package com.outuolu.content

import com.outuolu.notification.NotificationPayload
import com.outuolu.notification.NotificationService
import com.rometools.rome.io.SyndFeedInput
import com.rometools.rome.io.XmlReader
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import java.net.URL
import java.util.UUID
import java.util.concurrent.ConcurrentHashMap
import org.slf4j.LoggerFactory

@Service
class RssService(
    private val notificationService: NotificationService
) {
    private val logger = LoggerFactory.getLogger(RssService::class.java)
    
    // BBC News - Europe (Reliable source for European news)
    private val RSS_URL = "http://feeds.bbci.co.uk/news/world/europe/rss.xml"
    
    // In-memory cache to prevent duplicate pushes (In prod, use Redis/DB)
    private val processedGuids = ConcurrentHashMap.newKeySet<String>()

    // Run every day at 8:00 AM
    @Scheduled(cron = "0 0 8 * * ?")
    fun fetchDailyNews() {
        logger.info("Starting daily RSS fetch from $RSS_URL")
        try {
            val feedUrl = URL(RSS_URL)
            val input = SyndFeedInput()
            val feed = input.build(XmlReader(feedUrl))

            feed.entries.forEach { entry ->
                // Use URI or Link as unique ID
                val guid = entry.uri ?: entry.link
                
                if (!processedGuids.contains(guid)) {
                    processedGuids.add(guid)
                    
                    // Publish Notification
                    val payload = NotificationPayload(
                        notificationId = UUID.randomUUID().toString(),
                        type = "NEWS",
                        title = entry.title,
                        summary = entry.description?.value?.take(100) ?: "No description",
                        targetUrl = entry.link,
                        timestamp = System.currentTimeMillis()
                    )
                    
                    notificationService.publish(payload)
                    logger.info("Published new article: ${entry.title}")
                    
                    // TODO: Save to Database for persistence
                }
            }
        } catch (e: Exception) {
            logger.error("Failed to fetch RSS feed", e)
        }
    }
    
    // Manual trigger for testing
    fun triggerNow() {
        fetchDailyNews()
    }
}
