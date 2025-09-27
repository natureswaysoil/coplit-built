import { createClient } from 'contentful'

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
})

export async function getPublishedPosts() {
  const entries = await client.getEntries({
    content_type: 'blogPost',
    order: '-fields.publishDate',
    'fields.publishDate[lte]': new Date().toISOString(), // Only published posts
  })

  return entries.items.map((item) => ({
    slug: item.fields.slug,
    title: item.fields.title,
    excerpt: item.fields.excerpt,
    content: item.fields.content,
    publishDate: item.fields.publishDate,
    category: item.fields.category,
    featuredImage: item.fields.featuredImage?.fields?.file?.url,
    author: item.fields.author || 'Nature\'s Way Team',
    metaDescription: item.fields.metaDescription,
  }))
}

export async function getPostBySlug(slug) {
  const entries = await client.getEntries({
    content_type: 'blogPost',
    'fields.slug': slug,
    'fields.publishDate[lte]': new Date().toISOString(),
  })

  if (entries.items.length > 0) {
    const item = entries.items[0]
    return {
      slug: item.fields.slug,
      title: item.fields.title,
      excerpt: item.fields.excerpt,
      content: item.fields.content,
      publishDate: item.fields.publishDate,
      category: item.fields.category,
      featuredImage: item.fields.featuredImage?.fields?.file?.url,
      author: item.fields.author || 'Nature\'s Way Team',
      metaDescription: item.fields.metaDescription,
    }
  }

  return null
}

export async function getAllPostSlugs() {
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
}
