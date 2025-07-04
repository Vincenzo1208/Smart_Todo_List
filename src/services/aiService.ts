// AI Service for task analysis and suggestions
// This simulates AI processing - in production, this would call your AI API

export interface AITaskSuggestion {
  priorityScore: number
  suggestedDeadline: string
  enhancedDescription: string
  suggestedCategory: string
  reasoning: string
}

export interface AIContextAnalysis {
  keywords: string[]
  sentiment: 'positive' | 'negative' | 'neutral'
  insights: string
  taskSuggestions: string[]
}

export class AIService {
  // Simulate AI-powered task analysis
  static async analyzeTask(
    title: string,
    description: string,
    contextEntries: any[] = []
  ): Promise<AITaskSuggestion> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock AI analysis based on task content
    const urgencyKeywords = ['urgent', 'asap', 'immediately', 'critical', 'emergency']
    const workKeywords = ['meeting', 'presentation', 'report', 'project', 'client']
    const personalKeywords = ['personal', 'family', 'health', 'home', 'shopping']

    const taskText = `${title} ${description}`.toLowerCase()
    
    let priorityScore = 3 // Default medium priority
    let suggestedCategory = 'General'
    
    // Analyze content for priority
    if (urgencyKeywords.some(word => taskText.includes(word))) {
      priorityScore = Math.min(priorityScore + 2, 5)
    }
    
    // Categorize based on content
    if (workKeywords.some(word => taskText.includes(word))) {
      suggestedCategory = 'Work'
      priorityScore = Math.min(priorityScore + 1, 5)
    } else if (personalKeywords.some(word => taskText.includes(word))) {
      suggestedCategory = 'Personal'
    }

    // Analyze context for additional insights
    const recentContextKeywords = contextEntries
      .slice(0, 5)
      .flatMap(entry => entry.keywords || [])
      .filter(keyword => taskText.includes(keyword.toLowerCase()))

    if (recentContextKeywords.length > 0) {
      priorityScore = Math.min(priorityScore + 1, 5)
    }

    // Suggest deadline based on priority and complexity
    const daysToAdd = priorityScore >= 4 ? 1 : priorityScore >= 3 ? 3 : 7
    const suggestedDeadline = new Date()
    suggestedDeadline.setDate(suggestedDeadline.getDate() + daysToAdd)

    // Enhance description with context
    let enhancedDescription = description
    if (recentContextKeywords.length > 0) {
      enhancedDescription += `\n\nContext insights: Related to recent discussions about ${recentContextKeywords.join(', ')}`
    }

    return {
      priorityScore,
      suggestedDeadline: suggestedDeadline.toISOString().split('T')[0],
      enhancedDescription,
      suggestedCategory,
      reasoning: `Priority based on content analysis (${priorityScore}/5). ${
        recentContextKeywords.length > 0 
          ? `Enhanced with context from recent entries.` 
          : 'No recent context available.'
      }`
    }
  }

  // Simulate AI-powered context analysis
  static async analyzeContext(content: string): Promise<AIContextAnalysis> {
    await new Promise(resolve => setTimeout(resolve, 800))

    // Mock sentiment analysis
    const positiveWords = ['good', 'great', 'excellent', 'happy', 'success', 'complete']
    const negativeWords = ['problem', 'issue', 'urgent', 'failure', 'delay', 'cancel']
    
    const contentLower = content.toLowerCase()
    const positiveCount = positiveWords.filter(word => contentLower.includes(word)).length
    const negativeCount = negativeWords.filter(word => contentLower.includes(word)).length
    
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral'
    if (positiveCount > negativeCount) sentiment = 'positive'
    else if (negativeCount > positiveCount) sentiment = 'negative'

    // Mock keyword extraction
    const keywords = content
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'she', 'use', 'her', 'now', 'air', 'day', 'end', 'why'].includes(word.toLowerCase()))
      .slice(0, 5)

    // Mock insights generation
    const insights = `Content analysis suggests ${sentiment} sentiment. Key themes identified around ${keywords.slice(0, 3).join(', ')}.`

    // Mock task suggestions
    const taskSuggestions = [
      'Follow up on mentioned topics',
      'Schedule related meetings',
      'Prepare necessary documents',
      'Review and respond to requests'
    ].slice(0, 2)

    return {
      keywords,
      sentiment,
      insights,
      taskSuggestions
    }
  }

  // Generate task recommendations based on context
  static async getTaskRecommendations(contextEntries: any[]): Promise<string[]> {
    await new Promise(resolve => setTimeout(resolve, 500))

    const recommendations = [
      'Schedule weekly team meeting',
      'Prepare quarterly report',
      'Follow up on client feedback',
      'Update project documentation',
      'Review and approve budget proposals'
    ]

    return recommendations.slice(0, 3)
  }
}