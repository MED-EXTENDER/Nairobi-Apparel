import { Product } from "@shared/schema";
import { Link } from "wouter";
import { useCartStore } from "@/lib/cart";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore(s => s.addItem);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-card rounded-3xl overflow-hidden border border-border shadow-lg shadow-black/5 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 flex flex-col h-full"
    >
      <Link href={`/products/${product.id}`} className="block relative aspect-[4/5] overflow-hidden bg-muted">
        <img 
          src={product.imageUrl || `https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&h=600&fit=crop`}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-background/90 backdrop-blur-md rounded-full text-xs font-semibold text-foreground shadow-sm">
            {product.category}
          </span>
        </div>
      </Link>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2 gap-4">
          <Link href={`/products/${product.id}`} className="font-bold text-lg text-foreground line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </Link>
          <span className="font-bold text-xl text-primary whitespace-nowrap">
            KSh {Number(product.price).toLocaleString()}
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-1">
          {product.description}
        </p>

        <button
          onClick={() => addItem(product)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 active:scale-95"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}
