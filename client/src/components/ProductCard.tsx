import { Product } from "@shared/schema";
import { Link } from "wouter";
import { useCartStore } from "@/lib/cart";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all flex flex-col h-full"
    >
      <Link
        href={`/products/${product.id}`}
        className="block relative aspect-square overflow-hidden bg-muted"
      >
        <img
          src={
            product.imageUrl ||
            `https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&h=600&fit=crop`
          }
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute top-2 left-2">
          <span className="px-2 py-0.5 bg-background/90 backdrop-blur rounded-full text-[10px] font-semibold text-foreground">
            {product.category}
          </span>
        </div>
      </Link>

      <div className="p-3 flex flex-col flex-1">

        <Link
          href={`/products/${product.id}`}
          className="font-semibold text-sm text-foreground leading-tight line-clamp-2 hover:text-primary transition-colors"
        >
          {product.name}
        </Link>

        <span className="font-bold text-primary text-sm mt-1">
          KSh {Number(product.price).toLocaleString()}
        </span>

        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
          {product.description}
        </p>

        <button
          onClick={() => addItem(product)}
          className="mt-2 w-full flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition active:scale-95"
        >
          <ShoppingCart className="w-3 h-3" />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}
