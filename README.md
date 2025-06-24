# Hooper

Hooper is a full-stack basketball stat tracking app built with React, FastAPI, and OpenAI. Track your game stats, generate comparisons, and get AI-powered insights on your performance over time.

---

## 🚀 Features

* Log game stats (points, rebounds, assists, etc.)
* Visualize your performance over time
* Generate AI-based comparisons and feedback
* Quota system for AI usage via webhook (requires ngrok)

---

## 🛠 Tech Stack

* **Frontend:** React + Vite
* **Backend:** FastAPI + SQLAlchemy + OpenAI API
* **Other:** Ngrok (for webhook support), Conda (for Python env)

---

## Getting Started

Follow these steps to set up Hooper locally:

### 1. Fork & Clone the Repository

```bash
git clone https://github.com/<your-username>/Hooper.git
cd Hooper
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 3. Backend Setup

```bash
cd ../backend
conda env create -f environment.yml
conda activate hooper-env
python server.py
```

### 4. Webhook Setup (Quota Management)

* [Sign up at ngrok.com](https://ngrok.com/) and install the CLI.
* Start a tunnel to your backend:

  ```bash
  ngrok http 8000
  ```
* Update your `.env` file or webhook settings to use the generated ngrok URL.

**This step is only needed when creating your account. After you have an account you can run the app without ngrok.**

---
