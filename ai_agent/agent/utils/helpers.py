import re
from typing import List

def clean_text(text: str) -> str:
    """Clean text by removing extra spaces, newlines, and special characters."""
    text = text.replace("\r", " ").replace("\n", " ")
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def chunk_text(text: str, chunk_size: int = 1000) -> List[str]:
    """Split text into smaller chunks for model processing."""
    return [text[i:i + chunk_size] for i in range(0, len(text), chunk_size)]
