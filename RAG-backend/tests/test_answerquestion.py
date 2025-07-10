from retriever.answer_question import answer_question

chunks = answer_question(
    query="How to win in checkers?",
    collection_name="rulebook_session_79ad63b8"
)

for c in chunks:
    print("📖 Page:", c['page'], "| Game:", c['game'])
    print(c['text'])
    print("=" * 40)
