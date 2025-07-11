from langchain_huggingface import HuggingFaceEmbeddings
from langchain_qdrant import Qdrant
from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from vectorstores.qdrant_store import create_qdrant_client

def create_hybrid_retriever(collection_name: str):
    """
    Create a LangChain retriever from Qdrant collection using Sentence Transformers.

    Returns:
        retriever (VectorStoreRetriever): LangChain-compatible retriever
    """

    qdrant_client: QdrantClient = create_qdrant_client()

    embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

    vector_store = QdrantVectorStore(
        client=qdrant_client,
        collection_name=collection_name,
        embedding=embedding_model,
    )

    return vector_store.as_retriever(search_kwargs={"k": 5})
