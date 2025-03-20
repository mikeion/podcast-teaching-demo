declare module 'csm-mlx' {
  export class CSM {
    constructor(config: any);
    loadWeights(path: string): Promise<void>;
  }

  export function csm_1b(): any;
  export function generate(
    model: CSM,
    text: string,
    config: {
      speaker: number;
      context: any[];
      max_audio_length_ms: number;
      sampler: any;
    }
  ): Promise<ArrayBuffer>;

  export function stream_generate(
    model: CSM,
    text: string,
    config: {
      speaker: number;
      context: any[];
      max_audio_length_ms: number;
      sampler: any;
    }
  ): AsyncGenerator<ArrayBuffer>;
}

declare module 'mlx_lm/sample_utils' {
  export function make_sampler(config: {
    temp?: number;
    top_k?: number;
    top_p?: number;
    min_p?: number;
    min_tokens_to_keep?: number;
  }): any;
} 