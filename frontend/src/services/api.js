/**
 * API client for backend communication.
 * Handles all HTTP requests to the Flask backend.
 */
import axios from 'axios'
import { supabase } from './auth'

const API_URL = import.meta.env.VITE_API_URL

// Create axios instance
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    async (config) => {
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.access_token) {
            config.headers.Authorization = `Bearer ${session.access_token}`
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Server responded with error
            const message = error.response.data?.message || error.response.statusText
            throw new Error(message)
        } else if (error.request) {
            // Request made but no response
            throw new Error('No response from server. Please check your connection.')
        } else {
            // Something else happened
            throw new Error(error.message)
        }
    }
)

// API methods

/**
 * Get all friends
 */
export const getFriends = async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.upcoming) params.append('upcoming', 'true')
    if (filters.reminders) params.append('reminders', 'true')

    const response = await apiClient.get(`/friends?${params.toString()}`)
    return response.data
}

/**
 * Get single friend by ID
 */
export const getFriend = async (friendId) => {
    const response = await apiClient.get(`/friends/${friendId}`)
    return response.data
}

/**
 * Create new friend
 */
export const createFriend = async (friendData) => {
    const response = await apiClient.post('/friends', friendData)
    return response.data
}

/**
 * Update friend
 */
export const updateFriend = async (friendId, friendData) => {
    const response = await apiClient.put(`/friends/${friendId}`, friendData)
    return response.data
}

/**
 * Delete friend
 */
export const deleteFriend = async (friendId) => {
    await apiClient.delete(`/friends/${friendId}`)
}

/**
 * Get AI suggestions for friend
 */
export const getSuggestions = async (friendId, suggestionType) => {
    const response = await apiClient.post(`/friends/${friendId}/suggestions`, {
        suggestion_type: suggestionType,
    })
    return response.data
}

export default apiClient
