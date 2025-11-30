-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Entities Table (Nodes)
CREATE TABLE IF NOT EXISTS entities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- e.g., 'CITY', 'SPOT', 'FOOD'
    description TEXT,
    metadata JSONB,
    UNIQUE(name, type)
);

-- Relationships Table (Edges)
CREATE TABLE IF NOT EXISTS relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID REFERENCES entities(id),
    target_id UUID REFERENCES entities(id),
    relation_type TEXT NOT NULL, -- e.g., 'LOCATED_IN', 'NEAR', 'SERVES'
    weight FLOAT DEFAULT 1.0,
    UNIQUE(source_id, target_id, relation_type)
);

-- Index for faster traversal
CREATE INDEX IF NOT EXISTS idx_relationships_source ON relationships(source_id);
CREATE INDEX IF NOT EXISTS idx_relationships_target ON relationships(target_id);
