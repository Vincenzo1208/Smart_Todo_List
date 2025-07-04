import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Brain, Loader2, Calendar, Tag, FileText, Lightbulb } from 'lucide-react'
import { AIService } from '../services/aiService'
import { useCategories } from '../hooks/useCategories'
import { useContextEntries } from '../hooks/useContextEntries'
import { Database } from '../lib/supabase'

type Task = Database['public']['Tables']['tasks']['Row']
type TaskInsert = Database['public']['Tables']['tasks']['Insert']

interface TaskFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (task: TaskInsert) => void
  editingTask?: Task | null
}

export const TaskForm: React.FC<TaskFormProps> = ({ isOpen, onClose, onSubmit, editingTask }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    deadline: '',
    priority_score: 3,
    status: 'pending' as const
  })

  const [aiSuggestions, setAiSuggestions] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [useAiSuggestions, setUseAiSuggestions] = useState(false)

  const { categories } = useCategories()
  const { contextEntries } = useContextEntries()

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description,
        category: editingTask.category,
        deadline: editingTask.deadline,
        priority_score: editingTask.priority_score,
        status: editingTask.status
      })
    } else {
      setFormData({
        title: '',
        description: '',
        category: '',
        deadline: '',
        priority_score: 3,
        status: 'pending'
      })
    }
    setAiSuggestions(null)
    setUseAiSuggestions(false)
  }, [editingTask, isOpen])

  const handleAnalyzeTask = async () => {
    if (!formData.title.trim()) return

    setIsAnalyzing(true)
    try {
      const suggestions = await AIService.analyzeTask(
        formData.title,
        formData.description,
        contextEntries
      )
      setAiSuggestions(suggestions)
    } catch (error) {
      console.error('AI analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleApplyAiSuggestions = () => {
    if (!aiSuggestions) return

    setFormData(prev => ({
      ...prev,
      description: aiSuggestions.enhancedDescription,
      category: aiSuggestions.suggestedCategory,
      deadline: aiSuggestions.suggestedDeadline,
      priority_score: aiSuggestions.priorityScore
    }))
    setUseAiSuggestions(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const taskData: TaskInsert = {
      ...formData,
      ai_enhanced: useAiSuggestions,
      context_based: contextEntries.length > 0
    }

    onSubmit(taskData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto"
      >
        <div className="p-6">
          
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
          
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <FileText className="h-4 w-4 inline mr-2" />
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                placeholder="Enter task title..."
                required
              />
            </div>

            
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleAnalyzeTask}
                disabled={!formData.title.trim() || isAnalyzing}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isAnalyzing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Brain className="h-4 w-4" />
                )}
                <span>{isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}</span>
              </button>
              {aiSuggestions && (
                <span className="text-sm text-green-600 dark:text-green-400">
                  AI suggestions ready!
                </span>
              )}
            </div>

            
            {aiSuggestions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-purple-900 dark:text-purple-100 flex items-center">
                    <Lightbulb className="h-4 w-4 mr-2" />
                    AI Suggestions
                  </h3>
                  <button
                    type="button"
                    onClick={handleApplyAiSuggestions}
                    className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm"
                  >
                    Apply All
                  </button>
                </div>
                <div className="space-y-2 text-sm">
                  <p><strong>Priority:</strong> {aiSuggestions.priorityScore}/5</p>
                  <p><strong>Category:</strong> {aiSuggestions.suggestedCategory}</p>
                  <p><strong>Deadline:</strong> {aiSuggestions.suggestedDeadline}</p>
                  <p><strong>Reasoning:</strong> {aiSuggestions.reasoning}</p>
                </div>
              </motion.div>
            )}

          
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                placeholder="Describe your task..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <Tag className="h-4 w-4 inline mr-2" />
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  required
                >
                  <option value="">Select category</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Health">Health</option>
                  <option value="Education">Education</option>
                  <option value="Finance">Finance</option>
                  <option value="Other">Other</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  Deadline
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Priority (1-5)
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.priority_score}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority_score: parseInt(e.target.value) }))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                  <span>Low</span>
                  <span className="font-medium">{formData.priority_score}</span>
                  <span>High</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingTask ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  )
}