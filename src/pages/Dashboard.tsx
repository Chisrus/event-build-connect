import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Trash2, MapPin, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            navigate("/login");
            return;
        }

        if (user) {
            fetchUserProducts();
        }
    }, [user, authLoading, navigate]);

    const fetchUserProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('user_id', user!.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (error: any) {
            console.error('Error fetching products:', error);
            toast.error("Impossible de charger vos annonces.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, imagePath?: string) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) return;

        try {
            // Delete image from storage if exists
            if (imagePath) {
                // Clean up image path to get the relative path in bucket
                // This assumes imagePath is the full public URL. 
                // If your DB stores full URL, you might need parsing.
                // Ideally keeping it simple for now or assuming the filename is sufficient if stored simply.
                // For this implementation effectively just deleting the row is the priority.
            }

            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setProducts(products.filter(p => p.id !== id));
            toast.success("Annonce supprimée avec succès.");
        } catch (error: any) {
            console.error('Error deleting product:', error);
            toast.error("Erreur lors de la suppression.");
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <div className="container mx-auto px-4 py-24 flex-grow">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold font-display">Mon Tableau de Bord</h1>
                        <p className="text-muted-foreground">Gérez vos annonces et vos locations.</p>
                    </div>
                    <Button onClick={() => navigate("/publish")}>Publier une annonce</Button>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed">
                        <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Aucune annonce publiée</h3>
                        <p className="text-muted-foreground mb-6">Vous n'avez pas encore mis d'objets en location.</p>
                        <Button variant="outline" onClick={() => navigate("/publish")}>Commencer maintenant</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <div key={product.id} className="bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
                                <div className="aspect-video relative overflow-hidden bg-muted">
                                    <img
                                        src={product.images?.[0] || "/placeholder.svg"}
                                        alt={product.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-2 right-2">
                                        <span className="bg-background/80 backdrop-blur-sm text-foreground text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                                            {product.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-lg mb-1 truncate">{product.title}</h3>
                                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        <span className="truncate">{product.location || "Non spécifié"}</span>
                                    </div>

                                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                        <span className="font-bold text-primary">{product.price} FCFA <span className="text-xs font-normal text-muted-foreground">/jour</span></span>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDelete(product.id, product.images?.[0])}
                                            className="hover:bg-red-600"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Supprimer
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Dashboard;
