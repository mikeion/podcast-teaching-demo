import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text, useElevenLabs } = await req.json();
    
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    if (useElevenLabs) {
      // Use ElevenLabs API
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': process.env.ELEVENLABS_API_KEY || '',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech with ElevenLabs');
      }

      const audioBuffer = await response.arrayBuffer();
      return new NextResponse(audioBuffer, {
        headers: {
          'Content-Type': 'audio/mpeg',
        },
      });
    } else {
      // For now, return an error since CSM-MLX is not set up
      return NextResponse.json(
        { error: 'CSM-MLX is not yet configured. Please use ElevenLabs for now.' },
        { status: 501 }
      );

      // TODO: Once CSM-MLX is set up, implement local generation:
      /*
      const pythonProcess = spawn('python3', [
        '-c',
        `
        from csm_mlx import CSM, csm_1b, generate
        import numpy as np
        
        csm = CSM(csm_1b())
        audio = generate(
          csm,
          text="${text}",
          speaker=0,
          context=[],
          max_audio_length_ms=180000
        )
        sys.stdout.buffer.write(np.array(audio, dtype=np.float32).tobytes())
        `
      ]);
      */
    }
  } catch (error) {
    console.error('TTS Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate speech' },
      { status: 500 }
    );
  }
} 