import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { description } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an intelligent assistant responsible for extracting key information from user input to create an educational podcast. The podcast should be concise (2-3 minutes when spoken) and focused on the user's learning goals.`
        },
        {
          role: "user",
          content: `Extract key information from this learning request: ${description}

Please extract the following in JSON format:
{
  "title": "Main topic or concept",
  "type": "Type of content (e.g., concept explanation, tutorial, etc.)",
  "learning_goal": "Specific learning objective",
  "preferences": {
    "duration": "2-3 minutes",
    "teaching_style": "How to present the information",
    "participants": "Single narrator",
    "tone": "Professional but conversational",
    "language": "English",
    "intonation": "Natural with appropriate emphasis",
    "usage": "Active learning",
    "personalized_explanation": "Yes"
  }
}`
        }
      ]
    });

    const result = response.choices[0].message.content;
    return NextResponse.json(JSON.parse(result || '{}'));
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({ error: 'Failed to analyze project' }, { status: 500 });
  }
} 