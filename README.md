# 🌱 Dhara

Dhara is a full-stack [React + Vite + TypeScript + Flask] project focused on digital healthcare paperwork automation, serving as a prototype for Megathon ’24. The goal is to streamline and digitize healthcare documentation, making it faster and more reliable for both patients and providers.

---

## 📖 Table of Contents
- [Project Purpose](#project-purpose)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Known Issues / Work in Progress](#known-issues--work-in-progress)
- [Contributing](#contributing)
- [License](#license)
- [Contributors](#contributors)
- [Contact](#contact)
- [Screenshots / Demo](#screenshots--demo)

---

## 📝 Project Purpose

Dhara digitizes paperwork processes in healthcare by providing an intuitive web interface and a robust backend. It automates document handling, leverages NLP/ML for extracting key information, and aims to minimize manual errors and delays.

---

## ✨ Features

- Modern React-based UI for data entry and management
- Fast backend APIs with Flask (Python)
- (Optional) NLP/ML integration for automated information extraction
- Real-time data validation
- Easy setup for local development
- Modular project structure
- RESTful API endpoints
- Error handling and helpful feedback
- Works cross-platform (Windows, Mac, Linux)

---

## 📂 Project Structure

```
Dhara/
 ├── frontend/     # React + Vite + TypeScript (UI)
 ├── backend/      # Flask (Python APIs + NLP/ML if used)
 ├── README.md     # This file
 └── ...           # Other configs
```

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/PatilTejaSree-02/Dhara.git
cd Dhara
```

### 2. Frontend Setup (React + Vite + TS)

```bash
cd frontend
npm install
npm run dev
```
Frontend will start at: [http://localhost:5173](http://localhost:5173)

### 3. Backend Setup (Flask)

**Prerequisites:** Python 3.9+, pip

Create Virtual Environment (recommended):

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Mac/Linux
venv\Scripts\activate      # Windows
```

Install Requirements:

```bash
pip install -r requirements.txt
```

Run Backend:

```bash
python app.py
```
Backend will run on: [http://localhost:5000](http://localhost:5000)

---

## 🛠️ Usage

1. Start both frontend and backend servers.
2. Visit [http://localhost:5173](http://localhost:5173).
3. Use the interface to upload, review, and process healthcare documents.
4. The frontend communicates with the backend via REST APIs (default: http://localhost:5000).

**Example workflow:**
- Fill out patient forms via the web UI.
- Submit forms; backend processes and stores them.
- (If enabled) NLP/ML modules extract key info and display results.

---

## 📡 API Documentation

> **Note:** Full API documentation is coming soon. For now, refer to `frontend/src/services/api.ts` for endpoints used.

**Base URL:** `http://localhost:5000`

**Example Endpoints:**
- `POST /api/uploadDocument`
- `GET /api/patient/:id`
- `POST /api/extractInfo`

Add authentication, request/response samples, and error codes as needed.

---

## 🌐 Deployment

Deployment steps are not finalized. Planned targets:
- Heroku / Vercel / AWS / GCP
- Docker setup

Stay tuned for updates!

---

## 🐞 Known Issues / Work in Progress

- Integration between frontend and backend is ongoing.
- API error handling to be improved.
- Deployment steps are not finalized.

---

## 🤝 Contributing

We welcome contributions!

1. Fork the repo and create your branch.
2. Submit a pull request with your changes.
3. Follow code style and add helpful comments.
4. For major changes, open an issue first to discuss.

Please see [CONTRIBUTING.md](CONTRIBUTING.md) (to be created) for guidelines.

---

## 📜 License

Specify the license for your project (e.g., MIT, Apache-2.0).  
Example:
```
MIT License
See [LICENSE](LICENSE) for details.
```

---

## 👥 Contributors

- Hasitha Narayanabhatta
- Teja Sree Patil

---

## 📌 Contact

Raise issues or PRs for improvements.  
For team communications, we coordinate via WhatsApp (team + Vikash).

---

## 🖼️ Screenshots / Demo

> Add screenshots, GIFs, or demo links here for a quick visual overview!

---

✨ Dhara: Building impactful solutions, one step at a time.
