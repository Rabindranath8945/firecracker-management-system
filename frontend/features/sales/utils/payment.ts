export function getQuickAmounts(total: number): number[] {
  const notes = [50, 100, 200, 500, 1000, 2000, 5000, 10000];

  return notes.filter((note) => note >= total).slice(0, 3);
}
