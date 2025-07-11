from fastapi import APIRouter,UploadFile, File,Form,Body, HTTPException
import os
import uuid
from ingest.load_document import extract_text_from_pdf, chunk_pdf_text
from ingest.embed_and_store import store_in_qdrant
from vectorstores.qdrant_store import create_qdrant_client
from retriever.answer_question import answer_question

router = APIRouter()

active_sessions = {}

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/")
def get_status():
    return {"message": "Backend is running"}

@router.post("/upload")
async def upload_rulebook(
    file : UploadFile = File(...),
    game_name: str = Form(...),
):
    
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    # Save the uploaded file
    file_path = os.path.join(UPLOAD_DIR,file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())

    raw_pages = extract_text_from_pdf(file_path)
    documents = chunk_pdf_text(raw_pages, source_filename=file.filename, game_name=game_name)

    collection_name = f"rulebook_{uuid.uuid4().hex[:8]}"

    try:
        store_in_qdrant(documents, collection_name)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to store documents: {str(e)}")
    
    session_id = uuid.uuid4().hex
    active_sessions[session_id] = {
        "file_path": file_path,
        "collection_name": collection_name,
        "game_name": game_name,
    }
    return {
        "session_id": session_id,
        "collection_name": collection_name,
        "message": f"Successfully uploaded and processed {len(documents)} chunks."
    }

@router.post("/ask")
async def ask_question(
    session_id: str = Body(...),
    question: str = Body(...),
):
    if session_id not in active_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session_data = active_sessions[session_id]
    collection_name = session_data["collection_name"]

    try:
        result = answer_question(
            query=question,
            collection_name=collection_name,
            top_k=5
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to answer question: {str(e)}")

