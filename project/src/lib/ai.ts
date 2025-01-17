import Replicate from 'replicate';

// Initialize Replicate client
const replicate = new Replicate({
  auth: import.meta.env.VITE_REPLICATE_API_TOKEN,
});

// ElevenLabs API endpoint
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

export async function generateSpeech(text: string, voiceId: string): Promise<string> {
  const response = await fetch(`${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': import.meta.env.VITE_ELEVENLABS_API_KEY,
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_monolingual_v1',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate speech');
  }

  const audioBlob = await response.blob();
  return URL.createObjectURL(audioBlob);
}

export async function generateVideo(prompt: string): Promise<string> {
  const output = await replicate.run(
    "stability-ai/stable-video-diffusion:3d54740e59b41b09f8f4799aea6703c0c0acb861a11b41a0311e85e5a01e7bc8",
    {
      input: {
        prompt,
        video_length: "14_frames_with_svd_xt",
        fps: 6,
        motion_bucket_id: 127,
        cond_aug: 0.02,
      }
    }
  );

  // The output will be a video URL
  return output as string;
}

// Voice mapping for ElevenLabs voices
export const VOICE_IDS = {
  'en-US-1': 'pNInz6obpgDQGcFmaJgB', // Adam
  'en-US-2': 'EXAVITQu4vr4xnSDxMaL', // Rachel
  'en-US-3': 'VR6AewLTigWG4xSOukaG', // Sam
  'en-US-4': 'yoZ06aMxZJJ28mfd3POQ', // Emily
};