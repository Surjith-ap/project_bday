/**
 * AISuggestions component.
 * Displays AI-powered gift and event suggestions.
 */
import React, { useState } from 'react'
import { getSuggestions } from '../services/api'

export const AISuggestions = ({ friend, onClose }) => {
    const [suggestionType, setSuggestionType] = useState('gifts')
    const [suggestions, setSuggestions] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchSuggestions = async (type) => {
        setLoading(true)
        setError(null)
        try {
            const data = await getSuggestions(friend.id, type)
            setSuggestions(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleTypeChange = (type) => {
        setSuggestionType(type)
        fetchSuggestions(type)
    }

    // Auto-fetch on mount
    React.useEffect(() => {
        fetchSuggestions('gifts')
    }, [])

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-custom">
                {/* Header */}
                <div className="sticky top-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg p-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                            ✨ AI Suggestions for {friend.name}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-2xl"
                        >
                            ×
                        </button>
                    </div>

                    {/* Type selector */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleTypeChange('gifts')}
                            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${suggestionType === 'gifts'
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                }`}
                        >
                            🎁 Gift Ideas
                        </button>
                        <button
                            onClick={() => handleTypeChange('events')}
                            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${suggestionType === 'events'
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                }`}
                        >
                            🎉 Event Ideas
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {loading && (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
                            <p className="text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    {suggestions && !loading && (
                        <div className="space-y-4">
                            {suggestions.suggestions.map((suggestion, index) => (
                                <div
                                    key={index}
                                    className="p-4 bg-gradient-to-br from-white to-slate-50 dark:from-slate-700 dark:to-slate-800 rounded-xl border border-slate-200 dark:border-slate-600 hover:shadow-lg transition-all duration-200"
                                >
                                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                                        {suggestion.title}
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-300 mb-2">
                                        {suggestion.description}
                                    </p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                                        {suggestion.reasoning || suggestion.planning_tips}
                                    </p>
                                    {suggestion.estimated_price_range && (
                                        <div className="mt-2 inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium">
                                            {suggestion.estimated_price_range}
                                        </div>
                                    )}
                                    {suggestion.estimated_budget && (
                                        <div className="mt-2 inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium">
                                            {suggestion.estimated_budget}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
