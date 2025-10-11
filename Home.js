import Image from 'next/image'

export default function Home() {
  return (
    <main style={{background:'#f9f9f6', minHeight:'100vh', paddingTop:'3rem'}}>
      <section style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'3rem 1rem'}}>
        <Image 
          src="/screenshots/logo-with-tagline.png"
          alt="Nature's Way Soil Logo"
          width={140}
          height={140}
          style={{objectFit:'contain', marginBottom:'1.5rem'}}
          priority
        />
        <h1 style={{fontSize:'2.75rem',fontWeight:'bold',color:'#256029',marginBottom:'1.5rem',textAlign:'center',letterSpacing:'0.01em'}}>
          Welcome to Nature's Way Soil
        </h1>
        <p style={{fontSize:'1.25rem',color:'#4b4b3d',maxWidth:'700px',textAlign:'center',marginBottom:'2rem'}}>
          Premium natural soil products, compost, and fertilizers for healthier gardens and pastures. Horse-safe, pet-friendly, and sustainably sourced.
        </p>
        <a href="/products" className="btn btn-primary" style={{fontSize:'1.15rem',padding:'0.75rem 2rem',background:'#256029',color:'#fff',borderRadius:'0.5rem',textDecoration:'none',fontWeight:'bold'}}>
          Shop Products
        </a>
      </section>
      {/* Add additional professional sections here if needed */}
    </main>
  )
}