import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const Catalog = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 py-24">
                <h1 className="text-4xl font-bold font-display mb-8">Catalogue Complet</h1>
                <p className="text-muted-foreground mb-12">Découvrez l'ensemble de notre matériel disponible à la location.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Placeholder for real catalog items */}
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div key={item} className="bg-card rounded-lg border p-6 hover:shadow-lg transition-shadow">
                            <div className="h-48 bg-muted rounded-md mb-4 flex items-center justify-center text-muted-foreground">
                                Image Produit {item}
                            </div>
                            <h3 className="text-xl font-bold mb-2">Produit {item}</h3>
                            <p className="text-sm text-muted-foreground mb-4">Description courte du produit disponible à la location.</p>
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-primary">À partir de 50€/jour</span>
                                <button className="text-sm font-medium hover:underline">Voir détails</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Catalog;
