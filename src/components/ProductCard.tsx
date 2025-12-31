import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, ShoppingCart, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

interface Product {
    id: string;
    title: string;
    category: string;
    price: number;
    images: string[];
    description: string;
    location?: string;
}

import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

export const ProductCard = ({ product }: { product: Product }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { addItem, setIsOpen } = useCart();
    const formattedPrice = new Intl.NumberFormat('fr-FR').format(product.price || 0);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            toast.info("Veuillez vous inscrire pour ajouter des articles au panier.");
            navigate("/register");
            return;
        }

        addItem({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.images?.[0] || "/placeholder.svg",
            category: product.category,
        });
    };

    const handleViewDetails = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toast.info("Les détails du produit seront bientôt disponibles !");
    };

    return (
        <Card className="group overflow-hidden border-border/50 hover:border-accent/30 transition-all duration-700 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] bg-card rounded-[2.5rem] animate-fade-in premium-shadow">
            <div className="relative overflow-hidden aspect-[4/5] m-3 rounded-[2rem]">
                <img
                    src={product.images?.[0] || "/placeholder.svg"}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center p-6 gap-3">
                    <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-full w-12 h-12 glass border-white/20 translate-y-0 lg:translate-y-4 lg:group-hover:translate-y-0 transition-all duration-500 delay-75 hover:bg-white hover:text-primary"
                        onClick={handleViewDetails}
                    >
                        <Eye className="h-5 w-5" />
                    </Button>
                    <Button
                        size="icon"
                        className="rounded-full w-12 h-12 bg-accent text-white translate-y-0 lg:translate-y-4 lg:group-hover:translate-y-0 transition-all duration-500 delay-150 hover:scale-110"
                        onClick={handleAddToCart}
                    >
                        <ShoppingCart className="h-5 w-5" />
                    </Button>
                </div>
                <Badge className="absolute top-4 left-4 glass text-white border-0 text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                    {product.category}
                </Badge>
            </div>
            <CardContent className="px-6 pb-4 pt-2">
                <h3 className="font-display text-xl font-black text-foreground mb-2 line-clamp-1 group-hover:text-accent transition-colors duration-300">
                    {product.title}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-6 min-h-[40px] leading-relaxed">
                    {product.description}
                </p>
                <div className="flex items-center justify-between border-t border-border/50 pt-5">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter">Prix Loc.</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-primary group-hover:text-accent transition-colors">{formattedPrice}</span>
                            <span className="text-[10px] font-black text-muted-foreground tracking-tighter uppercase italic">CFA</span>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="w-12 h-12 rounded-2xl bg-secondary hover:bg-accent hover:text-white transition-all duration-300"
                        onClick={handleAddToCart}
                    >
                        <PlusCircle className="h-6 w-6" />
                    </Button>
                </div>
            </CardContent>
            <div className="flex items-center gap-2 mt-4 text-xs font-medium text-muted-foreground bg-secondary/50 p-2 rounded-lg">
                <MapPin className="h-4 w-4 text-accent" />
                <span className="truncate">{product.location || "Localisation non spécifiée"}</span>
            </div>
        </CardFooter>
        </Card >
    );
};

import { PlusCircle } from "lucide-react";
