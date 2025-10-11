import useSWR from 'swr'

export interface UseProductsOptions {
  search?: string
  includeInactive?: boolean
  limit?: number
  source?: 'db' | 'static'
}

interface ProductsResponse<T = any> {
  ok: boolean
  products: T[]
  count: number
  source: string
  fallback: boolean
  error: string | null
}

const fetcher = (url: string) => fetch(url).then(r => {
  if (!r.ok) throw new Error(`Request failed: ${r.status}`)
  return r.json()
})

export function useProducts<T = any>(opts: UseProductsOptions = {}) {
  const params = new URLSearchParams()
  if (opts.search) params.set('search', opts.search)
  if (opts.includeInactive) params.set('include', 'inactive')
  if (opts.limit) params.set('limit', String(opts.limit))
  if (opts.source) params.set('source', opts.source)
  const key = `/api/products${params.toString() ? `?${params.toString()}` : ''}`
  const { data, error, isLoading, mutate } = useSWR<ProductsResponse<T>>(key, fetcher, { revalidateOnFocus: false })
  return {
    products: data?.products || [],
    count: data?.count || 0,
    source: data?.source,
    fallback: data?.fallback,
    loading: isLoading,
    error: error || (data && !data.ok ? new Error(data.error || 'Unknown error') : undefined),
    refresh: mutate
  }
}