'use client';

import PodcastGenerator from '@/components/PodcastGenerator';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Podcast Teaching Demo</h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-gray-600 mb-4">
            Welcome to the Podcast Teaching Demo. This application helps you generate educational podcasts using both local and cloud-based text-to-speech systems.
          </p>
          <PodcastGenerator apiKey={process.env.NEXT_PUBLIC_OPENAI_API_KEY} />
        </div>
      </div>
    </main>
  );
} 