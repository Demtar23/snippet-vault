📦 Snippet Vault
A fullstack web application for storing and managing personal snippets (notes, links, commands).
Built with Next.js (frontend), NestJS (backend) and MongoDB.

🚀 Live Demo
Frontend: [Live Demo](https://snippet-vault-liart.vercel.app)
Backend: [Live Demo](https://snippet-vault-l84r.onrender.com/snippets)

🧠 Features
Create snippets (notes / links / commands)
Edit existing snippets
Delete snippets
Search by title/content
Filter by tags
Pagination
View single snippet page
REST API integration
🛠 Tech Stack
Frontend
Next.js (App Router)
React
TypeScript
Tailwind CSS
Backend
NestJS
MongoDB + Mongoose
Class Validator
REST API

📁 Project Structure
snippet-vault/
│
├── backend/        # NestJS API
│   ├── src/
│   └── dist/
│
├── frontend/       # Next.js app
│   ├── app/
│   ├── components/
│   └── lib/

🧑‍💻 Running Locally
1. Clone repo

git clone https://github.com/Demtar23/snippet-vault.git
cd snippet-vault
2. Backend setup

cd backend
npm install
npm run start:dev
3. Frontend setup

cd frontend
npm install
npm run dev

🔗 API Endpoints
Snippets
GET /snippets → get all snippets (pagination, search, filter)
GET /snippets/:id → get single snippet
POST /snippets → create snippet
PATCH /snippets/:id → update snippet
DELETE /snippets/:id → delete snippet

📌 Key Learnings
Working with monorepo structure
Connecting frontend with REST API
Deploying backend (Render)
Deploying frontend (Vercel)
Handling CORS issues
Environment variables management
Debugging production deployment issues

🚀 Deployment
Backend deployed on Render
Frontend deployed on Vercel
MongoDB hosted on Atlas