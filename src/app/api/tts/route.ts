import { NextRequest, NextResponse } from 'next/server';
import { TTSService } from '@/services/tts.service';

export async function POST(req: NextRequest) {
  try {
    const { text, options } = await req.json();
    
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const ttsService = new TTSService(process.env.ELEVENLABS_API_KEY || '');
    const audioStream = await ttsService.generateSpeech(text, options);

    // Create response with appropriate headers for streaming audio
    const response = new NextResponse(audioStream as any, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Transfer-Encoding': 'chunked',
      },
    });

    return response;
  } catch (error) {
    console.error('TTS Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate speech' },
      { status: 500 }
    );
  }
} 