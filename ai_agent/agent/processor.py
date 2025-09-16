# agent/processor.py
from .utils.helpers import clean_text, chunk_text

class Processor:
    """Process combined text before feeding to LLaMA agent."""

    def __init__(self, chunk_size: int = 1000):
        self.chunk_size = chunk_size

    def process_text(self, text: str, chunk_size: int = None):
        """
        Clean and chunk text.
        If chunk_size is provided, override the default chunk_size.
        """
        if chunk_size is None:
            chunk_size = self.chunk_size

        cleaned = clean_text(text)
        chunks = chunk_text(cleaned, chunk_size)
        return chunks
