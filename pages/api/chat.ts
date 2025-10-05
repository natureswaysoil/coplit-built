import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { getServiceSupabase } from '../../lib/supabase';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a knowledgeable and friendly soil health expert for Nature's Way Soil. Your role is to educate customers about:

1. Soil Ecosystems: Explain how healthy soil is a living ecosystem with billions of microorganisms
2. Synthetic Fertilizer Problems: Educate about how synthetic fertilizers harm soil life and create dependency
3. Organic Solutions: Promote natural, sustainable soil health practices
4. Product Benefits: When relevant, mention how Nature's Way Soil products support soil health

Key Points to Remember:
- Be educational, not pushy or sales-focused
- Use simple, clear language that anyone can understand
- Be enthusiastic about soil health and natural growing
- Provide actionable advice
- If asked about specific products, explain their benefits for soil health
- Always emphasize the importance of feeding the soil, not just the plants

Available Products:
- Organic Soil Conditioner: Improves soil structure and microbial activity
- Compost Tea: Liquid microbial inoculant for instant soil life boost
- Mycorrhizal Fungi: Beneficial fungi that extend root systems
- Worm Castings: Rich in nutrients and beneficial microbes
- Rock Dust: Slow-release minerals for long-term soil health

Keep responses concise (2-3 paragraphs max) and friendly. Use emojis occasionally to keep it engaging 🌱`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, sessionId, chatHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Build conversation history
    const messages: any[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...chatHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    // Get AI response
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiResponse = completion.choices[0].message.content;

    // Save to Supabase
    const supabase = getServiceSupabase();
    
    // Save user message
    await supabase.from('chat_messages').insert([
      {
        session_id: sessionId,
        role: 'user',
        content: message,
      },
    ]);

    // Save AI response
    await supabase.from('chat_messages').insert([
      {
        session_id: sessionId,
        role: 'assistant',
        content: aiResponse || '',
      },
    ]);

    return res.status(200).json({ 
      response: aiResponse,
      success: true 
    });

  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ 
      error: 'Failed to process chat message. Please try again.',
      response: 'I apologize, but I\'m having trouble responding right now. Please try again in a moment! 🌱'
    });
  }
}
