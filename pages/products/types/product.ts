export interface Product {
  id: number;
  title: string;
  slug: string;
  price: number;
  image_url: string;
  asin?: string;
  rating?: number;
  active: boolean;
  short_description: string;
  full_description: string;
  stock_quantity: number;
  category?: string;
  tags?: string;
  seo_title?: string;
  seo_description?: string;
}
