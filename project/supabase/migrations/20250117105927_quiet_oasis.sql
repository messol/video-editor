/*
  # Create videos table for AI video generation

  1. New Tables
    - `videos`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `script` (text)
      - `voice_id` (text)
      - `status` (enum: pending, processing, completed, failed)
      - `video_url` (text, nullable)
      - `audio_url` (text, nullable)

  2. Security
    - Enable RLS
    - Add policies for authenticated users to:
      - Read their own videos
      - Create new videos
      - Update their own videos
*/

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  script text NOT NULL,
  voice_id text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  video_url text,
  audio_url text
);

-- Enable RLS
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own videos"
  ON videos
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create videos"
  ON videos
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own videos"
  ON videos
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);