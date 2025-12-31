import { Review } from "@/types";
import { Star, User } from "lucide-react";

interface ReviewListProps {
    reviews: Review[];
}

export const ReviewList = ({ reviews }: ReviewListProps) => {
    if (reviews.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-xl">
                <p>Aucun avis pour le moment.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {reviews.map((review) => (
                <div key={review.id} className="border-b pb-6 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <div className="bg-muted p-2 rounded-full">
                                <User className="h-4 w-4" />
                            </div>
                            <span className="font-semibold text-sm">Utilisateur</span>
                        </div>
                        <div className="flex text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < review.rating ? "fill-current" : "text-muted"}`}
                                />
                            ))}
                        </div>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{review.comment}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                        {new Date(review.created_at).toLocaleDateString()}
                    </p>
                </div>
            ))}
        </div>
    );
};
