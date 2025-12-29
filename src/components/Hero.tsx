import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const Hero = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/catalog');
    }
  };
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with sophisticated Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Matériel événementiel et de construction"
          className="w-full h-full object-cover scale-105 animate-subtle-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/40 to-background"></div>
        <div className="absolute inset-0 bg-primary/20 backdrop-grayscale-[0.3]"></div>
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 pt-32 pb-20 animate-fade-in-up">
        <div className="max-w-5xl mx-auto text-center space-y-10">
          <div className="space-y-4">
            <h1 className="text-balance font-display text-5xl sm:text-6xl md:text-8xl font-black text-white leading-[1.1] tracking-tight">
              L'Équipement <span className="text-accent underline decoration-accent/30 underline-offset-8">Pro</span><br />
              pour vos Ambitions
            </h1>
            <p className="text-lg md:text-2xl text-white/80 max-w-2xl mx-auto font-medium leading-relaxed">
              Location de matériel événementiel et de construction.
              Une plateforme robuste pour bâtir vos projets les plus audacieux.
            </p>
          </div>

          <form onSubmit={handleSearch} className="glass p-2 sm:p-3 rounded-[2rem] max-w-4xl mx-auto premium-shadow hover:shadow-2xl transition-all duration-500">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-[1.5] relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/50 group-focus-within:text-accent transition-colors" />
                <input
                  type="text"
                  placeholder="Que recherchez-vous ?"
                  className="w-full pl-14 h-16 text-lg border-0 bg-white/50 dark:bg-black/20 focus-visible:ring-0 rounded-2xl placeholder:text-primary/40 outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="hidden md:block w-px h-10 bg-primary/10 self-center"></div>
              <div className="flex-1 relative group">
                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/50 group-focus-within:text-accent transition-colors" />
                <input
                  type="text"
                  placeholder="Où ?"
                  className="w-full pl-14 h-16 text-lg border-0 bg-white/50 dark:bg-black/20 focus-visible:ring-0 rounded-2xl placeholder:text-primary/40 outline-none"
                />
              </div>
              <Button type="submit" size="lg" className="h-16 px-10 text-lg bg-accent hover:bg-accent/90 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-accent/40 hover:-translate-y-0.5">
                Explorer
              </Button>
            </div>
          </form>

          <div className="flex flex-wrap items-center justify-center gap-8 pt-4 opacity-70">
            <div className="flex items-center gap-2 text-white/80 text-sm font-semibold uppercase tracking-widest">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
              +500 Équipements
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm font-semibold uppercase tracking-widest">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
              Support 24/7
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 animate-bounce cursor-pointer opacity-50 hover:opacity-100 transition-opacity">
        <div className="w-8 h-12 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
        </div>
      </div>
    </section>
  );
};
