# Podcast Teaching Demo

A Next.js application that generates educational podcasts using a hybrid text-to-speech system, supporting both local (CSM-MLX) and cloud-based (ElevenLabs) speech synthesis. The app analyzes learning goals and generates concise, targeted educational content.

## Features

- Smart Content Analysis
  - Analyzes learning goals and project requirements
  - Generates targeted educational content
  - Optimizes for 2-3 minute podcast length
- Hybrid TTS System
  - Cloud-based generation using ElevenLabs (Currently Working)
  - Local generation using CSM-MLX (In Progress - Apple Silicon only)
- Modern Web Interface
  - Real-time content analysis
  - Live audio preview
  - TTS provider selection
  - Built with Next.js and TypeScript
  - Styled with Tailwind CSS

## Prerequisites

- Node.js 18+ 
- npm or yarn
- For local TTS (Coming Soon):
  - Apple Silicon Mac (M1/M2/M3)
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

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   - Edit `.env.local` and add your API keys:
     - `ELEVENLABS_API_KEY`: Your ElevenLabs API key
     - `OPENAI_API_KEY`: Your OpenAI API key

4. (Optional) For local TTS, run the setup script (Note: Currently in development):
```bash
chmod +x scripts/setup-csm.sh
./scripts/setup-csm.sh
```

## Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

The following environment variables are required:

- `ELEVENLABS_API_KEY`: Your ElevenLabs API key for cloud-based TTS
- `OPENAI_API_KEY`: Your OpenAI API key for content generation

Optional variables:
- `NODE_ENV`: Set to 'development' or 'production' (default: 'development')
- `PORT`: The port number for the development server (default: 3000)

## Known Issues

1. CSM-MLX Integration (In Progress)
   - The local TTS using CSM-MLX is currently not working due to module resolution issues
   - Use ElevenLabs TTS in the meantime
   - Fix coming soon

2. Environment Variables
   - Both ELEVENLABS_API_KEY and OPENAI_API_KEY are required for full functionality
   - The app will show appropriate error messages if keys are missing

## Project Structure

```
podcast-teaching-demo/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/
│   │   │   │   └── route.ts    # Content analysis endpoint
│   │   │   ├── generate-content/
│   │   │   │   └── route.ts    # Educational content generation
│   │   │   └── tts/
│   │   │       └── route.ts    # TTS API endpoint
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Main page
│   ├── components/
│   │   └── PodcastGenerator/   # Main podcast generator component
│   └── services/
│       └── tts.service.ts      # TTS service implementation
├── scripts/
│   └── setup-csm.sh           # CSM-MLX setup script
├── .env.example              # Example environment variables
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