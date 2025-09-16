# app.py

from flask import Flask, request, jsonify
import os
import base64
from io import BytesIO
from PyPDF2 import PdfReader
from pdf2image import convert_from_bytes
import pytesseract
import docx
import pandas as pd
import re
import string

from agent.llama_agent import LlamaAgent

# -------------------------------
# Flask app setup
# -------------------------------
app = Flask(__name__)

# DATA_DIR = r"C:\Users\ASUS\OneDrive\Desktop\Waseeq\Coding\Project\AnalystAI\ai_agent\data"
DATA_DIR = "/app/data"
os.makedirs(DATA_DIR, exist_ok=True)
COMBINED_FILE = os.path.join(DATA_DIR, "combined_text.txt")

# Tesseract path (Windows)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Initialize LLaMA agent
agent = LlamaAgent(chunk_size=500)  # smaller chunks for low RAM

# -------------------------------
# Utility functions
# -------------------------------
def clean_text(text: str) -> str:
    """Basic cleaning: remove extra spaces, empty lines, non-printable characters."""
    # Remove non-printable characters
    text = ''.join(filter(lambda x: x in string.printable, text))
    # Normalize whitespace
    text = re.sub(r'\s+', ' ', text)
    # Remove leading/trailing spaces
    text = text.strip()
    return text

def extract_text(file_name: str, file_bytes: bytes) -> str:
    """Extract text from TXT, PDF, DOCX, CSV, Excel."""
    text = ""
    try:
        file_name_lower = file_name.lower()
        if file_name_lower.endswith(".txt"):
            text = file_bytes.decode("utf-8", errors="ignore")
        elif file_name_lower.endswith(".pdf"):
            reader = PdfReader(BytesIO(file_bytes))
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
            # OCR for images inside PDF
            images = convert_from_bytes(file_bytes)
            for img in images:
                ocr_text = pytesseract.image_to_string(img)
                if ocr_text.strip():
                    text += ocr_text + "\n"
        elif file_name_lower.endswith(".docx"):
            doc = docx.Document(BytesIO(file_bytes))
            for para in doc.paragraphs:
                text += para.text + "\n"
        elif file_name_lower.endswith(".csv"):
            df = pd.read_csv(BytesIO(file_bytes))
            text = df.astype(str).agg(' '.join, axis=1).str.cat(sep=' ')
        elif file_name_lower.endswith((".xls", ".xlsx")):
            df = pd.read_excel(BytesIO(file_bytes))
            text = df.astype(str).agg(' '.join, axis=1).str.cat(sep=' ')
        else:
            # Default: try decode
            text = file_bytes.decode("utf-8", errors="ignore")
    except Exception as e:
        print(f"[WARN] Failed to extract text from {file_name}: {e}")
    return clean_text(text)

# -------------------------------
# Routes
# -------------------------------
@app.route("/process-multi", methods=["POST"])
def process_multi():
    """Receive multiple files, extract and clean text, save and load into agent."""
    try:
        files = request.get_json()
        if not files or not isinstance(files, list):
            return jsonify({"error": "No files received or invalid format"}), 400

        combined_text = ""
        for file_obj in files:
            file_name = file_obj.get("fileName")
            file_data = file_obj.get("data")
            if not file_name or not file_data:
                continue

            file_bytes = base64.b64decode(file_data)
            text = extract_text(file_name, file_bytes)
            if text.strip():
                combined_text += f"\n--- {file_name} ---\n{text}\n"

        if not combined_text.strip():
            return jsonify({"status": "error", "message": "No valid text to process"}), 400

        # Save combined cleaned text
        with open(COMBINED_FILE, "w", encoding="utf-8") as f:
            f.write(combined_text)

        # Load into LLaMA agent in chunks
        agent.load_text(combined_text)

        print(f"[INFO] Combined cleaned text loaded into agent. Ready for queries.")
        return jsonify({
            "status": "success",
            "message": f"{len(files)} files processed, cleaned, and loaded",
            "combined_file": COMBINED_FILE
        }), 200

    except Exception as e:
        print(f"[ERROR] {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/query", methods=["POST"])
def query():
    """Receive query, return answer from LLaMA agent."""
    try:
        data = request.get_json()
        query_text = data.get("query")
        if not query_text:
            return jsonify({"error": "Query text missing"}), 400

        answer = agent.answer_query(query_text)
        return jsonify({"answer": answer}), 200

    except Exception as e:
        print(f"[ERROR] Failed to answer query: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500
