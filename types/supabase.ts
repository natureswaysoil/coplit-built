// Placeholder Supabase generated types.
// Replace with real generated output using:
// npx supabase gen types typescript --project-id <PROJECT_ID> --schema public > types/supabase.ts

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string | number
          slug: string | null
          title: string
          short_description: string | null
          details: string | null
          image_url: string | null
          price: number | null
          keyword: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Insert: {
          id?: string | number
          slug?: string | null
          title: string
          short_description?: string | null
          details?: string | null
          image_url?: string | null
          price?: number | null
          keyword?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string | number
          slug?: string | null
          title?: string
          short_description?: string | null
          details?: string | null
          image_url?: string | null
          price?: number | null
          keyword?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}

export type ProductsRow = Database['public']['Tables']['products']['Row']
