import fs from 'fs'
import path from 'path'

// Get all published blog posts from local JSON file
export async function getAllPosts() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'blog_articles.json')
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const posts = JSON.parse(fileContents)
    
    // Filter and sort posts
    const publishedPosts = posts
      .filter(post => new Date(post.publishDate) <= new Date())
      .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
    
    return publishedPosts
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

// Get a single post by slug
export async function getPostBySlug(slug) {
  try {
    const posts = await getAllPosts()
    const post = posts.find(post => post.slug === slug)
    return post || null
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

// Get all post slugs for static generation
export async function getAllPostSlugs() {
  try {
    const posts = await getAllPosts()
    return posts.map(post => ({
      params: {
        slug: post.slug,
      },
    }))
  } catch (error) {
    console.error('Error fetching slugs:', error)
    return []
  }
}
