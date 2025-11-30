import { useState, useEffect } from 'react'
import { Plus, AlertCircle } from 'lucide-react'

function Community() {
    const [posts, setPosts] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [error, setError] = useState(null)

    // Form State
    const [formData, setFormData] = useState({
        userId: 'user_123', // Mock User ID
        type: 'ERRAND',
        title: '',
        content: '',
        contactInfo: ''
    })

    useEffect(() => {
        fetchPosts()
    }, [])

    const fetchPosts = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/v1/community/posts')
            const data = await res.json()
            setPosts(data)
        } catch (err) {
            console.error("Failed to fetch posts", err)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        try {
            const res = await fetch('http://localhost:8080/api/v1/community/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Failed to create post')
            }

            setShowModal(false)
            fetchPosts()
            // Reset form
            setFormData({ ...formData, title: '', content: '', contactInfo: '' })

        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Community Board</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                    <Plus size={20} />
                    Create Post
                </button>
            </div>

            {/* Post Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map(post => (
                    <div key={post.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-md mb-3">
                            {post.type}
                        </span>
                        <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
                        <div className="text-sm text-gray-500 border-t pt-4">
                            Contact: {post.contactInfo}
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Post Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h2 className="text-2xl font-bold mb-4">New Post</h2>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 flex items-center gap-2">
                                <AlertCircle size={18} />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Type</label>
                                <select
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="ERRAND">International Errand</option>
                                    <option value="GUIDE_REQUEST">Find a Guide</option>
                                    <option value="JOB">Job / Hiring</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Content</label>
                                <textarea
                                    required
                                    rows="4"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Contact Info</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="WeChat ID / Email"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                                    value={formData.contactInfo}
                                    onChange={e => setFormData({ ...formData, contactInfo: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Post
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Community
