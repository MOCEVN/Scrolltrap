import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface InterestSelectorProps {
  interests: string[];
  onInterestsUpdate?: (interests: string[]) => void;
}

const InterestSelector: React.FC<InterestSelectorProps> = ({
  interests,
  onInterestsUpdate,
}) => {
  const availableInterests = [
    "nature",
    "office",
    "people",
    "technology",
    "abstract",
    "food",
    "sport",
    "science",
  ];

  const toggleInterest = (interest: string) => {
    let newInterests: string[];

    if (interests.includes(interest)) {
      newInterests = interests.filter((i) => i !== interest);
    } else {
      newInterests = [...interests, interest];
    }

    onInterestsUpdate?.(newInterests);
  };

  return (
    <View className="bg-white rounded-lg p-4 mx-4 my-4 shadow-sm border border-gray-100">
      <View className="mb-3">
        <Text className="text-gray-700 text-sm font-medium mb-1">
          Your Interests
        </Text>
        {interests.length > 0 ? (
          <Text className="text-gray-500 text-xs">
            {interests.length} {interests.length === 1 ? "topic" : "topics"}{" "}
            selected
          </Text>
        ) : (
          <Text className="text-blue-600 text-xs font-medium">
            👋 Select topics to get started
          </Text>
        )}
      </View>

      <View>
        <View className="flex-row flex-wrap gap-2">
          {availableInterests.map((interest) => (
            <TouchableOpacity
              key={interest}
              onPress={() => toggleInterest(interest)}
              className={`px-3 py-1.5 rounded-full border ${
                interests.includes(interest)
                  ? "bg-blue-100 border-blue-300"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <Text
                className={`text-xs font-medium ${
                  interests.includes(interest)
                    ? "text-blue-700"
                    : "text-gray-600"
                }`}
              >
                {interest}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text className="text-gray-500 text-xs mt-2 leading-4">
          Tap to select or deselect topics you&apos;d like to see
        </Text>
      </View>
    </View>
  );
};

export default InterestSelector;
