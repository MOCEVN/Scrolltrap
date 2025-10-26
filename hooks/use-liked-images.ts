import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

interface ImageItem {
  id: string;
  url: string;
  width: number;
  height: number;
  topic: string;
}

const LIKED_IMAGES_KEY = "@scrolltrap_liked_images";

export const useLikedImages = () => {
  const [likedImages, setLikedImages] = useState<ImageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLikedImages = async () => {
      try {
        const stored = await AsyncStorage.getItem(LIKED_IMAGES_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setLikedImages(parsed);
        }
      } catch (error) {
        console.error("Error loading liked images:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLikedImages();
  }, []);

  const saveLikedImages = useCallback(async (images: ImageItem[]) => {
    try {
      await AsyncStorage.setItem(LIKED_IMAGES_KEY, JSON.stringify(images));
    } catch (error) {
      console.error("Error saving liked images:", error);
    }
  }, []);

  const toggleLike = useCallback(
    (imageId: string, imageData: ImageItem) => {
      setLikedImages((prev) => {
        const existingIndex = prev.findIndex((img) => img.id === imageId);
        let newLikedImages: ImageItem[];

        if (existingIndex !== -1) {
          newLikedImages = prev.filter((img) => img.id !== imageId);
        } else {
          newLikedImages = [...prev, imageData];
        }

        saveLikedImages(newLikedImages);

        return newLikedImages;
      });
    },
    [saveLikedImages]
  );

  const isImageLiked = useCallback(
    (imageId: string) => {
      return likedImages.some((img) => img.id === imageId);
    },
    [likedImages]
  );

  const clearAllLikes = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(LIKED_IMAGES_KEY);
      setLikedImages([]);
    } catch (error) {
      console.error("Error clearing liked images:", error);
    }
  }, []);

  return {
    likedImages,
    toggleLike,
    isImageLiked,
    clearAllLikes,
    likedCount: likedImages.length,
    isLoading,
  };
};
