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

export const ProductCard = ({ product }: { product: Product }) => {
    const formattedPrice = new Intl.NumberFormat('fr-FR').format(product.price);

    return (
        <Card className="group overflow-hidden border-border hover:border-primary/50 transition-all duration-500 hover:shadow-2xl bg-card animate-fade-in">
            <div className="relative overflow-hidden aspect-[4/5]">
                <img
                    src={product.images?.[0] || "/placeholder.svg"}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <Button size="icon" variant="secondary" className="rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 delay-75">
                        <Eye className="h-5 w-5" />
                    </Button>
                    <Button size="icon" className="rounded-full bg-primary scale-0 group-hover:scale-100 transition-transform duration-300 delay-150">
                        <ShoppingCart className="h-5 w-5" />
                    </Button>
                </div>
                <Badge className="absolute top-4 left-4 bg-background/80 backdrop-blur-md text-foreground border-none hover:bg-background/90 text-xs font-semibold px-3 py-1">
                    {product.category}
                </Badge>
            </div>
            <CardContent className="p-5">
                <h3 className="font-display text-lg font-bold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    {product.title}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-4 min-h-[40px]">
                    {product.description}
                </p>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-primary">{formattedPrice}</span>
                    <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">FCFA / JOUR</span>
                </div>
            </CardContent>
            <CardFooter className="p-5 pt-0">
                <Button className="w-full bg-secondary hover:bg-primary transition-all duration-300 text-secondary-foreground hover:text-primary-foreground font-bold py-6">
                    Réserver maintenant
                </Button>
            </CardFooter>
        </Card>
    );
};
