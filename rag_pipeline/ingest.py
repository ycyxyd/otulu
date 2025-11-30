import os
import glob
from dotenv import load_dotenv
from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from supabase import create_client, Client

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: SUPABASE_URL and SUPABASE_KEY must be set in .env")
    exit(1)

# Initialize Supabase Client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def ingest_documents():
    print("🚀 Starting RAG Ingestion Pipeline...")

    # 1. Load Documents
    documents = []
    for file_path in glob.glob("./data/*.txt"):
        print(f"Loading {file_path}...")
        loader = TextLoader(file_path, encoding='utf-8')
        documents.extend(loader.load())

    if not documents:
        print("No documents found in ./data/")
        return

    # 2. Split Text
    print("✂️ Splitting documents...")
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )
    chunks = text_splitter.split_documents(documents)
    print(f"Generated {len(chunks)} chunks.")

    # 3. Generate Embeddings (Local Model)
    print("🧠 Generating embeddings (all-MiniLM-L6-v2)...")
    embeddings_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    
    # Process in batches to avoid memory issues
    batch_size = 100
    for i in range(0, len(chunks), batch_size):
        batch = chunks[i:i+batch_size]
        texts = [doc.page_content for doc in batch]
        metadatas = [doc.metadata for doc in batch]
        
        # Generate vectors
        vectors = embeddings_model.embed_documents(texts)
        
        # Prepare data for Supabase
        rows = []
        for j, vector in enumerate(vectors):
            rows.append({
                "content": texts[j],
                "metadata": metadatas[j],
                "embedding": vector
            })
        
        # 4. Store in Supabase
        print(f"💾 Saving batch {i//batch_size + 1} to Supabase...")
        data, count = supabase.table("documents").insert(rows).execute()
        
    print("✅ Ingestion Complete!")

if __name__ == "__main__":
    ingest_documents()
