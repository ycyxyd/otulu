import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState(null)
    const [bio, setBio] = useState(null)
    const [avatarUrl, setAvatarUrl] = useState(null)
    const [session, setSession] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            if (session) getProfile(session)
            else navigate('/login')
        })
    }, [navigate])

    const getProfile = async (session) => {
        try {
            setLoading(true)
            const { user } = session

            // In a real app with the trigger set up, we fetch from 'profiles'
            // For MVP without the trigger running locally, we might get null, so handle gracefully
            let { data, error, status } = await supabase
                .from('profiles')
                .select(`username, bio, avatar_url`)
                .eq('id', user.id)
                .single()

            if (error && status !== 406) {
                throw error
            }

            if (data) {
                setUsername(data.username)
                setBio(data.bio)
                setAvatarUrl(data.avatar_url)
            }
        } catch (error) {
            console.warn('Error loading user data!', error.message)
        } finally {
            setLoading(false)
        }
    }

    const updateProfile = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)
            const { user } = session

            const updates = {
                id: user.id,
                username,
                bio,
                updated_at: new Date(),
            }

            let { error } = await supabase.from('profiles').upsert(updates)

            if (error) {
                throw error
            }
            alert('Profile updated!')
        } catch (error) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
                <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <form onSubmit={updateProfile} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="text"
                                value={session?.user.email}
                                disabled
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <input
                                type="text"
                                value={username || ''}
                                onChange={(e) => setUsername(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Bio</label>
                            <textarea
                                value={bio || ''}
                                onChange={(e) => setBio(e.target.value)}
                                rows={4}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Update Profile'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}
