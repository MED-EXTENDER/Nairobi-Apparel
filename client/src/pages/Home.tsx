import { useProducts } from "@/hooks/use-products";
import ProductCard from "@/components/ProductCard";
import Navigation from "@/components/Navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { user } = useAuth();
  const { data: products, isLoading } = useProducts();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  // Redirect Admin and Seller away from shopping
  if (user && (user.role === 'admin' || user.role === 'seller')) {
    const dashboardLink = user.role === 'admin' ? '/admin' : '/seller';
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card p-10 rounded-3xl border border-border shadow-2xl max-w-md w-full"
          >
            <h1 className="text-3xl font-bold mb-4">Welcome back!</h1>
            <p className="text-muted-foreground mb-8 text-lg">
              As a {user.role}, you should manage the platform from your dashboard.
            </p>
            <Link href={dashboardLink} className="inline-flex items-center justify-center w-full px-8 py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:shadow-lg transition-all active:scale-95">
              Go to {user.role === 'admin' ? 'Admin' : 'Seller'} Dashboard
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const categories = Array.from(new Set((products || []).map(p => p.category)));

  const filtered = (products || []).filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = category ? p.category === category : true;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5 -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6">
              Style that speaks <span className="text-primary">volumes.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              Discover premium apparel curated for the modern wardrobe. 
              Elevate your everyday look with Nairobi Apparel.
            </p>

            <div className="relative max-w-xl mx-auto group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search for amazing products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-card border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/20 text-lg shadow-sm transition-all outline-none placeholder:text-muted-foreground"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-20">
        
        {/* Categories */}
        <div className="flex overflow-x-auto pb-4 gap-3 mb-12 hide-scrollbar">
          <button
            onClick={() => setCategory(null)}
            className={`px-6 py-2.5 rounded-full whitespace-nowrap font-medium transition-all ${
              !category 
                ? 'bg-foreground text-background shadow-lg shadow-foreground/20' 
                : 'bg-card text-foreground hover:bg-muted border border-border'
            }`}
          >
            All Collections
          </button>
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-6 py-2.5 rounded-full whitespace-nowrap font-medium transition-all ${
                category === c 
                  ? 'bg-foreground text-background shadow-lg shadow-foreground/20' 
                  : 'bg-card text-foreground hover:bg-muted border border-border'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="aspect-[4/5] bg-muted animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-card rounded-3xl border border-border border-dashed">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
            <button 
              onClick={() => { setSearch(""); setCategory(null); }}
              className="mt-6 px-6 py-2 bg-primary/10 text-primary font-semibold rounded-xl hover:bg-primary/20 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
