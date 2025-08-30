import axios from "axios";

const callback = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: true, message: "Method not allowed" });
  }

  const { code, state, error } = req.query;

  if (error) {
    return res
      .status(400)
      .json({ error: true, message: `OAuth error: ${error}` });
  }

  if (!code) {
    return res
      .status(400)
      .json({ error: true, message: "Missing code parameter" });
  }

  try {
    const tokenRes = await axios.post("https://app.judge.me/oauth/token", {
      client_id: process.env.JUDGEME_CLIENT_ID,
      client_secret: process.env.JUDGEME_CLIENT_SECRET,
      code,
      redirect_uri: `${process.env.SHOPIFY_APP_URL}/api/auth/judgeme/callback`,
      grant_type: "authorization_code",
    });

    const { access_token, refresh_token, expires_in } = tokenRes.data;

    // Save tokens in DB (linked to org/shop/user)
    // Example with Prisma:
    // await prisma.integration.upsert({
    //   where: { orgId: currentOrgId },
    //   update: { accessToken: access_token, refreshToken: refresh_token, expiresAt: new Date(Date.now() + expires_in * 1000) },
    //   create: { orgId: currentOrgId, provider: "judgeme", accessToken: access_token, refreshToken: refresh_token, expiresAt: new Date(Date.now() + expires_in * 1000) }
    // });
    console.log('tokenRes.data', tokenRes.data);
    return res.status(200).json({
      status: true,
      message: "Judge.me integration successful",
      data: { access_token, refresh_token, expires_in },
    });
  } catch (err) {
    console.error("Judge.me OAuth Error:", err?.response?.data || err.message);
    return res
      .status(500)
      .json({ error: true, message: "Failed to exchange code for token" });
  }
};

export default callback;
