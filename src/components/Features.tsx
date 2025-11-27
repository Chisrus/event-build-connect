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
    <section className="py-20 bg-muted/30">
      <div className="container px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Pourquoi Nous Choisir
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Une plateforme conçue pour simplifier et sécuriser vos locations
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="text-center space-y-4 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 mb-4">
                <feature.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
