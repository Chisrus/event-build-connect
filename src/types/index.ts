export interface Product {
    id: string;
    title: string;
    category: string;
    price: number;
    images: string[];
    description: string;
    location?: string;
    latitude?: number;
    longitude?: number;
    user_id: string;
    created_at?: string;
}

export interface Booking {
    id: string;
    product_id: string;
    renter_id: string;
    owner_id: string;
    start_date: string;
    end_date: string;
    status: string;
    total_price: number;
    created_at: string;
    product?: Product;
}

export interface Review {
    id: string;
    product_id: string;
    user_id: string;
    rating: number;
    comment: string | null;
    created_at: string;
}
