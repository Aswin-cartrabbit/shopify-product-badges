// pages/api/apps/judgeme/init.js
const initJudgeMe = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: true, message: "Method not allowed" });
  }

  const clientId = process.env.JUDGEME_CLIENT_ID;
  const redirectUri = `${process.env.SHOPIFY_APP_URL}/api/judgeme/callback`;
  const scopes = "reviews.read reviews.write"; // adjust based on Judge.me docs
  const state = "randomstring123"; // ideally a cryptographically secure random string

  const authUrl = `https://app.judge.me/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=${encodeURIComponent(scopes)}&state=${state}`;

  return res.redirect(authUrl);
};

export default initJudgeMe;
