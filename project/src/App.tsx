import React, { useState, useEffect } from 'react';
import { TextEditor } from './components/TextEditor';
import { VideoPreview } from './components/VideoPreview';
import { VoiceSelector } from './components/VoiceSelector';
import { Sparkles } from 'lucide-react';
import { supabase } from './lib/supabase';
import { generateSpeech, generateVideo, VOICE_IDS } from './lib/ai';
import type { Database } from './lib/database.types';

type Video = Database['public']['Tables']['videos']['Row'];

function App() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('en-US-1');
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkVideoStatus = async () => {
      if (currentVideo && currentVideo.status === 'processing') {
        const { data: video } = await supabase
          .from('videos')
          .select('*')
          .eq('id', currentVideo.id)
          .single();

        if (video && video.status !== currentVideo.status) {
          setCurrentVideo(video);
        }
      }
    };

    const interval = setInterval(checkVideoStatus, 5000);
    return () => clearInterval(interval);
  }, [currentVideo]);

  const handleGenerate = async (script: string, title: string) => {
    try {
      setIsGenerating(true);
      setError(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Please sign in to generate videos');
      }

      // Create initial video record
      const { data: video, error: insertError } = await supabase
        .from('videos')
        .insert({
          user_id: user.id,
          title,
          script,
          voice_id: selectedVoice,
          status: 'processing'
        })
        .select()
        .single();

      if (insertError) throw insertError;
      setCurrentVideo(video);

      // Generate speech
      const audioUrl = await generateSpeech(
        script,
        VOICE_IDS[selectedVoice as keyof typeof VOICE_IDS]
      );

      // Generate video
      const videoUrl = await generateVideo(title);

      // Update video record with URLs
      const { error: updateError } = await supabase
        .from('videos')
        .update({
          status: 'completed',
          video_url: videoUrl,
          audio_url: audioUrl
        })
        .eq('id', video.id);

      if (updateError) throw updateError;

      // Fetch updated video
      const { data: updatedVideo } = await supabase
        .from('videos')
        .select('*')
        .eq('id', video.id)
        .single();

      if (updatedVideo) {
        setCurrentVideo(updatedVideo);
      }

    } catch (error) {
      console.error('Error generating video:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate video');
      
      // Update video status to failed if we have a video record
      if (currentVideo) {
        await supabase
          .from('videos')
          .update({
            status: 'failed'
          })
          .eq('id', currentVideo.id);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-blue-600" />
            <h1 className="text-xl font-bold">AI Video Creator</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
              {error}
            </div>
          )}

          {/* Text Input Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Enter Your Script</h2>
            <TextEditor
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          </section>

          {/* Voice Selection */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Choose a Voice</h2>
            <VoiceSelector
              selectedVoice={selectedVoice}
              onVoiceSelect={setSelectedVoice}
            />
          </section>

          {/* Preview Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Preview</h2>
            <VideoPreview
              videoUrl={currentVideo?.video_url}
              audioUrl={currentVideo?.audio_url}
            />
            {currentVideo?.status === 'processing' && (
              <div className="mt-4 text-center text-blue-600">
                Processing your video... This may take a few minutes.
              </div>
            )}
            {currentVideo?.status === 'failed' && (
              <div className="mt-4 text-center text-red-600">
                Failed to generate video. Please try again.
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;