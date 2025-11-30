package com.outuolu.notification

import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.stereotype.Service
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper

data class NotificationPayload(
    val notificationId: String,
    val type: String,
    val title: String,
    val summary: String,
    val targetUrl: String,
    val timestamp: Long
)

@Service
class NotificationService(
    private val redisTemplate: StringRedisTemplate
) {
    private val objectMapper = jacksonObjectMapper()
    private val TOPIC = "ou_tuo_lu_global_feed"

    fun publish(payload: NotificationPayload) {
        val json = objectMapper.writeValueAsString(payload)
        redisTemplate.convertAndSend(TOPIC, json)
        // TODO: Save to Supabase for persistence
        println("Published notification: ${payload.notificationId}")
    }
}
