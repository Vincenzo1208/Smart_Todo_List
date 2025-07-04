import React from 'react'
import { motion } from 'framer-motion'
import { Plus, TrendingUp, Clock, CheckCircle, AlertCircle, Brain } from 'lucide-react'
import { useTasks } from '../hooks/useTasks'
import { useContextEntries } from '../hooks/useContextEntries'
import { TaskCard } from '../components/TaskCard'
import { TaskForm } from '../components/TaskForm'
import { format } from 'date-fns'

export const Dashboard: React.FC = () => {
  const { tasks, createTask, updateTask, deleteTask } = useTasks()
  const { contextEntries } = useContextEntries()
  const [isTaskFormOpen, setIsTaskFormOpen] = React.useState(false)
  const [editingTask, setEditingTask] = React.useState(null)

  const handleToggleComplete = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return

    const newStatus = task.status === 'completed' ? 'pending' : 'completed'
    await updateTask(taskId, { status: newStatus })
  }

  const handleEditTask = (task: any) => {
    setEditingTask(task)
    setIsTaskFormOpen(true)
  }

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(taskId)
    }
  }

  const handleCloseTaskForm = () => {
    setIsTaskFormOpen(false)
    setEditingTask(null)
  }

  // Dashboard statistics
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.status === 'completed').length
  const pendingTasks = tasks.filter(t => t.status === 'pending').length
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length
  const overdueTasks = tasks.filter(t => 
    new Date(t.deadline) < new Date() && t.status !== 'completed'
  ).length
  const aiEnhancedTasks = tasks.filter(t => t.ai_enhanced).length

  // Recent tasks (last 5)
  const recentTasks = tasks.slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Welcome back! Here's your task overview for today.
          </p>
        </div>
        <button
          onClick={() => setIsTaskFormOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Total Tasks</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalTasks}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
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
              <p className="text-sm text-slate-600 dark:text-slate-400">Completed</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{completedTasks}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
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
              <p className="text-sm text-slate-600 dark:text-slate-400">In Progress</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{inProgressTasks}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
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
              <p className="text-sm text-slate-600 dark:text-slate-400">Overdue</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{overdueTasks}</p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* AI Insights */}
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
            AI Insights
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
            <p className="text-purple-800 dark:text-purple-200 font-medium">AI Enhanced Tasks</p>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">
              {aiEnhancedTasks}
            </p>
          </div>
          <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
            <p className="text-purple-800 dark:text-purple-200 font-medium">Context Entries</p>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">
              {contextEntries.length}
            </p>
          </div>
          <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
            <p className="text-purple-800 dark:text-purple-200 font-medium">Success Rate</p>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">
              {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
            </p>
          </div>
        </div>
      </motion.div>

      {/* Recent Tasks */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
          Recent Tasks
        </h2>
        {recentTasks.length > 0 ? (
          <div className="space-y-4">
            {recentTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-slate-400 dark:text-slate-500 text-lg mb-2">
              No tasks yet
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              Create your first task to get started!
            </p>
          </div>
        )}
      </div>

      {/* Task Form */}
      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={handleCloseTaskForm}
        onSubmit={createTask}
        editingTask={editingTask}
      />
    </div>
  )
}