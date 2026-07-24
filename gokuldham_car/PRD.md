Product Requirements Document - Society Portal (MVP)

Purpose
- Provide a secure landing site for society members with admin-mediated signup and an editable notice board.

Users
- Residents (applicants)
- Admins (approve accounts, manage notices)

Core features
- Signup (collect full resident data) -> pending approval
- Admin approval workflow for accounts and password resets
- Login for approved members
- Notice board managed by admins (text + image) with default placeholder
- Dockerized deployment with nginx reverse proxy and SQLite for persistence

Success metrics
- Admin can approve accounts and manage notices
- Members can view notices and access members area after approval
