package com.outuolu.community

import org.springframework.stereotype.Service
import java.time.Instant
import java.time.ZoneId
import java.util.concurrent.ConcurrentHashMap

@Service
class PostService {
    // In-memory storage for MVP. Replace with Supabase/Database later.
    private val posts = ConcurrentHashMap<String, Post>()
    
    // Mock User Membership (Default to FREE)
    // In real app, fetch from User Service
    private fun isPlusMember(userId: String): Boolean {
        return userId.startsWith("plus_")
    }

    fun getAllPosts(): List<Post> {
        return posts.values.sortedByDescending { it.createdAt }
    }

    fun createPost(request: CreatePostRequest): Post {
        // 1. Rate Limiting Check
        if (!isPlusMember(request.userId)) {
            checkRateLimit(request.userId)
        }

        // 2. Create Post
        val post = Post(
            userId = request.userId,
            type = request.type,
            title = request.title,
            content = request.content,
            contactInfo = request.contactInfo
        )
        
        posts[post.id] = post
        return post
    }

    private fun checkRateLimit(userId: String) {
        val now = Instant.now()
        val currentMonth = now.atZone(ZoneId.systemDefault()).month
        
        val userPostsThisMonth = posts.values.count { 
            it.userId == userId && 
            it.createdAt.atZone(ZoneId.systemDefault()).month == currentMonth 
        }

        if (userPostsThisMonth >= 3) {
            throw RateLimitExceededException("Free members are limited to 3 posts per month. Please upgrade to PLUS.")
        }
    }
}

class RateLimitExceededException(message: String) : RuntimeException(message)
