import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Trash2, MapPin, Package, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Booking, Product } from "@/types";
import { differenceInDays, format } from "date-fns";
import { fr } from "date-fns/locale";

const Dashboard = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [myBookings, setMyBookings] = useState<Booking[]>([]);
    const [requests, setRequests] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            navigate("/login");
            return;
        }

        if (user) {
            fetchData();
        }
    }, [user, authLoading, navigate]);

    const fetchData = async () => {
        setLoading(true);
        await Promise.all([fetchUserProducts(), fetchMyBookings(), fetchRequests()]);
        setLoading(false);
    };

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
        }
    };

    const fetchMyBookings = async () => {
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select('*, product:products(*)')
                .eq('renter_id', user!.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setMyBookings(data || []);
        } catch (error: any) {
            console.error('Error fetching bookings:', error);
        }
    };

    const fetchRequests = async () => {
        try {
            // First get my product IDs
            const { data: myProducts, error: prodError } = await supabase
                .from('products')
                .select('id')
                .eq('user_id', user!.id);

            if (prodError) throw prodError;

            if (!myProducts || myProducts.length === 0) return;

            const productIds = myProducts.map(p => p.id);

            const { data, error } = await supabase
                .from('bookings')
                .select('*, product:products(*)')
                .in('product_id', productIds)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRequests(data || []);
        } catch (error: any) {
            console.error('Error fetching requests:', error);
        }
    };

    const handleDelete = async (id: string, imagePath?: string) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) return;

        try {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) throw error;
            setProducts(products.filter(p => p.id !== id));
            toast.success("Annonce supprimée.");
        } catch (error: any) {
            console.error('Error deleting:', error);
            toast.error("Erreur lors de la suppression.");
        }
    };

    const handleUpdateStatus = async (bookingId: string, status: 'confirmed' | 'cancelled') => {
        try {
            const { error } = await supabase
                .from('bookings')
                .update({ status })
                .eq('id', bookingId);

            if (error) throw error;

            setRequests(requests.map(req => req.id === bookingId ? { ...req, status } : req));
            toast.success(`Réservation ${status === 'confirmed' ? 'confirmée' : 'annulée'}.`);
        } catch (error) {
            toast.error("Erreur lors de la mise à jour.");
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed': return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Confirmé</span>;
            case 'cancelled': return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"><XCircle className="h-3 w-3" /> Annulé</span>;
            default: return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Clock className="h-3 w-3" /> En attente</span>;
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
                        <h1 className="text-3xl font-bold font-display">Tableau de Bord</h1>
                        <p className="text-muted-foreground">Gérez votre activité.</p>
                    </div>
                </div>

                <Tabs defaultValue="products" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="products">Mes Annonces ({products.length})</TabsTrigger>
                        <TabsTrigger value="bookings">Mes Réservations ({myBookings.length})</TabsTrigger>
                        <TabsTrigger value="requests">Demandes Reçues ({requests.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="products">
                        {products.length === 0 ? (
                            <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed">
                                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                                <h3 className="font-semibold">Aucune annonce</h3>
                                <Button variant="link" onClick={() => navigate("/publish")}>Publier maintenant</Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <div key={product.id} className="bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                                        <div className="aspect-video relative bg-muted">
                                            <img src={product.images?.[0]} alt={product.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold truncate">{product.title}</h3>
                                            <div className="flex justify-between items-center mt-4">
                                                <span className="font-bold text-primary">{product.price} CFA/j</span>
                                                <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="bookings">
                        {myBookings.length === 0 ? (
                            <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed">
                                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                                <h3 className="font-semibold">Aucune réservation</h3>
                                <Button variant="link" onClick={() => navigate("/catalog")}>Explorer le catalogue</Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {myBookings.map((booking) => (
                                    <div key={booking.id} className="bg-card border rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                                        <div className="flex gap-4">
                                            <img src={booking.product?.images?.[0]} className="w-20 h-20 rounded-lg object-cover bg-muted" alt="" />
                                            <div>
                                                <h4 className="font-bold text-lg">{booking.product?.title}</h4>
                                                <p className="text-muted-foreground text-sm">
                                                    Du {format(new Date(booking.start_date), "d MMM y", { locale: fr })} au {format(new Date(booking.end_date), "d MMM y", { locale: fr })}
                                                </p>
                                                <p className="font-medium text-primary mt-1">Total: {booking.total_price} CFA</p>
                                            </div>
                                        </div>
                                        <div>
                                            {getStatusBadge(booking.status)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="requests">
                        {requests.length === 0 ? (
                            <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed">
                                <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                                <h3 className="font-semibold">Aucune demande reçue</h3>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {requests.map((booking) => (
                                    <div key={booking.id} className="bg-card border rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                                        <div className="flex gap-4">
                                            <img src={booking.product?.images?.[0]} className="w-20 h-20 rounded-lg object-cover bg-muted" alt="" />
                                            <div>
                                                <h4 className="font-bold text-lg">{booking.product?.title}</h4>
                                                <p className="text-muted-foreground text-sm">
                                                    Du {format(new Date(booking.start_date), "d MMM y", { locale: fr })} au {format(new Date(booking.end_date), "d MMM y", { locale: fr })}
                                                </p>
                                                <div className="mt-1 flex gap-2 items-center">
                                                    <span className="font-medium">Total: {booking.total_price} CFA</span>
                                                    {getStatusBadge(booking.status)}
                                                </div>
                                            </div>
                                        </div>
                                        {booking.status === 'pending' && (
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="default" onClick={() => handleUpdateStatus(booking.id, 'confirmed')}>
                                                    Accepter
                                                </Button>
                                                <Button size="sm" variant="destructive" onClick={() => handleUpdateStatus(booking.id, 'cancelled')}>
                                                    Refuser
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
            <Footer />
        </div>
    );
};

export default Dashboard;
