'use client';

import type { ImageItem } from '@/types/image';
import { useCallback, useState } from 'react';

const STORAGE_KEY = 'scrolltrap_liked_images';

const readStoredLikes = (): ImageItem[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is ImageItem => {
      if (!item || typeof item !== 'object') {
        return false;
      }

      return (
        typeof item.id === 'string' &&
        typeof item.url === 'string' &&
        typeof item.width === 'number' &&
        typeof item.height === 'number' &&
        typeof item.topic === 'string'
      );
    });
  } catch (error) {
    console.error('Failed to parse stored liked images', error);
    return [];
  }
};

export const useLikedImages = () => {
  const [likedImages, setLikedImages] = useState<ImageItem[]>(() => readStoredLikes());

  const persist = useCallback((images: ImageItem[]) => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
    } catch (error) {
      console.error('Failed to persist liked images', error);
    }
  }, []);

  const toggleLike = useCallback(
    (imageId: string, imageData: ImageItem) => {
      setLikedImages((prev) => {
        const exists = prev.some((image) => image.id === imageId);
        const next = exists
          ? prev.filter((image) => image.id !== imageId)
          : [...prev, imageData];

        persist(next);
        return next;
      });
    },
    [persist],
  );

  const isImageLiked = useCallback(
    (imageId: string) => likedImages.some((image) => image.id === imageId),
    [likedImages],
  );

  const clearAllLikes = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }

    setLikedImages([]);
  }, []);

  return {
    likedImages,
    toggleLike,
    isImageLiked,
    clearAllLikes,
    likedCount: likedImages.length,
    isLoading: false as const,
  } as const;
};
