import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const Event = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 py-24">
                <h1 className="text-4xl font-bold font-display mb-8">Matériel Événementiel</h1>
                <p className="text-muted-foreground">Tout le nécessaire pour vos événements : Mariages, concerts, conférences...</p>
            </div>
            <Footer />
        </div>
    );
};

export default Event;
