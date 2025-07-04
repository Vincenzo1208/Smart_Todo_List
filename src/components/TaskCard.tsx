import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Tag, CheckCircle, Circle, AlertCircle, Brain } from 'lucide-react'
import { format } from 'date-fns'
import { Database } from '../lib/supabase'

type Task = Database['public']['Tables']['tasks']['Row']

interface TaskCardProps {
  task: Task
  onToggleComplete: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const getPriorityColor = (priority: number) => {
    if (priority >= 4) return 'text-red-500 bg-red-50 dark:bg-red-900/20'
    if (priority >= 3) return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
    return 'text-green-500 bg-green-50 dark:bg-green-900/20'
  }

  const getPriorityLabel = (priority: number) => {
    if (priority >= 4) return 'High'
    if (priority >= 3) return 'Medium'
    return 'Low'
  }

  const getStatusIcon = () => {
    if (task.status === 'completed') {
      return <CheckCircle className="h-5 w-5 text-green-500" />
    }
    if (task.status === 'in_progress') {
      return <Clock className="h-5 w-5 text-blue-500" />
    }
    return <Circle className="h-5 w-5 text-slate-400" />
  }

  const isOverdue = new Date(task.deadline) < new Date() && task.status !== 'completed'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow ${
        task.status === 'completed' ? 'opacity-75' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          
          <div className="flex items-center space-x-3 mb-3">
            <button
              onClick={() => onToggleComplete(task.id)}
              className="flex-shrink-0 hover:scale-110 transition-transform"
            >
              {getStatusIcon()}
            </button>
            <h3 className={`text-lg font-semibold ${
              task.status === 'completed' 
                ? 'text-slate-500 dark:text-slate-400 line-through' 
                : 'text-slate-900 dark:text-white'
            }`}>
              {task.title}
            </h3>
            {task.ai_enhanced && (
              <div className="flex items-center space-x-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <Brain className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                  AI Enhanced
                </span>
              </div>
            )}
          </div>

          <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
            {task.description}
          </p>

          
          <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span className={isOverdue ? 'text-red-500' : ''}>
                {format(new Date(task.deadline), 'MMM d, yyyy')}
              </span>
              {isOverdue && <AlertCircle className="h-4 w-4 text-red-500" />}
            </div>
            <div className="flex items-center space-x-1">
              <Tag className="h-4 w-4" />
              <span>{task.category}</span>
            </div>
          </div>
        </div>

      
        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority_score)}`}>
          <span>{getPriorityLabel(task.priority_score)}</span>
        </div>
      </div>

      
      <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={() => onEdit(task)}
          className="px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
        >
          Delete
        </button>
      </div>
    </motion.div>
  )
}