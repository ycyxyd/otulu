package com.outuolu.community

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/community")
@CrossOrigin(origins = ["*"]) // Allow all for MVP
class PostController(
    private val postService: PostService
) {

    @GetMapping("/posts")
    fun getPosts(): List<Post> {
        return postService.getAllPosts()
    }

    @PostMapping("/posts")
    fun createPost(@RequestBody request: CreatePostRequest): ResponseEntity<Any> {
        return try {
            val post = postService.createPost(request)
            ResponseEntity.ok(post)
        } catch (e: RateLimitExceededException) {
            ResponseEntity.status(HttpStatus.FORBIDDEN).body(mapOf("error" to e.message))
        }
    }
}
