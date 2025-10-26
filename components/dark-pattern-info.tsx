import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const DarkPatternInfo: React.FC = () => {
  const [showComparison, setShowComparison] = useState(false);

  const darkPatterns = [
    {
      title: "Infinite Scroll",
      dark: "Never-ending content with no natural stopping points",
      light:
        "Natural break points every 20 images with pause prompts and time awareness",
    },
    {
      title: "Likes & Engagement",
      dark: "Addictive mechanics with public counters creating competition",
      light: "Likes are private and only for easier access later",
    },
    {
      title: "Content Algorithm",
      dark: "engagement-maximizing content that addicts users using algorithms",
      light: "Diverse content based on your own interests",
    },
    {
      title: "Time Pressure",
      dark: "FOMO tactics, streaks, and urgent notifications",
      light: "Gentle time awareness and encouragement to take breaks",
    },
  ];

  return (
    <>
      <TouchableOpacity
        onPress={() => setShowComparison(!showComparison)}
        className="absolute bottom-20 right-4 z-10 w-12 h-12 bg-white rounded-full items-center justify-center shadow-lg border border-gray-200"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <Text className="text-2xl">{showComparison ? "✕" : "?"}</Text>
      </TouchableOpacity>

      {showComparison && (
        <View
          className="absolute bottom-36 z-10 bg-white border border-gray-200 rounded-lg p-5 shadow-xl"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 8,
            left: "10%",
            right: "10%",
            maxHeight: "65%",
          }}
        >
          <Text className="text-gray-900 font-bold mb-4 text-center text-lg">
            Common Dark Patterns vs. Our Approach
          </Text>

          <ScrollView style={{ maxHeight: 500 }}>
            {darkPatterns.map((pattern, index) => (
              <View key={index} className="mb-4 last:mb-0">
                <Text className="font-semibold text-gray-800 mb-2">
                  {pattern.title}
                </Text>

                <View className="bg-red-50 border-l-4 border-red-400 p-3 mb-2">
                  <Text className="text-red-800 text-sm">
                    ❌ Dark Pattern: {pattern.dark}
                  </Text>
                </View>

                <View className="bg-green-50 border-l-4 border-green-400 p-3">
                  <Text className="text-green-800 text-sm">
                    ✅ Our Approach: {pattern.light}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </>
  );
};

export default DarkPatternInfo;
