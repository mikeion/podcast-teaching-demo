# Local TTS Setup

This directory contains the local Text-to-Speech implementation using CSM-MLX.

## Prerequisites

- Python 3.10 or later (but not 3.13)
- pip or uv package manager
- Apple Silicon Mac (M1/M2/M3)

## Setup

1. Create a Python virtual environment:
```bash
python3 -m venv .venv
source .venv/bin/activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Usage

The local TTS script can be used in two ways:

1. As a command-line tool:
```bash
python local_tts.py "Your text here" output.wav
```

2. Through the Next.js API (automatically handled by the application)

## Troubleshooting

If you encounter any issues:

1. Make sure you're using a compatible Python version (3.10-3.12)
2. Check that all dependencies are installed correctly
3. Verify that you're running on Apple Silicon hardware
4. Check the error output in the application logs

## Notes

- The first run will download the model weights (about 1GB)
- Generation speed depends on your hardware
- Audio is generated in WAV format at 24kHz 