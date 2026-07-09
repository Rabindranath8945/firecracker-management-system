export function generateSku(last = 1) {
  return `PRD-${last.toString().padStart(6, "0")}`;
}
