# Car Database Workspace

This workspace contains starter files and instructions for a car-owner database that uses Google Sheets as storage, n8n for automation, and Telegram as a user interface.

Contents:
- templates/car_database_template.csv — CSV template you can import into Google Sheets
- n8n/telegram-car-db-workflow.json — example n8n workflow (import into n8n)
- .gitignore

Setup summary:
1. Create a Google Sheet and import templates/car_database_template.csv or copy its headers.
2. Set up n8n (self-hosted or n8n cloud). Import the workflow in n8n/telegram-car-db-workflow.json.
3. Create a Telegram bot with BotFather and get the bot token.
4. In n8n, connect Telegram and Google Sheets credentials and update the workflow node credentials.
5. Test using Telegram commands: /find <partial_or_full_car_number>, /create <car_number> name=... phone=..., /update <car_number> field=value

n8n notes:
- Import n8n/telegram-car-db-workflow.json into your n8n instance. Connect the Telegram Trigger node to a Function node that parses commands, then to Google Sheets nodes to perform lookups and updates. Use credentials you set up in the n8n UI.


If you want, provide your Google Service Account credentials or share the Google Sheet with the service account email, and provide the Telegram bot token and I will help test and iterate.

Workspace-specific choices you provided:
- Google Sheet URL: https://docs.google.com/spreadsheets/d/1SRQ-4v4vKqWFeoh7sL8wiY_XtuSM-hGTQDw9a6iP7KY/edit
- Sheet (tab) name: Database
- Authentication for Google Sheets in n8n: OAuth via n8n UI
- Telegram: you have a bot token and will configure credential in n8n
- Search behavior: user will send only car number (partial or full) and all matching rows should be returned
- AI processing: run both automatically on create/update and on-demand via /validate <car_number>
- AI actions: validate/normalize fields and redact owner_phone and address in the main columns while keeping originals in hidden columns

Next steps I will provide for you to apply in n8n (I can produce the full JSON you can import):
1) Detailed n8n workflow JSON (importable) that implements:
   - Telegram Trigger -> Parse Command -> Router
   - Find branch: read sheet rows, filter partial matches, reply with list
   - Create/Update branches: write rows and then call AI validation node
   - Validate branch (on-demand): call AI node and apply redaction
2) Exact node configuration snippets and expressions for Google Sheets nodes (read, append, update) and Telegram nodes
3) Instructions to configure OAuth Google Sheets credential in n8n and Telegram credential (bot token)
4) Example Telegram commands to test: e.g. "KA01", "/find KA01", "/validate KA01"

To proceed now, tell me whether you want me to: "Generate the full importable n8n workflow JSON now" or "Show step-by-step node configs first".
 
Next actions I took:
- Scaffolded a minimal Express backend (backend/) with endpoints for signup, admin approval, login, notice board, and image uploads.
- Added Dockerfile for backend and a docker-compose.yml to run backend + nginx.
- Added PRD.md, TECH_REQS.md, DEPLOY.md and deployment snippets to help you deploy to your VPS under a dedicated project root.

What I need from you next:
- Confirm you want me to scaffold the React frontend now, or should I create a simpler static HTML frontend?
- Provide the domain name you will use (optional now) and whether you prefer Manual Docker deploy or automated GitHub Actions.

If you're ready I can continue scaffolding the frontend and provide the exact VPS commands to deploy and configure TLS. Otherwise I will pause and wait for your confirmation.
