import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import session from "express-session";
import MemoryStoreSession from "memorystore";

declare module 'express-session' {
  interface SessionData {
    userId: number;
    role: string;
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const SessionStore = MemoryStoreSession(session);
  app.use(session({
    secret: process.env.SESSION_SECRET || 'nairobi-apparel-secret',
    resave: false,
    saveUninitialized: false,
    store: new SessionStore({ checkPeriod: 86400000 })
  }));

  // -- Authentication Routes --
  app.post(api.auth.register.path, async (req, res) => {
    try {
      const input = api.auth.register.input.parse(req.body);
      const existing = await storage.getUserByEmail(input.email);
      if (existing) return res.status(400).json({ message: "Email already exists", field: "email" });
      const user = await storage.createUser(input);
      req.session.userId = user.id;
      req.session.role = user.role;
      res.status(201).json(user);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  app.post(api.auth.login.path, async (req, res) => {
    try {
      const { email, password } = api.auth.login.input.parse(req.body);
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) return res.status(401).json({ message: "Invalid email or password" });
      req.session.userId = user.id;
      req.session.role = user.role;
      res.status(200).json(user);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      throw err;
    }
  });

  app.get(api.auth.me.path, async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ message: "Not authenticated" });
    const user = await storage.getUser(req.session.userId);
    if (!user) return res.status(401).json({ message: "User not found" });
    res.status(200).json(user);
  });

  app.post(api.auth.logout.path, (req, res) => {
    req.session.destroy(() => {
      res.status(200).json({ message: "Logged out" });
    });
  });

  // -- Product Routes --
  app.get(api.products.list.path, async (req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  });

  app.post(api.products.create.path, async (req, res) => {
    try {
      const input = api.products.create.input.parse(req.body);
      const product = await storage.createProduct(input);
      res.status(201).json(product);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      throw err;
    }
  });

  app.put(api.products.update.path, async (req, res) => {
    try {
      const input = api.products.update.input.parse(req.body);
      const product = await storage.updateProduct(Number(req.params.id), input);
      res.status(200).json(product);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      throw err;
    }
  });

  app.delete(api.products.delete.path, async (req, res) => {
    await storage.deleteProduct(Number(req.params.id));
    res.status(204).send();
  });

  // -- Order Routes --
  app.get(api.orders.list.path, async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ message: "Not authenticated" });
    const allOrders = await storage.getOrders();
    let filteredOrders = [];
    if (req.session.role === 'admin') filteredOrders = allOrders;
    else if (req.session.role === 'seller') filteredOrders = allOrders.filter(o => o.items.some(item => item.product.sellerId === req.session.userId));
    else filteredOrders = allOrders.filter(o => o.order.customerId === req.session.userId);
    res.json(filteredOrders);
  });

  app.post(api.orders.create.path, async (req, res) => {
    try {
      const { items } = api.orders.create.input.parse(req.body);
      if (!req.session.userId) return res.status(401).json({ message: "Must be logged in to order" });

      let totalAmount = 0;
      const orderItemsToInsert = [];

      for (const item of items) {
        const product = await storage.getProduct(item.productId);
        if (!product) return res.status(400).json({ message: `Product ${item.productId} not found` });
        if (product.stock < item.quantity) return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
        const price = Number(product.price);
        totalAmount += price * item.quantity;
        orderItemsToInsert.push({ orderId: 0, productId: product.id, quantity: item.quantity, price: price.toString() });
      }

      const order = await storage.createOrder({
        customerId: req.session.userId,
        totalAmount: totalAmount.toString(),
        status: "pending",
        paymentReference: `PAY-${Date.now()}`
      }, orderItemsToInsert);

      // Node 18+ global fetch (no node-fetch needed)
      const response = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: (await storage.getUser(req.session.userId)).email,
          amount: totalAmount * 100,
          reference: order.paymentReference,
          callback_url: `${process.env.APP_URL}/checkout/callback`
        })
      });

      const paystackData = await response.json();
      if (!paystackData.status) return res.status(500).json({ message: "Paystack initialization failed" });

      res.status(201).json({ order, paymentUrl: paystackData.data.authorization_url });
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.patch(api.orders.updateStatus.path, async (req, res) => {
    try {
      const { status } = api.orders.updateStatus.input.parse(req.body);
      const order = await storage.updateOrderStatus(Number(req.params.id), status);
      res.status(200).json(order);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      throw err;
    }
  });

  // -- Review Routes --
  app.get(api.reviews.list.path, async (req, res) => {
    const reviews = await storage.getReviewsByProduct(Number(req.params.id));
    res.json(reviews);
  });

  app.post(api.reviews.create.path, async (req, res) => {
    try {
      if (!req.session.userId) return res.status(401).json({ message: "Must be logged in to review" });
      const input = api.reviews.create.input.parse(req.body);
      const review = await storage.createReview({
        ...input,
        productId: Number(req.params.id),
        customerId: req.session.userId
      });
      res.status(201).json(review);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      throw err;
    }
  });

  // -- Upload Route --
  app.post(api.upload.image.path, async (req, res) => {
    try {
      if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return res.status(500).json({ message: "Supabase not configured" });
      const mockUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/product-images/product-${Date.now()}.jpg`;
      res.json({ url: mockUrl });
    } catch (err) {
      res.status(500).json({ message: "Upload failed" });
    }
  });

  await seedDatabase();
  return httpServer;
}

async function seedDatabase() {
  const users = await storage.getUserByEmail('admin@nairobiapparel.com');
  if (!users) {
    const admin = await storage.createUser({ username: 'admin_user', email: 'admin@nairobiapparel.com', password: 'password123', role: 'admin' });
    const seller = await storage.createUser({ username: 'nairobi_seller', email: 'seller@nairobiapparel.com', password: 'password123', role: 'seller' });
    await storage.createUser({ username: 'john_doe', email: 'john@example.com', password: 'password123', role: 'customer' });

    await storage.createProduct({ sellerId: seller.id, name: 'Nairobi Sunset Hoodie', description: 'A warm, comfortable hoodie perfect for chilly evenings.', price: '45.00', stock: 50, category: 'Hoodies', imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop' });
    await storage.createProduct({ sellerId: seller.id, name: 'Classic White Tee', description: 'Essential cotton t-shirt.', price: '15.00', stock: 100, category: 'T-Shirts', imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop' });
    await storage.createProduct({ sellerId: seller.id, name: 'Urban Cargo Pants', description: 'Stylish and functional cargo pants.', price: '55.00', stock: 30, category: 'Pants', imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600&auto=format&fit=crop' });
  }
}
