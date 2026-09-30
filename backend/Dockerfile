FROM python:3.11-slim

WORKDIR /app

# System deps: FAISS needs libopenblas, SBERT needs tokenizers build tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libopenblas-dev \
    && rm -rf /var/lib/apt/lists/*

# Install lightweight CPU-only PyTorch first to prevent downloading 3GB of CUDA wheels
RUN pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Ensure the SQLite database directory exists at runtime
RUN mkdir -p /app/database

EXPOSE 8000

ENV PYTHONUNBUFFERED=1

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
