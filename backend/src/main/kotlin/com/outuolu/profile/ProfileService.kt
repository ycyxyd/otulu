package com.outuolu.profile

import org.springframework.stereotype.Service
import java.util.UUID

data class UserProfile(
    val id: UUID,
    val username: String?,
    val bio: String?,
    val avatarUrl: String?,
    val membershipTier: String
)

@Service
class ProfileService {

    // In a real app, this would use Supabase Postgrest Client to fetch from 'profiles' table
    // For MVP, we will mock the persistence or just return echo data
    
    fun getProfile(userId: String): UserProfile {
        // Mock fetch
        return UserProfile(
            id = UUID.fromString(userId),
            username = "user_${userId.substring(0, 8)}",
            bio = "I love traveling!",
            avatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=$userId",
            membershipTier = "FREE"
        )
    }

    fun updateProfile(userId: String, username: String?, bio: String?): UserProfile {
        // Mock update
        return UserProfile(
            id = UUID.fromString(userId),
            username = username ?: "user_${userId.substring(0, 8)}",
            bio = bio ?: "Updated bio",
            avatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=$userId",
            membershipTier = "FREE"
        )
    }
}
