# YouTube Blog

Full-stack blog app (React + Vite frontend, Express + MongoDB backend) with JWT auth.

## Backend
```bash
cd backend
npm install
cp .env.example .env     # then edit MONGO_URI and JWT_SECRET
npm run dev              # http://localhost:5000
```

## Frontend
```bash
cd frontend
npm install
npm run dev              # http://localhost:5173 (proxies /api to :5000)
```

## API
| Method | Route               | Auth | Description        |
|--------|---------------------|------|--------------------|
| POST   | /api/auth/signup    | no   | Create account     |
| POST   | /api/auth/signin    | no   | Sign in            |
| GET    | /api/auth/me        | yes  | Current user       |
| GET    | /api/posts          | no   | List posts         |
| GET    | /api/posts/:id      | no   | Single post        |
| POST   | /api/posts          | yes  | Create post        |
| PUT    | /api/posts/:id      | yes  | Update own post    |
| DELETE | /api/posts/:id      | yes  | Delete own post    |
