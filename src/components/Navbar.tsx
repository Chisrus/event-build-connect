import { Button } from "@/components/ui/button";
import { Menu, User, ShoppingCart, PlusCircle, LogOut } from "lucide-react";
import logo from "@/assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo + Name */}
          <div className="flex items-center gap-4 group cursor-pointer">
            <img
              src={logo}
              alt="HM. BUILDING EVENT"
              className="w-16 h-16 object-contain transition-transform duration-300 group-hover:scale-110"
            />
            <div className="hidden md:block">
              <h2 className="font-display text-xl font-bold text-foreground leading-tight">
                HM. BUILDING EVENT
              </h2>
              <p className="text-xs text-muted-foreground">Location de matériel</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors font-medium">
              Accueil
            </Link>
            <Link to="/event" className="text-foreground hover:text-primary transition-colors font-medium">
              Événementiel
            </Link>
            <Link to="/construction" className="text-foreground hover:text-primary transition-colors font-medium">
              Construction
            </Link>
            <Link to="/catalog" className="text-foreground hover:text-primary transition-colors font-medium">
              Catalogue
            </Link>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors font-medium">
              Contact
            </a>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Link to="/publish">
              <Button className="hidden md:flex gap-2 bg-primary hover:bg-primary/90">
                <PlusCircle className="h-4 w-4" />
                Publier une annonce
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <ShoppingCart className="h-5 w-5" />
            </Button>
            {user ? (
              <div className="flex items-center gap-2">
                <Button variant="outline" className="hidden md:flex">
                  <User className="h-4 w-4 mr-2" />
                  Profil
                </Button>
                <Button variant="ghost" size="icon" onClick={handleSignOut} title="Se déconnecter">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="outline" className="hidden md:flex">
                    <User className="h-4 w-4 mr-2" />
                    Connexion
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="hidden md:flex bg-accent hover:bg-accent/90 text-accent-foreground">
                    S'inscrire
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};
