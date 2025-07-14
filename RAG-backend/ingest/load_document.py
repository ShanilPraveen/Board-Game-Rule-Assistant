# ingest/load_documents.py

import os
import fitz 
import re
from typing import List
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter


def clean_text(text: str) -> str:
    """
    Clean PDF page text:
    1. Collapse >2 newlines to exactly 2 (paragraph breaks)
    2. Remove bullets and non-standard unicode symbols
    3. Remove common footers like "Page 3"
    4. Strip whitespace per line
    5. (Optional) Lowercase everything
    """
    # Step 1: Collapse 3+ newlines to 2
    text = re.sub(r'\n{3,}', '\n\n', text)

    # Step 2: Remove bullets and unicode artifacts
    text = re.sub(r'[•·►\uf0b7\xa0]', '', text)

    # Step 3: Remove "Page 3" type headers/footers
    text = re.sub(r'page\s+\d+', '', text, flags=re.IGNORECASE)

    # Step 4: Strip leading/trailing whitespace per line
    text = '\n'.join([line.strip() for line in text.splitlines()])

    # Step 5: (Optional) Lowercase normalization
    text = text.lower()

    return text


def extract_text_from_pdf(pdf_path: str) -> List[str]:
    """
    Extracts and cleans text from each page of a PDF file.
    Returns a list of cleaned text strings, one per page.
    """
    doc = fitz.open(pdf_path)
    pages = []

    for i,page in enumerate(doc):
        raw_text = page.get_text()
        cleaned_text = clean_text(raw_text)
        if cleaned_text.strip():
            pages.append(cleaned_text)

    doc.close()
    return pages


def chunk_pdf_text(
    text_pages: List[str],
    source_filename: str,
    game_name: str,
    chunk_size: int = 500,
    chunk_overlap: int = 100
) -> List[Document]:
    """
    Chunk the cleaned text into overlapping segments and attach metadata.
    Each chunk becomes a LangChain Document for use in embedding/RAG.
    """
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", ".", " ", ""]
    )

    documents = []

    for page_number, page_text in enumerate(text_pages, start=1):
        chunks = splitter.split_text(page_text)

        for chunk in chunks:
            doc = Document(
                page_content=chunk,
                metadata={
                    "source": source_filename,
                    "page": page_number,
                    "game": game_name
                }
            )
            documents.append(doc)

    return documents
