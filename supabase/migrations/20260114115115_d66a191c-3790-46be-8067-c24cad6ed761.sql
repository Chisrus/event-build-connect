-- Créer la table products
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  user_id UUID NOT NULL,
  location TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Politique: tout le monde peut voir les produits
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

-- Politique: les utilisateurs authentifiés peuvent créer des produits
CREATE POLICY "Authenticated users can create products" 
ON public.products 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Politique: les utilisateurs peuvent modifier leurs propres produits
CREATE POLICY "Users can update their own products" 
ON public.products 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Politique: les utilisateurs peuvent supprimer leurs propres produits
CREATE POLICY "Users can delete their own products" 
ON public.products 
FOR DELETE 
USING (auth.uid() = user_id);

-- Index pour optimiser les recherches par proximité
CREATE INDEX idx_products_geolocation 
ON public.products (latitude, longitude) 
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Index pour les recherches par catégorie
CREATE INDEX idx_products_category ON public.products (category);

-- Créer le bucket de stockage pour les images de produits
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true);

-- Politique: tout le monde peut voir les images
CREATE POLICY "Product images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'product-images');

-- Politique: les utilisateurs authentifiés peuvent uploader des images
CREATE POLICY "Authenticated users can upload product images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Politique: les utilisateurs peuvent supprimer leurs propres images
CREATE POLICY "Users can delete their own product images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');