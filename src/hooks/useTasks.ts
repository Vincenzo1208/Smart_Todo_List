import { useState, useEffect } from 'react'
import { supabase, Database } from '../lib/supabase'

type Task = Database['public']['Tables']['tasks']['Row']
type TaskInsert = Database['public']['Tables']['tasks']['Insert']
type TaskUpdate = Database['public']['Tables']['tasks']['Update']

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('priority_score', { ascending: false })
      
      if (error) throw error
      setTasks(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (task: TaskInsert) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([task])
        .select()
        .single()
      
      if (error) throw error
      if (data) {
        setTasks(prev => [data, ...prev])
      }
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task')
      throw err
    }
  }

  const updateTask = async (id: string, updates: TaskUpdate) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      if (data) {
        setTasks(prev => prev.map(task => task.id === id ? data : task))
      }
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task')
      throw err
    }
  }

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      setTasks(prev => prev.filter(task => task.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task')
      throw err
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks
  }
}