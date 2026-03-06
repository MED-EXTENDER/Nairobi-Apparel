import { useCartStore } from "@/lib/cart";
import Navigation from "@/components/Navigation";
import { Link, useLocation } from "wouter";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Cart() {
  const { items, updateQuantity, removeItem, total } = useCartStore();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-extrabold text-foreground mb-10">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-3xl border border-border border-dashed">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-foreground">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Link href="/" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-6">
              {items.map(({ product, quantity }) => (
                <motion.div 
                  layout
                  key={product.id} 
                  className="flex flex-col sm:flex-row gap-6 p-6 bg-card rounded-3xl border border-border shadow-sm"
                >
                  <img 
                    src={product.imageUrl || `https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&h=200&fit=crop`} 
                    alt={product.name}
                    className="w-full sm:w-32 h-32 object-cover rounded-2xl bg-muted"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-1">{product.name}</h3>
                        <p className="text-muted-foreground text-sm">{product.category}</p>
                      </div>
                      <p className="text-xl font-bold text-primary">KSh {Number(product.price).toLocaleString()}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3 bg-muted p-1 rounded-xl border border-border">
                        <button 
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="p-2 hover:bg-background rounded-lg transition-colors text-foreground"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-semibold w-8 text-center">{quantity}</span>
                        <button 
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="p-2 hover:bg-background rounded-lg transition-colors text-foreground"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeItem(product.id)}
                        className="p-3 text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-card rounded-3xl p-8 border border-border sticky top-32 shadow-xl shadow-black/5">
                <h3 className="text-2xl font-bold text-foreground mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6 text-lg">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="text-foreground font-medium">KSh {total().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="text-foreground font-medium">Free</span>
                  </div>
                  <hr className="border-border my-4" />
                  <div className="flex justify-between text-xl font-extrabold text-foreground">
                    <span>Total</span>
                    <span className="text-primary">KSh {total().toLocaleString()}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setLocation("/checkout")}
                  className="w-full flex items-center justify-center gap-2 px-8 py-5 bg-foreground text-background font-bold text-lg rounded-2xl hover:bg-foreground/90 transition-colors shadow-lg"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Ensure ShoppingCart is imported for the empty state
import { ShoppingCart } from "lucide-react";
