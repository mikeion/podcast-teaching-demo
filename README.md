# Podcast Teaching Demo

A Next.js application that generates educational podcasts using a hybrid text-to-speech system, supporting both local (CSM-MLX) and cloud-based (ElevenLabs) speech synthesis.

## Features

- Hybrid TTS System
  - Local generation using CSM-MLX (optimized for Apple Silicon)
  - Cloud-based generation using ElevenLabs
- Real-time streaming audio
- Modern React components with TypeScript
- Tailwind CSS for styling
- Environment-based configuration

## Prerequisites

- Node.js 18+ 
- npm or yarn
- For local TTS:
  - Apple Silicon Mac (for CSM-MLX)
  - Python 3.8+
  - FFmpeg

## Installation

1. Clone the repository:
```bash
git clone https://github.com/mikeion/podcast-teaching-demo.git
cd podcast-teaching-demo
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
ELEVENLABS_API_KEY=your_api_key_here
```

4. (Optional) For local TTS, install CSM-MLX:
```bash
pip install git+https://github.com/senstella/csm-mlx.git
```

## Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
podcast-teaching-demo/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── tts/
│   │   │       └── route.ts    # TTS API endpoint
│   │   └── page.tsx            # Main page
│   ├── components/
│   │   └── PodcastGenerator/   # Main podcast generator component
│   ├── services/
│   │   └── tts.service.ts      # TTS service implementation
│   └── types/
│       └── csm-mlx.d.ts        # Type definitions
├── public/
├── .env.local                  # Environment variables (not in repo)
└── package.json
```

## Contributing

Please read our [Contributing Guidelines](.github/CONTRIBUTING.md) before submitting a Pull Request.

### Branch Naming Convention

- Feature: `feature/description`
- Bug Fix: `fix/description`
- Documentation: `docs/description`
- Refactor: `refactor/description`

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes (formatting, etc)
- refactor: Code refactoring
- test: Adding or modifying tests
- chore: Maintenance tasks

Example:
```
feat(tts): add streaming support for local TTS

- Implemented chunk-based audio streaming
- Added progress indicators
- Updated documentation
```

## License

MIT License - see [LICENSE](LICENSE) for details 