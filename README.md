# Reegy - (Reels+Swiggy)

A full‑stack JavaScript project for browsing, liking, and saving food-related video/content with user authentication and partner management. The repository contains a Node.js + Express backend and a Vite‑based frontend. It exposes routes for auth, food items, and food‑partner features and persists data through a backend database (see backend/.env.example).

## Features
- User authentication and protected routes (see backend/src/controllers/auth.controller.js and backend/src/middlewares/auth.middleware.js)
- Browse and manage food items (backend/src/controllers/food.controller.js, backend/src/models/food.model.js)
- Food partner endpoints (backend/src/controllers/food-partner.controller.js)
- Like and save functionality (backend/src/models/likes.model.js, backend/src/models/save.model.js)
- Separate frontend (Vite) for the UI (frontend/)

## Stack
- Language(s): JavaScript (frontend + backend)
- Runtime / Frameworks:
  - Backend: Node.js with Express (server.js, backend/src/app.js)
  - Frontend: Vite (see frontend/vite.config.js and frontend/package.json) — front end source in frontend/src
- Notable code areas: backend routes & controllers (backend/src/routes, backend/src/controllers), models (backend/src/models), db connection (backend/src/db/db.js)

