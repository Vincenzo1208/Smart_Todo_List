import React, { useState } from 'react'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Tasks } from './pages/Tasks'
import { Context } from './pages/Context'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'tasks':
        return <Tasks />
      case 'context':
        return <Context />
      default:
        return <Dashboard />
    }
  }

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  )
}

export default App