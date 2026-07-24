Deployment guide (manual Docker deploy)

Prerequisites on VPS
- A non-root user with sudo
- Docker and docker-compose installed
- Domain name pointing to VPS (for TLS)

Steps (summary)
1) Copy project to VPS under /home/<user>/projects/society-portal
2) Create a .env file with JWT_SECRET and initial admin password
3) Run docker-compose up -d --build
4) Configure nginx site and obtain TLS certs with certbot

I will provide exact commands and a script to automate these steps in the next changes.
