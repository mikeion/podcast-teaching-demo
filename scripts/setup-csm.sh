#!/bin/bash

# Check if Python 3.8+ is installed
if ! command -v python3 &> /dev/null; then
    echo "Python 3.8+ is required but not installed. Please install it first."
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "pip3 is required but not installed. Please install it first."
    exit 1
fi

# Check if running on Apple Silicon
if [[ "$(uname -m)" != "arm64" ]]; then
    echo "This script requires Apple Silicon (M1/M2/M3) Mac."
    exit 1
fi

# Install CSM-MLX and dependencies
echo "Installing CSM-MLX and dependencies..."
pip3 install "git+https://github.com/senstella/csm-mlx.git"
pip3 install audiofile audresample

# Download model weights
echo "Downloading model weights..."
python3 -c "
from huggingface_hub import hf_hub_download
weight = hf_hub_download(repo_id='senstella/csm-1b-mlx', filename='ckpt.safetensors')
print(f'Model weights downloaded to: {weight}')
"

echo "Setup complete! CSM-MLX is ready to use." 