import { useState, useRef, useEffect } from "react";
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
import { Image, MapPin, X, Navigation, Upload } from "lucide-react";
import { getUserLocation } from "@/utils/geolocation";

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
    const [location, setLocation] = useState("");
    const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
    const [isLocating, setIsLocating] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("L'image est trop volumineuse (max 5Mo)");
                return;
            }
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const removeImage = () => {
        setImage(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleGetLocation = async () => {
        setIsLocating(true);
        try {
            const coords = await getUserLocation();
            setCoordinates(coords);
            toast.success("Position localisée avec succès !");
            // Optional: You could use a reverse geocoding API here to fill the text location
        } catch (error: any) {
            console.error("Error getting location:", error);
            toast.error("Impossible de récupérer votre position. Vérifiez que la localisation est activée.");
        } finally {
            setIsLocating(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast.error("Vous devez être connecté pour publier une annonce");
            return;
        }

        if (!title || !category || !price || !description || !location) {
            toast.error("Veuillez remplir tous les champs obligatoires, y compris la localisation");
            return;
        }

        if (!image) {
            toast.error("Une photo est requise pour plus de transparence");
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
                    location: location,
                    latitude: coordinates?.latitude,
                    longitude: coordinates?.longitude,
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
                        <Label htmlFor="location">Localisation (Ville, Quartier)</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Ex: Douala, Bonapriso"
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex justify-end mt-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleGetLocation}
                            disabled={isLocating}
                        >
                            <Navigation className="mr-2 h-4 w-4" />
                            {isLocating ? "Localisation..." : coordinates ? "Position enregistrée" : "Utiliser ma position actuelle"}
                        </Button>
                    </div>

                    <div className="space-y-4">
                        <Label>Photo du produit</Label>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                        <div
                            className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center gap-4 transition-colors ${previewUrl ? 'border-primary/50 bg-primary/5' : 'border-input bg-muted/20 hover:bg-muted/30 cursor-pointer'
                                }`}
                            onClick={!previewUrl ? handleUploadClick : undefined}
                        >
                            {previewUrl ? (
                                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black/5">
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2 rounded-full"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeImage();
                                        }}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-center space-y-4">
                                    <div className="mx-auto w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                                        <Upload className="h-8 w-8 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Importer une image</p>
                                        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                            Cliquez ou glissez une photo de votre article ici (PNG, JPG, max 5Mo).
                                        </p>
                                    </div>
                                    <Button type="button" variant="outline" onClick={handleUploadClick}>
                                        <Image className="mr-2 h-4 w-4" />
                                        Choisir un fichier
                                    </Button>
                                </div>
                            )}
                        </div>
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
