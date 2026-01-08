/**
 * Custom React hook for authentication state.
 */
import { useState, useEffect } from 'react'
import { getCurrentUser, onAuthStateChange } from '../services/auth'

export const useAuth = () => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Get initial user
        getCurrentUser()
            .then((user) => {
                setUser(user)
                setLoading(false)
            })
            .catch(() => {
                setUser(null)
                setLoading(false)
            })

        // Listen to auth changes
        const { data: { subscription } } = onAuthStateChange((event, session) => {
            setUser(session?.user || null)
            setLoading(false)
        })

        return () => {
            subscription?.unsubscribe()
        }
    }, [])

    return { user, loading }
}
