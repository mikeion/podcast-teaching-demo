// Types for CSM-MLX (since we can't import them directly)
import type { ProcessEnv } from 'node';
declare const process: { env: ProcessEnv; arch: string; platform: string };

interface CSMConfig {
  speaker: number;
  context: any[];
  max_audio_length_ms: number;
  sampler: any;
}

export interface TTSProvider {
  generateSpeech(text: string): Promise<ReadableStream<Uint8Array>>;
  streamSpeech(text: string): Promise<ReadableStream<Uint8Array>>;
}

export class CSMMLXProvider implements TTSProvider {
  private csm: any;
  private initialized: boolean = false;

  constructor() {
    this.initializeModel();
  }

  private async initializeModel() {
    try {
      // Dynamic import of CSM-MLX
      const { CSM, csm_1b } = await import('csm-mlx');
      const { make_sampler } = await import('mlx_lm/sample_utils');
      
      this.csm = new CSM(csm_1b());
      await this.csm.loadWeights("ckpt.safetensors");
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize CSM-MLX model:', error);
      this.initialized = false;
    }
  }

  async generateSpeech(text: string): Promise<ReadableStream<Uint8Array>> {
    if (!this.initialized) {
      throw new Error('Model not initialized');
    }

    try {
      const { generate } = await import('csm-mlx');
      const { make_sampler } = await import('mlx_lm/sample_utils');

      const audio = await generate(
        this.csm,
        text,
        {
          speaker: 0,
          context: [],
          max_audio_length_ms: 5000,
          sampler: make_sampler({ temp: 0.8, top_k: 50 })
        }
      );

      return new ReadableStream({
        start(controller) {
          controller.enqueue(new Uint8Array(audio));
          controller.close();
        }
      });
    } catch (error) {
      console.error('Failed to generate speech:', error);
      throw error;
    }
  }

  async streamSpeech(text: string): Promise<ReadableStream<Uint8Array>> {
    if (!this.initialized) {
      throw new Error('Model not initialized');
    }

    try {
      const { stream_generate } = await import('csm-mlx');
      const { make_sampler } = await import('mlx_lm/sample_utils');

      const chunks: Uint8Array[] = [];
      for await (const chunk of stream_generate(
        this.csm,
        text,
        {
          speaker: 0,
          context: [],
          max_audio_length_ms: 5000,
          sampler: make_sampler({ temp: 0.8, top_k: 50 })
        }
      )) {
        chunks.push(new Uint8Array(chunk));
      }

      return new ReadableStream({
        start(controller) {
          chunks.forEach(chunk => controller.enqueue(chunk));
          controller.close();
        }
      });
    } catch (error) {
      console.error('Failed to stream speech:', error);
      throw error;
    }
  }
}

export class ElevenLabsProvider implements TTSProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateSpeech(text: string): Promise<ReadableStream<Uint8Array>> {
    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/stream', {
      method: 'POST',
      headers: {
        'xi-api-key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        stream: true
      })
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    return response.body as ReadableStream<Uint8Array>;
  }

  async streamSpeech(text: string): Promise<ReadableStream<Uint8Array>> {
    return this.generateSpeech(text);
  }
}

// Type guard for process object
function isNodeProcess(proc: any): proc is { arch: string; platform: string } {
  return proc && typeof proc.arch === 'string' && typeof proc.platform === 'string';
}

import { OpenAI } from 'openai';

export interface TTSOptions {
  text: string;
  voice?: string;
  model?: string;
  useLocal?: boolean;
}

export class TTSService {
  private openai: OpenAI;
  private localProvider?: TTSProvider;
  private cloudProvider: TTSProvider;
  
  constructor(elevenLabsApiKey: string) {
    this.openai = new OpenAI({ apiKey: elevenLabsApiKey });
    // Only initialize local provider if on Apple Silicon
    if (this.isAppleSilicon()) {
      this.localProvider = new CSMMLXProvider();
    }
    this.cloudProvider = new ElevenLabsProvider(elevenLabsApiKey);
  }

  private isAppleSilicon(): boolean {
    try {
      return typeof process !== 'undefined' && 
             isNodeProcess(process) &&
             process.arch === 'arm64' && 
             process.platform === 'darwin';
    } catch {
      return false;
    }
  }

  async generateSpeech(options: TTSOptions): Promise<ArrayBuffer> {
    if (options.useLocal) {
      return this.generateLocalSpeech(options);
    }
    return this.generateCloudSpeech(options);
  }

  private async generateCloudSpeech({ text, voice = 'alloy', model = 'tts-1' }: TTSOptions): Promise<ArrayBuffer> {
    try {
      const response = await this.openai.audio.speech.create({
        model,
        voice,
        input: text,
      });

      const arrayBuffer = await response.arrayBuffer();
      return arrayBuffer;
    } catch (error) {
      console.error('Error generating cloud speech:', error);
      throw error;
    }
  }

  private async generateLocalSpeech(options: TTSOptions): Promise<ArrayBuffer> {
    // TODO: Implement local speech generation using CSM-MLX
    // This will be implemented once we set up the Python backend
    throw new Error('Local speech generation not yet implemented');
  }
} 