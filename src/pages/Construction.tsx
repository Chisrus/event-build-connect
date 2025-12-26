import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const Construction = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 py-24">
                <h1 className="text-4xl font-bold font-display mb-8">Matériel de Construction</h1>
                <p className="text-muted-foreground">Équipements professionnels pour le BTP et les chantiers.</p>
            </div>
            <Footer />
        </div>
    );
};

export default Construction;
