const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateBusinessId(): string {
  let id = "MTS-";

  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return id;
}
