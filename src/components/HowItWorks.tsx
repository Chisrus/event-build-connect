import { Search, CheckCircle, Truck } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: "1. Recherchez",
      description: "Parcourez notre catalogue et trouvez l'équipement dont vous avez besoin",
    },
    {
      icon: CheckCircle,
      title: "2. Réservez",
      description: "Sélectionnez vos dates et validez votre réservation en ligne",
    },
    {
      icon: Truck,
      title: "3. Recevez",
      description: "Livraison rapide et récupération de votre matériel sans déplacement",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Comment Ça Marche
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trois étapes simples pour louer votre matériel
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative text-center space-y-4 animate-fade-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary to-accent"></div>
              )}
              
              <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary via-primary to-accent mx-auto shadow-lg">
                <step.icon className="h-10 w-10 text-primary-foreground" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground">
                {step.title}
              </h3>
              <p className="text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
