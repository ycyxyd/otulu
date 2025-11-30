package com.outuolu.community

import java.time.Instant
import java.util.UUID

enum class PostType {
    ERRAND, // 国际跑腿
    GUIDE_REQUEST, // 找导游
    JOB, // 找工作
    OTHER
}

data class Post(
    val id: String = UUID.randomUUID().toString(),
    val userId: String,
    val type: PostType,
    val title: String,
    val content: String,
    val contactInfo: String,
    val createdAt: Instant = Instant.now()
)

data class CreatePostRequest(
    val userId: String, // In real app, get from Auth Context
    val type: PostType,
    val title: String,
    val content: String,
    val contactInfo: String
)
