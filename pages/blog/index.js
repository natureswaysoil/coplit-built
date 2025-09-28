import Head from 'next/head'
import Link from 'next/link'
import { getAllPosts } from '../../lib/localBlog'
import { format } from 'date-fns'

export default function Blog({ posts }) {
  // Separate featured posts
  const featuredPosts = posts.filter(post => post.featuredPost)
  const regularPosts = posts.filter(post => !post.featuredPost)

  return (
    <>
      <Head>
        <title>The Living Soil Blog - Nature's Way Soil</title>
        <meta 
          name="description" 
          content="Discover practical gardening tips, natural solutions, and inspiring stories — all dedicated to bringing life back to the soil and helping you grow the healthy way." 
        />
        <meta name="keywords" content="organic gardening, natural soil, compost, biochar, sustainable farming" />
      </Head>

      <div className="blog-container">
        <header className="blog-header">
          <h1>The Living Soil Blog</h1>
          <p>Discover practical gardening tips, natural solutions, and inspiring stories — all dedicated to bringing life back to the soil and helping you grow the healthy way.</p>
        </header>

        {/* Featured Posts Section */}
        {featuredPosts.length > 0 && (
          <section className="featured-section">
            <h2>Featured Posts</h2>
            <div className="featured-grid">
              {featuredPosts.map((post) => (
                <article key={post.slug} className="featured-card">
                  {post.featuredImage && (
                    <img 
                      src={`https:${post.featuredImage}`} 
                      alt={post.title}
                      className="featured-image"
                    />
                  )}
                  <div className="featured-content">
                    <span className="post-category">{post.category}</span>
                    <h3>
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>
                    <p className="post-excerpt">{post.excerpt}</p>
                    <div className="post-meta">
                      <span>By {post.author}</span>
                      <span>{format(new Date(post.publishDate), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Regular Posts Section */}
        <section className="posts-section">
          <h2>Latest Posts</h2>
          <div className="posts-grid">
            {regularPosts.map((post) => (
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
                  <h3>
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className="post-excerpt">{post.excerpt}</p>
                  <div className="post-meta">
                    <span>By {post.author}</span>
                    <span>{format(new Date(post.publishDate), 'MMM dd, yyyy')}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {posts.length === 0 && (
          <div className="no-posts">
            <p>No blog posts found. Check back soon!</p>
          </div>
        )}
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
          line-height: 1.6;
        }
        .featured-section {
          margin-bottom: 3rem;
        }
        .featured-section h2 {
          color: #2d5016;
          font-size: 1.8rem;
          margin-bottom: 1.5rem;
        }
        .featured-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }
        .featured-card {
          border: 2px solid #4a7c59;
          border-radius: 12px;
          overflow: hidden;
          transition: transform 0.3s ease;
        }
        .featured-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        .featured-image {
          width: 100%;
          height: 250px;
          object-fit: cover;
        }
        .featured-content {
          padding: 2rem;
        }
        .posts-section h2 {
          color: #2d5016;
          font-size: 1.8rem;
          margin-bottom: 1.5rem;
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
          transition: transform 0.2s ease;
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
          font-weight: 600;
        }
        .post-content h3, .featured-content h3 {
          margin: 1rem 0 0.5rem 0;
          font-size: 1.3rem;
        }
        .post-content h3 a, .featured-content h3 a {
          color: #2d5016;
          text-decoration: none;
        }
        .post-content h3 a:hover, .featured-content h3 a:hover {
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
        .no-posts {
          text-align: center;
          padding: 3rem;
          color: #666;
        }
        @media (max-width: 768px) {
          .blog-container {
            padding: 1rem;
          }
          .blog-header h1 {
            font-size: 2rem;
          }
          .featured-grid, .posts-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  )
}

export async function getStaticProps() {
  const posts = await getAllPosts()
  
  return {
    props: {
      posts,
    },
    revalidate: 60, // Revalidate every 60 seconds for auto-publishing
  }
}
// Force deployment Sun Sep 28 19:38:14 UTC 2025
