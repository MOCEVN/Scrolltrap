import React, { useEffect, useState } from "react";
import { Animated, Modal, Text, TouchableOpacity, View } from "react-native";

const TimeAwareness: React.FC = () => {
  const [sessionTime, setSessionTime] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationLevel, setNotificationLevel] = useState<
    "info" | "warning" | "danger"
  >("info");
  const [canDismiss, setCanDismiss] = useState(true);
  const [progress] = useState(new Animated.Value(0));

  useEffect(() => {
    const startTime = Date.now();

    const startTimeout = () => {
      progress.setValue(0);

      Animated.timing(progress, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: false,
      }).start(() => {
        setCanDismiss(true);
      });
    };

    const interval = setInterval(() => {
      const currentTime = Date.now();
      const timeSpent = Math.floor((currentTime - startTime) / 1000);
      setSessionTime(timeSpent);

      // 2 minutes
      if (timeSpent === 120) {
        setNotificationLevel("info");
        setCanDismiss(true);
        setShowNotification(true);
        // 5 minutes
      } else if (timeSpent === 300) {
        setNotificationLevel("warning");
        setCanDismiss(true);
        setShowNotification(true);
        // 10 minutes
      } else if (timeSpent === 600) {
        setNotificationLevel("danger");
        setCanDismiss(false);
        setShowNotification(true);
        startTimeout();
        // Every 5 min after 10 min
      } else if (timeSpent > 600 && timeSpent % 300 === 0) {
        setNotificationLevel("danger");
        setCanDismiss(false);
        setShowNotification(true);
        startTimeout();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [progress]);

  const handleDismiss = () => {
    if (!canDismiss) return;
    setShowNotification(false);
  };

  const minutes = Math.floor(sessionTime / 60);

  const getMessage = () => {
    if (notificationLevel === "info") {
      return {
        emoji: "📱",
        title: "Time Check",
        message: `You've been scrolling for ${minutes} minutes`,
        suggestion: "",
      };
    }
    if (notificationLevel === "warning") {
      return {
        emoji: "⏰",
        title: "Time Reminder",
        message: `${minutes} minutes of browsing`,
        suggestion: "Consider taking a short break soon",
      };
    }
    return {
      emoji: "🛑",
      title: "Break Reminder",
      message: `You've been here for ${minutes} minutes`,
      suggestion: "Time to rest your eyes!",
    };
  };

  const { emoji, title, message, suggestion } = getMessage();

  const getModalColors = () => {
    if (notificationLevel === "info") {
      return {
        primary: "#3b82f6", // blue
        secondary: "#93c5fd",
        text: "#1e40af",
      };
    }
    if (notificationLevel === "warning") {
      return {
        primary: "#f59e0b", // yellow

        secondary: "#fcd34d",
        text: "#92400e",
      };
    }
    return {
      primary: "#ef4444", // red
      secondary: "#fca5a5",
      text: "#991b1b",
    };
  };

  const colors = getModalColors();

  return (
    <Modal
      visible={showNotification}
      transparent={true}
      animationType="fade"
      onRequestClose={handleDismiss}
    >
      <View
        className="flex-1 items-center justify-center px-6"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
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
          <Text className="text-6xl text-center mb-4">{emoji}</Text>
          <Text
            className="font-bold text-2xl text-center mb-3"
            style={{ color: colors.text }}
          >
            {title}
          </Text>

          <Text className="text-gray-700 text-center text-lg mb-2 font-medium">
            {message}
          </Text>
          <Text className="text-gray-600 text-center mb-6 leading-relaxed">
            {suggestion}
          </Text>

          {notificationLevel === "danger" && !canDismiss && (
            <View className="mb-6">
              <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <Animated.View
                  style={{
                    height: "100%",
                    backgroundColor: colors.primary,
                    width: progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0%", "100%"],
                    }),
                  }}
                />
              </View>
              <Text className="text-xs text-gray-500 text-center mt-2">
                Please wait {Math.ceil((1 - (progress as any)._value) * 5)}{" "}
                seconds...
              </Text>
            </View>
          )}

          <View className="gap-3">
            <TouchableOpacity
              onPress={handleDismiss}
              disabled={!canDismiss}
              className="px-6 py-4 rounded-xl"
              style={{
                backgroundColor: canDismiss ? colors.primary : "#d1d5db",
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: canDismiss ? 0.3 : 0.1,
                shadowRadius: 4,
                elevation: 4,
                opacity: canDismiss ? 1 : 0.6,
              }}
            >
              <Text className="text-white font-bold text-center text-base">
                Got it, thanks!
              </Text>
            </TouchableOpacity>

            {notificationLevel === "danger" && (
              <TouchableOpacity
                onPress={handleDismiss}
                disabled={!canDismiss}
                className="bg-gray-100 px-6 py-4 rounded-xl border border-gray-300"
                style={{
                  opacity: canDismiss ? 1 : 0.6,
                }}
              >
                <Text className="text-gray-700 font-semibold text-center text-base">
                  I&apos;ll take a break
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <Text className="text-gray-400 text-xs text-center mt-4">
            We care about your wellbeing 💙
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default TimeAwareness;
