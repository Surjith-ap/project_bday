/**
 * Dashboard page component.
 * Main application page for managing friends.
 */
import React, { useState } from 'react'
import { Layout } from '../components/Layout'
import { FriendList } from '../components/FriendList'
import { FriendForm } from '../components/FriendForm'
import { AISuggestions } from '../components/AISuggestions'
import { useFriends } from '../hooks/useFriends'

export const Dashboard = ({ user }) => {
    const [showForm, setShowForm] = useState(false)
    const [editingFriend, setEditingFriend] = useState(null)
    const [showSuggestions, setShowSuggestions] = useState(null)
    const [filter, setFilter] = useState('all')

    // Get friends with filters
    const filters = {
        upcoming: filter === 'upcoming',
        reminders: filter === 'reminders',
    }
    const { friends, loading, error, refetch, addFriend, editFriend, removeFriend } = useFriends(filters)

    const handleAddFriend = async (friendData) => {
        await addFriend(friendData)
        setShowForm(false)
    }

    const handleEditFriend = async (friendData) => {
        await editFriend(editingFriend.id, friendData)
        setEditingFriend(null)
        setShowForm(false)
    }

    const handleDeleteFriend = async (friendId) => {
        if (window.confirm('Are you sure you want to delete this friend?')) {
            await removeFriend(friendId)
        }
    }

    const handleEdit = (friend) => {
        setEditingFriend(friend)
        setShowForm(true)
    }

    const handleCancelForm = () => {
        setShowForm(false)
        setEditingFriend(null)
    }

    // Count reminders
    const reminderCount = friends.filter((f) => f.is_reminder_due).length

    return (
        <Layout user={user}>
            {/* Header with actions */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
                        My Friends
                    </h2>
                    {reminderCount > 0 && (
                        <p className="text-red-600 dark:text-red-400 font-medium">
                            🔔 {reminderCount} birthday{reminderCount > 1 ? 's' : ''} coming up in 2 days or less!
                        </p>
                    )}
                </div>

                <button
                    onClick={() => setShowForm(true)}
                    className="btn-primary"
                >
                    + Add Friend
                </button>
            </div>

            {/* Filter buttons */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${filter === 'all'
                            ? 'bg-primary-500 text-white shadow-lg'
                            : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600'
                        }`}
                >
                    All Friends
                </button>
                <button
                    onClick={() => setFilter('reminders')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${filter === 'reminders'
                            ? 'bg-red-500 text-white shadow-lg'
                            : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600'
                        }`}
                >
                    🔔 Reminders
                </button>
                <button
                    onClick={() => setFilter('upcoming')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${filter === 'upcoming'
                            ? 'bg-amber-500 text-white shadow-lg'
                            : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600'
                        }`}
                >
                    📅 Upcoming (30 days)
                </button>
            </div>

            {/* Friend list */}
            <FriendList
                friends={friends}
                loading={loading}
                error={error}
                onEdit={handleEdit}
                onDelete={handleDeleteFriend}
                onViewSuggestions={setShowSuggestions}
            />

            {/* Add/Edit form modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="glass-card max-w-md w-full p-6">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
                            {editingFriend ? 'Edit Friend' : 'Add New Friend'}
                        </h2>
                        <FriendForm
                            friend={editingFriend}
                            onSubmit={editingFriend ? handleEditFriend : handleAddFriend}
                            onCancel={handleCancelForm}
                        />
                    </div>
                </div>
            )}

            {/* AI Suggestions modal */}
            {showSuggestions && (
                <AISuggestions
                    friend={showSuggestions}
                    onClose={() => setShowSuggestions(null)}
                />
            )}
        </Layout>
    )
}
