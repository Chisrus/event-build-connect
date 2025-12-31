import { Button } from "@/components/ui/button";
import { Menu, User, ShoppingCart, PlusCircle, LogOut, Home, Grid, HardHat, PartyPopper, Phone, LayoutDashboard } from "lucide-react";
import logo from "@/assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

import { useCart } from "@/contexts/CartContext";

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const { totalItems, setIsOpen } = useCart();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Déconnexion réussie");
    navigate("/");
  };

  const handleCartClick = () => {
    setIsOpen(true);
  };

  const handlePublishClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast.info("Veuillez vous inscrire pour publier une annonce.");
      navigate("/register");
    } else {
      navigate("/publish");
    }
  };

  const navLinks = [
    { name: "Accueil", path: "/", icon: Home },
    { name: "Événementiel", path: "/event", icon: PartyPopper },
    { name: "Construction", path: "/construction", icon: HardHat },
    { name: "Catalogue", path: "/catalog", icon: Grid },
    { name: "Contact", path: "#contact", icon: Phone },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo + Name */}
          <Link to="/" className="flex items-center gap-4 group cursor-pointer">
            <img
              src={logo}
              alt="HM. BUILDING EVENT"
              className="w-16 h-16 object-contain transition-transform duration-300 group-hover:scale-110"
            />
            <div className="hidden sm:block">
              <h2 className="font-display text-lg md:text-xl font-bold text-foreground leading-tight">
                HM. BUILDING EVENT
              </h2>
              <p className="text-[10px] md:text-xs text-muted-foreground">Location de matériel</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-foreground hover:text-primary transition-colors font-medium text-sm"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Button onClick={handlePublishClick} className="hidden md:flex gap-2 bg-primary hover:bg-primary/90">
              <PlusCircle className="h-4 w-4" />
              Publier une annonce
            </Button>
            <Button variant="ghost" size="icon" className="hidden xl:flex relative" onClick={handleCartClick}>
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg shadow-accent/40 animate-in zoom-in">
                  {totalItems}
                </span>
              )}
            </Button>

            {user ? (
              <div className="hidden xl:flex items-center gap-2">
                <Link to="/dashboard">
                  <Button variant="ghost" className="flex">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Tableau de bord
                  </Button>
                </Link>
                <Button variant="outline" className="flex">
                  <User className="h-4 w-4 mr-2" />
                  Profil
                </Button>
                <Button variant="ghost" size="icon" onClick={handleSignOut} title="Se déconnecter">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="hidden xl:flex items-center gap-2">
                <Link to="/login">
                  <Button variant="outline">
                    Connexion
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    S'inscrire
                  </Button>
                </Link>
              </div>
            )}

            <div className="xl:hidden flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative" onClick={handleCartClick}>
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg shadow-accent/40 animate-in zoom-in">
                    {totalItems}
                  </span>
                )}
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <SheetHeader className="text-left">
                    <SheetTitle className="font-display text-2xl font-bold">Menu</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-6 mt-8">
                    <div className="flex flex-col gap-4">
                      {navLinks.map((link) => (
                        <Link
                          key={link.name}
                          to={link.path}
                          className="flex items-center gap-4 text-lg font-medium text-foreground hover:text-primary transition-colors py-2"
                        >
                          <link.icon className="h-5 w-5" />
                          {link.name}
                        </Link>
                      ))}
                    </div>
                    <Separator />
                    <div className="flex flex-col gap-4">
                      {user ? (
                        <>
                          <div className="flex items-center gap-4 text-lg font-medium py-2 text-muted-foreground italic">
                            <User className="h-5 w-5" /> {user.email}
                          </div>
                          <Link
                            to="/dashboard"
                            className="flex items-center gap-4 text-lg font-medium text-foreground hover:text-primary transition-colors py-2"
                          >
                            <LayoutDashboard className="h-5 w-5" />
                            Tableau de bord
                          </Link>
                          <Button
                            variant="destructive"
                            className="w-full justify-start gap-4"
                            onClick={handleSignOut}
                          >
                            <LogOut className="h-5 w-5" /> Se déconnecter
                          </Button>
                        </>
                      ) : (
                        <>
                          <Link to="/login" className="w-full text-center">
                            <Button variant="outline" className="w-full">Connexion</Button>
                          </Link>
                          <Link to="/register" className="w-full text-center">
                            <Button className="w-full bg-accent text-accent-foreground">S'inscrire</Button>
                          </Link>
                        </>
                      )}
                    </div>
                    <Button onClick={handlePublishClick} className="mt-4 w-full gap-2 bg-primary">
                      <PlusCircle className="h-4 w-4" />
                      Publier une annonce
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
