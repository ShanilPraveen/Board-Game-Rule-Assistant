from ingest.load_document import extract_text_from_pdf, chunk_pdf_text
from ingest.embed_and_store import store_in_qdrant
import uuid

docs = chunk_pdf_text(
    extract_text_from_pdf("uploads/cfn.pdf"),
    source_filename="Chekers.pdf",
    game_name="Checkers",
)

session_collection = f"rulebook_session_{uuid.uuid4().hex[:8]}"
store_in_qdrant(docs, session_collection)
