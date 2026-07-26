export function generateBusinessId() {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();

  return `MTS-${random}`;
}
