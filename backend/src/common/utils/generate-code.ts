export function generateSequenceCode(codes: string[], prefix: string): string {
  const normalizedPrefix = prefix.trim().toUpperCase();

  if (!normalizedPrefix) {
    throw new Error("Number series prefix is required.");
  }

  if (codes.length === 0) {
    return `${normalizedPrefix}-0001`;
  }

  const lastNumber = Math.max(
    ...codes.map((code) => {
      const match = code.match(/\d+$/);

      return match ? parseInt(match[0], 10) : 0;
    }),
  );

  return `${normalizedPrefix}-${String(lastNumber + 1).padStart(4, "0")}`;
}
