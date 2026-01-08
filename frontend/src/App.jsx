/**
 * Main App component.
 * Handles routing and authentication state.
 */
import React from 'react'
import { useAuth } from './hooks/useAuth'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'

function App() {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500"></div>
            </div>
        )
    }

    return user ? <Dashboard user={user} /> : <Login />
}

export default App
