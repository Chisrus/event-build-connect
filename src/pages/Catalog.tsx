import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Map, Grid as GridIcon, Search, Navigation } from "lucide-react";
import { calculateDistance, getUserLocation } from "@/utils/geolocation";
import { toast } from "sonner";

const Catalog = () => {
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
    const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
    const [priceRange, setPriceRange] = useState([0, 1000000]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);
    const [sortByDistance, setSortByDistance] = useState(false);

    const categories = ["Construction", "Événementiel", "Logistique", "Autre"];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*');

                if (error) throw error;
                if (data) setProducts(data);
            } catch (err) {
                console.error("Error fetching catalog products:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);



    const handleEnableLocation = async () => {
        try {
            const coords = await getUserLocation();
            setUserCoords(coords);
            setSortByDistance(true);
            toast.success("Localisation activée. Les produits les plus proches sont affichés en premier.");
        } catch (error) {
            console.error(error);
            toast.error("Impossible d'accéder à votre position.");
        }
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = (p.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (p.category?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (p.description?.toLowerCase() || "").includes(searchTerm.toLowerCase());

        const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
        const matchesCategory = selectedCategory ? p.category === selectedCategory : true;

        return matchesSearch && matchesPrice && matchesCategory;
    }).sort((a, b) => {
        if (sortByDistance && userCoords && a.latitude && a.longitude && b.latitude && b.longitude) {
            const distA = calculateDistance(userCoords.latitude, userCoords.longitude, a.latitude, a.longitude);
            const distB = calculateDistance(userCoords.latitude, userCoords.longitude, b.latitude, b.longitude);
            return distA - distB;
        }
        return 0; // Default order
    });

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 py-32">
                <div className="flex flex-col gap-8 mb-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="animate-fade-in">
                            <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">Catalogue Complet</h1>
                            <p className="text-muted-foreground text-lg">Découvrez l'ensemble de notre matériel disponible à la location.</p>
                        </div>
                        <div className="relative w-full md:w-96 animate-fade-in">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher..."
                                className="pl-10 h-12 rounded-full border-2 focus-visible:ring-primary"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button
                            variant={sortByDistance ? "default" : "outline"}
                            onClick={() => sortByDistance ? setSortByDistance(false) : handleEnableLocation()}
                            className="gap-2"
                        >
                            <Navigation className="h-4 w-4" />
                            {sortByDistance ? "Tri par proximité activé" : "Trier par proximité"}
                        </Button>
                    </div>

                    {/* Filters Bar */}
                    <div className="bg-card border rounded-2xl p-6 flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between shadow-sm">
                        <div className="flex flex-wrap gap-4 items-center">
                            <div className="flex gap-2">
                                <Button
                                    variant={selectedCategory === null ? "default" : "outline"}
                                    onClick={() => setSelectedCategory(null)}
                                    size="sm"
                                    className="rounded-full"
                                >
                                    Tout
                                </Button>
                                {categories.map(cat => (
                                    <Button
                                        key={cat}
                                        variant={selectedCategory === cat ? "default" : "outline"}
                                        onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                                        size="sm"
                                        className="rounded-full"
                                    >
                                        {cat}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-8 w-full lg:w-auto">
                            <div className="flex-1 lg:w-64 space-y-2">
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Prix max</span>
                                    <span>{priceRange[1].toLocaleString()} CFA</span>
                                </div>
                                <Slider
                                    defaultValue={[0, 1000000]}
                                    max={1000000}
                                    step={1000}
                                    value={priceRange}
                                    onValueChange={(val) => setPriceRange([0, val[1]])} // Only upper bound usually
                                />
                            </div>

                            <div className="flex items-center space-x-2 bg-secondary/50 p-2 rounded-lg">
                                <Button
                                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                    size="icon"
                                    onClick={() => setViewMode('grid')}
                                >
                                    <GridIcon className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={viewMode === 'map' ? 'default' : 'ghost'}
                                    size="icon"
                                    onClick={() => setViewMode('map')}
                                >
                                    <Map className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {viewMode === 'map' ? (
                    <div className="w-full h-[600px] bg-muted rounded-3xl flex items-center justify-center border-2 border-dashed relative overflow-hidden group">
                        <Map className="h-16 w-16 text-muted-foreground/50 mb-4" />
                        <p className="text-muted-foreground font-medium">Vue Carte (Placeholder)</p>
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end justify-center pb-12 opacity-0 group-hover:opacity-100 transition-opacity p-8">
                            <p className="text-center text-sm max-w-md">L'intégration de la carte interactive nécessite une clé API (Google Maps) ou une configuration Leaflet. Pour l'instant, c'est une vue statique.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
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
                                <Button
                                    variant="link"
                                    onClick={() => {
                                        setSearchTerm("");
                                        setPriceRange([0, 1000000]);
                                        setSelectedCategory(null);
                                    }}
                                >
                                    Réinitialiser les filtres
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Catalog;
