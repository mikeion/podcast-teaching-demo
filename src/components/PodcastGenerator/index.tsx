'use client';

import { useState, useRef } from 'react';

interface UserPreferences {
  title: string;
  type: string;
  learning_goal: string;
  preferences: {
    duration: string;
    teaching_style: string;
    participants: string;
    tone: string;
    language: string;
    intonation: string;
    usage: string;
    personalized_explanation: string;
  };
}

export default function PodcastGenerator() {
  const [projectDescription, setProjectDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [useElevenLabs, setUseElevenLabs] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  const analyzeProject = async () => {
    try {
      setIsAnalyzing(true);
      setError(null);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: projectDescription }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze project');
      }

      const preferences = await response.json();
      setUserPreferences(preferences);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze project');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generatePodcast = async () => {
    if (!userPreferences) {
      setError('Please analyze the project first');
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);

      // Generate educational content based on preferences
      const contentResponse = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userPreferences),
      });

      if (!contentResponse.ok) {
        throw new Error('Failed to generate content');
      }

      const { content } = await contentResponse.json();

      // Generate speech from content
      const audioResponse = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: content,
          useElevenLabs, // Pass the TTS provider choice
        }),
      });

      if (!audioResponse.ok) {
        throw new Error('Failed to generate audio');
      }

      const audioBlob = await audioResponse.blob();
      const url = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.src = url;
        await audioRef.current.play();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate podcast');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="project" className="block text-sm font-medium text-gray-700">
          Describe your learning goals or project
        </label>
        <textarea
          id="project"
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          className="w-full h-32 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="What are you trying to learn? What concepts do you want explained?"
        />
      </div>

      <div className="flex items-center space-x-2 py-2">
        <span className="text-sm text-gray-600">TTS Provider:</span>
        <button
          onClick={() => setUseElevenLabs(true)}
          className={`px-3 py-1 text-sm rounded-md ${
            useElevenLabs
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          ElevenLabs
        </button>
        <button
          onClick={() => setUseElevenLabs(false)}
          className={`px-3 py-1 text-sm rounded-md ${
            !useElevenLabs
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          CSM-MLX (Local)
        </button>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={analyzeProject}
          disabled={!projectDescription || isAnalyzing}
          className={`flex-1 py-2 px-4 rounded-md text-white ${
            !projectDescription || isAnalyzing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Project'}
        </button>

        <button
          onClick={generatePodcast}
          disabled={!userPreferences || isGenerating}
          className={`flex-1 py-2 px-4 rounded-md text-white ${
            !userPreferences || isGenerating
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isGenerating ? 'Generating...' : 'Generate Podcast'}
        </button>
      </div>

      {error && (
        <div className="p-4 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      {userPreferences && (
        <div className="p-4 bg-gray-50 rounded-md">
          <h3 className="font-medium mb-2">Analysis Results:</h3>
          <ul className="space-y-1 text-sm">
            <li><strong>Topic:</strong> {userPreferences.title}</li>
            <li><strong>Learning Goal:</strong> {userPreferences.learning_goal}</li>
            <li><strong>Teaching Style:</strong> {userPreferences.preferences.teaching_style}</li>
            <li><strong>Duration:</strong> {userPreferences.preferences.duration}</li>
          </ul>
        </div>
      )}

      <audio ref={audioRef} controls className="w-full" />
    </div>
  );
} 