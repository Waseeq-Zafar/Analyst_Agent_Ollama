FROM python:3.10-slim-bookworm

# Set workdir
WORKDIR /app

# Copy requirements first (better caching)
COPY requirements.txt .

# Install system dependencies
RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y --no-install-recommends \
        build-essential \
        gcc \
        g++ \
        tesseract-ocr \
        libtesseract-dev \
        poppler-utils \
        libsm6 \
        libxext6 \
        libxrender-dev \
        libxml2-dev \
        libxslt-dev \
        zlib1g-dev \
        libjpeg-dev \
        && pip install --upgrade pip \
        && pip install --no-cache-dir -r requirements.txt \
        && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy application code
COPY . .

# Expose Flask API port
EXPOSE 5005

# Run Flask app
CMD ["python", "run.py"]
