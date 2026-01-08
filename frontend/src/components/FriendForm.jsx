/**
 * FriendForm component.
 * Form for adding or editing a friend with validation.
 */
import React, { useState, useEffect } from 'react'
import { validateFriendForm } from '../utils/validators'

export const FriendForm = ({ friend, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        date_of_birth: '',
        notes: '',
    })
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Pre-fill form if editing
    useEffect(() => {
        if (friend) {
            setFormData({
                name: friend.name || '',
                date_of_birth: friend.date_of_birth || '',
                notes: friend.notes || '',
            })
        }
    }, [friend])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validate form
        const validation = validateFriendForm(formData)
        if (!validation.isValid) {
            setErrors(validation.errors)
            return
        }

        setIsSubmitting(true)
        try {
            await onSubmit(formData)
            // Reset form
            setFormData({ name: '', date_of_birth: '', notes: '' })
            setErrors({})
        } catch (error) {
            setErrors({ submit: error.message })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name field */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Name *
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`input-field ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Enter friend's name"
                />
                {errors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                )}
            </div>

            {/* Date of birth field */}
            <div>
                <label htmlFor="date_of_birth" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Date of Birth * (YYYY-MM-DD)
                </label>
                <input
                    type="date"
                    id="date_of_birth"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    className={`input-field ${errors.date_of_birth ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                {errors.date_of_birth && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.date_of_birth}</p>
                )}
            </div>

            {/* Notes field */}
            <div>
                <label htmlFor="notes" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Notes (Optional)
                </label>
                <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    className={`input-field resize-none ${errors.notes ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="e.g., College friend, loves tech gadgets"
                />
                {errors.notes && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.notes}</p>
                )}
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {formData.notes.length}/5000 characters
                </p>
            </div>

            {/* Submit error */}
            {errors.submit && (
                <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
                </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Saving...' : friend ? 'Update Friend' : 'Add Friend'}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn-secondary"
                >
                    Cancel
                </button>
            </div>
        </form>
    )
}
