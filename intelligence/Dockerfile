FROM python:3.11-slim

LABEL maintainer="Resonance Contributors"
LABEL description="Resonance Intelligence Service — acoustic incident detection"

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    libsndfile1 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies first for layer caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source
COPY . .

# Install the package
RUN pip install --no-cache-dir -e .

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8001/health')"

EXPOSE 8001

ENV PYTHONUNBUFFERED=1
ENV LOG_LEVEL=INFO
ENV NATS_URL=nats://nats:4222
ENV HEALTH_PORT=8001
ENV MODEL_DIR=/app/models
ENV REGISTRY_PATH=/app/registry/models.json

CMD ["python", "-m", "intelligence.service.main"]
