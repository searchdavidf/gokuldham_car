Quick deploy steps (copy-paste)

# On VPS (run as deploy user)
mkdir -p ~/projects && cd ~/projects
git clone <your-private-repo-url> society-portal
cd society-portal
cp .env.example .env
# edit .env and set JWT_SECRET and ADMIN_PASSWORD
docker-compose up -d --build

To view logs:
docker-compose logs -f backend
