/**
 * FriendCard component.
 * Displays a single friend's information with birthday details and actions.
 */
import React from 'react'
import { formatDateToReadable, getDaysUntilText } from '../utils/dateHelpers'

export const FriendCard = ({ friend, onEdit, onDelete, onViewSuggestions }) => {
    const { name, date_of_birth, age, notes, days_until_birthday, is_reminder_due, next_birthday } = friend

    return (
        <div className="glass-card p-6 animate-slide-up hover:shadow-2xl transition-all duration-300">
            {/* Header with name and badges */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-1">
                        {name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Turning {age + 1} on {formatDateToReadable(next_birthday)}
                    </p>
                </div>

                {/* Reminder badge */}
                {is_reminder_due && (
                    <span className="badge-reminder ml-2">
                        {getDaysUntilText(days_until_birthday)}
                    </span>
                )}
                {!is_reminder_due && days_until_birthday <= 30 && (
                    <span className="badge-upcoming ml-2">
                        {getDaysUntilText(days_until_birthday)}
                    </span>
                )}
            </div>

            {/* Birthday info */}
            <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm">
                    <span className="text-slate-600 dark:text-slate-400 w-24">Birthday:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">
                        {formatDateToReadable(date_of_birth)}
                    </span>
                </div>
                <div className="flex items-center text-sm">
                    <span className="text-slate-600 dark:text-slate-400 w-24">Current Age:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">{age} years</span>
                </div>
                {notes && (
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                        <p className="text-sm text-slate-600 dark:text-slate-400 italic">"{notes}"</p>
                    </div>
                )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 mt-4">
                <button
                    onClick={() => onViewSuggestions(friend)}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                    ✨ AI Suggestions
                </button>
                <button
                    onClick={() => onEdit(friend)}
                    className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200"
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(friend.id)}
                    className="bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200"
                >
                    Delete
                </button>
            </div>
        </div>
    )
}
