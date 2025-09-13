import { supabase } from './supabaseClient';
import { Product } from '@/types/Product';

export async function getProductBySlug(slug: string): Promise<Product> {
  const { data, error } = await supabase
    .from<Product>('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getAllProductSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from<Product>('products')
    .select('slug');

  if (error) throw new Error(error.message);
  return data.map((p) => p.slug);
}
