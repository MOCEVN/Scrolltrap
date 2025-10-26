import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "@scrolltrap_interests";

export const useInterests = () => {
  const [interests, setInterests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInterests = async () => {
      try {
        const storedInterests = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedInterests) {
          setInterests(JSON.parse(storedInterests));
        }
      } catch (error) {
        console.error("Failed to load interests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInterests();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const saveInterests = async () => {
        try {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(interests));
        } catch (error) {
          console.error("Failed to save interests:", error);
        }
      };

      saveInterests();
    }
  }, [interests, isLoading]);

  const updateInterests = useCallback((newInterests: string[]) => {
    setInterests(newInterests);
  }, []);

  const clearInterests = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setInterests([]);
    } catch (error) {
      console.error("Failed to clear interests:", error);
    }
  }, []);

  return {
    interests,
    updateInterests,
    clearInterests,
    isLoading,
  };
};
