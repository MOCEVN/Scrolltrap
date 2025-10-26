import { Image } from "expo-image";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ImageItem {
  id: string;
  url: string;
  width: number;
  height: number;
  topic: string;
}

interface MasonryGridProps {
  numColumns: number;
  spacing: number;
  userInterests: string[];
  likedImages: ImageItem[];
  toggleLike: (imageId: string, imageData: ImageItem) => void;
  isImageLiked: (imageId: string) => boolean;
  showLikedOnly?: boolean;
  onToggleShowLiked?: () => void;
}

const MasonryGrid: React.FC<MasonryGridProps> = ({
  numColumns,
  spacing,
  userInterests,
  likedImages,
  toggleLike,
  isImageLiked,
  showLikedOnly = false,
  onToggleShowLiked,
}) => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastInterests, setLastInterests] = useState<string[]>([]);
  const [showBreakPoint, setShowBreakPoint] = useState(false);
  const [imagesViewedInSession, setImagesViewedInSession] = useState(0);

  const screenWidth = Dimensions.get("window").width;
  const columnWidth = (screenWidth - spacing * (numColumns + 1)) / numColumns;

  const generateImages = useCallback(
    (count: number, startIndex: number = 0): ImageItem[] => {
      if (userInterests.length === 0) return [];

      return Array.from({ length: count }, (_, index) => {
        const width = 640;
        const height = 360;
        const globalIndex = startIndex + index;
        const topic = userInterests[globalIndex % userInterests.length];

        return {
          id: `${topic}-${globalIndex}`,
          url: `https://static.photos/${topic}/${width}x${height}/${globalIndex}`,
          width,
          height,
          topic,
        };
      });
    },
    [userInterests]
  );

  const loadImages = useCallback(() => {
    const interestsChanged =
      JSON.stringify(userInterests) !== JSON.stringify(lastInterests);

    if (!interestsChanged && images.length > 0) {
      return;
    }

    setLoading(true);
    setLastInterests(userInterests);

    setTimeout(() => {
      const newImages = generateImages(20);
      setImages(newImages);
      setLoading(false);
    }, 500);
  }, [generateImages, userInterests, lastInterests, images.length]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  const loadMoreImages = useCallback(() => {
    if (loadingMore || showBreakPoint) return;

    const newCount = images.length + 10;

    if (newCount % 20 === 0 && newCount > 0) {
      setShowBreakPoint(true);
      setImagesViewedInSession(newCount);
      return;
    }

    setLoadingMore(true);
    setTimeout(() => {
      setImages((prevImages) => {
        const moreImages = generateImages(10, prevImages.length);
        return [...prevImages, ...moreImages];
      });
      setLoadingMore(false);
    }, 300);
  }, [generateImages, loadingMore, images.length, showBreakPoint]);

  const handleContinueScrolling = useCallback(() => {
    setShowBreakPoint(false);
    setLoadingMore(true);
    setTimeout(() => {
      setImages((prevImages) => {
        const moreImages = generateImages(10, prevImages.length);
        return [...prevImages, ...moreImages];
      });
      setLoadingMore(false);
    }, 300);
  }, [generateImages]);

  const calculateImageHeight = (
    originalWidth: number,
    originalHeight: number
  ): number => {
    return (originalHeight * columnWidth) / originalWidth;
  };

  const renderColumns = () => {
    const columns: ImageItem[][] = Array.from({ length: numColumns }, () => []);

    const displayImages = showLikedOnly ? likedImages : images;

    displayImages.forEach((image, index) => {
      const columnIndex = index % numColumns;
      columns[columnIndex].push(image);
    });

    return columns.map((column, columnIndex) => (
      <View
        key={columnIndex}
        className="flex-1"
        style={{ marginHorizontal: spacing / 2 }}
      >
        {column.map((image) => {
          const imageHeight = calculateImageHeight(image.width, image.height);
          const isLiked = isImageLiked(image.id);

          return (
            <View
              key={image.id}
              style={{
                marginBottom: spacing,
                height: imageHeight,
                position: "relative",
              }}
            >
              <Image
                source={{ uri: image.url }}
                style={{
                  width: "100%",
                  height: "100%",
                }}
                contentFit="cover"
                transition={300}
                cachePolicy="memory-disk"
                priority="normal"
                placeholder="L6PZfSjE.AyE_3t7t7R**0o#DgR4"
                recyclingKey={image.id}
              />

              <View className="absolute top-3 left-3">
                <View
                  className="px-3 py-1.5 rounded-full"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.95)",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.2,
                    shadowRadius: 2,
                    elevation: 2,
                  }}
                >
                  <Text className="text-xs font-semibold text-gray-800 capitalize">
                    {image.topic}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => toggleLike(image.id, image)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full items-center justify-center"
                style={{
                  backgroundColor: "rgba(255,255,255,0.95)",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.2,
                  shadowRadius: 2,
                  elevation: 2,
                }}
              >
                <Text className="text-lg">{isLiked ? "❤️" : "🤍"}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    ));
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (userInterests.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 p-8">
        <Text className="text-gray-500 text-center">
          Select some interests to see images
        </Text>
      </View>
    );
  }

  if (showLikedOnly && likedImages.length === 0) {
    return (
      <View className="flex-1 bg-gray-50">
        <ScrollView contentContainerStyle={{ padding: spacing }}>
          <TouchableOpacity
            onPress={onToggleShowLiked}
            className="bg-white rounded-xl p-4 border-2 border-pink-300 mb-4"
          >
            <View className="flex-row items-center justify-center gap-2">
              <Text className="font-bold text-base text-pink-600">
                Back to All Images
              </Text>
            </View>
          </TouchableOpacity>

          <View className="items-center justify-center py-12">
            <Text className="text-gray-700 text-lg font-semibold text-center mb-2">
              No Liked Images Yet
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <>
      <Modal
        visible={showBreakPoint}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowBreakPoint(false)}
      >
        <View
          className="flex-1 bg-black/50 items-center justify-center px-6"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <View
            className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-md"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 12,
            }}
          >
            <Text className="text-6xl text-center mb-4">🌸</Text>
            <Text className="text-gray-900 font-bold text-2xl text-center mb-3">
              Do you want to take a break?
            </Text>
            <Text className="text-blue-600 text-center text-base mb-2 font-medium">
              You&apos;ve explored {imagesViewedInSession} images
            </Text>

            <View className="gap-3">
              <TouchableOpacity
                onPress={handleContinueScrolling}
                className="bg-blue-500 px-6 py-4 rounded-xl"
                style={{
                  shadowColor: "#3b82f6",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 4,
                }}
              >
                <Text className="text-white font-bold text-center text-base">
                  Continue Exploring
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowBreakPoint(false)}
                className="bg-gray-100 px-6 py-4 rounded-xl border border-gray-300"
              >
                <Text className="text-gray-700 font-semibold text-center text-base">
                  Take a Break
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView
        className="flex-1 bg-gray-50"
        contentContainerStyle={{ padding: spacing }}
        showsVerticalScrollIndicator={false}
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const paddingToBottom = 20;
          if (
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom
          ) {
            loadMoreImages();
          }
        }}
        scrollEventThrottle={400}
      >
        <View className="flex-row" style={{ marginHorizontal: -spacing / 2 }}>
          {renderColumns()}
        </View>
        {loadingMore && (
          <View className="py-4 items-center">
            <ActivityIndicator size="small" color="#6366f1" />
          </View>
        )}
      </ScrollView>
    </>
  );
};

export default MasonryGrid;
