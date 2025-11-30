#!/bin/bash

# Simulate Workflow A: Daily News Digest
echo "Simulating Daily News Digest Trigger..."
curl -X POST http://localhost:8080/api/v1/content/news/trigger
echo "\nNews Triggered."

# Simulate Workflow B: New User Welcome
echo "Simulating New User Webhook..."
# Note: In production, this URL comes from N8N. For local dev, we assume localhost:5678
curl -X POST http://localhost:5678/webhook/new-user \
     -H "Content-Type: application/json" \
     -d '{"email": "test@example.com"}'
echo "\nWebhook Sent."
