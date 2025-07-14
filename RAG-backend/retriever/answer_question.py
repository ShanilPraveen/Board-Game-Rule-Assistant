from sentence_transformers import SentenceTransformer
from vectorstores.qdrant_store import create_qdrant_client
from qdrant_client.models import Filter, FieldCondition, MatchValue
from typing import List, Dict, Any
from llm.call_LLM import call_gemini
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

def format_rag_prompt(chunks:List[Dict],user_query:str)->str:
    """
    Format the retrieved chunks and user query into a prompt for RAG.
    
    Args:
        chunks (List[Dict]): The list of retrieved chunks.
        user_query (str): The user's question.
        
    Returns:
        str: The formatted prompt string.
    """
    context = "\n\n---\n\n".join(
        f"[Source: {chunk.get('source', 'unknown')} | Page: {chunk.get('page', '?')}]\n{chunk['text']}"
        for chunk in chunks
    )

    prompt = f"""You are a helpful board game rules assistant.

    Answer the question based ONLY on the context provided below. 
    If the answer is not in the context, say "I don't know based on the provided rulebook."

    Context:
    {context}

    ---

    Question: {user_query}
    Answer:"""

    return prompt

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
    #print(retrieved_chunks)
    prompt = format_rag_prompt(retrieved_chunks, query)
    #print(prompt)
    answer = call_gemini(prompt)
    return {
        "answer": answer,
        "sources": [
            {
                "page": c.get("page"),
                "source": c.get("source"),
                "text": c.get("text")
            }
            for c in retrieved_chunks
        ]
    }