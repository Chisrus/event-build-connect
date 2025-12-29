import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

interface Product {
    id: string;
    title: string;
    category: string;
    price: number;
    images: string[];
    description: string;
}

import { toast } from "sonner";

export const ProductCard = ({ product }: { product: Product }) => {
    const formattedPrice = new Intl.NumberFormat('fr-FR').format(product.price || 0);

    const handleAction = () => {
        toast.info("Cette fonctionnalité de réservation sera bientôt disponible avec paiement sécurisé !");
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
                        onClick={handleAction}
                    >
                        <Eye className="h-5 w-5" />
                    </Button>
                    <Button
                        size="icon"
                        className="rounded-full w-12 h-12 bg-accent text-white translate-y-0 lg:translate-y-4 lg:group-hover:translate-y-0 transition-all duration-500 delay-150 hover:scale-110"
                        onClick={handleAction}
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
                        onClick={handleAction}
                    >
                        <PlusCircle className="h-6 w-6" />
                    </Button>
                </div>
            </CardContent>
            <CardFooter className="px-6 pb-8 pt-0">
                {/* Optional button if we want more secondary action */}
            </CardFooter>
        </Card>
    );
};

import { PlusCircle } from "lucide-react";
