import { Search, Flame, Leaf, Dog, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { AppleStyleCard } from "../../components/AppleStyleCard";
import { SEOHead } from "@/components/SEOHead";

const finderTools = [
  {
    title: "AI Plant Finder 🌿",
    description: "Identify your plant and check its health using AI. Upload a photo to get instant care tips — 100% free and powered by OpenAI.",
    icon: Leaf,
    path: "/finder/tools/plantfinder",
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    emoji: "🌿",
    tooltip: "Snap & Identify"
  },
  {
    title: "Pet Breed Finder 🐾",
    description: "Identify dog & cat breeds instantly with AI! Upload a photo and discover breed name, fun facts, and care tips — 100% free.",
    icon: Dog,
    path: "/finder/tools/pet-breed-finder",
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    emoji: "🐶",
    tooltip: "What breed is it?"
  },
  {
    title: "Home Decor Style Finder 🏠",
    description: "Discover your interior design style with AI! Upload a room photo and get style analysis, color palette, and decor tips — free!",
    icon: Home,
    path: "/finder/tools/home-decor-style-finder",
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    emoji: "🎨",
    tooltip: "Find your style"
  },
  {
    title: "Calorie Burn Calculator 🔥",
    description: "Find out how long to exercise to burn off your favorite foods! From burgers to donuts - see the truth.",
    icon: Flame,
    path: "/calculators/viral/calorie-burn",
    color: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    emoji: "🔥",
    tooltip: "Worth the workout?"
  }
];

export default function FinderPage() {
  return (
    <>
      <SEOHead
        title="Finder - Discovery Tools | Smart Calculator Hubs"
        description="Discover powerful tools to find information and make smart decisions. Explore our collection of finder and discovery calculators."
        keywords="finder tools, discovery calculators, calorie burn calculator, food finder, workout finder"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 dark:from-gray-900 dark:via-orange-900/20 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl mb-6 shadow-lg">
              <Search className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent mb-4">
              Finder Tools 🔍
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover and explore with our powerful finder tools. Get instant insights and make informed decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {finderTools.map((calc, index) => {
              const Icon = calc.icon;
              return (
                <Link key={index} to={calc.path} className="group" title={calc.tooltip}>
                  <AppleStyleCard className="h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                    <div className="p-6">
                      <div className={`inline-flex items-center justify-center w-16 h-16 ${calc.bgColor} rounded-2xl mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-8 h-8 ${calc.color}`} />
                      </div>
                      <div className="mb-3">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                          {calc.title}
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{calc.tooltip}</p>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {calc.description}
                      </p>
                      <div className="mt-4 flex items-center text-orange-600 dark:text-orange-400 font-semibold group-hover:gap-3 gap-2 transition-all text-sm">
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
              <Search className="w-8 h-8 text-orange-600" />
              Why Use Finder Tools?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-orange-600 dark:text-orange-400 mb-2">🎯 Quick Discovery</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Find exactly what you're looking for with our specialized finder tools designed for accuracy and speed.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-orange-600 dark:text-orange-400 mb-2">📊 Data-Driven</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  All tools are powered by accurate data and proven algorithms to give you reliable results.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-orange-600 dark:text-orange-400 mb-2">🚀 Fast Results</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Get instant results without complex forms or lengthy processes. Simple, fast, and effective.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-orange-600 dark:text-orange-400 mb-2">💯 100% Free</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  All finder tools are completely free to use with no hidden costs or subscriptions required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
