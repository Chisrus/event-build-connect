import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Catalog = () => {
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");

    useEffect(() => {
        const fetchProducts = async () => {
            const { data, error } = await supabase
                .from('products')
                .select('*');

            if (data) setProducts(data);
            setLoading(false);
        };

        fetchProducts();
    }, []);

    const filteredProducts = products.filter(p =>
        (p.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (p.category?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (p.description?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 py-24">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="animate-fade-in">
                        <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">Catalogue Complet</h1>
                        <p className="text-muted-foreground text-lg">Découvrez l'ensemble de notre matériel disponible à la location.</p>
                    </div>

                    <div className="relative w-full md:w-96 animate-fade-in">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher un équipement..."
                            className="pl-10 h-12 rounded-full border-2 focus-visible:ring-primary"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {loading ? (
                        [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="space-y-4">
                                <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ))
                    ) : filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center animate-fade-in">
                            <h3 className="text-2xl font-bold mb-2">Aucun résultat trouvé</h3>
                            <p className="text-muted-foreground">Essayez d'ajuster vos critères de recherche.</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Catalog;
