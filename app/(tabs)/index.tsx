import AntiDarkPatternInfo from "@/components/dark-pattern-info";
import InterestSelector from "@/components/interest-selector";
import MasonryGrid from "@/components/masonry-grid";
import TimeAwareness from "@/components/time-awareness";
import { useInterests } from "@/hooks/use-interests";
import { useLikedImages } from "@/hooks/use-liked-images";
import React, { useCallback, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const [showLikedOnly, setShowLikedOnly] = useState(false);

  const { interests, updateInterests } = useInterests();
  const { likedImages, toggleLike, isImageLiked, likedCount } =
    useLikedImages();

  const handleInterestsUpdate = useCallback(
    (newInterests: string[]) => {
      updateInterests(newInterests);
    },
    [updateInterests]
  );

  const handleToggleShowLiked = useCallback(() => {
    setShowLikedOnly((prev) => !prev);
  }, []);

  return (
    <View className="flex-1 bg-gray-50">
      <TimeAwareness />

      <View className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-gray-900 font-bold text-lg">
              {showLikedOnly ? "Your Liked Images" : "Explore"}
            </Text>
          </View>


          {likedCount > 0 && (
            <TouchableOpacity
              onPress={handleToggleShowLiked}
              className={`px-2 rounded-full flex-row items-center gap-2 ${
                showLikedOnly ? "bg-pink-500" : "bg-pink-50"
              }`}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                elevation: 3,
              }}
            >
           <Text className="text-xs font-bold">
            {showLikedOnly ? (
              <>
                <Text className="text-white">Viewing likes</Text>
              </>
            ) : (
              <>
                <Text className="text-pink-600">Show likes</Text>
              </>
            )}
          </Text>
              <Text
                className={`text-base font-bold ${
                  showLikedOnly ? "text-white" : "text-pink-600"
                }`}
              >
               ❤️ {likedCount}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {!showLikedOnly && (
        <InterestSelector
          interests={interests}
          onInterestsUpdate={handleInterestsUpdate}
        />
      )}

      <MasonryGrid
        numColumns={4}
        spacing={8}
        userInterests={interests}
        likedImages={likedImages}
        toggleLike={toggleLike}
        isImageLiked={isImageLiked}
        showLikedOnly={showLikedOnly}
        onToggleShowLiked={handleToggleShowLiked}
      />
      <AntiDarkPatternInfo />
    </View>
  );
}