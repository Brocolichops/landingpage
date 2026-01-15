const RESEND_API_KEY = process.env.RESEND_API_KEY || null;

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
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
        from: process.env.EMAIL_FROM || `Aux Pictures Test <no-reply@auxpictures.com>` ,
        to: [process.env.EMAIL_TO],
        subject: "Test Email from Deployed Server",
        text: "If you received this, your Resend email setup works!"
      })
    });
    const info = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      return res.status(500).json({ error: "Test email failed", details: info });
    }
    res.json({ success: true, info });
  } catch (err) {
    res.status(500).json({ error: "Test email failed", details: err?.message });
  }
};