import type { TestData } from "../types/data";

export const STORAGE_PREFIX = "psyco-quizz";

export function getStorageKey(testId: string): string {
  return `${STORAGE_PREFIX}_${testId}`;
}

export function loadTestData(testId: string): TestData | null {
  try {
    const item = window.localStorage.getItem(getStorageKey(testId));
    return item ? (JSON.parse(item) as TestData) : null;
  } catch {
    return null;
  }
}

export function saveTestData(testData: TestData): void {
  try {
    window.localStorage.setItem(
      getStorageKey(testData.id),
      JSON.stringify(testData)
    );
  } catch {
    // ignore
  }
}

export function clearTestData(testId: string): void {
  try {
    window.localStorage.removeItem(getStorageKey(testId));
  } catch {
    // ignore
  }
}
