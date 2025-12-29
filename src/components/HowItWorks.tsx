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
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="container px-4">
        <div className="text-center mb-24 animate-fade-in">
          <h2 className="text-balance font-display text-4xl md:text-6xl font-black text-foreground mb-6">
            Votre Succès en <span className="text-accent italic">3 Temps</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Une expérience de location pensée pour l'efficacité et la sérénité.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-16 lg:gap-24 max-w-6xl mx-auto relative">
          {/* Decorative path for desktop */}
          <div className="hidden lg:block absolute top-[60px] left-[15%] right-[15%] h-1 bg-gradient-to-r from-accent/20 via-accent to-accent/20 rounded-full blur-[1px]"></div>

          {steps.map((step, index) => (
            <div
              key={step.title}
              className="group relative text-center space-y-8 animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="relative inline-flex items-center justify-center w-32 h-32 rounded-[2.5rem] bg-white dark:bg-card premium-shadow group-hover:scale-110 group-hover:-rotate-3 transition-all duration-700 animate-fade-in">
                <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center text-xl font-black shadow-lg shadow-accent/40 group-hover:scale-110 transition-transform">
                  {index + 1}
                </div>
                <step.icon className="h-12 w-12 text-primary group-hover:text-accent transition-colors duration-500" />
              </div>
              <div className="space-y-4">
                <h3 className="font-display text-3xl font-black text-foreground group-hover:text-accent transition-colors">
                  {step.title.split('. ')[1]}
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
