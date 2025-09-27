import { createClient } from 'contentful'

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
})

// Get all published blog posts
export async function getAllPosts() {
  try {
    const entries = await client.getEntries({
      content_type: 'blogPost',
      order: '-fields.publishDate',
      'fields.publishDate[lte]': new Date().toISOString(), // Only published posts
    })

    return entries.items.map((item) => ({
      sys: item.sys,
      slug: item.fields.slug,
      title: item.fields.title,
      excerpt: item.fields.excerpt || '',
      content: item.fields.content,
      publishDate: item.fields.publishDate,
      category: item.fields.category || '',
      featuredImage: item.fields.featuredImage?.fields?.file?.url || null,
      author: item.fields.author || 'Nature\'s Way Team',
      featuredPost: item.fields.featuredPost || false,
    }))
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

// Get a single post by slug
export async function getPostBySlug(slug) {
  try {
    const entries = await client.getEntries({
      content_type: 'blogPost',
      'fields.slug': slug,
      'fields.publishDate[lte]': new Date().toISOString(),
      limit: 1,
    })

    if (entries.items.length === 0) {
      return null
    }

    const item = entries.items[0]
    return {
      sys: item.sys,
      slug: item.fields.slug,
      title: item.fields.title,
      excerpt: item.fields.excerpt || '',
      content: item.fields.content,
      publishDate: item.fields.publishDate,
      category: item.fields.category || '',
      featuredImage: item.fields.featuredImage?.fields?.file?.url || null,
      author: item.fields.author || 'Nature\'s Way Team',
      featuredPost: item.fields.featuredPost || false,
    }
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

// Get all post slugs for static generation
export async function getAllPostSlugs() {
  try {
    const entries = await client.getEntries({
      content_type: 'blogPost',
      select: 'fields.slug',
      'fields.publishDate[lte]': new Date().toISOString(),
    })

    return entries.items.map((item) => ({
      params: {
        slug: item.fields.slug,
      },
    }))
  } catch (error) {
    console.error('Error fetching slugs:', error)
    return []
  }
}
