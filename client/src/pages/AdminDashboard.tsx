import { useAuth } from "@/hooks/use-auth";
import { useOrders } from "@/hooks/use-orders";
import Navigation from "@/components/Navigation";
import { Redirect, Link } from "wouter";
import { Users, PackageSearch, DollarSign, Activity } from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { data: orders } = useOrders();

  if (user?.role !== 'admin') return <Redirect to="/" />;

  const totalRevenue = (orders || []).reduce((acc, obj) => acc + Number(obj.order.totalAmount), 0);

  return (
    <div className="min-h-screen bg-muted/30">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold text-foreground mb-8">Admin Overview</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-muted-foreground">Total Revenue</h3>
              <div className="p-2 bg-green-500/10 text-green-500 rounded-lg"><DollarSign className="w-5 h-5" /></div>
            </div>
            <p className="text-3xl font-extrabold text-foreground">KSh {totalRevenue.toLocaleString()}</p>
          </div>

          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-muted-foreground">Active Orders</h3>
              <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><PackageSearch className="w-5 h-5" /></div>
            </div>
            <p className="text-3xl font-extrabold text-foreground">{orders?.length || 0}</p>
          </div>

          <Link href="/admin/users" className="block bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-primary/50 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-muted-foreground group-hover:text-primary transition-colors">Manage Users</h3>
              <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg"><Users className="w-5 h-5" /></div>
            </div>
            <p className="text-sm font-medium text-primary">View & Edit Users →</p>
          </Link>
          
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-muted-foreground">System Status</h3>
              <div className="p-2 bg-orange-500/10 text-orange-500 rounded-lg"><Activity className="w-5 h-5" /></div>
            </div>
            <p className="text-green-500 font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Online
            </p>
          </div>
        </div>

        <div className="bg-card rounded-3xl border border-border shadow-sm p-8">
          <h2 className="text-xl font-bold mb-6">Recent Transactions</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-border text-muted-foreground">
                <tr>
                  <th className="pb-3 font-semibold">Order ID</th>
                  <th className="pb-3 font-semibold">Customer ID</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {(orders || []).slice(0, 10).map((o) => (
                  <tr key={o.order.id} className="border-b border-border/50">
                    <td className="py-4 font-mono text-sm">#{o.order.id.toString().padStart(6, '0')}</td>
                    <td className="py-4 text-muted-foreground">CUST-{o.order.customerId}</td>
                    <td className="py-4 font-bold">KSh {Number(o.order.totalAmount).toLocaleString()}</td>
                    <td className="py-4">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase">
                        {o.order.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {orders?.length === 0 && (
                  <tr><td colSpan={4} className="py-8 text-center text-muted-foreground">No recent transactions.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
