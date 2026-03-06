import { useCartStore } from "@/lib/cart";
import { useCreateOrder } from "@/hooks/use-orders";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function Checkout() {
  const { items, total, clearCart } = useCartStore();
  const { mutateAsync: createOrder } = useCreateOrder();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"form" | "paystack" | "success">("form");

  useEffect(() => {
    if (items.length === 0 && step === "form") {
      setLocation("/");
    }
  }, [items, setLocation, step]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep("paystack");

    // Simulate Paystack opening and processing
    setTimeout(async () => {
      try {
        await createOrder({
          items: items.map(i => ({ productId: i.product.id, quantity: i.quantity }))
        });
        clearCart();
        setStep("success");
      } catch (err) {
        alert("Checkout failed. Make sure you are logged in.");
        setStep("form");
      }
    }, 3000);
  };

  if (step === "paystack") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-card rounded-3xl p-10 border border-border shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 border-4 border-t-primary border-r-primary border-b-border border-l-border rounded-full animate-spin mx-auto"></div>
          <h2 className="text-2xl font-bold">Connecting to Paystack...</h2>
          <p className="text-muted-foreground">Please do not close this window.</p>
          <div className="p-4 bg-muted rounded-xl text-sm font-mono">
            Amount to pay: KSh {total().toLocaleString()}
          </div>
        </div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-card rounded-3xl p-10 border border-border shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold">Payment Successful!</h2>
          <p className="text-muted-foreground">Your order has been placed and is being processed.</p>
          <button 
            onClick={() => setLocation("/")}
            className="w-full py-4 mt-4 bg-foreground text-background font-bold rounded-xl"
          >
            Return to Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center py-12 px-4">
      <div className="max-w-4xl w-full bg-background rounded-3xl shadow-xl border border-border overflow-hidden grid md:grid-cols-2">
        <div className="p-10 bg-card border-r border-border">
          <h2 className="text-2xl font-bold mb-8">Checkout Details</h2>
          <form onSubmit={handleCheckout} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
              <input required type="text" className="w-full p-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Shipping Address</label>
              <textarea required rows={3} className="w-full p-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none" />
            </div>
            <button type="submit" className="w-full py-4 mt-6 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-0.5">
              Pay KSh {total().toLocaleString()} with Paystack
            </button>
          </form>
        </div>
        
        <div className="p-10 bg-muted/50">
          <h3 className="text-xl font-bold mb-6">Order Summary</h3>
          <div className="space-y-4 mb-6 h-64 overflow-y-auto pr-2">
            {items.map(item => (
              <div key={item.product.id} className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-xl bg-card border border-border overflow-hidden shrink-0">
                  <img src={item.product.imageUrl || ''} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm truncate">{item.product.name}</h4>
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="font-bold">KSh {(Number(item.product.price) * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <hr className="border-border my-4" />
          <div className="flex justify-between text-2xl font-extrabold">
            <span>Total</span>
            <span className="text-primary">KSh {total().toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
