/**
 * Login page component.
 * Handles user authentication.
 */
import React, { useState } from 'react'
import { signIn, signUp } from '../services/auth'

export const Login = () => {
    const [isSignUp, setIsSignUp] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setMessage(null)
        setLoading(true)

        try {
            if (isSignUp) {
                await signUp(email, password)
                setMessage('Account created! Please check your email to verify your account.')
                setEmail('')
                setPassword('')
            } else {
                await signIn(email, password)
                // Auth state change will trigger redirect
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass-card max-w-md w-full p-8 animate-slide-up">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">🎂</div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-2">
                        Birthday Reminder
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Never forget a friend's birthday again
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="input-field"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength="6"
                            className="input-field"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    {message && (
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg">
                            <p className="text-sm text-green-600 dark:text-green-400">{message}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
                    </button>
                </form>

                {/* Toggle sign up/sign in */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => {
                            setIsSignUp(!isSignUp)
                            setError(null)
                            setMessage(null)
                        }}
                        className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                    >
                        {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                    </button>
                </div>
            </div>
        </div>
    )
}
