package com.outuolu.ai

import org.springframework.web.bind.annotation.*

data class SuggestionRequest(
    val lat: Double,
    val lng: Double,
    val localTime: String,
    val userPrompt: String?
)

data class SuggestionResponse(
    val suggestion: String,
    val actions: List<String> // e.g., ["Create Route", "Book Hotel"]
)

@RestController
@RequestMapping("/api/v1/ai")
class AIController(
    private val graphService: GraphService
) {

    @PostMapping("/suggest")
    fun suggestItinerary(@RequestBody request: SuggestionRequest): SuggestionResponse {
        // Phase 1: Connect to Ollama/RAG here.
        // For Phase 0 MVP, we simulate the AI logic described by the user.
        
        val prompt = request.userPrompt ?: "General advice"
        val time = request.localTime
        
        // Graph RAG Enhancement
        // Extract keywords from prompt (Simple split for MVP)
        val keywords = prompt.split(" ").filter { it.length > 3 }
        val graphContext = keywords.flatMap { graphService.findRelatedEntities(it) }
        
        val contextString = if (graphContext.isNotEmpty()) {
            "Knowledge Graph Context:\n" + graphContext.joinToString("\n") { "${it.source} --[${it.relation}]--> ${it.target}" }
        } else {
            "No specific graph context found."
        }
        
        val aiMessage = """
            Based on your location and time ($time), here is my suggestion:
            
            It's getting late. How about a nice dinner at 'Tasty Burger' nearby (100m), followed by a drink at 'Joe's Bar'?
            
            If you are planning for tomorrow, I recommend visiting the 'Central Museum' which opens at 9 AM.
            
            User Prompt Context: $prompt
            
            $contextString
        """.trimIndent()

        return SuggestionResponse(
            suggestion = aiMessage,
            actions = listOf("Navigate to Tasty Burger", "Plan Tomorrow")
        )
    }
}
