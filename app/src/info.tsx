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
    <div className="min-h-screen bg-black p-4 overflow-y-auto">
      <h1 className="text-white text-3xl font-bold mb-6 text-center">
        Dark Pattern vs. Our Approach
      </h1>

      {darkPatterns.map((pattern, index) => (
        <div key={index} className="mb-6">
          <h2 className="text-lg text-white font-semibold mb-2">
            {pattern.title}
          </h2>

          <div className="bg-red-50 border-l-4 border-red-400 p-3 mb-2 rounded-md">
            <p className="text-red-800 text-sm">
              ❌ Dark Pattern: {pattern.dark}
            </p>
          </div>

          <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded-md">
            <p className="text-green-800 text-sm">
              ✅ Our Approach: {pattern.light}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
