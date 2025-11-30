package com.outuolu.content

import com.outuolu.notification.NotificationPayload
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/content")
class ContentController(
    private val rssService: RssService
) {

    // Mock persistence for Phase 0/1 transition
    // In real app, fetch from DB
    private val newsCache = mutableListOf<NotificationPayload>()

    @PostMapping("/trigger-rss")
    fun triggerRss() {
        rssService.triggerNow()
    }

    @GetMapping("/news")
    fun getNews(): List<NotificationPayload> {
        // Return mock data mixed with real if available, or just empty list if no persistence yet.
        // For MVP demo, let's return a static list + whatever is in memory if we implemented persistence.
        return listOf(
            NotificationPayload(
                notificationId = "1",
                type = "NEWS",
                title = "BBC: Europe Heatwave",
                summary = "Temperatures soar across the continent...",
                targetUrl = "https://bbc.com/news/...",
                timestamp = System.currentTimeMillis()
            ),
            NotificationPayload(
                notificationId = "2",
                type = "ROUTE",
                title = "Best Rail Routes 2024",
                summary = "Discover the scenic train rides...",
                targetUrl = "https://lonelyplanet.com/...",
                timestamp = System.currentTimeMillis() - 86400000
            )
        )
    }
}
