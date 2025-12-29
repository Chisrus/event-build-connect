import { MapPin, Shield, FileText, Clock } from "lucide-react";

export const Features = () => {
  const features = [
    {
      icon: MapPin,
      title: "Localisation GPS",
      description: "Trouvez les fournisseurs les plus proches et suivez vos équipements en temps réel",
    },
    {
      icon: Shield,
      title: "Sécurité Garantie",
      description: "Système de traçabilité GPS intégré pour protéger tous les équipements loués",
    },
    {
      icon: FileText,
      title: "Facturation Automatique",
      description: "Recevez instantanément votre facture après chaque transaction",
    },
    {
      icon: Clock,
      title: "Disponibilité Immédiate",
      description: "Réseau de partenaires mobilisés pour garantir la disponibilité et la qualité",
    },
  ];

  return (
    <section className="py-32 bg-secondary/30 relative">
      <div className="container px-4">
        <div className="text-center mb-24 animate-fade-in">
          <h2 className="text-balance font-display text-4xl md:text-6xl font-black text-foreground mb-6">
            L'Excellence à <span className="text-accent italic">Portée de Main</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Nous avons repensé la location pour qu'elle soit aussi performante que vos projets.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group flex flex-col items-center text-center space-y-6 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-accent/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white dark:bg-card premium-shadow group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500">
                  <feature.icon className="h-10 w-10 text-accent group-hover:rotate-12 transition-transform" />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-display text-2xl font-black text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed font-medium">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
