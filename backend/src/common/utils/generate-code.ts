export function generateSequenceCode(codes: string[], prefix: string): string {
  if (codes.length === 0) {
    return `${prefix}001`;
  }

  const lastNumber = Math.max(
    ...codes.map((code) => {
      const match = code.match(/\d+$/);

      return match ? parseInt(match[0], 10) : 0;
    }),
  );

  return `${prefix}${String(lastNumber + 1).padStart(3, "0")}`;
}
