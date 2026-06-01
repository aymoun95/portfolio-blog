---
title: "Ollama Beginner's Guide: Running AI Models Locally on Your Computer"
publishedAt: "2026-06-01"
summary: "Learn how to install Ollama, run local LLMs on your machine, pull models, and start building AI-powered applications without relying on cloud providers."
tags: ["ollama", "llm", "ai", "local-ai", "python"]
image: "https://i.ibb.co/fdP1qLyT/Ollama-Logo-Image.jpg"
---

Artificial Intelligence is no longer limited to cloud platforms and expensive APIs. With **Ollama**, you can run powerful Large Language Models (LLMs) directly on your own machine, keeping your data private while reducing API costs.

Whether you're a developer experimenting with AI, building local applications, or simply curious about running models offline, Ollama provides one of the easiest ways to get started.

In this guide, you'll learn everything from installation to API integrations, model management, performance optimization, and creating custom AI assistants.

---

# Why Use Ollama?

Ollama offers several advantages:

- Run AI models entirely on your computer
- No API costs for local models
- Better privacy and data ownership
- Offline AI capabilities
- Simple installation process
- Built-in API server
- Support for many open-source models

Popular models available through Ollama include:

- Llama 3
- Mistral
- Gemma
- Qwen
- DeepSeek
- Phi
- GPT-OSS

---

# System Requirements: RAM, VRAM & Storage

Before installing Ollama, it's important to understand the hardware requirements.

## RAM Recommendations

| Model Size | Recommended RAM |
| ---------- | --------------- |
| 3B - 7B    | 8GB - 16GB      |
| 8B - 14B   | 16GB - 32GB     |
| 32B+       | 32GB+           |
| 70B+       | 64GB+           |

## GPU / VRAM Recommendations

Running on a GPU significantly improves performance.

| Model Size | Recommended VRAM |
| ---------- | ---------------- |
| 7B         | 6GB - 8GB        |
| 13B        | 10GB - 12GB      |
| 32B        | 24GB+            |
| 70B        | 48GB+            |

If you don't have a GPU, Ollama can still run models using the CPU, although responses will be slower.

## Storage Requirements

Model files can be large:

| Model | Approximate Size |
| ----- | ---------------- |
| 3B    | 2GB              |
| 7B    | 4GB - 5GB        |
| 13B   | 8GB - 10GB       |
| 70B   | 40GB+            |

Always leave extra storage space for future model downloads.

---

# How to Download and Install Ollama

Visit the official Ollama website and download the installer for your operating system:

- macOS
- Windows
- Linux

## macOS/Linux

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

## Windows

Download the installer and follow the setup wizard.

---

# Verifying the Installation via Terminal

After installation, open your terminal and run:

```bash
ollama --version
```

Expected output:

```bash
ollama version 0.x.x
```

You can also verify that the service is running:

```bash
ollama list
```

If no models are installed yet, you'll see an empty list.

---

# The Ollama Model Library & Choosing a Model

Ollama supports a large collection of models.

### Recommended Models for Beginners

| Use Case            | Recommended Model |
| ------------------- | ----------------- |
| General Chat        | llama3            |
| Coding              | qwen3-coder       |
| Fast Responses      | phi               |
| Reasoning           | deepseek-r1       |
| Lightweight Devices | gemma             |

When selecting a model, balance:

- Quality
- Speed
- Hardware requirements
- Storage size

A 7B or 8B model is typically the best starting point.

---

# Running Your First Local Model

Start a model with:

```bash
ollama run llama3
```

If the model isn't already downloaded, Ollama will automatically:

1. Download the model
2. Store it locally
3. Launch an interactive chat session

Example:

```text
>>> What is machine learning?
```

The model responds directly in your terminal.

```text
Thinking...
The user asks: "What is machine learning?" Straightforward explanation. Should define it, give types,
examples, maybe a bit of history, why useful. Keep it concise but thorough.

We need to follow policies: it's fine. We'll answer.
...done thinking.

**Machine learning (ML)** is a sub‑field of artificial intelligence (AI) that focuses on building systems
that can *learn* from data rather than being explicitly programmed for every possible situation. In other
words, instead of writing step‑by‑step rules that tell a computer exactly what to do, you give the computer
examples (data) and let it infer the underlying patterns, rules, or predictions on its own.
```

---

# Running Llama with a Cloud Model: GPT-OSS 120B Cloud

Some models are too large for consumer hardware.

Ollama offers cloud-hosted options such as:

```bash
ollama run gpt-oss:120b-cloud
```

Benefits:

- Massive model size
- No local hardware limitations
- Better reasoning capabilities
- Faster startup time

Trade-offs:

- Requires internet access
- Uses cloud resources
- May incur usage costs depending on provider and plan

Use cloud models when local hardware cannot handle larger models effectively.

---

# How to Manage Sessions and Exit Models

To exit an active chat session:

```bash
/bye
```

or

```bash
Ctrl + D
```

Useful commands inside a session:

```bash
/help
```

```bash
/clear
```

```bash
/show info
```

These commands vary slightly by Ollama version.

