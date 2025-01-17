import React from 'react';
import { Video, Volume2 } from 'lucide-react';

interface VideoPreviewProps {
  videoUrl?: string;
  audioUrl?: string;
}

export function VideoPreview({ videoUrl, audioUrl }: VideoPreviewProps) {
  if (!videoUrl && !audioUrl) {
    return (
      <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500">
          <Video className="w-12 h-12 mx-auto mb-2" />
          <p>Your video will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {videoUrl && (
        <video
          controls
          className="w-full aspect-video rounded-lg bg-black"
          src={videoUrl}
        />
      )}
      {audioUrl && (
        <div className="flex items-center gap-4 p-4 bg-white rounded-lg">
          <Volume2 className="w-6 h-6 text-blue-600" />
          <audio controls className="flex-1" src={audioUrl} />
        </div>
      )}
    </div>
  );
}