import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useCartStore } from "@/lib/cart";
import {
  ShoppingBag,
  ShoppingCart,
  User as UserIcon,
  LogOut,
  Settings,
  LayoutDashboard,
  Home
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Navigation() {
  const { user, logout } = useAuth();
  const cartItems = useCartStore((s) => s.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const [location, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 glass-panel border-b-0 border-x-0 rounded-none rounded-b-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
                <ShoppingBag className="w-8 h-8 text-primary" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-foreground">
                Nairobi <span className="text-primary">Apparel</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-foreground/80 hover:text-primary font-medium transition-colors">
                Shop
              </Link>

              {user?.role === "customer" && (
                <Link href="/orders" className="text-foreground/80 hover:text-primary font-medium transition-colors">
                  My Orders
                </Link>
              )}

              {user?.role === "admin" && (
                <Link href="/admin" className="text-foreground/80 hover:text-primary font-medium transition-colors">
                  Admin
                </Link>
              )}

              {user?.role === "seller" && (
                <Link href="/seller" className="text-foreground/80 hover:text-primary font-medium transition-colors">
                  Dashboard
                </Link>
              )}

              <div className="h-8 w-px bg-border"></div>

              <Link href="/cart" className="relative group">
                <div className="p-2 rounded-full hover:bg-primary/10 transition-colors">
                  <ShoppingCart className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
                </div>

                {cartCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full"
                  >
                    {cartCount}
                  </motion.div>
                )}
              </Link>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-2 p-2 rounded-full hover:bg-primary/10 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-2xl overflow-hidden py-2">
                      <div className="px-4 py-2 border-b border-border/50 mb-2">
                        <p className="text-sm font-bold truncate">{user.username}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>

                      <Link
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-primary/5 text-sm cursor-pointer transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 text-muted-foreground" />
                        Customization
                      </Link>

                      <button
                        onClick={() => {
                          logout();
                          setMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-destructive/10 text-destructive text-sm transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex gap-3">
                  <Link
                    href="/login"
                    className="px-5 py-2.5 rounded-xl font-medium text-foreground hover:bg-primary/10 transition-colors"
                  >
                    Log in
                  </Link>

                  <Link
                    href="/register"
                    className="px-5 py-2.5 rounded-xl font-medium bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE BOTTOM NAVIGATION */}

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
        <div className="flex justify-around items-center h-16 text-xs">

          <Link href="/" className="flex flex-col items-center justify-center gap-1">
            <Home className="w-5 h-5" />
            <span>Shop</span>
          </Link>

          <Link href="/cart" className="relative flex flex-col items-center justify-center gap-1">
            <ShoppingCart className="w-5 h-5" />
            <span>Cart</span>

            {cartCount > 0 && (
              <div className="absolute -top-1 right-3 bg-primary text-white text-[10px] px-1.5 rounded-full">
                {cartCount}
              </div>
            )}
          </Link>

          <Link href="/orders" className="flex flex-col items-center justify-center gap-1">
            <ShoppingBag className="w-5 h-5" />
            <span>Orders</span>
          </Link>

          <Link href="/settings" className="flex flex-col items-center justify-center gap-1">
            <UserIcon className="w-5 h-5" />
            <span>Profile</span>
          </Link>

        </div>
      </div>
    </>
  );
}
