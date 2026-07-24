Example webhook payloads for n8n integration

Pending signup notification
POST /webhook/pending_signup
{
  "userId": 123,
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "9000000000"
}

Admin can use this webhook in n8n to forward to Telegram or email.
