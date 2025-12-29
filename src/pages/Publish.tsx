import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Publish = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    // Form State
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast.error("Vous devez être connecté pour publier une annonce");
            return;
        }

        if (!title || !category || !price || !description) {
            toast.error("Veuillez remplir tous les champs obligatoires");
            return;
        }

        setLoading(true);

        try {
            let imageUrl = null;

            // Upload Image
            if (image) {
                const fileExt = image.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${user.id}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('products')
                    .upload(filePath, image);

                if (uploadError) {
                    throw uploadError;
                }

                const { data } = supabase.storage
                    .from('products')
                    .getPublicUrl(filePath);

                imageUrl = data.publicUrl;
            }

            // Insert Product
            const { error: insertError } = await supabase
                .from('products')
                .insert({
                    title,
                    category,
                    price: parseFloat(price),
                    description,
                    images: imageUrl ? [imageUrl] : [],
                    user_id: user.id
                });

            if (insertError) throw insertError;

            toast.success("Votre annonce a été publiée avec succès !");
            navigate("/catalog");

        } catch (error: any) {
            console.error('Error publishing product:', error);
            toast.error(error.message || "Erreur lors de la publication");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 py-24 max-w-2xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-display mb-2">Publier une annonce</h1>
                    <p className="text-muted-foreground">Remplissez le formulaire ci-dessous pour proposer votre matériel à la location.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg border shadow-sm">
                    <div className="space-y-2">
                        <Label htmlFor="title">Titre de l'annonce</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ex: Tente de réception 5x10m"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Catégorie</Label>
                        <Select value={category} onValueChange={setCategory} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionner une catégorie" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="event">Événementiel</SelectItem>
                                <SelectItem value="construction">Construction</SelectItem>
                                <SelectItem value="tools">Outillage</SelectItem>
                                <SelectItem value="transport">Transport</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="price">Prix par jour (FCFA)</Label>
                        <Input
                            id="price"
                            type="number"
                            min="0"
                            step="1"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="0"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description détaillée</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Décrivez l'état, les dimensions et les caractéristiques techniques..."
                            className="min-h-[150px]"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="images">Photos</Label>
                        <Input
                            id="images"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                            className="cursor-pointer"
                        />
                    </div>

                    <div className="pt-4 flex gap-4">
                        <Button type="button" variant="outline" className="w-full" onClick={() => navigate(-1)}>
                            Annuler
                        </Button>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Publication en cours..." : "Publier l'annonce"}
                        </Button>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default Publish;
