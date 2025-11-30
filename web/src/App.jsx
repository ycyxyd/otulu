import { useState, useEffect } from 'react'
import { Bell, MapPin, Coffee } from 'lucide-react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Community from './pages/Community'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import { supabase } from './lib/supabase'

// Home Component
function Home() {
    return (
        <>
            {/* Hero Section */}
            <div className="relative bg-blue-600 text-white py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">Discover Europe, Your Way</h1>
                    <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        AI-driven itineraries, local secrets, and a community of travelers.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition">
                            Plan My Trip
                        </button>
                        <Link to="/community" className="bg-blue-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-800 transition">
                            Join Community
                        </Link>
                    </div>
                </div>
            </div>

            {/* News Feed */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Coffee className="text-blue-600" />
                    Latest News & Routes
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
                        <div className="h-48 bg-gray-200"></div>
                        <div className="p-6">
                            <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">Route</span>
                            <h3 className="mt-2 text-xl font-bold">Hidden Gems of Provence</h3>
                            <p className="mt-2 text-gray-600 text-sm">Explore the lavender fields and ancient villages...</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
                        <div className="h-48 bg-gray-200"></div>
                        <div className="p-6">
                            <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">News</span>
                            <h3 className="mt-2 text-xl font-bold">Paris Olympics Update</h3>
                            <p className="mt-2 text-gray-600 text-sm">New transport regulations for tourists during the games...</p>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

function App() {
    const [session, setSession] = useState(null)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

        return () => subscription.unsubscribe()
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
    }

    return (
        <Router>
            <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
                {/* Header */}
                <header className="bg-white shadow-sm sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-8">
                            <Link to="/" className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-blue-600">OuTuoLu</span>
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">MVP</span>
                            </Link>
                            <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
                                <Link to="/" className="hover:text-blue-600">Home</Link>
                                <Link to="/community" className="hover:text-blue-600">Community</Link>
                                <a href="#" className="hover:text-blue-600">AI Planner</a>
                            </nav>
                        </div>
                        <div className="flex items-center gap-4">
                            {session ? (
                                <div className="flex items-center gap-4">
                                    <Link to="/profile" className="text-sm text-gray-600 hover:text-blue-600">{session.user.email}</Link>
                                    <button onClick={handleLogout} className="text-sm text-red-600 hover:text-red-800">Logout</button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600">Login</Link>
                                    <Link to="/register" className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Sign Up</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile" element={<Profile />} />
                </Routes>
            </div>
        </Router>
    )
}

export default App
