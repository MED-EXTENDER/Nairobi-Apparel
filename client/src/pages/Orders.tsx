import Navigation from "@/components/Navigation";
import { useOrders } from "@/hooks/use-orders";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { Package, Truck, CheckCircle2, Clock } from "lucide-react";

export default function Orders() {
  const { user } = useAuth();
  const { data: orders, isLoading } = useOrders();

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return <Clock className="w-5 h-5 text-orange-500" />;
      case 'paid': return <Package className="w-5 h-5 text-blue-500" />;
      case 'shipped': return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      default: return <Package className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold mb-8">My Orders</h1>

        {isLoading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="h-48 bg-card animate-pulse rounded-3xl border border-border" />
            ))}
          </div>
        ) : orders?.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-3xl border border-border border-dashed">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
            <p className="text-muted-foreground">When you buy something, it will appear here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders?.map(({ order, items }) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm"
              >
                <div className="p-6 border-b border-border bg-muted/30 flex flex-wrap justify-between items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-background rounded-2xl border border-border">
                      {getStatusIcon(order.status)}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Order #{order.id.toString().padStart(6, '0')}</p>
                      <p className="text-lg font-bold capitalize">{order.status}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground font-medium">Total Amount</p>
                    <p className="text-xl font-extrabold text-primary">KSh {Number(order.totalAmount).toLocaleString()}</p>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {items.map(({ item, product }) => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <img 
                        src={product.imageUrl || ''} 
                        className="w-16 h-16 rounded-xl object-cover bg-muted border border-border" 
                        alt={product.name}
                      />
                      <div className="flex-1">
                        <h4 className="font-bold">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-bold">KSh {Number(item.price).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <div className="px-6 py-4 bg-muted/10 border-t border-border flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Ordered on {new Date(order.createdAt || '').toLocaleDateString()}
                  </p>
                  {order.status === 'pending' && (
                    <button className="text-primary font-bold hover:underline text-sm">
                      Track Order
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
