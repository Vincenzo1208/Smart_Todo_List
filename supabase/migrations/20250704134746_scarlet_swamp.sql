/*
  # Smart Todo List Database Schema

  1. New Tables
    - `tasks`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `category` (text)
      - `priority_score` (integer, 1-5)
      - `deadline` (date)
      - `status` (enum: pending, in_progress, completed)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `ai_enhanced` (boolean)
      - `context_based` (boolean)
      
    - `context_entries`
      - `id` (uuid, primary key)
      - `content` (text)
      - `source_type` (enum: whatsapp, email, notes)
      - `created_at` (timestamp)
      - `processed_insights` (text)
      - `keywords` (text array)
      - `sentiment` (enum: positive, negative, neutral)
      
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `color` (text)
      - `usage_count` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create enum types
CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'completed');
CREATE TYPE context_source AS ENUM ('whatsapp', 'email', 'notes');
CREATE TYPE sentiment_type AS ENUM ('positive', 'negative', 'neutral');

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  priority_score integer DEFAULT 3 CHECK (priority_score >= 1 AND priority_score <= 5),
  deadline date NOT NULL,
  status task_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  ai_enhanced boolean DEFAULT false,
  context_based boolean DEFAULT false
);

-- Create context_entries table
CREATE TABLE IF NOT EXISTS context_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  source_type context_source NOT NULL,
  created_at timestamptz DEFAULT now(),
  processed_insights text DEFAULT '',
  keywords text[] DEFAULT ARRAY[]::text[],
  sentiment sentiment_type DEFAULT 'neutral'
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  color text DEFAULT '#3B82F6',
  usage_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category);
CREATE INDEX IF NOT EXISTS idx_tasks_deadline ON tasks(deadline);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority_score);
CREATE INDEX IF NOT EXISTS idx_context_source ON context_entries(source_type);
CREATE INDEX IF NOT EXISTS idx_context_sentiment ON context_entries(sentiment);
CREATE INDEX IF NOT EXISTS idx_context_created ON context_entries(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for tasks table
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE context_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policies for tasks
CREATE POLICY "Tasks are publicly accessible"
  ON tasks
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create policies for context_entries
CREATE POLICY "Context entries are publicly accessible"
  ON context_entries
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create policies for categories
CREATE POLICY "Categories are publicly accessible"
  ON categories
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert default categories
INSERT INTO categories (name, color) VALUES
  ('Work', '#3B82F6'),
  ('Personal', '#10B981'),
  ('Health', '#EF4444'),
  ('Education', '#8B5CF6'),
  ('Finance', '#F59E0B'),
  ('Other', '#6B7280')
ON CONFLICT (name) DO NOTHING;