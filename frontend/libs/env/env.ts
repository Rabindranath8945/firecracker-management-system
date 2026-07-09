const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

if (!apiUrl) {
  throw new Error("NEXT_PUBLIC_API_URL is missing.");
}

if (!googleClientId) {
  throw new Error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is missing.");
}

export const env = {
  apiUrl,
  googleClientId,
} as const;
