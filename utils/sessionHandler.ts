import { Session } from "@shopify/shopify-api";
import cryption from "./cryption";
import prisma from "./prisma";

/**
 * Stores the session data into the database.
 *
 * @param {Session} session - The Shopify session object.
 * @returns {Promise<boolean>} Returns true if the operation was successful.
 */
const storeSession = async (session) => {
  console.log("=====================================");
  console.log(session);
  console.log("=====================================");
  
  let storeId = session.storeId;
  
  // If session doesn't have a storeId, find or create the store
  if (!storeId && session.shop) {
    const store = await prisma.stores.upsert({
      where: { shop: session.shop },
      update: { isActive: true },
      create: { shop: session.shop, isActive: true },
    });
    storeId = store.id;
  }
  
  // If we still don't have a storeId, something is wrong
  if (!storeId) {
    throw new Error(`Unable to determine storeId for session ${session.id}. Session must have either storeId or shop property.`);
  }

  await prisma.session.upsert({
    where: { id: session.id },
    update: {
      content: cryption.encrypt(JSON.stringify(session)),
      shop: session.shop,
      type: session.isOnline ? "ONLINE" : "OFFLINE",
      storeId: storeId,
    },
    create: {
      id: session.id,
      content: cryption.encrypt(JSON.stringify(session)),
      shop: session.shop,
      type: session.isOnline ? "ONLINE" : "OFFLINE",
      storeId: storeId,
    },
  });

  return true;
};

/**
 * Loads the session data from the database.
 *
 * @param {string} id - The session ID.
 * @returns {Promise<Session|undefined>} Returns the Shopify session object or undefined if not found.
 */
const loadSession = async (id) => {
  const sessionResult = await prisma.session.findUnique({ where: { id } });

  if (sessionResult === null) {
    return undefined;
  }
  if (sessionResult.content.length > 0) {
    const sessionObj = JSON.parse(cryption.decrypt(sessionResult.content));
    return new Session(sessionObj);
  }
  return undefined;
};

/**
 * Deletes the session data from the database.
 *
 * @param {string} id - The session ID.
 * @returns {Promise<boolean>} Returns true if the operation was successful.
 */
const deleteSession = async (id) => {
  await prisma.session.deleteMany({ where: { id } });

  return true;
};

/**
 * Session handler object containing storeSession, loadSession, and deleteSession functions.
 */
const sessionHandler = { storeSession, loadSession, deleteSession };

export default sessionHandler;
