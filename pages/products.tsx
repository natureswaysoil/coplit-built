import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Products() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    supabase.from('products').select('*').then(({ data }) => {
      setProducts(data || [])
    })
  }, [])

  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map((product: any) => (
          <li key={product.id}>{product.name} - ${product.price}</li>
        ))}
      </ul>
    </div>
  )
}