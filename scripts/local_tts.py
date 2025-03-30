#!/usr/bin/env python3
import sys
import json
import numpy as np
import audiofile
from mlx_lm.sample_utils import make_sampler
from huggingface_hub import hf_hub_download
from csm_mlx import CSM, csm_1b, generate, Segment
import mlx.core as mx
from dataclasses import dataclass

@dataclass
class TextInput:
    text: str
    speaker: int = 0

def initialize_model():
    """Initialize the CSM model and load weights."""
    try:
        csm = CSM(csm_1b())
        weight = hf_hub_download(repo_id="senstella/csm-1b-mlx", filename="ckpt.safetensors")
        csm.load_weights(weight)
        return csm
    except Exception as e:
        print(f"Error initializing model: {str(e)}", file=sys.stderr)
        return None

def split_text(text, max_chars=300):
    """Split text into chunks while preserving sentence boundaries and context."""
    sentences = text.split('. ')
    chunks = []
    current_chunk = []
    current_length = 0
    
    for sentence in sentences:
        # Add period back if it's not the last sentence
        if not sentence.endswith('.'):
            sentence += '.'
        
        # If a single sentence is too long, split it at punctuation or phrases
        if len(sentence) > max_chars:
            parts = sentence.replace(',', '.|').replace(';', '.|').replace(':', '.|').split('.|')
            for part in parts:
                if len(part) > max_chars:
                    words = part.split()
                    temp_chunk = []
                    temp_length = 0
                    for word in words:
                        if temp_length + len(word) + 1 <= max_chars:
                            temp_chunk.append(word)
                            temp_length += len(word) + 1
                        else:
                            chunks.append(' '.join(temp_chunk))
                            temp_chunk = [word]
                            temp_length = len(word)
                    if temp_chunk:
                        chunks.append(' '.join(temp_chunk))
                else:
                    if current_length + len(part) + 1 <= max_chars:
                        current_chunk.append(part)
                        current_length += len(part) + 1
                    else:
                        if current_chunk:
                            chunks.append(' '.join(current_chunk))
                        current_chunk = [part]
                        current_length = len(part)
        else:
            if current_length + len(sentence) + 1 <= max_chars:
                current_chunk.append(sentence)
                current_length += len(sentence) + 1
            else:
                if current_chunk:
                    chunks.append(' '.join(current_chunk))
                current_chunk = [sentence]
                current_length = len(sentence)
    
    if current_chunk:
        chunks.append(' '.join(current_chunk))
    
    return chunks

def crossfade(audio1, audio2, overlap_ms=100):
    """Apply crossfade between two audio segments."""
    overlap_samples = int(overlap_ms * 24)  # 24kHz sample rate
    if len(audio1) < overlap_samples or len(audio2) < overlap_samples:
        return np.concatenate([audio1, audio2])
    
    # Create fade curves
    fade_out = np.linspace(1.0, 0.0, overlap_samples)
    fade_in = np.linspace(0.0, 1.0, overlap_samples)
    
    # Apply crossfade
    audio1_end = audio1[:-overlap_samples]
    overlap_region = audio1[-overlap_samples:] * fade_out + audio2[:overlap_samples] * fade_in
    audio2_rest = audio2[overlap_samples:]
    
    return np.concatenate([audio1_end, overlap_region, audio2_rest])

def text_to_speech(text, output_path):
    """Convert text to speech using CSM-MLX with improved context and audio handling."""
    try:
        csm = initialize_model()
        if not csm:
            return False

        # Split text into chunks
        chunks = split_text(text)
        all_audio = []
        
        # Create optimized sampler for more natural speech
        sampler = make_sampler(
            temp=0.7,      # Slightly higher temperature for more natural variation
            top_k=50,      # Limit to top 50 tokens for stability
            top_p=0.9,     # Use nucleus sampling
            min_p=0.05,    # Minimum probability threshold
            min_tokens_to_keep=5  # Keep at least 5 tokens
        )
        
        print(f"Processing {len(chunks)} chunks...", file=sys.stderr)
        
        # Initialize context with empty list
        context = []
        
        # Generate audio for each chunk
        for i, chunk in enumerate(chunks, 1):
            try:
                print(f"Generating chunk {i}/{len(chunks)}...", file=sys.stderr)
                
                # Create segment from previous chunk if available
                if context and all_audio:
                    context = [
                        Segment(
                            speaker=0,
                            text=chunks[i-2],  # Previous chunk's text
                            audio=mx.array(all_audio[-1])  # Previous chunk's audio
                        )
                    ]
                
                # Generate audio with context
                audio = generate(
                    csm,
                    text=chunk,
                    speaker=0,
                    context=context,
                    max_audio_length_ms=60000,  # 1 minute per chunk
                    sampler=sampler
                )
                
                audio_array = np.asarray(audio)
                
                # Trim silence
                threshold = 0.005  # Lower threshold for better silence detection
                mask = np.abs(audio_array) > threshold
                if np.any(mask):  # Only trim if non-silent audio exists
                    start = np.argmax(mask)
                    end = len(audio_array) - np.argmax(mask[::-1])
                    audio_array = audio_array[start:end]
                
                # Apply crossfade if not the first chunk
                if all_audio:
                    all_audio[-1] = crossfade(all_audio[-1], audio_array)
                else:
                    all_audio.append(audio_array)
                
            except Exception as e:
                print(f"Error generating audio for chunk {i}: {str(e)}", file=sys.stderr)
                continue

        if not all_audio:
            return False

        print("Finalizing audio...", file=sys.stderr)
        
        # Concatenate all audio chunks
        final_audio = np.concatenate(all_audio)
        
        # Normalize audio
        max_val = np.max(np.abs(final_audio))
        if max_val > 0:
            final_audio = final_audio / max_val * 0.95  # Leave some headroom
        
        print(f"Saving audio to {output_path}...", file=sys.stderr)
        audiofile.write(output_path, final_audio, 24000)
        return True
    except Exception as e:
        print(f"Error in text_to_speech: {str(e)}", file=sys.stderr)
        return False

def main():
    """Main function to handle command line arguments."""
    if len(sys.argv) != 3:
        print("Usage: python local_tts.py <text> <output_path>", file=sys.stderr)
        sys.exit(1)

    text = sys.argv[1]
    output_path = sys.argv[2]

    success = text_to_speech(text, output_path)
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main() 