Technical Requirements - Society Portal (MVP)

Stack
- Frontend: React (static build served by nginx)
- Backend: Node.js + Express
- DB: SQLite (file-based)
- Hosting: Docker on VPS with nginx reverse proxy and Let's Encrypt TLS

API endpoints (summary)
- POST /api/signup - create pending user
- POST /api/login - authenticate approved user
- GET /api/admin/pending - list pending users (admin)
- POST /api/admin/approve - approve user and set password (admin)
- GET /api/notices - public list of notices
- POST /api/admin/notice - create notice with optional image (admin)

Security
- Passwords: bcrypt hashing
- Auth: JWT tokens for members and admin routes
- Admin notifications: n8n webhook integration for pending signups and reset requests

Deployment
- Dockerfiles and docker-compose.yml provided. Run in a dedicated project root on the VPS.
