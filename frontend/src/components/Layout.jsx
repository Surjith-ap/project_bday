/**
 * Layout component.
 * Provides the main application layout with header and navigation.
 */
import React from 'react'
import { signOut } from '../services/auth'

export const Layout = ({ children, user }) => {
    const handleSignOut = async () => {
        try {
            await signOut()
            window.location.reload()
        } catch (error) {
            console.error('Sign out error:', error)
        }
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="glass-card sticky top-0 z-40 mb-8">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="text-4xl">🎂</div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                                    Birthday Reminder
                                </h1>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Never forget a friend's birthday again
                                </p>
                            </div>
                        </div>

                        {user && (
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                    {user.email}
                                </span>
                                <button
                                    onClick={handleSignOut}
                                    className="btn-secondary text-sm"
                                >
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="container mx-auto px-4 pb-12">
                {children}
            </main>

            {/* Footer */}
            <footer className="mt-12 py-6 text-center text-sm text-slate-600 dark:text-slate-400">
                <p>Made with ❤️ using React, Flask, Supabase & Gemini AI</p>
            </footer>
        </div>
    )
}
