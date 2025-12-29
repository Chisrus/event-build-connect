import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const Event = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('category', 'event');

            if (data) setProducts(data);
            setLoading(false);
        };

        fetchProducts();
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 py-24">
                <div className="mb-12 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">Matériel Événementiel</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                        Tout le nécessaire pour vos événements : Mariages, concerts, conférences et réceptions privées.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {loading ? (
                        [1, 2, 3, 4].map((i) => (
                            <div key={i} className="space-y-4">
                                <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ))
                    ) : products.length > 0 ? (
                        products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center animate-fade-in">
                            <h3 className="text-2xl font-bold mb-2">Aucun matériel disponible</h3>
                            <p className="text-muted-foreground">Revenez bientôt pour découvrir nos nouveautés événementielles.</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Event;
