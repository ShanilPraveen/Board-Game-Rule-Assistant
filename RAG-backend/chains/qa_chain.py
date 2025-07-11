from langchain.chains.conversational_retrieval.base import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain_core.language_models import BaseLanguageModel
from langchain_core.vectorstores import VectorStoreRetriever
from retriever.hybrid_retriever import create_hybrid_retriever
from llm.call_LLM import call_gemini
from active_sessions.sessions import active_sessions
from langchain_google_genai import ChatGoogleGenerativeAI
import google.generativeai as genai
import os

def get_conversational_chain(
    collection_name: str,
    session_id: str,
) -> ConversationalRetrievalChain:
    """
    Create a conversational retrieval chain for the given session.

    Args:
        collection_name (str): The name of the Qdrant collection to use.
        session_id (str): The unique identifier for the session.

    Returns:
        ConversationalRetrievalChain: The configured conversational retrieval chain.
    """
    retriever  = create_hybrid_retriever(collection_name)


    geminimodel = ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
        temperature=0.2,
        google_api_key=os.getenv("GEMINI_API_KEY")
    )
    #geminimodel = genai.GenerativeModel(model_name="models/gemini-1.5-flash-latest")
    session_data = active_sessions.get(session_id)
    if not session_data:
        raise ValueError(f"No active session found for session_id: {session_id}")
    
    memory = session_data.get("memory")
    if not memory:
        raise ValueError(f"No memory found for session_id: {session_id}")
    
    chain  = ConversationalRetrievalChain.from_llm(
        llm=geminimodel,
        retriever=retriever,
        memory=memory,
        verbose=True,
        return_source_documents=True
    )

    return chain
