package com.outuolu.notification

import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/v1/system")
class NotificationController(
    private val notificationService: NotificationService
) {

    @PostMapping("/publish-notification")
    fun publishNotification(@RequestBody request: NotificationRequest) {
        val payload = NotificationPayload(
            notificationId = UUID.randomUUID().toString(),
            type = request.type,
            title = request.title,
            summary = request.summary,
            targetUrl = request.targetUrl,
            timestamp = System.currentTimeMillis()
        )
        notificationService.publish(payload)
    }
}

data class NotificationRequest(
    val type: String,
    val title: String,
    val summary: String,
    val targetUrl: String
)
