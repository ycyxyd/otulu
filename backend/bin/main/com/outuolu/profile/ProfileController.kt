package com.outuolu.profile

import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.web.bind.annotation.*

data class UpdateProfileRequest(
    val username: String?,
    val bio: String?
)

@RestController
@RequestMapping("/api/v1/profile")
class ProfileController(
    private val profileService: ProfileService
) {

    @GetMapping("/me")
    fun getMyProfile(@AuthenticationPrincipal jwt: Jwt): UserProfile {
        val userId = jwt.subject // Supabase User ID
        return profileService.getProfile(userId)
    }

    @PutMapping("/me")
    fun updateMyProfile(
        @AuthenticationPrincipal jwt: Jwt,
        @RequestBody request: UpdateProfileRequest
    ): UserProfile {
        val userId = jwt.subject
        return profileService.updateProfile(userId, request.username, request.bio)
    }
}
