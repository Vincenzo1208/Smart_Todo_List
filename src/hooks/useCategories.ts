import { useState, useEffect } from 'react'
import { supabase, Database } from '../lib/supabase'

type Category = Database['public']['Tables']['categories']['Row']
type CategoryInsert = Database['public']['Tables']['categories']['Insert']

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('usage_count', { ascending: false })
      
      if (error) throw error
      setCategories(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories')
    } finally {
      setLoading(false)
    }
  }

  const createCategory = async (category: CategoryInsert) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([category])
        .select()
        .single()
      
      if (error) throw error
      if (data) {
        setCategories(prev => [data, ...prev])
      }
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create category')
      throw err
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return {
    categories,
    loading,
    error,
    createCategory,
    refetch: fetchCategories
  }
}