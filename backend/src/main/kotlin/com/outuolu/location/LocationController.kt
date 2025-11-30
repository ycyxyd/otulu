package com.outuolu.location

import org.springframework.web.bind.annotation.*

data class POI(
    val id: String,
    val name: String,
    val type: String, // PARKING, TOILET, RESTAURANT, BAR, ADULT, OTHER
    val distance: String,
    val details: String, // e.g., "Fee: 0.50€"
    val lat: Double,
    val lng: Double
)

@RestController
@RequestMapping("/api/v1/location")
class LocationController {

    @GetMapping("/nearby")
    fun getNearbyPOIs(
        @RequestParam lat: Double,
        @RequestParam lng: Double,
        @RequestParam(required = false) query: String?
    ): List<POI> {
        // In a real app, this would query PostGIS or Google Places API
        // For MVP, we return mock data based on the query or default categories
        
        val mockPOIs = listOf(
            POI("1", "Central Parking", "PARKING", "150m", "2.00€/hr", lat + 0.001, lng + 0.001),
            POI("2", "Public Toilet", "TOILET", "300m", "0.50€", lat - 0.001, lng + 0.002),
            POI("3", "Joe's Bar", "BAR", "500m", "Happy Hour 18-20", lat + 0.002, lng - 0.001),
            POI("4", "Tasty Burger", "RESTAURANT", "100m", "4.5 Stars", lat + 0.0005, lng + 0.0005),
            POI("5", "Red Light District Info", "ADULT", "1.2km", "Adults Only", lat + 0.01, lng + 0.01)
        )

        return if (query.isNullOrBlank()) {
            mockPOIs
        } else {
            mockPOIs.filter { it.name.contains(query, ignoreCase = true) || it.type.contains(query, ignoreCase = true) }
        }
    }
}
