import { supabase } from './supabaseClient';
import { Product } from '@/types/Product';

export async function getProductBySlug(slug: string): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error) throw new Error(error.message);
  return data as any as Product;
}

export async function getAllProductSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from('products')
    .select('slug');
  if (error) throw new Error(error.message);
  return (data as any[]).map((p) => p.slug).filter(Boolean);
}
