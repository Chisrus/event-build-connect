import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { Loader2, MapPin, Calendar as CalendarIcon, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Product, Review } from "@/types";
import { DateRange } from "react-day-picker";
import { addDays, differenceInDays, format, isBefore, startOfToday } from "date-fns";
import { fr } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ReviewForm } from "@/components/ReviewForm";
import { ReviewList } from "@/components/ReviewList";

const ProductDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [product, setProduct] = useState<Product | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState<DateRange | undefined>();
    const [isBooking, setIsBooking] = useState(false);
    const [existingBookings, setExistingBookings] = useState<Date[]>([]);

    useEffect(() => {
        if (id) {
            fetchProduct(id);
            fetchExistingBookings(id);
            fetchReviews(id);
        }
    }, [id]);

    const fetchProduct = async (productId: string) => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', productId)
                .single();

            if (error) throw error;
            setProduct(data);
        } catch (error) {
            console.error("Error fetching product:", error);
            toast.error("Impossible de charger le produit.");
            navigate("/catalog");
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async (productId: string) => {
        try {
            const { data, error } = await supabase
                .from('reviews')
                .select('*')
                .eq('product_id', productId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setReviews(data || []);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    };

    const fetchExistingBookings = async (productId: string) => {
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select('start_date, end_date')
                .eq('product_id', productId)
                .neq('status', 'cancelled');

            if (error) throw error;

            if (data) {
                const disabledDates: Date[] = [];
                data.forEach((booking: any) => {
                    let currentDate = new Date(booking.start_date);
                    const endDate = new Date(booking.end_date);

                    while (currentDate <= endDate) {
                        disabledDates.push(new Date(currentDate));
                        currentDate = addDays(currentDate, 1);
                    }
                });
                setExistingBookings(disabledDates);
            }
        } catch (error) {
            console.error("Error fetching availability:", error);
        }
    };

    const handleBooking = async () => {
        if (!user) {
            toast.info("Veuillez vous connecter pour réserver.");
            navigate("/login");
            return;
        }

        if (!date?.from || !date?.to) {
            toast.error("Veuillez sélectionner une période de location.");
            return;
        }

        if (!product) return;

        setIsBooking(true);
        try {
            const days = differenceInDays(date.to, date.from) + 1;
            const totalPrice = days * product.price;

            const { error } = await supabase
                .from('bookings')
                .insert({
                    product_id: product.id,
                    renter_id: user.id,
                    start_date: format(date.from, 'yyyy-MM-dd'),
                    end_date: format(date.to, 'yyyy-MM-dd'),
                    total_price: totalPrice,
                    status: 'pending'
                });

            if (error) throw error;

            toast.success("Demande de réservation envoyée !");
            navigate("/dashboard");

        } catch (error: any) {
            console.error("Error booking:", error);
            toast.error(error.message || "Erreur lors de la réservation.");
        } finally {
            setIsBooking(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 py-24">
                <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image */}
                    <div className="space-y-4">
                        <div className="aspect-square relative overflow-hidden rounded-3xl bg-muted">
                            <img
                                src={product.images?.[0] || "/placeholder.svg"}
                                alt={product.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-8">
                        <div>
                            <span className="bg-accent/10 text-accent font-bold px-3 py-1 rounded-full text-sm uppercase tracking-wide">
                                {product.category}
                            </span>
                            <h1 className="text-4xl font-bold font-display mt-4 mb-2">{product.title}</h1>
                            <div className="flex items-center text-muted-foreground">
                                <MapPin className="h-4 w-4 mr-2" />
                                <span>{product.location || "Localisation non spécifiée"}</span>
                            </div>
                        </div>

                        <div className="prose prose-sm max-w-none text-muted-foreground">
                            <p className="whitespace-pre-line">{product.description}</p>
                        </div>

                        <div className="border-t border-b py-6 space-y-4">
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium uppercase">Prix par jour</p>
                                    <p className="text-3xl font-black text-primary">
                                        {new Intl.NumberFormat('fr-FR').format(product.price)} CFA
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Sélectionner vos dates</label>
                                <div className={cn("grid gap-2")}>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                id="date"
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !date && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {date?.from ? (
                                                    date.to ? (
                                                        <>
                                                            {format(date.from, "d LLL y", { locale: fr })} -{" "}
                                                            {format(date.to, "d LLL y", { locale: fr })}
                                                        </>
                                                    ) : (
                                                        format(date.from, "d LLL y", { locale: fr })
                                                    )
                                                ) : (
                                                    <span>Choisir une période</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                initialFocus
                                                mode="range"
                                                defaultMonth={date?.from}
                                                selected={date}
                                                onSelect={setDate}
                                                numberOfMonths={2}
                                                disabled={(date) =>
                                                    isBefore(date, startOfToday()) ||
                                                    existingBookings.some(bookedDate =>
                                                        bookedDate.toDateString() === date.toDateString()
                                                    )
                                                }
                                                locale={fr}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            {date?.from && date?.to && (
                                <div className="bg-secondary/30 p-4 rounded-xl space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Durée</span>
                                        <span className="font-medium">{differenceInDays(date.to, date.from) + 1} jours</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total estimé</span>
                                        <span>{new Intl.NumberFormat('fr-FR').format((differenceInDays(date.to, date.from) + 1) * product.price)} CFA</span>
                                    </div>
                                </div>
                            )}

                            <Button
                                size="lg"
                                className="w-full text-lg h-14"
                                onClick={handleBooking}
                                disabled={isBooking || !date?.from || !date?.to}
                            >
                                {isBooking ? "Traitement..." : "Confirmer la réservation"}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="mt-24 max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold font-display mb-12 text-center">Avis Clients</h2>
                    <div className="grid gap-12">
                        <ReviewForm productId={product.id} onReviewSubmitted={() => id && fetchReviews(id)} />
                        <ReviewList reviews={reviews} />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProductDetails;
