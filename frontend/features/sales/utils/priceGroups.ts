export function getPriceGroups(prices: number[]) {
  if (prices.length === 0) {
    return ["All"];
  }

  const unique = [...new Set(prices)]
    .filter((price) => price > 0)
    .sort((a, b) => a - b);

  return ["All", ...unique.slice(0, 10)];
}
