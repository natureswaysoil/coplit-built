// lib/api.ts

// Example fetcher – replace with Supabase or your backend API
export async function getProductBySlug(slug: string) {
  // If you use Supabase:
  // const { data, error } = await supabase.from("products").select("*").eq("slug", slug).single();
  // return data;

  // Example placeholder fetch from your Next.js API route
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${slug}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return await res.json();
}

export async function getAllProductSlugs() {
  // Fetch all slugs for getStaticPaths
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
  if (!res.ok) throw new Error("Failed to fetch slugs");
  const products = await res.json();
  return products.map((p: any) => p.slug);
}
