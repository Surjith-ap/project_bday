/**
 * Supabase authentication service.
 * Handles user authentication and session management.
 */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Sign in with email and password
 */
export const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) throw error
    return data
}

/**
 * Sign up with email and password
 */
export const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    })

    if (error) throw error
    return data
}

/**
 * Sign out current user
 */
export const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
}

/**
 * Get current session
 */
export const getSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
}

/**
 * Get current user
 */
export const getCurrentUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
}

/**
 * Listen to auth state changes
 */
export const onAuthStateChange = (callback) => {
    return supabase.auth.onAuthStateChange(callback)
}
