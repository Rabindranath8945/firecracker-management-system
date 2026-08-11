export function getImageUrl(path?: string) {
  if (!path) return "";

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const backendUrl =
    process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") ??
    "http://localhost:5000";

  return `${backendUrl}${path}`;
}
