import type { TestData } from "../types/data";

export const STORAGE_PREFIX = "psyco-quizz";

export function getStorageKey(testId: string, lang: string): string {
  return `${STORAGE_PREFIX}_${testId}${lang ? `_${lang}` : ""}`;
}

export function loadTestData(testId: string, lang: string): TestData | null {
  try {
    const item = window.localStorage.getItem(getStorageKey(testId, lang));
    return item ? (JSON.parse(item) as TestData) : null;
  } catch {
    return null;
  }
}

export function saveTestData(testData: TestData, lang: string): void {
  try {
    window.localStorage.setItem(
      getStorageKey(testData.id, lang),
      JSON.stringify(testData)
    );
  } catch {
    // ignore
  }
}

export function clearTestData(testId: string, lang: string): void {
  try {
    window.localStorage.removeItem(getStorageKey(testId, lang));
  } catch {
    // ignore
  }
}
