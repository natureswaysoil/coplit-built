import Head from 'next/head'
import Link from 'next/link'
import { getPostBySlug, getAllPostSlugs } from '../../lib/localBlog'
import ReactMarkdown from 'react-markdown'
import { format } from 'date-fns'

// Custom components for markdown rendering
const markdownComponents = {
  h1: ({ children }) => <h1 className="post-h1">{children}</h1>,
  h2: ({ children }) => <h2 className="post-h2">{children}</h2>,
  h3: ({ children }) => <h3 className="post-h3">{children}</h3>,
  p: ({ children }) => <p className="post-paragraph">{children}</p>,
  ul: ({ children }) => <ul className="post-ul">{children}</ul>,
  ol: ({ children }) => <ol className="post-ol">{children}</ol>,
  li: ({ children }) => <li className="post-li">{children}</li>,
  blockquote: ({ children }) => <blockquote className="post-quote">{children}</blockquote>,
  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
}

export default function BlogPost({ post }) {
  if (!post) {
    return (
      <div className="error-container">
        <h1>Post not found</h1>
        <Link href="/blog">← Back to Blog</Link>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{post.title} - Nature's Way Soil Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta name="keywords" content={`${post.category}, organic gardening, natural soil, Nature's Way Soil`} />
        
        {/* Open Graph tags for social sharing */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        {post.featuredImage && (
          <meta property="og:image" content={`https:${post.featuredImage}`} />
        )}
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        {post.featuredImage && (
          <meta name="twitter:image" content={`https:${post.featuredImage}`} />
        )}
      </Head>

      <article className="blog-post">
        <div className="post-header">
          <Link href="/blog" className="back-link">← Back to Blog</Link>
          
          {/* Video Player - Priority over featured image */}
          {post.video && post.video.url && (
            <div className="video-container">
              <video 
                controls
                poster={post.featuredImage ? `https:${post.featuredImage}` : undefined}
                className="featured-video"
              >
                <source src={post.video.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              {post.video.title && (
                <p className="video-caption">{post.video.title}</p>
              )}
            </div>
          )}
          
          {/* Featured Image - Only show if no video */}
          {!post.video && post.featuredImage && (
            <img 
              src={`https:${post.featuredImage}`} 
              alt={post.title}
              className="featured-image"
            />
          )}
          
          <div className="post-meta-header">
            {post.category && <span className="category">{post.category}</span>}
            <h1>{post.title}</h1>
            <div className="meta-info">
              <span>By {post.author}</span>
              <span>•</span>
              <span>{format(new Date(post.publishDate), 'MMMM dd, yyyy')}</span>
            </div>
          </div>
        </div>

        <div className="post-content">
          <ReactMarkdown components={markdownComponents}>
            {post.content}
          </ReactMarkdown>
        </div>

        <div className="post-footer">
          <div className="cta-section">
            <h3>Ready to Transform Your Garden?</h3>
            <p>Explore our natural soil products and join the movement to grow healthier, naturally.</p>
            <Link href="/products" className="cta-button">
              Shop Nature's Way Soil Products
            </Link>
          </div>
          
          <Link href="/blog" className="back-to-blog">
            ← Back to All Posts
          </Link>
        </div>
      </article>

      <style jsx>{`
        .blog-post {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          line-height: 1.7;
        }
        .back-link {
          color: #4a7c59;
          text-decoration: none;
          margin-bottom: 2rem;
          display: inline-block;
          font-weight: 500;
        }
        .back-link:hover {
          color: #2d5016;
        }
        .featured-image {
          width: 100%;
          height: 400px;
          object-fit: cover;
          border-radius: 12px;
          margin-bottom: 2rem;
        }
        .video-container {
          width: 100%;
          margin-bottom: 2rem;
        }
        .featured-video {
          width: 100%;
          max-height: 600px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .video-caption {
          text-align: center;
          color: #666;
          font-size: 0.9rem;
          margin-top: 0.5rem;
          font-style: italic;
        }
        .category {
          background: #4a7c59;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.9rem;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        .post-meta-header h1 {
          color: #2d5016;
          font-size: 2.5rem;
          margin: 1.5rem 0 1rem 0;
          line-height: 1.2;
        }
        .meta-info {
          display: flex;
          gap: 0.5rem;
          color: #666;
          margin-bottom: 3rem;
          font-size: 1rem;
        }
        .post-content {
          font-size: 1.1rem;
          color: #333;
        }
        .post-content :global(.post-h1) {
          color: #2d5016;
          font-size: 2rem;
          margin: 2.5rem 0 1rem 0;
          line-height: 1.3;
        }
        .post-content :global(.post-h2) {
          color: #2d5016;
          font-size: 1.6rem;
          margin: 2rem 0 1rem 0;
          line-height: 1.3;
        }
        .post-content :global(.post-h3) {
          color: #4a7c59;
          font-size: 1.3rem;
          margin: 1.5rem 0 0.5rem 0;
          line-height: 1.3;
        }
        .post-content :global(.post-paragraph) {
          margin-bottom: 1.5rem;
          line-height: 1.8;
        }
        .post-content :global(.post-ul), 
        .post-content :global(.post-ol) {
          margin: 1.5rem 0;
          padding-left: 2rem;
        }
        .post-content :global(.post-li) {
          margin-bottom: 0.5rem;
          line-height: 1.6;
        }
        .post-content :global(.post-quote) {
          border-left: 4px solid #4a7c59;
          padding-left: 1.5rem;
          margin: 2rem 0;
          font-style: italic;
          color: #555;
          background: #f9f9f9;
          padding: 1.5rem;
          border-radius: 0 8px 8px 0;
        }
        .post-footer {
          margin-top: 4rem;
          padding-top: 2rem;
          border-top: 2px solid #e0e0e0;
        }
        .cta-section {
          background: linear-gradient(135deg, #4a7c59, #2d5016);
          color: white;
          padding: 2rem;
          border-radius: 12px;
          text-align: center;
          margin-bottom: 2rem;
        }
        .cta-section h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }
        .cta-section p {
          margin: 0 0 1.5rem 0;
          opacity: 0.9;
        }
        .cta-button {
          background: white;
          color: #2d5016;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          display: inline-block;
          transition: transform 0.2s ease;
        }
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .back-to-blog {
          color: #4a7c59;
          text-decoration: none;
          font-weight: 500;
        }
        .back-to-blog:hover {
          color: #2d5016;
        }
        .error-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 4rem 2rem;
          text-align: center;
        }
        .error-container h1 {
          color: #2d5016;
          margin-bottom: 1rem;
        }
        .error-container a {
          color: #4a7c59;
          text-decoration: none;
        }
        @media (max-width: 768px) {
          .blog-post {
            padding: 1rem;
          }
          .post-meta-header h1 {
            font-size: 2rem;
          }
          .featured-image {
            height: 250px;
          }
          .meta-info {
            flex-direction: column;
            gap: 0.25rem;
          }
        }
      `}</style>
    </>
  )
}

export async function getStaticPaths() {
  const paths = await getAllPostSlugs()
  
  return {
    paths,
    fallback: 'blocking', // Enable ISR for new posts
  }
}

export async function getStaticProps({ params }) {
  const post = await getPostBySlug(params.slug)
  
  if (!post) {
    return {
      notFound: true,
    }
  }
  
  return {
    props: {
      post,
    },
    revalidate: 60, // Revalidate every 60 seconds for auto-publishing
  }
}
