import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import tentImage from "@/assets/tent-event.jpg";
import soundImage from "@/assets/sound-system.jpg";
import toolsImage from "@/assets/construction-tools.jpg";
import chairsImage from "@/assets/chairs.jpg";

export const FeaturedProducts = () => {
  const products = [
    {
      id: 1,
      name: "Tente Événementielle 6x6m",
      category: "Événementiel",
      price: "150€",
      period: "/jour",
      image: tentImage,
      available: true,
    },
    {
      id: 2,
      name: "Système de Sonorisation Pro",
      category: "Événementiel",
      price: "200€",
      period: "/jour",
      image: soundImage,
      available: true,
    },
    {
      id: 3,
      name: "Kit Outils de Construction",
      category: "Construction",
      price: "80€",
      period: "/jour",
      image: toolsImage,
      available: true,
    },
    {
      id: 4,
      name: "Chaises Chiavari x50",
      category: "Événementiel",
      price: "120€",
      period: "/jour",
      image: chairsImage,
      available: true,
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Équipements Populaires
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez nos équipements les plus demandés, disponibles immédiatement
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {products.map((product, index) => (
            <Card
              key={product.id}
              className="group overflow-hidden border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden aspect-square">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">
                  {product.category}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-primary">{product.price}</span>
                  <span className="text-muted-foreground text-sm">{product.period}</span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Réserver
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="hover:bg-primary hover:text-primary-foreground">
            Voir tout le catalogue
          </Button>
        </div>
      </div>
    </section>
  );
};
