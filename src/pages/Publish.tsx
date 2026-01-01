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
import { Camera, MapPin, X, Navigation } from "lucide-react";
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
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            streamRef.current = stream;
            setIsCameraOpen(true);
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            }, 100);
        } catch (err) {
            console.error("Error accessing camera:", err);
            toast.error("Impossible d'accéder à la caméra. Vérifiez vos permissions.");
        }
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            if (context) {
                // Set canvas dimensions to match video
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                // Draw video frame to canvas
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Convert to blob/file
                canvas.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], "captured-photo.jpg", { type: "image/jpeg" });
                        setImage(file);
                        setPreviewUrl(URL.createObjectURL(blob));
                        stopCamera();
                    }
                }, 'image/jpeg', 0.8);
            }
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsCameraOpen(false);
    };

    const resetCamera = () => {
        setImage(null);
        setPreviewUrl(null);
        startCamera();
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

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
                        <div className="border-2 border-dashed border-input rounded-lg p-6 flex flex-col items-center gap-4 bg-muted/20">
                            {previewUrl ? (
                                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2 rounded-full"
                                        onClick={resetCamera}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : isCameraOpen ? (
                                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        className="w-full h-full object-contain"
                                    />
                                    <Button
                                        type="button"
                                        className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full px-8 py-6 shadow-lg animate-pulse bg-red-600 hover:bg-red-700 border-4 border-white"
                                        onClick={capturePhoto}
                                    >
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-center space-y-4">
                                    <div className="mx-auto w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                                        <Camera className="h-8 w-8 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Prendre une photo</p>
                                        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                            Pour plus de transparence, veuillez prendre une photo directe de votre article.
                                        </p>
                                    </div>
                                    <Button type="button" onClick={startCamera}>
                                        <Camera className="mr-2 h-4 w-4" />
                                        Ouvrir la caméra
                                    </Button>
                                    <canvas ref={canvasRef} className="hidden" />
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
