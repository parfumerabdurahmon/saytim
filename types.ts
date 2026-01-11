
export interface Perfume {
  id: string;
  name: string;
  brand: string;
  price: number;
  description: string;
  image: string;
  notes: string[];
  category: 'Floral' | 'Woody' | 'Oriental' | 'Fresh' | 'Citrus';
}

export interface RecommendationRequest {
  preference: string;
  occasion: string;
  mood: string;
}
