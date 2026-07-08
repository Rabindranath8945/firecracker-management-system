import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export interface GoogleProfile {
  googleId: string;
  email: string;
  picture?: string;
}

export async function verifyGoogleToken(
  credential: string,
): Promise<GoogleProfile> {
  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload) {
    throw new Error("Invalid Google Token");
  }

  return {
    googleId: payload.sub,
    email: payload.email!,
    picture: payload.picture,
  };
}
