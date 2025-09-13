import { useState, useEffect, useCallback } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get value from localStorage or use initialValue
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        // Handle Date objects
        if (parsed && typeof parsed === "object") {
          Object.keys(parsed).forEach((key) => {
            if (
              parsed[key] &&
              typeof parsed[key] === "string" &&
              parsed[key].match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
            ) {
              parsed[key] = new Date(parsed[key]);
            }
          });
        }
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
