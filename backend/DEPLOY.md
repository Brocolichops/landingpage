Deployment notes for backend

Required environment variables (set these in Railway project settings):

- RESEND_API_KEY    # API key from Resend (recommended for platforms that block SMTP)
- EMAIL_TO
- EMAIL_FROM (optional)  # sender address used in outgoing emails
- FRONTEND_URL    # set to your Netlify URL (e.g. https://cvlandingpagealphav1.netlify.app) to lock CORS
- PORT (optional)

How the server runs on Railway

- Railway will run `npm install` then `npm start` (the `start` script runs `node server.js`).
- The service currently uses SQLite (`database.sqlite`) stored in the app filesystem. Railway ephemeral filesystems lose data across restarts unless a persistent volume is attached. You asked to keep SQLite local — be aware data may not persist across container restarts on Railway unless you add a volume.

Commands to run locally

```bash
cd backend
npm install
npm start
```

Logs

-- The server prints whether CORS is restricted and whether the Resend client initialized. If email fails, check Railway environment variables (`RESEND_API_KEY`, `EMAIL_TO`, `FRONTEND_URL`).
