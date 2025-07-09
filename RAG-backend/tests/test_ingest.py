from ingest.load_document import extract_text_from_pdf, chunk_pdf_text

if __name__ == "__main__":
    pdf_path = "uploads/cfn.pdf"
    game_name = "Checkers"

    text_pages = extract_text_from_pdf(pdf_path)
    print(f"Extracted {len(text_pages)} pages.")

    documents = chunk_pdf_text(text_pages, source_filename="cfn.pdf", game_name=game_name)

    print(f"Created {len(documents)} chunks.")
    print("Preview first chunk:\n", documents[0].page_content[:500])
    print("Metadata:\n", documents[0].metadata)
