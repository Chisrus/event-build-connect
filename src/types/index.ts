export interface Product {
    id: string;
    title: string;
    category: string;
    price: number;
    images: string[];
    description: string;
    location?: string;
    user_id: string;
    created_at?: string;
}

export interface Booking {
    id: string;
    product_id: string;
    renter_id: string;
    start_date: string;
    end_date: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    total_price: number;
    created_at: string;
    product?: Product; // For joined queries
}

export interface Review {
    id: string;
    product_id: string;
    reviewer_id: string;
    rating: number; // 1-5
    comment: string;
    created_at: string;
    reviewer?: {
        display_name: string; // Or email if profile not set
    };
}
