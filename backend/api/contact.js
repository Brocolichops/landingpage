const db = require("../db");

const RESEND_API_KEY = process.env.RESEND_API_KEY || null;

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
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
    if (!process.env.EMAIL_TO) {
      return res.status(500).json({ error: "Server misconfiguration: EMAIL_TO not set" });
    }
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO clients (name, email, project_type, preferred_date, song_link, notes, estimate) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, email, projectType, preferredDate, songLink, notes, estimate],
        function (err) {
          if (err) return reject(err);
          resolve(this.lastID);
        }
      );
    });
    if (!RESEND_API_KEY) {
      return res.status(500).json({ error: "Email sending disabled: RESEND_API_KEY not configured" });
    }
    const sendPayload = {
      from: process.env.EMAIL_FROM || `Aux Pictures <no-reply@auxpictures.com>`,
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
      throw new Error(info?.error || JSON.stringify(info));
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to submit form", details: err?.message });
  }
};