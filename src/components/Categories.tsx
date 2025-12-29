import { PartyPopper, HardHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Categories = () => {
  const categories = [
    {
      icon: PartyPopper,
      title: "Événementiel",
      description: "Tentes, chaises, sonorisation, décoration et tout le nécessaire pour vos événements",
      color: "from-accent/20 to-accent/5",
      iconColor: "text-accent",
      path: "/event"
    },
    {
      icon: HardHat,
      title: "Construction",
      description: "Outils professionnels, équipements de chantier et matériel de sécurité",
      color: "from-primary/20 to-primary/5",
      iconColor: "text-primary",
      path: "/construction"
    },
  ];

  return (
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>

      <div className="container px-4">
        <div className="text-center mb-20 animate-fade-in">
          <h2 className="text-balance font-display text-4xl md:text-6xl font-black text-foreground mb-6">
            Explorez par <span className="text-accent italic">Univers</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Une sélection rigoureuse d'équipements pour propulser vos projets vers l'excellence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {categories.map((category, index) => (
            <div
              key={category.title}
              className="group relative bg-card rounded-[2.5rem] p-10 border border-border hover:border-accent/30 transition-all duration-500 premium-shadow hover:shadow-2xl overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/10 to-transparent rounded-bl-[100%] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

              <div className="relative z-10">
                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                  <category.icon className={`h-10 w-10 ${category.iconColor}`} />
                </div>
                <h3 className="font-display text-3xl font-black text-foreground mb-4">
                  {category.title}
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-sm">
                  {category.description}
                </p>
                <Link to={category.path}>
                  <Button variant="outline" className="h-12 px-8 rounded-full border-2 border-primary/10 hover:border-accent hover:bg-accent hover:text-white transition-all duration-300 font-bold tracking-wide">
                    Découvrir le matériel
                  </Button>
                </Link>
              </div>

              <div className="absolute bottom-8 right-8 text-6xl font-black text-primary/5 opacity-0 group-hover:opacity-10 group-hover:-translate-y-2 transition-all duration-700 pointer-events-none uppercase italic">
                {category.title.split(' ')[0]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
