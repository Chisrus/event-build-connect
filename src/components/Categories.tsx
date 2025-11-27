import { PartyPopper, HardHat } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Categories = () => {
  const categories = [
    {
      icon: PartyPopper,
      title: "Événementiel",
      description: "Tentes, chaises, sonorisation, décoration et tout le nécessaire pour vos événements",
      color: "from-accent/20 to-accent/5",
      iconColor: "text-accent",
    },
    {
      icon: HardHat,
      title: "Construction",
      description: "Outils professionnels, équipements de chantier et matériel de sécurité",
      color: "from-primary/20 to-primary/5",
      iconColor: "text-primary",
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Nos Catégories
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez notre large gamme d'équipements pour tous vos besoins
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {categories.map((category, index) => (
            <div
              key={category.title}
              className="group bg-card rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-border hover:border-primary/20 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <category.icon className={`h-8 w-8 ${category.iconColor}`} />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                {category.title}
              </h3>
              <p className="text-muted-foreground mb-6">
                {category.description}
              </p>
              <Button variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                Explorer
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
