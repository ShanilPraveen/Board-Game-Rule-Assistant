# 🎲 Board Game Rulebook Assistant

An AI-powered assistant that reads PDF rulebooks of board games and answers user questions with cited references from the original documents.

Built using **FastAPI**, **LangChain**, **Qdrant**, and **Google Gemini API** on the backend, and a beautiful **Next.js**, **Tailwind CSS**, and **Framer Motion** frontend.

---

## ✨ Features

- 📄 Upload any board game rulebook in PDF format
- 🤖 Ask questions and receive LLM-generated answers based on rulebook content
- 🧠 Conversational memory for context-aware follow-up questions
- 🔍 Answer sources include page and rulebook location
- 🧹 Deletes rulebook and vector embeddings after session ends
- 📱 Fully responsive and animated frontend

---

## 🧰 Tech Stack

### Backend
- **FastAPI** – Lightweight and fast web framework
- **LangChain** – LLM-based RAG with memory
- **Qdrant Cloud** – Vector database for hybrid search
- **Google Gemini API** – Large Language Model for answer generation
- **SentenceTransformers** – Embedding model (`all-MiniLM-L6-v2`)

### Frontend
- **Next.js** – App Router-based React framework
- **Tailwind CSS** – Utility-first styling
- **Framer Motion** – Smooth and elegant animations
- **TypeScript** – Static typing


## 🚀 Getting Started

### Clone the Repository

```bash
git clone https://github.com/ShanilPraveen/Board-Game-Rule-Assistant.git
cd boardgame-rag-assistant
```


> **Setup Instructions (Backend):**
>
> 1. Create and activate a virtual environment:
>    ```bash
>    cd backend
>    python -m venv venv
>    source venv/bin/activate  # Windows: venv\Scripts\activate
>    ```
> 2. Install dependencies:
>    ```bash
>    pip install -r requirements.txt
>    ```
> 3. Create a `.env` file in the backend folder with:
>    ```env
>    QDRANT_API_KEY=your_qdrant_api_key
>    QDRANT_URL=https://your-qdrant-url
>    GEMINI_API_KEY=your_google_gemini_api_key
>    ```
> 4. Run the FastAPI server:
>    ```bash
>    uvicorn main:app --reload
>    ```
> 5. API will be running at `http://127.0.0.1:8000`


> **Setup Instructions (Frontend):**
>
> 1. Move to the frontend folder:
>    ```bash
>    cd frontend
>    ```
> 2. Install Node.js dependencies:
>    ```bash
>    npm install
>    ```
> 3. Create a `.env.local` file with:
>    ```env
>    NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
>    ```
> 4. Start the development server:
>    ```bash
>    npm run dev
>    ```
> 5. Frontend will be running at `http://localhost:3000`

---

🚀 Usage Flow

1. 🏁 Start on the animated landing page that invites users to interact.
2. 🎮 Enter the name of the board game.
3. 📄 Upload the PDF rulebook (text-based, max 50MB).
4. 💬 Ask any question about the game rules.
5. 🧠 The assistant uses memory to handle follow-up questions contextually.
6. 📚 Each answer includes page-specific citations from the rulebook.
7. 🛑 Click “End Session” to delete the session, rulebook file, and Qdrant vectors.

---

🛠 Additional Notes

- Make sure your PDF is **text-based** (not scanned images).
- CORS is enabled on the backend for local development to support frontend API calls.
- Memory and session management is handled in-memory (not persistent).
- Rulebook files are automatically deleted when a session ends.

---
