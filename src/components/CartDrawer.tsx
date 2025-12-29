import React from 'react';
import { useCart } from '@/contexts/CartContext';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

export const CartDrawer = () => {
    const { items, removeItem, updateQuantity, totalPrice, totalItems, isOpen, setIsOpen, clearCart } = useCart();

    const formattedTotalPrice = new Intl.NumberFormat('fr-FR').format(totalPrice);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent className="w-full sm:max-w-md flex flex-col p-0 glass border-l border-white/20">
                <SheetHeader className="px-6 py-6 border-b border-border/50">
                    <SheetTitle className="font-display text-2xl font-black flex items-center gap-3">
                        <ShoppingBag className="text-accent" />
                        Votre Panier
                        <span className="text-sm font-medium bg-accent/10 text-accent px-3 py-1 rounded-full ml-auto">
                            {totalItems} article{totalItems > 1 ? 's' : ''}
                        </span>
                    </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-hidden">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center space-y-4 px-6 text-center">
                            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
                                <ShoppingBag className="w-10 h-10 text-muted-foreground opacity-20" />
                            </div>
                            <p className="text-xl font-bold text-foreground">Votre panier est vide</p>
                            <p className="text-muted-foreground">
                                Découvrez notre catalogue et ajoutez des équipements pour commencer.
                            </p>
                            <Button
                                variant="outline"
                                className="rounded-full mt-4"
                                onClick={() => setIsOpen(false)}
                            >
                                Continuer mes recherches
                            </Button>
                        </div>
                    ) : (
                        <ScrollArea className="h-full px-6">
                            <div className="space-y-6 py-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4 group">
                                        <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-secondary flex-shrink-0">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-display font-black text-lg line-clamp-1 group-hover:text-accent transition-colors">
                                                        {item.title}
                                                    </h4>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mt-1 -mr-2"
                                                        onClick={() => removeItem(item.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                                                    {item.category}
                                                </p>
                                            </div>

                                            <div className="flex justify-between items-end">
                                                <div className="flex items-center bg-secondary rounded-lg p-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 rounded-md"
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="w-8 text-center text-sm font-bold">
                                                        {item.quantity}
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 rounded-md"
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-lg font-black text-primary">
                                                        {new Intl.NumberFormat('fr-FR').format(item.price * item.quantity)}
                                                    </span>
                                                    <span className="text-[10px] font-black text-muted-foreground ml-1">CFA</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    )}
                </div>

                {items.length > 0 && (
                    <SheetFooter className="px-6 py-6 flex-col border-t border-border/50 bg-secondary/30">
                        <div className="w-full space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground font-medium">Sous-total</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-black text-primary">{formattedTotalPrice}</span>
                                    <span className="text-xs font-black text-muted-foreground uppercase italic">CFA</span>
                                </div>
                            </div>
                            <Separator />
                            <div className="grid grid-cols-1 gap-3">
                                <Button
                                    className="w-full h-14 bg-accent hover:bg-accent/90 text-white font-black text-lg rounded-2xl shadow-lg shadow-accent/20 transition-all active:scale-[0.98]"
                                    onClick={() => {
                                        // Placeholder for checkout logic
                                        toast.info("Le système de paiement en ligne sera activé prochainement !");
                                    }}
                                >
                                    Procéder à la réservation
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                                    onClick={clearCart}
                                >
                                    Vider le panier
                                </Button>
                            </div>
                            <p className="text-[10px] text-center text-muted-foreground">
                                Taxes et frais de livraison calculés à l'étape suivante.
                            </p>
                        </div>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    );
};
