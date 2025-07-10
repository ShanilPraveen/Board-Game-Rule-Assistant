from retriever.answer_question import answer_question

res = answer_question(
    query="how many indices for each player?",
    collection_name="rulebook_session_79ad63b8"
)

print("🔮 Answer:\n", res["answer"])
print("\n📚 Sources used:")
for s in res["sources"]:
    print(f"- Page {s['page']} of {s['source']}")
