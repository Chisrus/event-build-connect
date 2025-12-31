import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface ReviewFormProps {
    productId: string;
    onReviewSubmitted: () => void;
}

export const ReviewForm = ({ productId, onReviewSubmitted }: ReviewFormProps) => {
    const { user } = useAuth();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [hoveredRating, setHoveredRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error("Veuillez vous connecter pour laisser un avis.");
            return;
        }

        if (rating === 0) {
            toast.error("Veuillez sélectionner une note.");
            return;
        }

        setIsSubmitting(true);
        try {
            const { error } = await supabase.from('reviews').insert({
                product_id: productId,
                reviewer_id: user.id,
                rating,
                comment
            });

            if (error) throw error;

            toast.success("Votre avis a été publié !");
            setRating(0);
            setComment("");
            onReviewSubmitted();
        } catch (error: any) {
            console.error("Error submitting review:", error);
            toast.error("Erreur lors de l'envoi de l'avis.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-muted/30 p-6 rounded-2xl">
            <h3 className="font-semibold text-lg">Laisser un avis</h3>

            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        className="focus:outline-none transition-colors"
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        onClick={() => setRating(star)}
                    >
                        <Star
                            className={`h-6 w-6 ${star <= (hoveredRating || rating)
                                    ? "fill-yellow-500 text-yellow-500"
                                    : "text-muted-foreground"
                                }`}
                        />
                    </button>
                ))}
            </div>

            <Textarea
                placeholder="Partagez votre expérience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                className="min-h-[100px] bg-background"
            />

            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Envoi..." : "Publier l'avis"}
            </Button>
        </form>
    );
};
