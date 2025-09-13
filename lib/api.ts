// lib/api.ts
import { supabase } from './supabaseClient';

export async function getProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getAllProductSlugs() {
  const { data, error } = await supabase
    .from('products')
    .select('slug');

  if (error) throw new Error(error.message);
  return data.map((p: any) => p.slug);
}


