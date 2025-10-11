
import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { message, sessionId, history } = req.body

    // Build context from history
    const messages: any[] = [
      {
        role: 'system',
        content: `You are a knowledgeable and friendly customer service representative for Nature's Way Soil, an organic fertilizer company. 

Your expertise includes:
- The science of soil microbiomes and mycorrhizal fungi
- How synthetic fertilizers disrupt natural soil processes
- Benefits of organic fertilizers vs synthetic ones
- Product recommendations based on customer needs
- Application instructions and best practices
- Troubleshooting plant and soil issues

Key facts to reference:
- Mycorrhizal fungi form symbiotic relationships with 90% of plant species
- Synthetic fertilizers can reduce beneficial soil microbes by up to 84%
- Our products work WITH soil biology, not against it
- All products are USDA certified organic and made fresh weekly

Be helpful, educational, and guide customers toward making informed decisions. Keep responses concise (2-3 paragraphs max) and actionable. If asked about specific products, recommend based on their needs. Always emphasize science-backed benefits.`
      }
    ]

    // Add conversation history
    if (history && Array.isArray(history)) {
      history.forEach((msg: any) => {
        messages.push({
          role: msg.role,
          content: msg.content
        })
      })
    }

    // Add current message
    messages.push({
      role: 'user',
      content: message
    })

    // Get response from OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      max_tokens: 500,
      temperature: 0.7
    })

    const response = completion.choices[0].message.content

    return res.status(200).json({ response })
  } catch (error: any) {
    console.error('Chat API error:', error)
    return res.status(500).json({ 
      error: 'Failed to process chat message',
      details: error.message 
    })
  }
}
