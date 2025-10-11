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
          
          {post.featuredImage && (
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

        {/* Video Section - Display if any videos are available */}
        {post.socialMediaPromoted && (post.videos?.tiktok || post.videos?.instagram || post.videos?.youtube) && (
          <div className="video-section">
            <h2>Watch This Topic</h2>
            {post.videoDescription && (
              <p className="video-description">{post.videoDescription}</p>
            )}
            <div className="video-grid">
              {post.videos.youtube && (
                <div className="video-container">
                  <div className="video-label">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    YouTube
                  </div>
                  <div className="video-embed">
                    {post.videos.youtube.includes('iframe') ? (
                      <div dangerouslySetInnerHTML={{ __html: post.videos.youtube }} />
                    ) : (
                      <iframe
                        src={post.videos.youtube}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    )}
                  </div>
                </div>
              )}
              
              {post.videos.tiktok && (
                <div className="video-container">
                  <div className="video-label">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                    TikTok
                  </div>
                  <div className="video-embed">
                    {post.videos.tiktok.includes('blockquote') || post.videos.tiktok.includes('iframe') ? (
                      <div dangerouslySetInnerHTML={{ __html: post.videos.tiktok }} />
                    ) : (
                      <iframe
                        src={post.videos.tiktok}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    )}
                  </div>
                </div>
              )}
              
              {post.videos.instagram && (
                <div className="video-container">
                  <div className="video-label">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    Instagram
                  </div>
                  <div className="video-embed">
                    {post.videos.instagram.includes('blockquote') || post.videos.instagram.includes('iframe') ? (
                      <div dangerouslySetInnerHTML={{ __html: post.videos.instagram }} />
                    ) : (
                      <iframe
                        src={post.videos.instagram}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

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
        .video-section {
          margin: 3rem 0;
          padding: 2rem;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 12px;
          border: 2px solid #4a7c59;
        }
        .video-section h2 {
          color: #2d5016;
          font-size: 2rem;
          margin: 0 0 1rem 0;
          text-align: center;
        }
        .video-description {
          text-align: center;
          color: #555;
          font-size: 1.1rem;
          margin-bottom: 2rem;
          line-height: 1.6;
        }
        .video-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 1.5rem;
        }
        .video-container {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .video-container:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }
        .video-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          background: #4a7c59;
          color: white;
          font-weight: 600;
          font-size: 1rem;
        }
        .video-label svg {
          width: 24px;
          height: 24px;
        }
        .video-embed {
          position: relative;
          padding-bottom: 56.25%; /* 16:9 aspect ratio */
          height: 0;
          overflow: hidden;
        }
        .video-embed iframe,
        .video-embed > div {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .video-embed blockquote {
          margin: 0;
          padding: 0;
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
          .video-section {
            padding: 1rem;
            margin: 2rem 0;
          }
          .video-section h2 {
            font-size: 1.5rem;
          }
          .video-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
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
