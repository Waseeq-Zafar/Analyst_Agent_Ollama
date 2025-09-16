# AnalystAI Project

AnalystAI is a full-stack AI-powered document analysis system. Users can upload multiple documents (PDF, DOCX, CSV, Excel, TXT), and the system processes the text using a LLaMA3-based agent running in Docker. You can query the uploaded content in natural language.

This project includes:

- **Backend services**: API Gateway, File Service, Query Service, Python Agent, MongoDB.
- **AI agent**: Ollama container with LLaMA3 model.
- **Frontend**: React.js application for file uploads and querying the AI agent.

---

## 💻 Technology Stack

### Backend
- Spring Boot (API Gateway, File Service, Query Service)
- Python Flask (Python Agent)
- REST APIs using RestTemplate
- Docker & Docker Compose for containerization

### Frontend
- React.js
- Vite
- TailwindCSS

### Database
- MongoDB

### AI & NLP
- LLaMA3 model via Ollama
- LangChain Ollama integration

### Other Tools
- Base64 file handling, PDF/DOCX/CSV parsing
- PyPDF2, pdf2image, pytesseract, docx, pandas

---

## 🚀 Features

- Upload multiple documents and extract clean text.
- AI-powered natural language queries.
- Summarization of uploaded content.
- Containerized backend and AI agent for easy deployment.

---

## 🛠️ Installation & Setup

### 1. Clone the repository

```bash
git clone <YOUR_REPO_URL>
cd <YOUR_REPO_DIRECTORY>
```

### 2. Backend & AI setup using Docker Compose

```bash
# Ensure Docker Desktop is running, then execute:
docker-compose up --build
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 📞 Support

For issues, questions, or contributions, please open an issue on the GitHub repository.

---

This is **fully Markdown-compliant**. Every command, note, and bullet is properly formatted in Markdown.

You can also add **screenshots and GIF placeholders** for the Upload & Query workflow to make your README more visual and user-friendly.


