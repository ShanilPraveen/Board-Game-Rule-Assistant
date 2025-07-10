from sentence_transformers import SentenceTransformer
from vectorstores.qdrant_store import create_qdrant_client
from qdrant_client.models import Filter, FieldCondition, MatchValue
from typing import List, Dict, Any
import numpy as np

def search_qdrant_for_chunks(
        query_vector: List[float],
        collection_name: str,
        top_k: int = 5,
)->List[Dict]:
    """
    Search for the top-k chunks in Qdrant based on the query vector.
    
    Args:
        query_vector (List[float]): The vector representation of the query.
        collection_name (str): The name of the Qdrant collection to search.
        top_k (int): The number of top results to return.
        
    Returns:
        List[Dict[str, Any]]: A list of dictionaries containing the chunk data and metadata.
    """
    qdrant_client = create_qdrant_client()
    search_result = qdrant_client.search(
        collection_name=collection_name,
        query_vector=query_vector,
        limit=top_k,
        with_payload=True,

    )
    
    return [hit.payload for hit in search_result]

def answer_question(
        query:str,
        collection_name:str,
        top_k:int = 5,
)->List[Dict]:
    """
    Answer a question by searching for relevant chunks in Qdrant.
    
    Args:
        query (str): The question to answer.
        collection_name (str): The name of the Qdrant collection to search.
        top_k (int): The number of top results to return.
        
    Returns:
        List[Dict[str, Any]]: A list of dictionaries containing the chunk data and metadata.
    """
    model = SentenceTransformer('all-MiniLM-L6-v2')
    query_vector = model.encode(query,convert_to_numpy=True).tolist()
    retrieved_chunks = search_qdrant_for_chunks(query_vector, collection_name, top_k)
    
    return retrieved_chunks