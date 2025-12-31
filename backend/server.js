require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// ---------- Email transporter ----------
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

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

  // 1️⃣ Save to database
  db.run(
    `
    INSERT INTO clients
    (name, email, project_type, preferred_date, song_link, notes, estimate)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [name, email, projectType, preferredDate, songLink, notes, estimate]
  );

  // 2️⃣ Send email
  try {
    await transporter.sendMail({
      from: `"Cerberus Visuals" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `[Booking] ${projectType || "New inquiry"} — ${name}`,
      text: `
Name: ${name}
Email: ${email}
Project type: ${projectType}
Preferred date(s): ${preferredDate}
Song link: ${songLink}

Notes:
${notes}

------------------
Estimate:
${estimate}
      `
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// ---------- Start server ----------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
