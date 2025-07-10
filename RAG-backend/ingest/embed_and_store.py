from vectorstores.qdrant_store import create_qdrant_client
from sentence_transformers import SentenceTransformer
from typing import Any, Dict,List
from langchain_core.documents import Document
import uuid
from qdrant_client.models import PointStruct,VectorParams, Distance

def generate_embeddings(documents:list[Document]) -> list[list[float]]:
    """
    Generate embeddings for a list of texts using a specified SentenceTransformer model.
    
    """
    embedmodel = SentenceTransformer('all-MiniLM-L6-v2')
    texts = [doc.page_content for doc in documents]
    embeddings = embedmodel.encode(texts, show_progress_bar=True,convert_to_numpy=True).tolist()
    return embeddings

def build_points(documents: list[Document], embeddings: list[list[float]]) -> list[PointStruct]:
    """
    Build a list of PointStruct objects from documents and their corresponding embeddings.
    
    """
    points = []

    for i, (doc, embedding) in enumerate(zip(documents, embeddings)):
        point = PointStruct(
            id=str(uuid.uuid4()),
            vector=embedding,
            payload={
                "text": doc.page_content,
                **doc.metadata
            }
        )
        points.append(point)
    return points
    
def store_in_qdrant(documents:List[Document],collection_name:str,vector_dim:int=384):
    """
    Store documents in Qdrant vector database.
    
    Args:
        documents (List[Document]): List of LangChain Document objects to store.
        collection_name (str): Name of the Qdrant collection to store the documents in.
        vector_dim (int): Dimension of the embedding vectors.
        
    Returns:
        None
    """
    # Generate embeddings for the documents
    embeddings = generate_embeddings(documents)
    
    # Build points for Qdrant
    points = build_points(documents, embeddings)
    
    # Create Qdrant client
    qdrant_client = create_qdrant_client()
    
    # Create collection if it doesn't exist
    qdrant_client.recreate_collection(
        collection_name=collection_name,
        vectors_config=VectorParams(size=vector_dim, distance=Distance.COSINE)
    )
    
    # Upload points to Qdrant
    qdrant_client.upsert(
        collection_name=collection_name,
        points=points
    )
    
    print(f"Stored {len(points)} documents in Qdrant collection '{collection_name}'.")

def delete_collection(collection_name: str):
    """
    Delete a collection from Qdrant.
    
    Args:
        collection_name (str): Name of the Qdrant collection to delete.
        
    Returns:
        None
    """
    qdrant_client = create_qdrant_client()
    
    # Delete the collection
    qdrant_client.delete_collection(collection_name=collection_name)
    
    print(f"Deleted Qdrant collection '{collection_name}'.")