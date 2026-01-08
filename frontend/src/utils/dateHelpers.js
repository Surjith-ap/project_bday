/**
 * Date helper utilities.
 * Provides functions for date formatting and validation.
 */

/**
 * Format date to YYYY-MM-DD
 */
export const formatDateToISO = (date) => {
    if (!date) return ''
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

/**
 * Format date to readable string (e.g., "Jan 15, 2026")
 */
export const formatDateToReadable = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })
}

/**
 * Get days until text (e.g., "Today!", "Tomorrow", "in 5 days")
 */
export const getDaysUntilText = (days) => {
    if (days === 0) return 'Today! 🎉'
    if (days === 1) return 'Tomorrow'
    if (days === 2) return 'In 2 days'
    return `In ${days} days`
}

/**
 * Validate date format (YYYY-MM-DD)
 */
export const isValidDateFormat = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/
    if (!regex.test(dateString)) return false

    const date = new Date(dateString)
    return date instanceof Date && !isNaN(date)
}

/**
 * Check if date is in the past
 */
export const isPastDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
}

/**
 * Check if date is in the future
 */
export const isFutureDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date > today
}
