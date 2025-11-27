import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Matériel événementiel et de construction" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/75"></div>
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 py-20 mt-20 animate-fade-in">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="font-display text-5xl md:text-7xl font-bold text-primary-foreground leading-tight">
            Location de Matériel Professionnel
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto">
            Votre plateforme de location de matériel événementiel et de construction. 
            Simple, rapide et sécurisé.
          </p>

          {/* Search Bar */}
          <div className="bg-background/95 backdrop-blur-sm p-4 rounded-2xl shadow-2xl max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Rechercher du matériel..." 
                  className="pl-12 h-14 text-lg border-0 bg-muted/50"
                />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Localisation" 
                  className="pl-12 h-14 text-lg border-0 bg-muted/50"
                />
              </div>
              <Button size="lg" className="h-14 px-8 text-lg bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                Rechercher
              </Button>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary-foreground/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-primary-foreground/50 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};
