/**
 * Custom React hook for managing friends data.
 */
import { useState, useEffect } from 'react'
import { getFriends, createFriend, updateFriend, deleteFriend } from '../services/api'

export const useFriends = (filters = {}) => {
    const [friends, setFriends] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchFriends = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await getFriends(filters)
            setFriends(data.friends || [])
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchFriends()
    }, [JSON.stringify(filters)])

    const addFriend = async (friendData) => {
        try {
            const newFriend = await createFriend(friendData)
            setFriends((prev) => [...prev, newFriend])
            return newFriend
        } catch (err) {
            throw new Error(err.message)
        }
    }

    const editFriend = async (friendId, friendData) => {
        try {
            const updatedFriend = await updateFriend(friendId, friendData)
            setFriends((prev) =>
                prev.map((f) => (f.id === friendId ? updatedFriend : f))
            )
            return updatedFriend
        } catch (err) {
            throw new Error(err.message)
        }
    }

    const removeFriend = async (friendId) => {
        try {
            await deleteFriend(friendId)
            setFriends((prev) => prev.filter((f) => f.id !== friendId))
        } catch (err) {
            throw new Error(err.message)
        }
    }

    return {
        friends,
        loading,
        error,
        refetch: fetchFriends,
        addFriend,
        editFriend,
        removeFriend,
    }
}
