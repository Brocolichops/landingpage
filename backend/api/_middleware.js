// Vercel Middleware for CORS (Netlify frontend)

// Always allow auxpictures.com (GitHub Pages custom domain) for CORS
module.exports = (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://auxpictures.com");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  next();
};
