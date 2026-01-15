// backend/index.js
require("dotenv").config();
const express = require("express");
const path = require("path");
// Use Resend (resend.com) for sending emails from deployed environments
// (Railway may block direct SMTP outbound). We'll call the Resend HTTP API
// directly using global `fetch` so the SDK package isn't required.
const cors = require("cors");
const db = require("./db"); // your existing SQLite setup

const app = express();

// ---------- CORS middleware ----------
// Restrict origin when FRONTEND_URL is provided (Netlify), otherwise allow all for local testing
const FRONTEND_URL = process.env.FRONTEND_URL;
if (FRONTEND_URL) {
  app.use(cors({ origin: FRONTEND_URL }));
  console.log("CORS: restricted to", FRONTEND_URL);
} else {
  app.use(cors());
  console.log("CORS: allowing all origins (no FRONTEND_URL set)");
}
app.use(express.json());

// Serve frontend static files (assumes frontend folder is next to backend)
const frontendPath = path.join(__dirname, "..", "frontend");
app.use(express.static(frontendPath));

// Root route for convenience
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// ---------- Email client (Resend) ----------
const RESEND_API_KEY = process.env.RESEND_API_KEY || null;
if (RESEND_API_KEY) console.log("Resend API key detected (emails enabled)");
else console.log("RESEND_API_KEY not set — email sending disabled until configured");

// ---------- Contact form endpoint ----------
app.post("/api/contact", async (req, res) => {
  const {
    name,
    email,
    projectType,
    preferredDate,
    songLink,
    notes,
    estimate
  } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Missing name or email" });
  }

  try {
    // validate recipient configured
    if (!process.env.EMAIL_TO) {
      console.error("EMAIL_TO is not set in environment");
      return res.status(500).json({ error: "Server misconfiguration: EMAIL_TO not set" });
    }

    // 1️⃣ Save to database (await the insert so we can handle DB errors)
    await new Promise((resolve, reject) => {
      db.run(
        `
      INSERT INTO clients
      (name, email, project_type, preferred_date, song_link, notes, estimate)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
        [name, email, projectType, preferredDate, songLink, notes, estimate],
        function (err) {
          if (err) {
            console.error("DB insert error:", err);
            return reject(err);
          }
          resolve(this.lastID);
        }
      );
    });


    // 2️⃣ Send email via Resend HTTP API (preferred for platforms that block SMTP)
    if (!RESEND_API_KEY) {
      console.error("Email client not configured (RESEND_API_KEY missing)");
      return res.status(500).json({ error: "Email sending disabled: RESEND_API_KEY not configured" });
    }

    const sendPayload = {
      from: process.env.EMAIL_FROM || `Cerberus Visuals <no-reply@cerberusvisuals.com>`,
      to: [process.env.EMAIL_TO],
      subject: `[Booking] ${projectType || "New inquiry"} — ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nProject type: ${projectType}\nPreferred date(s): ${preferredDate}\nSong link: ${songLink}\n\nNotes:\n${notes}\n\n------------------\nEstimate:\n${estimate}`
    };

    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify(sendPayload)
    });

    const info = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      console.error("Resend API error:", info);
      throw new Error(info?.error || JSON.stringify(info));
    }

    // 3️⃣ Success response
    res.json({ success: true });
  } catch (err) {
    console.error("Error handling contact form:", err);
    res.status(500).json({ error: "Failed to submit form", details: err?.message });
  }
});

// ---------- Test email route (for local debugging) ----------
app.get("/api/test-email", async (req, res) => {
  try {
    if (!process.env.EMAIL_TO) {
      return res.status(500).json({ error: "Server misconfiguration: EMAIL_TO not set" });
    }
    if (!RESEND_API_KEY) {
      return res.status(500).json({ error: "Resend not configured: RESEND_API_KEY missing" });
    }

    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || `Cerberus Visuals Test <no-reply@cerberusvisuals.com>`,
        to: [process.env.EMAIL_TO],
        subject: "Test Email from Deployed Server",
        text: "If you received this, your Resend email setup works!"
      })
    });

    const info = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      console.error("Resend test API error:", info);
      return res.status(500).json({ error: "Test email failed", details: info });
    }

    console.log("Test email info:", info);
    res.json({ success: true, info });
  } catch (err) {
    console.error("Test email failed:", err);
    res.status(500).json({ error: "Test email failed", details: err?.message });
  }
});

// ---------- Start server ----------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
