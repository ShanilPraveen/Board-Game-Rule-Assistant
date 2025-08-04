from vectorstores.qdrant_store import create_qdrant_client
from sentence_transformers import SentenceTransformer
from typing import Any, Dict,List
from langchain_core.documents import Document
import uuid
from qdrant_client.models import PointStruct,VectorParams, Distance
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
>>>>>>> 8b34fe62d8cae1929ab2ef49956a9f1d590b0b9e
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_qdrant import QdrantVectorStore
import os
from dotenv import load_dotenv

load_dotenv()
QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
<<<<<<< HEAD
=======
>>>>>>> 64c0f14d9ee34178ef5a7679b610a56439595244
>>>>>>> 8b34fe62d8cae1929ab2ef49956a9f1d590b0b9e

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
<<<<<<< HEAD
    # embeddings = generate_embeddings(documents)
=======
<<<<<<< HEAD
    # Generate embeddings for the documents
    embeddings = generate_embeddings(documents)
>>>>>>> 8b34fe62d8cae1929ab2ef49956a9f1d590b0b9e
    
    # points = build_points(documents, embeddings)

    # qdrant_client = create_qdrant_client()
    
    # qdrant_client.recreate_collection(
    #     collection_name=collection_name,
    #     vectors_config=VectorParams(size=vector_dim, distance=Distance.COSINE)
    # )
    
    # qdrant_client.upsert(
    #     collection_name=collection_name,
    #     points=points
    # )
    
    embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

    vector_store = QdrantVectorStore.from_documents(
        documents=documents,
        embedding=embedding_model,
        url=QDRANT_URL,
        api_key=QDRANT_API_KEY,
        prefer_grpc=False,
        collection_name=collection_name,
    )

    print(f"Stored {len(documents)} documents in Qdrant collection '{collection_name}'.")

def delete_collection(collection_name: str):
<<<<<<< HEAD

=======
    """
    Delete a collection from Qdrant.
    
    Args:
        collection_name (str): Name of the Qdrant collection to delete.
        
    Returns:
        None
    """
=======
    # embeddings = generate_embeddings(documents)
    
    # points = build_points(documents, embeddings)

    # qdrant_client = create_qdrant_client()
    
    # qdrant_client.recreate_collection(
    #     collection_name=collection_name,
    #     vectors_config=VectorParams(size=vector_dim, distance=Distance.COSINE)
    # )
    
    # qdrant_client.upsert(
    #     collection_name=collection_name,
    #     points=points
    # )
    
    embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

    vector_store = QdrantVectorStore.from_documents(
        documents=documents,
        embedding=embedding_model,
        url=QDRANT_URL,
        api_key=QDRANT_API_KEY,
        prefer_grpc=False,
        collection_name=collection_name,
    )

    print(f"Stored {len(documents)} documents in Qdrant collection '{collection_name}'.")

def delete_collection(collection_name: str):

>>>>>>> 64c0f14d9ee34178ef5a7679b610a56439595244
>>>>>>> 8b34fe62d8cae1929ab2ef49956a9f1d590b0b9e
    qdrant_client = create_qdrant_client()
    
    # Delete the collection
    qdrant_client.delete_collection(collection_name=collection_name)
    
    print(f"Deleted Qdrant collection '{collection_name}'.")