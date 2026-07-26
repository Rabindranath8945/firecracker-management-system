import { distance } from "fastest-levenshtein";

export function confidence(expected: string, actual: string): number {
  expected = expected.toUpperCase().trim();

  actual = actual.toUpperCase().trim();

  if (!expected || !actual) {
    return 0;
  }

  if (expected === actual) {
    return 100;
  }

  const maxLength = Math.max(expected.length, actual.length);

  const diff = distance(expected, actual);

  const score = ((maxLength - diff) / maxLength) * 100;

  return Math.max(0, Math.round(score));
}
