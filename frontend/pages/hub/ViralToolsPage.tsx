import { Calculator, Heart, Clock, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { AppleStyleCard } from "../../components/AppleStyleCard";
import { SEOHead } from "@/components/SEOHead";

const viralCalculators = [
  {
    title: "Love Compatibility Calculator 💕",
    description: "Discover your cosmic connection! Calculate love compatibility with your crush based on zodiac signs and numerology.",
    icon: Heart,
    path: "/calculators/viral/love-compatibility",
    color: "text-pink-500",
    bgColor: "bg-pink-50 dark:bg-pink-950/20",
    emoji: "💕",
    tooltip: "Test your love chemistry!"
  },
  {
    title: "Zodiac Compatibility Calculator ✨",
    description: "Discover your cosmic connection! Find out how compatible you are with your crush based on zodiac signs.",
    icon: Heart,
    path: "/calculators/viral/zodiac-compatibility",
    color: "text-pink-500",
    bgColor: "bg-pink-50 dark:bg-pink-950/20",
    emoji: "✨",
    tooltip: "Match your stars!"
  },
  {
    title: "Life Path Number Calculator 🔮",
    description: "Unlock numerology secrets! Calculate your Life Path Number and discover your destiny, personality traits, and life purpose.",
    icon: Sparkles,
    path: "/calculators/viral/life-path-number",
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    emoji: "🔮",
    tooltip: "What's your destiny number?"
  },
  {
    title: "Friend Compatibility Test 👯",
    description: "Test your friendship! Calculate compatibility score with your BFF based on interests, personality, and vibes.",
    icon: Heart,
    path: "/calculators/viral/friend-compatibility",
    color: "text-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    emoji: "👯",
    tooltip: "Are you really BFFs?"
  },

  {
    title: "Life Expectancy Calculator ⏰",
    description: "Estimate your lifespan based on lifestyle, health habits, and genetics. Get personalized longevity insights!",
    icon: Clock,
    path: "/calculators/viral/life-expectancy",
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    emoji: "⏰",
    tooltip: "How many years left?"
  },
  {
    title: "Binge Watch Calculator 📺",
    description: "Calculate exactly how much time you need to binge your favorite TV shows and movies!",
    icon: Clock,
    path: "/calculators/viral/how-long-to-watch",
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    emoji: "📺",
    tooltip: "Plan your binge session!"
  }
];

export default function ViralToolsPage() {
  return (
    <>
      <SEOHead
        title="Viral Calculators 🔥 - Fun & Shareable Tools | Smart Calculator Hubs"
        description="Explore our collection of fun, viral calculators! From zodiac compatibility to binge-watch time calculators - share with friends and have fun!"
        keywords="viral calculators, fun calculators, zodiac compatibility, binge watch calculator, shareable tools, entertainment calculators"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-500 rounded-3xl mb-6 shadow-lg">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
              Viral Calculators 🔥
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Fun, shareable calculators that everyone loves! From zodiac compatibility to binge-watching time - 
              discover entertaining tools you'll want to share with friends.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {viralCalculators.map((calc, index) => {
              const Icon = calc.icon;
              return (
                <Link key={index} to={calc.path} className="group" title={calc.tooltip}>
                  <AppleStyleCard className="h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                    <div className="p-6">
                      <div className={`inline-flex items-center justify-center w-16 h-16 ${calc.bgColor} rounded-2xl mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-8 h-8 ${calc.color}`} />
                      </div>
                      <div className="mb-3">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {calc.title}
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{calc.tooltip}</p>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {calc.description}
                      </p>
                      <div className="mt-4 flex items-center text-purple-600 dark:text-purple-400 font-semibold group-hover:gap-3 gap-2 transition-all text-sm">
                        Try it now
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                  </AppleStyleCard>
                </Link>
              );
            })}
          </div>

          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <Calculator className="w-8 h-8 text-purple-600" />
              Why Use Viral Calculators?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-2">🎉 Fun & Entertaining</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  These calculators are designed to be enjoyable and shareable. Perfect for social media, group chats, and conversations with friends.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-2">🤖 AI-Powered Insights</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Get personalized, entertaining insights powered by advanced AI analysis based on your inputs.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-2">📱 Easy Sharing</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Share your results instantly on Twitter, Instagram, WhatsApp, or copy a shareable link with one click.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-2">💯 100% Free</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  All viral calculators are completely free to use with no hidden costs or subscriptions required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}