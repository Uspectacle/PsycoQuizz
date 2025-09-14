import { useState, useEffect, useCallback } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get value from localStorage or use initialValue
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        return parsed as T;
      }
      return initialValue;
    } catch {
      return initialValue;
    }
  });

  // Update localStorage when value changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  }, [key, value]);

  // Provide a clear method
  const clear = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setValue(initialValue);
    } catch (error) {
      console.error("Failed to clear localStorage:", error);
    }
  }, [key, initialValue]);

  // Return value, setter, and clear method
  return [value, setValue, clear] as const;
}
