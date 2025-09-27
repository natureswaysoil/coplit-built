import Head from 'next/head'
import Link from 'next/link'
import { getPublishedPosts } from '../../lib/contentful'
import { format } from 'date-fns'

export default function Blog({ posts }) {
  return (
    <>
      <Head>
        <title>The Living Soil Blog - Nature's Way Soil</title>
        <meta 
          name="description" 
          content="Discover practical gardening tips, natural solutions, and inspiring stories — all dedicated to bringing life back to the soil and helping you grow the healthy way." 
        />
      </Head>

      <div className="blog-container">
        <header className="blog-header">
          <h1>The Living Soil Blog</h1>
          <p>Discover practical gardening tips, natural solutions, and inspiring stories — all dedicated to bringing life back to the soil and helping you grow the healthy way.</p>
        </header>

        <div className="posts-grid">
          {posts.map((post) => (
            <article key={post.slug} className="post-card">
              {post.featuredImage && (
                <img 
                  src={`https:${post.featuredImage}`} 
                  alt={post.title}
                  className="post-image"
                />
              )}
              <div className="post-content">
                <span className="post-category">{post.category}</span>
                <h2>
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>
                <p className="post-excerpt">{post.excerpt}</p>
                <div className="post-meta">
                  <span>By {post.author}</span>
                  <span>{format(new Date(post.publishDate), 'MMM dd, yyyy')}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <style jsx>{`
        .blog-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }
        .blog-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        .blog-header h1 {
          color: #2d5016;
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        .blog-header p {
          color: #666;
          font-size: 1.1rem;
          max-width: 600px;
          margin: 0 auto;
        }
        .posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }
        .post-card {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          overflow: hidden;
          transition: transform 0.2s;
        }
        .post-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .post-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }
        .post-content {
          padding: 1.5rem;
        }
        .post-category {
          background: #4a7c59;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-size: 0.8rem;
          text-transform: uppercase;
        }
        .post-content h2 {
          margin: 1rem 0 0.5rem 0;
          font-size: 1.3rem;
        }
        .post-content h2 a {
          color: #2d5016;
          text-decoration: none;
        }
        .post-content h2 a:hover {
          color: #4a7c59;
        }
        .post-excerpt {
          color: #666;
          line-height: 1.6;
          margin-bottom: 1rem;
        }
        .post-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          color: #888;
        }
      `}</style>
    </>
  )
}

export async function getStaticProps() {
  const posts = await getPublishedPosts()
  
  return {
    props: {
      posts,
    },
    revalidate: 60, // Revalidate every 60 seconds for auto-publishing
  }
}
