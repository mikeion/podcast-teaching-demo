import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const preferences = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an expert educator creating a concise (2-3 minutes when spoken) educational podcast script. 
The content should be engaging, clear, and tailored to the student's learning goals.
Use natural language and appropriate pacing. Include brief pauses (marked with [...]) for better comprehension.`
        },
        {
          role: "user",
          content: `Create a podcast script about ${preferences.title}.

Learning Goal: ${preferences.learning_goal}
Teaching Style: ${preferences.preferences.teaching_style}
Tone: ${preferences.preferences.tone}

The script should:
1. Start with a brief introduction
2. Present concepts clearly and logically
3. Use examples or analogies when helpful
4. End with a quick summary
5. Be naturally conversational
6. Take 2-3 minutes when spoken aloud`
        }
      ],
      temperature: 0.7,
      max_tokens: 500, // Limit length to about 2-3 minutes of speech
    });

    const content = response.choices[0].message.content;
    return NextResponse.json({ content });
  } catch (error) {
    console.error('Content generation error:', error);
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
  }
} 