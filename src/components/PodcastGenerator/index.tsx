'use client';

import { useState } from 'react';

export default function PodcastGenerator() {
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const generatePodcast = async () => {
    try {
      setIsGenerating(true);
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          options: {
            preferLocal: true,
            quality: 'high',
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate podcast');
      }

      // Create a blob URL from the audio stream
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (error) {
      console.error('Error generating podcast:', error);
      alert('Failed to generate podcast. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Podcast Generator</h1>
      
      <div className="space-y-4">
        <div>
          <label 
            htmlFor="text" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Enter your text
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-32 p-2 border rounded-md"
            placeholder="Enter the text you want to convert to speech..."
          />
        </div>

        <button
          onClick={generatePodcast}
          disabled={isGenerating || !text.trim()}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isGenerating || !text.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isGenerating ? 'Generating...' : 'Generate Podcast'}
        </button>

        {audioUrl && (
          <div className="mt-6">
            <h2 className="text-lg font-medium mb-2">Generated Audio</h2>
            <audio controls className="w-full">
              <source src={audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>
    </div>
  );
} 