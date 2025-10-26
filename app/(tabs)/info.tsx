import { ScrollView, Text, View } from "react-native";

export default function Create() {
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
      dark: "Engagement-maximizing content that addicts users using algorithms",
      light: "Diverse content based on your own interests",
    },
    {
      title: "Time Pressure",
      dark: "FOMO tactics, streaks, and urgent notifications",
      light: "Gentle time awareness and encouragement to take breaks",
    },
  ];

  return (
    <ScrollView className="flex-1 bg-black p-4">
      <Text className="text-white text-3xl font-bold mb-6 text-center">
        Dark Pattern vs. Our Approach
      </Text>

      {darkPatterns.map((pattern, index) => (
        <View key={index} className="mb-6">
          <Text className="text-lg text-white font-semibold mb-2">
            {pattern.title}
          </Text>

          <View className="bg-red-50 border-l-4 border-red-400 p-3 mb-2 rounded-md">
            <Text className="text-red-800 text-sm">
              ❌ Dark Pattern: {pattern.dark}
            </Text>
          </View>

          <View className="bg-green-50 border-l-4 border-green-400 p-3 rounded-md">
            <Text className="text-green-800 text-sm">
              ✅ Our Approach: {pattern.light}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
