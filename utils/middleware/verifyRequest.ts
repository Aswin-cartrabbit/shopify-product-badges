import sessionHandler from "@/utils/sessionHandler";
import shopify from "@/utils/shopify";
import { RequestedTokenType, Session } from "@shopify/shopify-api";
import validateJWT from "../validateJWT";
import prisma from "../prisma";

/**
 *
 * @async
 * @function verifyRequest
 * @param {import('next').NextApiRequest} req - The Next.js API request object, expected to have an 'authorization' header.
 * @param {import('next').NextApiResponse} res - The Next.js API response object, used to send back error messages if needed.
 * @param {import('next').NextApiHandler} next - Callback to pass control to the next middleware function in the Next.js API route.
 * @throws Will throw an error if the authorization header is missing or invalid, or if no shop is found in the payload.
 */
const verifyRequest = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      throw Error("No authorization header found.");
    }

    const payload = validateJWT(authHeader.split(" ")[1]);

    let shop = shopify.utils.sanitizeShop(payload.dest.replace("https://", ""));
    if (!shop) {
      throw Error("No shop found, not a valid request");
    }

    const sessionId = await shopify.session.getCurrentId({
      isOnline: true,
      rawRequest: req,
      rawResponse: res,
    });

    let session = await sessionHandler.loadSession(sessionId);
    if (!session) {
      session = await getSession({ shop, authHeader });
    }

    if (
      new Date(session?.expires) > new Date() &&
      shopify.config.scopes.equals(session?.scope)
    ) {
    } else {
      session = await getSession({ shop, authHeader });
    }

    //Add session and shop to the request object so any subsequent routes that use this middleware can access it
    req.user_session = session;
    req.user_shop = session.shop;
    
    // Get the storeId from the session for API endpoints
    if (session?.storeId) {
      req.user_id = session.storeId;
    } else {
      // If session doesn't have storeId, try to get it from the database
      const store = await prisma.stores.findUnique({
        where: { shop: session.shop }
      });
      if (store) {
        req.user_id = store.id;
      }
    }

    await next();

    return;
  } catch (e) {
    console.error(
      `---> An error happened at verifyRequest middleware: ${e.message}`
    );
    return res.status(401).send({ error: "Unauthorized call" });
  }
};

export default verifyRequest;

/**
 * Retrieves and stores session information based on the provided authentication header and offline flag.
 *
 * @async
 * @function getSession
 * @param {Object} params - The function parameters.
 * @param {string} params.shop - The xxx.myshopify.com url of the requesting store.
 * @param {string} params.authHeader - The authorization header containing the session token.
 * @returns {Promise<Session>} The online session object
 */

async function getSession({ shop, authHeader }) {
  try {
    const sessionToken = authHeader.split(" ")[1];

    // Find or create the store first
    const store = await prisma.stores.upsert({
      where: { shop },
      update: { isActive: true },
      create: { shop, isActive: true },
    });

    const { session: onlineSession } = await shopify.auth.tokenExchange({
      sessionToken,
      shop,
      requestedTokenType: RequestedTokenType.OnlineAccessToken,
    });

    // Add storeId to the session before storing
    const onlineSessionWithStore = { ...onlineSession, storeId: store.id };
    await sessionHandler.storeSession(onlineSessionWithStore);

    const { session: offlineSession } = await shopify.auth.tokenExchange({
      sessionToken,
      shop,
      requestedTokenType: RequestedTokenType.OfflineAccessToken,
    });

    // Add storeId to the session before storing
    const offlineSessionWithStore = { ...offlineSession, storeId: store.id };
    await sessionHandler.storeSession(offlineSessionWithStore);

    return new Session(onlineSessionWithStore);
  } catch (e) {
    console.error(
      `---> Error happened while pulling session from Shopify: ${e.message}`
    );
  }
}
