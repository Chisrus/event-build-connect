import { useEffect, useState } from "react";
import { ProductCard } from "./ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

export const FeaturedProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .limit(4);

        if (error) throw error;
        if (data) setProducts(data);
      } catch (err) {
        console.error("Error fetching featured products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="py-32 bg-background relative">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 animate-fade-in">
          <div className="max-w-2xl">
            <Badge className="mb-6 bg-accent/10 text-accent hover:bg-accent/20 border-none px-5 py-1.5 text-xs tracking-[0.2em] uppercase font-black">
              Sélection Premium
            </Badge>
            <h2 className="text-balance font-display text-4xl md:text-6xl font-black text-foreground">
              Les Incontournables
            </h2>
          </div>
          <Link to="/catalog">
            <Button size="lg" variant="ghost" className="group text-primary font-bold hover:text-accent transition-colors gap-2 px-0 hover:bg-transparent">
              Voir tout le catalogue
              <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all transform group-hover:translate-x-1">
                →
              </div>
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 max-w-7xl mx-auto">
          {loading ? (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-6">
                <Skeleton className="aspect-[4/5] w-full rounded-[2rem]" />
                <div className="space-y-3">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>
              </div>
            ))
          ) : (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
    {children}
  </span>
);
