import { useState } from 'react'

export default function Cart() {
  const [cart, setCart] = useState([])

  return (
    <div>
      <h1>Your Cart</h1>
      <ul>
        {cart.map((item: any, idx: number) => (
          <li key={idx}>{item.name} - ${item.price}</li>
        ))}
      </ul>
    </div>
  )
}
