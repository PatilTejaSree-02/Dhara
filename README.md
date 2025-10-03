🌱 Dhara

Dhara is a [React + Vite + TypeScript + Flask] based project focused on [insert your project’s purpose here, e.g., digital healthcare paperwork automation / prototype for Megathon ’24].

📂 Project Structure
Dhara/

 ├── frontend/     # React + Vite + TypeScript (UI)
 
 ├── backend/      # Flask (Python APIs + NLP/ML if used)
 
 ├── README.md     # This file
 
 └── ...           # Other configs

🚀 Installation & Setup
1. Clone the Repository
git clone https://github.com/PatilTejaSree-02/Dhara.git
cd Dhara

2. Frontend Setup (React + Vite + TS)
cd frontend
npm install
npm run dev


Frontend will start at: http://localhost:5173

3. Backend Setup (Flask)
Prerequisites

Python 3.9+

pip

Create Virtual Environment (recommended)
cd backend
python -m venv venv
source venv/bin/activate   # Mac/Linux
venv\Scripts\activate      # Windows

Install Requirements
pip install -r requirements.txt

Run Backend
python app.py


Backend will run on: http://localhost:5000

⚡ Connecting Frontend & Backend

The frontend makes API calls to the backend on http://localhost:5000.

Make sure both servers (frontend + backend) are running.

Update API URLs in frontend/src/services/api.ts if needed.

🐞 Known Issues / Work in Progress

 Integration between frontend and backend still in progress.

 API error handling to be improved.

 Deployment steps not finalized.

👥 Contributors

Hasitha Narayanabhatta

Teja Sree Patil

📌 Notes

Please raise issues or PRs for improvements.

For smoother communication, we’re coordinating via WhatsApp (team + Vikash).

✨ Dhara: Building impactful solutions, one step at a time.
