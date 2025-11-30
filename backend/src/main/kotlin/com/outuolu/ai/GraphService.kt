package com.outuolu.ai

import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Service
import java.util.UUID

data class GraphEntity(
    val id: UUID,
    val name: String,
    val type: String,
    val description: String?
)

data class GraphRelation(
    val source: String,
    val target: String,
    val relation: String
)

@Service
class GraphService(
    private val jdbcTemplate: JdbcTemplate
) {

    fun findRelatedEntities(keyword: String): List<GraphRelation> {
        // Simple 1-hop traversal: Find entities directly connected to the keyword
        val sql = """
            SELECT e1.name as source, e2.name as target, r.relation_type
            FROM entities e1
            JOIN relationships r ON e1.id = r.source_id
            JOIN entities e2 ON r.target_id = e2.id
            WHERE e1.name ILIKE ?
            UNION
            SELECT e1.name as source, e2.name as target, r.relation_type
            FROM entities e2
            JOIN relationships r ON e2.id = r.target_id
            JOIN entities e1 ON r.source_id = e1.id
            WHERE e2.name ILIKE ?
        """.trimIndent()

        val query = "%$keyword%"
        
        return jdbcTemplate.query(sql, { rs, _ ->
            GraphRelation(
                source = rs.getString("source"),
                target = rs.getString("target"),
                relation = rs.getString("relation_type")
            )
        }, query, query)
    }
}