---

# Downloading Models with the Pull Command

Instead of downloading automatically, you can pull models manually.

```bash
ollama pull llama3
```

Examples:

```bash
ollama pull qwen3
```

```bash
ollama pull gemma3
```

```bash
ollama pull deepseek-r1
```

This is useful when preparing environments in advance.

---

# Managing Storage: List & Remove Commands

## List Installed Models

```bash
ollama list
```

Example:

```text
NAME          SIZE
llama3        4.7 GB
gemma3        3.8 GB
```

## Remove a Model

```bash
ollama rm llama3
```

Removing unused models can free significant disk space.

---

# The Core Ollama Terminal Commands Summary

## Run a Model

```bash
ollama run llama3
```

## Download a Model

```bash
ollama pull llama3
```

## List Models

```bash
ollama list
```

## Remove a Model

```bash
ollama rm llama3
```

## Show Running Models

```bash
ollama ps
```

## Display Version

```bash
ollama --version
```

---

# The Ollama API & Local Server Port

One of Ollama's most powerful features is its built-in API server.

By default, Ollama runs on:

```text
http://localhost:11434
```

This allows your applications to communicate with local AI models using standard HTTP requests.

No additional setup is required.

---

# Sending Local API Requests Using Curl

Generate text:

```bash
curl http://localhost:11434/api/generate \
-d '{
  "model":"llama3",
  "prompt":"Explain neural networks"
}'
```

Chat completion:

```bash
curl http://localhost:11434/api/chat \
-d '{
  "model":"llama3",
  "messages":[
    {
      "role":"user",
      "content":"Hello"
    }
  ]
}'
```

The API returns JSON responses that can easily be integrated into applications.

---

# Python Integration: Writing Custom Scripts

Install requests:

```bash
pip install requests
```

Simple example:

```python
import requests

response = requests.post(
    "http://localhost:11434/api/generate",
    json={
        "model": "llama3",
        "prompt": "Explain transformers"
    }
)

print(response.json()["response"])
```

This allows you to build:

- AI chatbots
- Document analyzers
- Coding assistants
- Internal company tools

---

# Streaming Live API Responses in Python

Streaming improves user experience by displaying tokens as they arrive.

```python
import requests
import json

response = requests.post(
    "http://localhost:11434/api/generate",
    json={
        "model":"llama3",
        "prompt":"Write a poem",
        "stream":True
    },
    stream=True
)

for line in response.iter_lines():
    if line:
        data = json.loads(line)
        print(data.get("response", ""), end="")
```

This creates a ChatGPT-style streaming experience.

---

# Customizing AI Personalities with Modelfiles

A Modelfile allows you to create customized AI assistants.

Example:

```dockerfile
FROM llama3

SYSTEM """
You are a senior software architect.
Always provide technical explanations.
"""
```

Save as:

```text
Modelfile
```

Create your custom model:

```bash
ollama create architect -f Modelfile
```

Run it:

```bash
ollama run architect
```

This is useful for:

- Company assistants
- Coding mentors
- Customer support bots
- Domain-specific experts

---

# Optimizing Performance & Memory Usage

## Use Smaller Models

Instead of:

```text
70B
```

Consider:

```text
8B
```

or

```text
14B
```

for faster responses.

## Close Unused Models

Check running models:

```bash
ollama ps
```

Stop unnecessary sessions.

## Use GPU Acceleration

Modern NVIDIA, AMD, and Apple Silicon GPUs provide significant speed improvements.

## Keep Storage Clean

Remove unused models regularly:

```bash
ollama rm model-name
```

---

# Troubleshooting Common Installation Errors

## Command Not Found

```bash
ollama: command not found
```

Solution:

- Restart terminal
- Reinstall Ollama
- Verify PATH configuration

---

## Slow Responses

Possible reasons:

- CPU-only inference
- Insufficient RAM
- Running oversized models

Try a smaller model or use GPU acceleration.

---

# Upgrading to a Desktop UI Experience

If you're not a fan of the terminal, Ollama offers an official desktop application that provides a modern chat interface while still running models through the same Ollama engine underneath.

The desktop app is ideal for users who want the power of local AI without constantly interacting with command-line tools.

## Why Use the Ollama Desktop App?

Benefits include:

- Clean, user-friendly chat interface
- Easy model discovery and installation
- Simple switching between models
- Built-in conversation history
- Support for both local and cloud-hosted models
- No need to remember terminal commands for everyday use

For many users, the desktop app is the fastest way to start experimenting with local AI.

---

# Final Thoughts

Ollama has dramatically simplified running AI locally. In just a few commands, you can download powerful models, interact with them through the terminal, integrate them into applications via APIs, and even create custom AI assistants tailored to your needs.

Whether you're experimenting with AI, building production applications, or exploring private and offline workflows, Ollama provides an excellent foundation for local AI development.

The best way to learn is to start small:

```bash
ollama pull llama3
ollama run llama3
```

Once you're comfortable, explore APIs, Modelfiles, streaming responses, and advanced integrations to unlock the full potential of local AI.
