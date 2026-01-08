/**
 * FriendList component.
 * Displays a list of friends with filtering options.
 */
import React from 'react'
import { FriendCard } from './FriendCard'

export const FriendList = ({ friends, loading, error, onEdit, onDelete, onViewSuggestions }) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="glass-card p-6 text-center">
                <p className="text-red-600 dark:text-red-400">Error: {error}</p>
            </div>
        )
    }

    if (friends.length === 0) {
        return (
            <div className="glass-card p-12 text-center">
                <div className="text-6xl mb-4">🎂</div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                    No friends added yet
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                    Click "Add Friend" to get started!
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {friends.map((friend) => (
                <FriendCard
                    key={friend.id}
                    friend={friend}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onViewSuggestions={onViewSuggestions}
                />
            ))}
        </div>
    )
}
