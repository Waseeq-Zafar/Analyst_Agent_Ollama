import os
import socket
from agent.processor import Processor

try:
    from langchain_ollama import ChatOllama
    from langchain.prompts import PromptTemplate
    LLM_AVAILABLE = True
except ImportError:
    print("[WARN] langchain_ollama not installed. Agent will run in limited mode.")
    LLM_AVAILABLE = False


def running_in_docker() -> bool:
    """Check if the code is running inside a Docker container."""
    try:
        with open("/proc/1/cgroup", "rt") as f:
            return "docker" in f.read() or "kubepods" in f.read()
    except Exception:
        return False


class LlamaAgent:
    """
    Local LLaMA3 Agent for processing text, answering queries, and summarization.
    Handles Docker vs Local Ollama.
    """

    def __init__(self, model_name="llama3", chunk_size: int = 1000):
        self.processor = Processor()
        self.chunks = []
        self.chunk_size = chunk_size

        self.llm = None

        if LLM_AVAILABLE:
            try:
                # Dockerized Ollama takes precedence if inside Docker
                if running_in_docker():
                    ollama_host = os.getenv("OLLAMA_HOST", "http://ollama:11434")
                    print(f"[INFO] Running inside Docker. Connecting to Ollama at {ollama_host}")
                    self.llm = ChatOllama(model=model_name, host=ollama_host)
                else:
                    # Local system installation
                    print(f"[INFO] Running on local system. Connecting to Ollama on localhost")
                    self.llm = ChatOllama(model=model_name)
            except Exception as e:
                print(f"[WARN] Failed to initialize LLaMA model: {e}")
                self.llm = None

        # QA Prompt template
        self.qa_template = PromptTemplate(
            input_variables=["question", "context"],
            template="Context: {context}\n\nQuestion: {question}\nAnswer:"
        )

        # Summarization Prompt template
        self.summarize_template = PromptTemplate(
            input_variables=["text"],
            template="Summarize the following text in 2-3 lines:\n\n{text}"
        )

    def load_text(self, text: str):
        if not text.strip():
            raise ValueError("No text provided to load.")
        self.chunks = self.processor.process_text(text, chunk_size=self.chunk_size)
        print(f"[INFO] Loaded {len(self.chunks)} chunks for local processing.")

    def answer_query(self, query: str) -> str:
        if not self.chunks:
            return "No text loaded. Please load text first."
        if not self.llm:
            return "LLM not available. Cannot answer query."

        context = "\n".join(self.chunks)
        try:
            response = (self.qa_template | self.llm).invoke({
                "question": query,
                "context": context
            })

            if hasattr(response, "content"):
                return response.content
            elif isinstance(response, list):
                return " ".join([msg.content if hasattr(msg, "content") else str(msg) for msg in response])
            else:
                return str(response)
        except MemoryError:
            return "MemoryError: Model requires more RAM than available. Try smaller chunk_size."
        except Exception as e:
            print(f"[ERROR] Failed to answer query: {e}")
            return f"Error answering query: {e}"

    def summarize_text(self) -> str:
        if not self.chunks:
            return "No text loaded to summarize."
        if not self.llm:
            return "LLM not available. Cannot summarize text."

        context = "\n".join(self.chunks)
        try:
            summary = (self.summarize_template | self.llm).invoke({"text": context})
            return summary
        except MemoryError:
            return "MemoryError: Model requires more RAM than available. Try smaller chunk_size."
        except Exception as e:
            print(f"[ERROR] Failed to summarize text: {e}")
            return f"Error summarizing text: {e}"

    def get_chunks(self) -> list:
        return self.chunks
