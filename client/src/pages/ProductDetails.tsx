import { useParams } from "wouter";
import { useProduct } from "@/hooks/use-products";
import { useReviews, useCreateReview } from "@/hooks/use-reviews";
import { useCartStore } from "@/lib/cart";
import Navigation from "@/components/Navigation";
import { Star, ShoppingCart, Loader2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export default function ProductDetails() {
  const { id } = useParams();
  const productId = Number(id);
  const { data: product, isLoading } = useProduct(productId);
  const { data: reviews } = useReviews(productId);
  const { mutate: addReview, isPending: isSubmittingReview } = useCreateReview();
  const addItem = useCartStore(s => s.addItem);
  const { user } = useAuth();
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background text-center pt-32">
        <h1 className="text-4xl font-bold">Product not found</h1>
      </div>
    );
  }

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("Must be logged in to review");
    addReview({ productId, data: { rating, comment } }, {
      onSuccess: () => { setComment(""); setRating(5); }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          <div className="rounded-3xl overflow-hidden border border-border bg-muted shadow-2xl shadow-black/5 aspect-[4/5] sticky top-32">
            <img 
              src={product.imageUrl || `https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&h=1000&fit=crop`}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="py-8">
            <div className="mb-4 flex gap-2">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-bold uppercase tracking-wider">
                {product.category}
              </span>
              {product.stock > 0 ? (
                <span className="px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-sm font-bold uppercase tracking-wider">
                  In Stock ({product.stock})
                </span>
              ) : (
                <span className="px-3 py-1 bg-red-500/10 text-red-600 rounded-full text-sm font-bold uppercase tracking-wider">
                  Out of Stock
                </span>
              )}
            </div>

            <h1 className="text-4xl lg:text-5xl font-extrabold text-foreground mb-4 leading-tight">
              {product.name}
            </h1>
            
            <p className="text-3xl font-bold text-primary mb-8">
              KSh {Number(product.price).toLocaleString()}
            </p>

            <p className="text-lg text-muted-foreground leading-relaxed mb-10">
              {product.description}
            </p>

            <button
              onClick={() => addItem(product)}
              disabled={product.stock <= 0}
              className="w-full md:w-auto px-10 py-5 rounded-2xl font-bold text-lg bg-primary text-primary-foreground flex items-center justify-center gap-3 shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              <ShoppingCart className="w-6 h-6" />
              Add to Cart
            </button>

            <hr className="my-12 border-border" />

            {/* Reviews Section */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Customer Reviews</h2>
              
              {user ? (
                <form onSubmit={submitReview} className="mb-10 bg-card p-6 rounded-2xl border border-border">
                  <h3 className="font-semibold mb-4">Write a review</h3>
                  <div className="flex gap-2 mb-4">
                    {[1,2,3,4,5].map(star => (
                      <button type="button" key={star} onClick={() => setRating(star)}>
                        <Star className={`w-8 h-8 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'} transition-colors`} />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="What did you think about this product?"
                    className="w-full p-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none mb-4 resize-none h-24"
                    required
                  />
                  <button
                    disabled={isSubmittingReview}
                    className="px-6 py-3 bg-foreground text-background font-semibold rounded-xl hover:bg-foreground/90 transition-colors"
                  >
                    {isSubmittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              ) : (
                <div className="mb-10 p-6 bg-primary/5 rounded-2xl border border-primary/20 text-center">
                  <p className="text-primary font-medium">Please log in to leave a review.</p>
                </div>
              )}

              <div className="space-y-6">
                {!reviews?.length ? (
                  <p className="text-muted-foreground italic">No reviews yet. Be the first!</p>
                ) : (
                  reviews.map(review => (
                    <div key={review.id} className="p-6 bg-card rounded-2xl border border-border">
                      <div className="flex gap-1 mb-3">
                        {[1,2,3,4,5].map(star => (
                          <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                        ))}
                      </div>
                      <p className="text-foreground">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
