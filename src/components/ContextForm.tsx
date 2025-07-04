import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Brain, Loader2, MessageCircle, Mail, FileText, Send } from 'lucide-react'
import { AIService } from '../services/aiService'
import { Database } from '../lib/supabase'

type ContextInsert = Database['public']['Tables']['context_entries']['Insert']

interface ContextFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (entry: ContextInsert) => void
}

export const ContextForm: React.FC<ContextFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    content: '',
    source_type: 'notes' as const
  })

  const [aiAnalysis, setAiAnalysis] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyzeContext = async () => {
    if (!formData.content.trim()) return

    setIsAnalyzing(true)
    try {
      const analysis = await AIService.analyzeContext(formData.content)
      setAiAnalysis(analysis)
    } catch (error) {
      console.error('Context analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const contextData: ContextInsert = {
      ...formData,
      keywords: aiAnalysis?.keywords || [],
      sentiment: aiAnalysis?.sentiment || 'neutral',
      processed_insights: aiAnalysis?.insights || ''
    }

    onSubmit(contextData)
    
    
    setFormData({
      content: '',
      source_type: 'notes'
    })
    setAiAnalysis(null)
    onClose()
  }

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'whatsapp':
        return <MessageCircle className="h-4 w-4" />
      case 'email':
        return <Mail className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
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
              Add Daily Context
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
                Source Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
                  { value: 'email', label: 'Email', icon: Mail },
                  { value: 'notes', label: 'Notes', icon: FileText }
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, source_type: value as any }))}
                    className={`flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-colors ${
                      formData.source_type === value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Content
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={6}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                placeholder="Paste your message, email, or notes here..."
                required
              />
            </div>

            
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleAnalyzeContext}
                disabled={!formData.content.trim() || isAnalyzing}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isAnalyzing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Brain className="h-4 w-4" />
                )}
                <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Context'}</span>
              </button>
              {aiAnalysis && (
                <span className="text-sm text-green-600 dark:text-green-400">
                  Analysis complete!
                </span>
              )}
            </div>

           
            {aiAnalysis && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700"
              >
                <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-3">
                  AI Analysis Results
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <strong className="text-purple-800 dark:text-purple-200">Sentiment:</strong>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      aiAnalysis.sentiment === 'positive' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : aiAnalysis.sentiment === 'negative'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}>
                      {aiAnalysis.sentiment}
                    </span>
                  </div>
                  <div>
                    <strong className="text-purple-800 dark:text-purple-200">Keywords:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {aiAnalysis.keywords.map((keyword: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full text-xs"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <strong className="text-purple-800 dark:text-purple-200">Insights:</strong>
                    <p className="text-slate-700 dark:text-slate-300 mt-1">{aiAnalysis.insights}</p>
                  </div>
                  <div>
                    <strong className="text-purple-800 dark:text-purple-200">Suggested Tasks:</strong>
                    <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mt-1">
                      {aiAnalysis.taskSuggestions.map((suggestion: string, index: number) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            
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
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Send className="h-4 w-4" />
                <span>Add Context</span>
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  )
}