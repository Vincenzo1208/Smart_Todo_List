import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string
          title: string
          description: string
          category: string
          priority_score: number
          deadline: string
          status: 'pending' | 'in_progress' | 'completed'
          created_at: string
          updated_at: string
          ai_enhanced: boolean
          context_based: boolean
        }
        Insert: {
          id?: string
          title: string
          description: string
          category: string
          priority_score?: number
          deadline: string
          status?: 'pending' | 'in_progress' | 'completed'
          created_at?: string
          updated_at?: string
          ai_enhanced?: boolean
          context_based?: boolean
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: string
          priority_score?: number
          deadline?: string
          status?: 'pending' | 'in_progress' | 'completed'
          created_at?: string
          updated_at?: string
          ai_enhanced?: boolean
          context_based?: boolean
        }
      }
      context_entries: {
        Row: {
          id: string
          content: string
          source_type: 'whatsapp' | 'email' | 'notes'
          created_at: string
          processed_insights: string
          keywords: string[]
          sentiment: 'positive' | 'negative' | 'neutral'
        }
        Insert: {
          id?: string
          content: string
          source_type: 'whatsapp' | 'email' | 'notes'
          created_at?: string
          processed_insights?: string
          keywords?: string[]
          sentiment?: 'positive' | 'negative' | 'neutral'
        }
        Update: {
          id?: string
          content?: string
          source_type?: 'whatsapp' | 'email' | 'notes'
          created_at?: string
          processed_insights?: string
          keywords?: string[]
          sentiment?: 'positive' | 'negative' | 'neutral'
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          color: string
          usage_count: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          color: string
          usage_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          color?: string
          usage_count?: number
          created_at?: string
        }
      }
    }
  }
}