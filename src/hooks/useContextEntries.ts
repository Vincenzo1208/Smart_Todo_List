import { useState, useEffect } from 'react'
import { supabase, Database } from '../lib/supabase'

type ContextEntry = Database['public']['Tables']['context_entries']['Row']
type ContextInsert = Database['public']['Tables']['context_entries']['Insert']

export const useContextEntries = () => {
  const [contextEntries, setContextEntries] = useState<ContextEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContextEntries = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('context_entries')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setContextEntries(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch context entries')
    } finally {
      setLoading(false)
    }
  }

  const createContextEntry = async (entry: ContextInsert) => {
    try {
      const { data, error } = await supabase
        .from('context_entries')
        .insert([entry])
        .select()
        .single()
      
      if (error) throw error
      if (data) {
        setContextEntries(prev => [data, ...prev])
      }
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create context entry')
      throw err
    }
  }

  useEffect(() => {
    fetchContextEntries()
  }, [])

  return {
    contextEntries,
    loading,
    error,
    createContextEntry,
    refetch: fetchContextEntries
  }
}