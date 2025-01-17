export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      videos: {
        Row: {
          id: string
          created_at: string
          user_id: string
          title: string
          script: string
          voice_id: string
          status: 'pending' | 'processing' | 'completed' | 'failed'
          video_url: string | null
          audio_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          title: string
          script: string
          voice_id: string
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          video_url?: string | null
          audio_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          title?: string
          script?: string
          voice_id?: string
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          video_url?: string | null
          audio_url?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}