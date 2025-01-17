import React from 'react';
import { Mic2, Play, Square } from 'lucide-react';
import { cn } from '../lib/utils';
import { VOICE_IDS, generateSpeech } from '../lib/ai';

interface Voice {
  id: string;
  name: string;
}

const AVAILABLE_VOICES: Voice[] = [
  { id: 'en-US-1', name: 'Adam (Male)' },
  { id: 'en-US-2', name: 'Rachel (Female)' },
  { id: 'en-US-3', name: 'Sam (Male)' },
  { id: 'en-US-4', name: 'Emily (Female)' },
];

interface VoiceSelectorProps {
  selectedVoice: string;
  onVoiceSelect: (voiceId: string) => void;
}

export function VoiceSelector({ selectedVoice, onVoiceSelect }: VoiceSelectorProps) {
  const [previewAudio, setPreviewAudio] = React.useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [loadingVoice, setLoadingVoice] = React.useState<string | null>(null);

  const handlePreview = async (voiceId: string) => {
    try {
      setLoadingVoice(voiceId);
      const audioUrl = await generateSpeech(
        "Hello! This is a preview of how I sound.",
        VOICE_IDS[voiceId as keyof typeof VOICE_IDS]
      );

      if (previewAudio) {
        previewAudio.pause();
        previewAudio.remove();
      }

      const audio = new Audio(audioUrl);
      setPreviewAudio(audio);
      setIsPlaying(true);
      audio.play();

      audio.onended = () => {
        setIsPlaying(false);
      };
    } catch (error) {
      console.error('Error previewing voice:', error);
    } finally {
      setLoadingVoice(null);
    }
  };

  const togglePlay = () => {
    if (!previewAudio) return;

    if (isPlaying) {
      previewAudio.pause();
      setIsPlaying(false);
    } else {
      previewAudio.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center gap-2 mb-4">
          <Mic2 className="w-5 h-5 text-blue-600" />
          <h3 className="font-medium">Select a Voice</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {AVAILABLE_VOICES.map((voice) => (
            <div
              key={voice.id}
              className={cn(
                "p-4 rounded-lg border-2",
                selectedVoice === voice.id
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200"
              )}
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={() => onVoiceSelect(voice.id)}
                  className="text-left flex-1"
                >
                  <p className="font-medium">{voice.name}</p>
                </button>
                <button
                  onClick={() => {
                    if (loadingVoice === voice.id) return;
                    if (selectedVoice === voice.id && previewAudio) {
                      togglePlay();
                    } else {
                      handlePreview(voice.id);
                    }
                  }}
                  className={cn(
                    "p-2 rounded-full",
                    "hover:bg-gray-100 transition-colors",
                    loadingVoice === voice.id && "animate-pulse"
                  )}
                >
                  {loadingVoice === voice.id ? (
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  ) : selectedVoice === voice.id && isPlaying ? (
                    <Square className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}