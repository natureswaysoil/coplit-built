// Supabase Database types. Regenerate after schema changes with:
// npx supabase gen types typescript --project-id <PROJECT_ID> --schema public > types/supabase.ts

export interface Database {
	public: {
		Tables: {
			products: {
				Row: {
					id: string
					slug: string | null
					title: string
					short_description: string | null
					details: string | null
					image_url: string | null
					price: number | null
					keyword: string | null
					inventory: number | null
					is_active: boolean | null
					created_at: string
					updated_at: string
				}
				Insert: {
					id?: string
					slug?: string | null
					title: string
					short_description?: string | null
					details?: string | null
					image_url?: string | null
					price?: number | null
					keyword?: string | null
					inventory?: number | null
					is_active?: boolean | null
					created_at?: string
					updated_at?: string
				}
				Update: {
					id?: string
					slug?: string | null
					title?: string
					short_description?: string | null
					details?: string | null
					image_url?: string | null
					price?: number | null
					keyword?: string | null
					inventory?: number | null
					is_active?: boolean | null
					created_at?: string
					updated_at?: string
				}
				Relationships: []
			},
			product_variations: {
				Row: {
					id: string
					product_id: string
					size: string
					price: number
					sku: string
					inventory: number | null
					created_at: string
					updated_at: string
				}
				Insert: {
					id?: string
					product_id: string
					size: string
					price: number
					sku: string
					inventory?: number | null
					created_at?: string
					updated_at?: string
				}
				Update: {
					id?: string
					product_id?: string
					size?: string
					price?: number
					sku?: string
					inventory?: number | null
					created_at?: string
					updated_at?: string
				}
				Relationships: [
					{
						foreignKeyName: "product_variations_product_id_fkey",
						columns: ["product_id"],
						referencedRelation: "products",
						referencedColumns: ["id"]
					}
				]
			}
		}
		Views: {
			v_products_enriched: {
				Row: {
					id: string
					slug: string | null
					title: string
					short_description: string | null
					details: string | null
					image_url: string | null
					effective_price: number | null
					base_price: number | null
					keyword: string | null
					product_inventory: number | null
					variations_inventory_sum: number | null
					is_active: boolean | null
					created_at: string | null
					updated_at: string | null
				}
			}
		}
		Functions: {
			search_products: {
				Args: { q: string; lim?: number }
				Returns: {
					id: string
					slug: string | null
					title: string
					short_description: string | null
					details: string | null
					image_url: string | null
					effective_price: number | null
					keyword: string | null
					score: number | null
				}[]
			}
		}
		Enums: {}
		CompositeTypes: {}
	}
}

export type ProductsRow = Database['public']['Tables']['products']['Row']