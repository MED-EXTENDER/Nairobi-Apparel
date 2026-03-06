import { useProducts } from "@/hooks/use-products";
import ProductCard from "@/components/ProductCard";
import Navigation from "@/components/Navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";

export default function Home() {
  const { user } = useAuth();
  const { data: products, isLoading } = useProducts();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  if (user && (user.role === "admin" || user.role === "seller")) {
    const dashboardLink = user.role === "admin" ? "/admin" : "/seller";

    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />

        <div className="flex-1 flex items-center justify-center p-4 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card p-6 rounded-2xl border shadow-lg max-w-sm w-full"
          >
            <h1 className="text-xl font-bold mb-3">Welcome back!</h1>

            <p className="text-muted-foreground mb-5 text-sm">
              As a {user.role}, manage the platform from your dashboard.
            </p>

            <Link
              href={dashboardLink}
              className="flex justify-center w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl"
            >
              Go to {user.role === "admin" ? "Admin" : "Seller"} Dashboard
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const categories = Array.from(
    new Set((products || []).map((p) => p.category))
  );

  const filtered = (products || []).filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = category ? p.category === category : true;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      <Navigation />

      {/* HERO */}
      <section className="px-3 pt-4 pb-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-xl sm:text-3xl font-bold text-center mb-3">
              Nairobi Apparel
            </h1>

            {/* SEARCH */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

              <input
                type="text"
                placeholder="Search products"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="px-3 mb-3">
        <div className="flex overflow-x-auto gap-2 pb-2">
          <button
            onClick={() => setCategory(null)}
            className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap ${
              !category ? "bg-primary text-white" : "bg-card border"
            }`}
          >
            All
          </button>

          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap ${
                category === c ? "bg-primary text-white" : "bg-card border"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="px-2">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="aspect-[4/5] bg-muted animate-pulse rounded-lg"
              />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="mx-auto mb-2 text-muted-foreground" />

            <p className="text-sm text-muted-foreground">
              No products found
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
