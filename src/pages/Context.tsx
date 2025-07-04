import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, MessageCircle, Mail, FileText, Calendar, Tag, Brain, TrendingUp } from 'lucide-react'
import { useContextEntries } from '../hooks/useContextEntries'
import { ContextForm } from '../components/ContextForm'
import { AIService } from '../services/aiService'
import { format } from 'date-fns'

export const Context: React.FC = () => {
  const { contextEntries, createContextEntry } = useContextEntries()
  const [isContextFormOpen, setIsContextFormOpen] = useState(false)
  const [taskRecommendations, setTaskRecommendations] = useState<string[]>([])
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false)

  const handleCreateEntry = async (entry: any) => {
    await createContextEntry(entry)
    await loadTaskRecommendations()
  }

  const loadTaskRecommendations = async () => {
    setIsLoadingRecommendations(true)
    try {
      const recommendations = await AIService.getTaskRecommendations(contextEntries)
      setTaskRecommendations(recommendations)
    } catch (error) {
      console.error('Failed to load recommendations:', error)
    } finally {
      setIsLoadingRecommendations(false)
    }
  }

  React.useEffect(() => {
    if (contextEntries.length > 0) {
      loadTaskRecommendations()
    }
  }, [contextEntries.length])

  const getSourceIcon = (sourceType: string) => {
    switch (sourceType) {
      case 'whatsapp':
        return <MessageCircle className="h-4 w-4" />
      case 'email':
        return <Mail className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getSourceColor = (sourceType: string) => {
    switch (sourceType) {
      case 'whatsapp':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'email':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      default:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'negative':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  // Statistics
  const totalEntries = contextEntries.length
  const whatsappEntries = contextEntries.filter(e => e.source_type === 'whatsapp').length
  const emailEntries = contextEntries.filter(e => e.source_type === 'email').length
  const notesEntries = contextEntries.filter(e => e.source_type === 'notes').length
  const positiveEntries = contextEntries.filter(e => e.sentiment === 'positive').length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Daily Context
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Add and analyze your daily context for better task management
          </p>
        </div>
        <button
          onClick={() => setIsContextFormOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Context</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Total Entries</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalEntries}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">WhatsApp</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{whatsappEntries}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <MessageCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Emails</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{emailEntries}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Positive</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{positiveEntries}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {taskRecommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-xl font-semibold text-purple-900 dark:text-purple-100">
              AI Task Recommendations
            </h2>
          </div>
          <div className="space-y-2">
            {taskRecommendations.map((recommendation, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg"
              >
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-slate-700 dark:text-slate-300">{recommendation}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="space-y-4">
        {contextEntries.length > 0 ? (
          contextEntries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${getSourceColor(entry.source_type)}`}>
                    {getSourceIcon(entry.source_type)}
                    <span className="capitalize">{entry.source_type}</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm ${getSentimentColor(entry.sentiment)}`}>
                    {entry.sentiment}
                  </div>
                </div>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {format(new Date(entry.created_at), 'MMM d, yyyy HH:mm')}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {entry.content}
                </p>
              </div>

              {entry.keywords && entry.keywords.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                    Keywords:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {entry.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {entry.processed_insights && (
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                    AI Insights:
                  </p>
                  <p className="text-slate-700 dark:text-slate-300 text-sm">
                    {entry.processed_insights}
                  </p>
                </div>
              )}
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-slate-400 dark:text-slate-500 text-lg mb-2">
              No context entries yet
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              Add your first context entry to get AI-powered insights!
            </p>
          </div>
        )}
      </div>

      <ContextForm
        isOpen={isContextFormOpen}
        onClose={() => setIsContextFormOpen(false)}
        onSubmit={handleCreateEntry}
      />
    </div>
  )
}