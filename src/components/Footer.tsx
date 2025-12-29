import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export const Footer = () => {
  return (
    <footer id="contact" className="bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent"></div>
      <div className="container px-4 py-24 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <img
              src={logo}
              alt="HM. BUILDING EVENT Logo"
              className="w-32 h-32 object-contain mb-4"
            />
            <p className="text-primary-foreground/80">
              Votre partenaire de confiance pour la location de matériel événementiel et de construction.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Liens Rapides</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/catalog" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Catalogue
                </Link>
              </li>
              <li>
                <Link to="/event" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Événementiel
                </Link>
              </li>
              <li>
                <Link to="/construction" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Construction
                </Link>
              </li>
              <li>
                <a href="#partners" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Nos Partenaires
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Support</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => toast.info("Le centre d'aide sera bientôt disponible.")}
                  className="text-primary-foreground/80 hover:text-accent transition-colors text-left"
                >
                  Centre d'aide
                </button>
              </li>
              <li>
                <button
                  onClick={() => toast.info("Les Conditions Générales de Vente seront bientôt disponibles.")}
                  className="text-primary-foreground/80 hover:text-accent transition-colors text-left"
                >
                  CGV
                </button>
              </li>
              <li>
                <button
                  onClick={() => toast.info("La politique de confidentialité sera bientôt disponible.")}
                  className="text-primary-foreground/80 hover:text-accent transition-colors text-left"
                >
                  Politique de confidentialité
                </button>
              </li>
              <li>
                <a href="#contact" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/60 text-sm">
              © 2024 HM. BUILDING EVENT. Tous droits réservés.
            </p>
            <div className="flex gap-4">
              <Button size="icon" variant="ghost" className="hover:bg-accent hover:text-accent-foreground">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="hover:bg-accent hover:text-accent-foreground">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="hover:bg-accent hover:text-accent-foreground">
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
