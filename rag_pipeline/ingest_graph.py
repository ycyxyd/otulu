import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

# Connect to Supabase Postgres
conn = psycopg2.connect(os.getenv("SUPABASE_DB_URL")) # Use direct connection string
cur = conn.cursor()

def get_or_create_entity(name, type, description=""):
    cur.execute(
        """
        INSERT INTO entities (name, type, description)
        VALUES (%s, %s, %s)
        ON CONFLICT (name, type) DO UPDATE SET description = EXCLUDED.description
        RETURNING id;
        """,
        (name, type, description)
    )
    return cur.fetchone()[0]

def create_relationship(source_id, target_id, relation_type):
    cur.execute(
        """
        INSERT INTO relationships (source_id, target_id, relation_type)
        VALUES (%s, %s, %s)
        ON CONFLICT (source_id, target_id, relation_type) DO NOTHING;
        """,
        (source_id, target_id, relation_type)
    )

def ingest_graph_data():
    print("Ingesting Graph Data...")
    
    # Mock Data Extraction (In prod, use LLM to extract from text)
    # Paris Context
    paris_id = get_or_create_entity("Paris", "CITY", "The capital of France.")
    eiffel_id = get_or_create_entity("Eiffel Tower", "SPOT", "Famous iron tower on the Champ de Mars.")
    seine_id = get_or_create_entity("Seine River", "SPOT", "Major river flowing through Paris.")
    croissant_id = get_or_create_entity("Croissant", "FOOD", "Buttery pastry.")
    
    # Relationships
    create_relationship(eiffel_id, paris_id, "LOCATED_IN")
    create_relationship(seine_id, paris_id, "FLOWS_THROUGH")
    create_relationship(eiffel_id, seine_id, "NEAR")
    create_relationship(croissant_id, paris_id, "POPULAR_IN")
    
    conn.commit()
    print("Graph Data Ingested Successfully!")

if __name__ == "__main__":
    ingest_graph_data()
    cur.close()
    conn.close()
