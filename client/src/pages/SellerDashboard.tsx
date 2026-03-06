import { useAuth } from "@/hooks/use-auth";
import { useProducts, useCreateProduct, useDeleteProduct } from "@/hooks/use-products";
import Navigation from "@/components/Navigation";
import { useState } from "react";
import { Plus, Edit, Trash2, Package, TrendingUp } from "lucide-react";
import { Redirect } from "wouter";

export default function SellerDashboard() {
  const { user } = useAuth();
  const { data: products } = useProducts();
  const { mutate: createProduct, isPending } = useCreateProduct();
  const { mutate: deleteProduct } = useDeleteProduct();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', stock: '', category: '', imageUrl: '' });

  if (user?.role !== 'seller' && user?.role !== 'admin') return <Redirect to="/" />;

  const myProducts = products?.filter(p => p.sellerId === user.id) || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProduct({
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      stock: Number(formData.stock),
      category: formData.category,
      imageUrl: formData.imageUrl || undefined,
      sellerId: user.id
    }, {
      onSuccess: () => {
        setIsModalOpen(false);
        setFormData({ name: '', description: '', price: '', stock: '', category: '', imageUrl: '' });
      }
    });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-foreground">Seller Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your store products and inventory.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" /> Add Product
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-primary/10 text-primary rounded-xl"><Package className="w-6 h-6" /></div>
              <h3 className="text-lg font-bold text-foreground">Total Products</h3>
            </div>
            <p className="text-4xl font-extrabold text-foreground ml-16">{myProducts.length}</p>
          </div>
          {/* Mock stats */}
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-green-500/10 text-green-500 rounded-xl"><TrendingUp className="w-6 h-6" /></div>
              <h3 className="text-lg font-bold text-foreground">Monthly Sales</h3>
            </div>
            <p className="text-4xl font-extrabold text-foreground ml-16">KSh 124,000</p>
          </div>
        </div>

        <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="p-4 font-semibold text-muted-foreground">Product</th>
                <th className="p-4 font-semibold text-muted-foreground">Category</th>
                <th className="p-4 font-semibold text-muted-foreground">Price</th>
                <th className="p-4 font-semibold text-muted-foreground">Stock</th>
                <th className="p-4 font-semibold text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {myProducts.map(p => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                  <td className="p-4 flex items-center gap-4">
                    <img src={p.imageUrl || ''} alt="" className="w-12 h-12 rounded-lg object-cover bg-muted" />
                    <span className="font-bold">{p.name}</span>
                  </td>
                  <td className="p-4"><span className="px-3 py-1 bg-background rounded-full text-sm border border-border">{p.category}</span></td>
                  <td className="p-4 font-bold text-primary">KSh {Number(p.price).toLocaleString()}</td>
                  <td className="p-4">{p.stock}</td>
                  <td className="p-4 flex justify-end gap-2">
                    <button className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => deleteProduct(p.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
              {myProducts.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No products found. Add your first product!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card w-full max-w-lg rounded-3xl p-8 border border-border shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required placeholder="Product Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 rounded-xl border bg-background" />
              <textarea required placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 rounded-xl border bg-background resize-none" rows={3} />
              <div className="flex gap-4">
                <input required type="number" step="0.01" placeholder="Price" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-3 rounded-xl border bg-background" />
                <input required type="number" placeholder="Stock" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full p-3 rounded-xl border bg-background" />
              </div>
              <input required placeholder="Category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-3 rounded-xl border bg-background" />
              <input placeholder="Image URL (optional)" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full p-3 rounded-xl border bg-background" />
              
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl font-bold hover:bg-muted text-foreground">Cancel</button>
                <button disabled={isPending} type="submit" className="px-6 py-3 rounded-xl font-bold bg-primary text-primary-foreground disabled:opacity-50">Create Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
