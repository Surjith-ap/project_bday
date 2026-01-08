/**
 * Client-side validation utilities.
 */

/**
 * Validate friend name
 */
export const validateName = (name) => {
    if (!name || !name.trim()) {
        return 'Name is required'
    }
    if (name.length > 255) {
        return 'Name must be 255 characters or less'
    }
    return null
}

/**
 * Validate date of birth
 */
export const validateDateOfBirth = (dateString) => {
    if (!dateString) {
        return 'Date of birth is required'
    }

    // Check format
    const regex = /^\d{4}-\d{2}-\d{2}$/
    if (!regex.test(dateString)) {
        return 'Date must be in YYYY-MM-DD format'
    }

    // Check if valid date
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
        return 'Invalid date'
    }

    // Check if in the future
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (date > today) {
        return 'Date of birth cannot be in the future'
    }

    // Check if too far in the past
    if (date.getFullYear() < 1900) {
        return 'Date of birth must be after 1900'
    }

    return null
}

/**
 * Validate notes
 */
export const validateNotes = (notes) => {
    if (notes && notes.length > 5000) {
        return 'Notes must be 5000 characters or less'
    }
    return null
}

/**
 * Validate entire friend form
 */
export const validateFriendForm = (formData) => {
    const errors = {}

    const nameError = validateName(formData.name)
    if (nameError) errors.name = nameError

    const dobError = validateDateOfBirth(formData.date_of_birth)
    if (dobError) errors.date_of_birth = dobError

    const notesError = validateNotes(formData.notes)
    if (notesError) errors.notes = notesError

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    }
}
