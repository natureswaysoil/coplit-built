import Head from 'next/head'
import Link from 'next/link'
import { getPostBySlug, getAllPostSlugs } from '../../lib/contentful'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { format } from 'date-fns'

export default function BlogPost({ post }) {
  if (!post) {
    return <div>Post not found</div>
  }

  return (
    <>
      <Head>
        <title>{post.title} - Nature's Way Soil Blog</title>
        <meta name="description" content={post.metaDescription || post.excerpt} />
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
          
          <div className="post-meta">
            <span className="category">{post.category}</span>
            <h1>{post.title}</h1>
            <div className="meta-info">
              <span>By {post.author}</span>
              <span>{format(new Date(post.publishDate), 'MMMM dd, yyyy')}</span>
            </div>
          </div>
        </div>

        <div className="post-content">
          {documentToReactComponents(post.content)}
        </div>

        <div className="post-footer">
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
        }
        .back-link {
          color: #4a7c59;
          text-decoration: none;
          margin-bottom: 2rem;
          display: inline-block;
        }
        .featured-image {
          width: 100%;
          height: 400px;
          object-fit: cover;
          border-radius: 8px;
          margin-bottom: 2rem;
        }
        .category {
          background: #4a7c59;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-size: 0.8rem;
          text-transform: uppercase;
        }
        .post-meta h1 {
          color: #2d5016;
          font-size: 2.5rem;
          margin: 1rem 0;
          line-height: 1.2;
        }
        .meta-info {
          display: flex;
          gap: 1rem;
          color: #666;
          margin-bottom: 2rem;
        }
        .post-content {
          line-height: 1.8;
          font-size: 1.1rem;
        }
        .post-content h2 {
          color: #2d5016;
          margin: 2rem 0 1rem 0;
        }
        .post-content h3 {
          color: #4a7c59;
          margin: 1.5rem 0 0.5rem 0;
        }
        .post-content p {
          margin-bottom: 1.5rem;
        }
        .post-footer {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid #e0e0e0;
        }
        .back-to-blog {
          color: #4a7c59;
          text-decoration: none;
          font-weight: 500;
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
    revalidate: 60, // Revalidate every 60 seconds
  }
}
