import { useState } from "react";
import { Clock, Film, Tv, Play, Coffee, Popcorn, Moon } from "lucide-react";
import { AppleStyleCard } from "../../../components/AppleStyleCard";
import { AppleStyleButton } from "@/components/AppleStyleButton";
import { AppleStyleInput } from "@/components/AppleStyleInput";
import { SEOHead } from "@/components/SEOHead";
import { AIAnalysis } from "@/components/AIAnalysis";
import ExportShareButtons from "@/components/ExportShareButtons";


interface WatchResult {
  totalMinutes: number;
  totalHours: number;
  days: number;
  weeks: number;
  marathonHours: number;
  marathonDays: number;
  sleepNights: number;
  coffeeBreaks: number;
  snackBreaks: number;
  schedule: {
    oneHourDaily: number;
    twoHoursDaily: number;
    weekendBinge: number;
  };
}

export default function HowLongToWatchCalculator() {
  const [showType, setShowType] = useState<"tv" | "movie">("tv");
  const [episodes, setEpisodes] = useState("");
  const [episodeLength, setEpisodeLength] = useState("45");
  const [movies, setMovies] = useState("");
  const [movieLength, setMovieLength] = useState("120");
  const [result, setResult] = useState<WatchResult | null>(null);
  const [showAI, setShowAI] = useState(false);

  const calculateWatchTime = () => {
    let totalMinutes = 0;

    if (showType === "tv") {
      const numEpisodes = parseInt(episodes) || 0;
      const lengthPerEpisode = parseInt(episodeLength) || 0;
      totalMinutes = numEpisodes * lengthPerEpisode;
    } else {
      const numMovies = parseInt(movies) || 0;
      const lengthPerMovie = parseInt(movieLength) || 0;
      totalMinutes = numMovies * lengthPerMovie;
    }

    const totalHours = totalMinutes / 60;
    const days = totalHours / 24;
    const weeks = days / 7;

    const marathonHours = totalHours / 8;
    const marathonDays = marathonHours / 24;

    const sleepNights = Math.ceil(totalHours / 8);
    const coffeeBreaks = Math.ceil(totalHours / 2);
    const snackBreaks = Math.ceil(totalHours / 1.5);

    const schedule = {
      oneHourDaily: Math.ceil(totalHours / 1),
      twoHoursDaily: Math.ceil(totalHours / 2),
      weekendBinge: Math.ceil(totalHours / 16)
    };

    setResult({
      totalMinutes,
      totalHours,
      days,
      weeks,
      marathonHours,
      marathonDays,
      sleepNights,
      coffeeBreaks,
      snackBreaks,
      schedule
    });

    setShowAI(true);
  };

  const formatTime = (hours: number): string => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    if (h === 0) return `${m} minutes`;
    if (m === 0) return `${h} hour${h !== 1 ? 's' : ''}`;
    return `${h} hour${h !== 1 ? 's' : ''} ${m} min`;
  };

  const shareText = result
    ? `📺 I need ${formatTime(result.totalHours)} to finish my watchlist! That's ${result.days.toFixed(1)} days of non-stop viewing! Calculate your binge time at`
    : "";

  return (
    <>
      <SEOHead
        title="How Long to Watch Calculator 📺 - Binge Time Calculator | Smart Calculator Hubs"
        description="Calculate exactly how long it takes to binge-watch TV shows and movies! Plan your watchlist, get viewing schedules, and share your binge goals. Free binge-watch time calculator!"
        keywords="binge watch calculator, how long to watch, tv show time calculator, movie marathon calculator, netflix calculator, viewing time calculator, watchlist planner"
      />

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
                <Tv className="w-10 h-10 text-purple-600" />
                How Long to Watch Calculator 📺
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Calculate exactly how much time you need to binge your favorite TV shows and movies! Get personalized viewing schedules and fun insights.
              </p>
            </div>
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <AppleStyleCard>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Play className="w-6 h-6 text-purple-600" />
                  Calculate Your Binge Time
                </h2>

                <div className="flex gap-3 mb-6">
                  <button
                    onClick={() => setShowType("tv")}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                      showType === "tv"
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg"
                        : "border-gray-200 dark:border-gray-700 hover:border-purple-300"
                    }`}
                  >
                    <Tv className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <div className="font-semibold text-gray-900 dark:text-white">TV Show</div>
                  </button>
                  <button
                    onClick={() => setShowType("movie")}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                      showType === "movie"
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg"
                        : "border-gray-200 dark:border-gray-700 hover:border-purple-300"
                    }`}
                  >
                    <Film className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <div className="font-semibold text-gray-900 dark:text-white">Movies</div>
                  </button>
                </div>

                <div className="space-y-4">
                  {showType === "tv" ? (
                    <>
                      <AppleStyleInput
                        label="Number of Episodes"
                        type="number"
                        value={episodes}
                        onChange={(e) => setEpisodes(e.target.value)}
                        placeholder="e.g., 62 (Breaking Bad)"
                        min="1"
                      />
                      <AppleStyleInput
                        label="Episode Length (minutes)"
                        type="number"
                        value={episodeLength}
                        onChange={(e) => setEpisodeLength(e.target.value)}
                        placeholder="e.g., 45"
                        min="1"
                      />
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                          <strong>💡 Quick Examples:</strong>
                          <br />• Breaking Bad: 62 eps × 47 min
                          <br />• Friends: 236 eps × 22 min
                          <br />• Game of Thrones: 73 eps × 57 min
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <AppleStyleInput
                        label="Number of Movies"
                        type="number"
                        value={movies}
                        onChange={(e) => setMovies(e.target.value)}
                        placeholder="e.g., 22 (MCU Phase 1-3)"
                        min="1"
                      />
                      <AppleStyleInput
                        label="Average Movie Length (minutes)"
                        type="number"
                        value={movieLength}
                        onChange={(e) => setMovieLength(e.target.value)}
                        placeholder="e.g., 120"
                        min="1"
                      />
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                          <strong>💡 Quick Examples:</strong>
                          <br />• Marvel MCU (23 films): ~130 min avg
                          <br />• Harry Potter (8 films): ~140 min avg
                          <br />• Lord of the Rings Extended (3): ~230 min avg
                        </p>
                      </div>
                    </>
                  )}

                  <AppleStyleButton
                    onClick={calculateWatchTime}
                    disabled={showType === "tv" ? !episodes : !movies}
                    className="w-full"
                  >
                    <Clock className="w-5 h-5 mr-2" />
                    Calculate Watch Time
                  </AppleStyleButton>
                </div>
              </div>
            </AppleStyleCard>

            {result && (
              <AppleStyleCard className="mt-6">
                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-4">
                      {showType === "tv" ? "📺" : "🎬"}
                    </div>
                    <div className="text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                      {formatTime(result.totalHours)}
                    </div>
                    <div className="text-xl text-gray-600 dark:text-gray-300">
                      Total Viewing Time
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                        {result.days.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Days Non-Stop
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {result.weeks.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Weeks Non-Stop
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Coffee className="w-5 h-5 text-orange-600" />
                        <h3 className="font-bold text-orange-800 dark:text-orange-300">
                          Coffee Breaks Needed
                        </h3>
                      </div>
                      <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {result.coffeeBreaks} breaks
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        (Every 2 hours of watching)
                      </p>
                    </div>

                    <div className="bg-pink-50 dark:bg-pink-900/20 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Popcorn className="w-5 h-5 text-pink-600" />
                        <h3 className="font-bold text-pink-800 dark:text-pink-300">
                          Snack Breaks Needed
                        </h3>
                      </div>
                      <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                        {result.snackBreaks} breaks
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        (Every 1.5 hours of watching)
                      </p>
                    </div>

                    <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Moon className="w-5 h-5 text-indigo-600" />
                        <h3 className="font-bold text-indigo-800 dark:text-indigo-300">
                          Sleep Nights
                        </h3>
                      </div>
                      <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {result.sleepNights} nights
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        (If watching 8 hours per day)
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-5">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                      📅 Suggested Viewing Schedules
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">1 hour per day:</span>
                        <span className="font-bold text-purple-600 dark:text-purple-400">
                          {result.schedule.oneHourDaily} days
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">2 hours per day:</span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">
                          {result.schedule.twoHoursDaily} days
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Weekend binge (8hrs/day):</span>
                        <span className="font-bold text-pink-600 dark:text-pink-400">
                          {result.schedule.weekendBinge} days
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <ExportShareButtons
                      calculatorType="how-long-to-watch"
                      inputs={{ type: showType, count: showType === "tv" ? episodes : movies, length: showType === "tv" ? episodeLength : movieLength }}
                      results={result}
                    />
                  </div>
                </div>
              </AppleStyleCard>
            )}
          </div>

          <div>
            {showAI && result && (
              <AIAnalysis
                analysisRequest={{
                  calculatorType: "how-long-to-watch",
                  data: {
                    type: showType,
                    count: showType === "tv" ? episodes : movies,
                    length: showType === "tv" ? episodeLength : movieLength,
                    ...result
                  } as any
                }}
              />
            )}
          </div>
        </div>

        <div className="mt-12 prose prose-lg max-w-none dark:prose-invert">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            How Long to Watch Calculator: Your Complete Guide to Binge-Watching 📺
          </h2>

          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Ever wondered exactly how long it would take to binge-watch your favorite TV series or complete that movie marathon you've been planning? Our <strong>How Long to Watch Calculator</strong> gives you precise viewing times, smart scheduling options, and fun insights to help you plan your perfect binge-watching session. Whether you're tackling Game of Thrones, the entire MCU, or catching up on that show everyone's talking about, we've got you covered!
          </p>

          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            What Is a Binge-Watch Time Calculator? 🎬
          </h3>

          <p className="text-gray-600 dark:text-gray-300">
            A binge-watch time calculator (also called a viewing time calculator or watchlist calculator) helps you determine exactly how much time you'll need to complete watching a TV series, movie franchise, or any collection of video content. Instead of manually multiplying episodes by runtime and converting minutes to hours and days, our calculator does all the math instantly and provides helpful scheduling suggestions.
          </p>

          <p className="text-gray-600 dark:text-gray-300">
            In today's streaming era, with endless content at our fingertips on Netflix, Hulu, Disney+, HBO Max, Prime Video, and countless other platforms, planning your viewing time has become essential. Whether you're preparing for a weekend marathon, planning vacation viewing, or just curious about the time commitment for a new series, this calculator is your perfect companion.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            How to Use the How Long to Watch Calculator ⚡
          </h3>

          <p className="text-gray-600 dark:text-gray-300">
            Using our calculator is incredibly simple - just follow these quick steps:
          </p>

          <ol className="list-decimal list-inside space-y-3 text-gray-600 dark:text-gray-300">
            <li><strong>Choose Your Content Type:</strong> Select either "TV Show" for series or "Movies" for film collections.</li>
            <li><strong>Enter the Count:</strong> Input the number of episodes (for TV) or number of movies you plan to watch.</li>
            <li><strong>Set the Length:</strong> Enter the average runtime in minutes. Most streaming platforms show this information.</li>
            <li><strong>Calculate:</strong> Click "Calculate Watch Time" to get your instant results with detailed breakdown.</li>
            <li><strong>Explore Schedules:</strong> Check out the suggested viewing schedules based on different daily watching habits.</li>
            <li><strong>Get AI Insights:</strong> Our AI provides personalized recommendations and fun facts about your binge plan!</li>
            <li><strong>Share Your Plans:</strong> Share your epic binge goals on social media to find viewing buddies!</li>
          </ol>

          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            Popular TV Show Binge Times 📊
          </h3>

          <p className="text-gray-600 dark:text-gray-300">
            Curious about how long it takes to watch popular series? Here are some fan-favorite shows and their total viewing times:
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-6">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-5">
              <h4 className="font-bold text-lg text-purple-700 dark:text-purple-300 mb-3">Breaking Bad</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Episodes:</span>
                  <span className="font-semibold">62</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Avg Runtime:</span>
                  <span className="font-semibold">47 minutes</span>
                </div>
                <div className="flex justify-between border-t border-purple-200 dark:border-purple-700 pt-2">
                  <span className="text-gray-900 dark:text-white font-bold">Total Time:</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">~48 hours (2 days)</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-5">
              <h4 className="font-bold text-lg text-blue-700 dark:text-blue-300 mb-3">Game of Thrones</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Episodes:</span>
                  <span className="font-semibold">73</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Avg Runtime:</span>
                  <span className="font-semibold">57 minutes</span>
                </div>
                <div className="flex justify-between border-t border-blue-200 dark:border-blue-700 pt-2">
                  <span className="text-gray-900 dark:text-white font-bold">Total Time:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">~70 hours (2.9 days)</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-5">
              <h4 className="font-bold text-lg text-green-700 dark:text-green-300 mb-3">Friends</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Episodes:</span>
                  <span className="font-semibold">236</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Avg Runtime:</span>
                  <span className="font-semibold">22 minutes</span>
                </div>
                <div className="flex justify-between border-t border-green-200 dark:border-green-700 pt-2">
                  <span className="text-gray-900 dark:text-white font-bold">Total Time:</span>
                  <span className="font-bold text-green-600 dark:text-green-400">~87 hours (3.6 days)</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-5">
              <h4 className="font-bold text-lg text-orange-700 dark:text-orange-300 mb-3">The Office (US)</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Episodes:</span>
                  <span className="font-semibold">201</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Avg Runtime:</span>
                  <span className="font-semibold">22 minutes</span>
                </div>
                <div className="flex justify-between border-t border-orange-200 dark:border-orange-700 pt-2">
                  <span className="text-gray-900 dark:text-white font-bold">Total Time:</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">~74 hours (3.1 days)</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-2xl p-5">
              <h4 className="font-bold text-lg text-pink-700 dark:text-pink-300 mb-3">Stranger Things</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Episodes:</span>
                  <span className="font-semibold">42 (S1-4)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Avg Runtime:</span>
                  <span className="font-semibold">51 minutes</span>
                </div>
                <div className="flex justify-between border-t border-pink-200 dark:border-pink-700 pt-2">
                  <span className="text-gray-900 dark:text-white font-bold">Total Time:</span>
                  <span className="font-bold text-pink-600 dark:text-pink-400">~36 hours (1.5 days)</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-5">
              <h4 className="font-bold text-lg text-indigo-700 dark:text-indigo-300 mb-3">The Sopranos</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Episodes:</span>
                  <span className="font-semibold">86</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Avg Runtime:</span>
                  <span className="font-semibold">55 minutes</span>
                </div>
                <div className="flex justify-between border-t border-indigo-200 dark:border-indigo-700 pt-2">
                  <span className="text-gray-900 dark:text-white font-bold">Total Time:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">~79 hours (3.3 days)</span>
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            Popular Movie Marathon Times 🎥
          </h3>

          <p className="text-gray-600 dark:text-gray-300">
            Planning a movie marathon? Here's how long it takes to complete popular film franchises:
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-6">
            <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl p-5">
              <h4 className="font-bold text-lg text-red-700 dark:text-red-300 mb-3">Marvel Cinematic Universe (MCU)</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Movies:</span>
                  <span className="font-semibold">33 films</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Avg Runtime:</span>
                  <span className="font-semibold">~130 minutes</span>
                </div>
                <div className="flex justify-between border-t border-red-200 dark:border-red-700 pt-2">
                  <span className="text-gray-900 dark:text-white font-bold">Total Time:</span>
                  <span className="font-bold text-red-600 dark:text-red-400">~72 hours (3 days)</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-2xl p-5">
              <h4 className="font-bold text-lg text-yellow-700 dark:text-yellow-300 mb-3">Harry Potter</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Movies:</span>
                  <span className="font-semibold">8 films</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Avg Runtime:</span>
                  <span className="font-semibold">~140 minutes</span>
                </div>
                <div className="flex justify-between border-t border-yellow-200 dark:border-yellow-700 pt-2">
                  <span className="text-gray-900 dark:text-white font-bold">Total Time:</span>
                  <span className="font-bold text-yellow-600 dark:text-yellow-400">~19 hours</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-5">
              <h4 className="font-bold text-lg text-emerald-700 dark:text-emerald-300 mb-3">Lord of the Rings (Extended)</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Movies:</span>
                  <span className="font-semibold">3 films</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Avg Runtime:</span>
                  <span className="font-semibold">~230 minutes</span>
                </div>
                <div className="flex justify-between border-t border-emerald-200 dark:border-emerald-700 pt-2">
                  <span className="text-gray-900 dark:text-white font-bold">Total Time:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">~11.5 hours</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-2xl p-5">
              <h4 className="font-bold text-lg text-violet-700 dark:text-violet-300 mb-3">Star Wars (All Films)</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Movies:</span>
                  <span className="font-semibold">12 films</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Avg Runtime:</span>
                  <span className="font-semibold">~133 minutes</span>
                </div>
                <div className="flex justify-between border-t border-violet-200 dark:border-violet-700 pt-2">
                  <span className="text-gray-900 dark:text-white font-bold">Total Time:</span>
                  <span className="font-bold text-violet-600 dark:text-violet-400">~27 hours</span>
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            Smart Binge-Watching Strategies 🧠
          </h3>

          <p className="text-gray-600 dark:text-gray-300">
            Want to maximize your viewing experience without burning out? Follow these proven binge-watching strategies:
          </p>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 my-6">
            <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-4">The Sustainable Approach (Recommended)</h4>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex gap-3">
                <span className="text-blue-600 dark:text-blue-400">✓</span>
                <div><strong>1-2 Hours Daily:</strong> Perfect for working professionals. Fits easily into evening routines without disrupting sleep.</div>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-600 dark:text-purple-400">✓</span>
                <div><strong>Take Breaks:</strong> Stand up and stretch every episode. Your back and eyes will thank you!</div>
              </li>
              <li className="flex gap-3">
                <span className="text-pink-600 dark:text-pink-400">✓</span>
                <div><strong>Hydrate:</strong> Keep water nearby. Caffeine is fine but water is essential for long sessions.</div>
              </li>
              <li className="flex gap-3">
                <span className="text-indigo-600 dark:text-indigo-400">✓</span>
                <div><strong>Plan Meals:</strong> Prep snacks beforehand so you don't survive on junk food alone.</div>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-6 my-6">
            <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-4">The Weekend Warrior</h4>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex gap-3">
                <span className="text-orange-600 dark:text-orange-400">✓</span>
                <div><strong>8-10 Hours Per Day:</strong> Perfect for weekends when you can dedicate the whole day to viewing.</div>
              </li>
              <li className="flex gap-3">
                <span className="text-red-600 dark:text-red-400">✓</span>
                <div><strong>Start Early:</strong> Begin in the morning to maximize daylight hours and avoid all-nighters.</div>
              </li>
              <li className="flex gap-3">
                <span className="text-pink-600 dark:text-pink-400">✓</span>
                <div><strong>Schedule Breaks:</strong> Set timers for breaks every 2 hours. Move around, eat proper meals.</div>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 my-6">
            <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-4">The Vacation Marathon</h4>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex gap-3">
                <span className="text-green-600 dark:text-green-400">✓</span>
                <div><strong>12+ Hours Daily:</strong> When you have time off and want to fully immerse yourself.</div>
              </li>
              <li className="flex gap-3">
                <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                <div><strong>Create Ambiance:</strong> Dim lights, comfy setup, good sound system - make it an experience!</div>
              </li>
              <li className="flex gap-3">
                <span className="text-teal-600 dark:text-teal-400">✓</span>
                <div><strong>Buddy System:</strong> Binge with friends or family to make it a social event with discussion breaks.</div>
              </li>
            </ul>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            Health Tips for Long Viewing Sessions 💪
          </h3>

          <p className="text-gray-600 dark:text-gray-300">
            Binge-watching doesn't have to be unhealthy! Follow these tips to stay comfortable and healthy during extended viewing:
          </p>

          <div className="space-y-4 my-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border-l-4 border-blue-500">
              <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-2">👀 Eye Care</h4>
              <p className="text-gray-700 dark:text-gray-300">
                Follow the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds. Adjust screen brightness to match room lighting. Consider blue light filtering glasses for evening viewing.
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-5 border-l-4 border-green-500">
              <h4 className="font-bold text-green-700 dark:text-green-300 mb-2">🧘 Posture & Movement</h4>
              <p className="text-gray-700 dark:text-gray-300">
                Maintain good posture with proper back support. Stand up and stretch between episodes. Do simple exercises during opening/closing credits. Walk around during longer breaks. Set timers to remind yourself to move.
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-5 border-l-4 border-purple-500">
              <h4 className="font-bold text-purple-700 dark:text-purple-300 mb-2">🍎 Nutrition & Hydration</h4>
              <p className="text-gray-700 dark:text-gray-300">
                Prep healthy snacks in advance: fruit, nuts, veggies with hummus. Drink water regularly - aim for 8oz per hour. Limit caffeine after 2 PM if watching in evening. Eat proper meals, not just snacks.
              </p>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-5 border-l-4 border-orange-500">
              <h4 className="font-bold text-orange-700 dark:text-orange-300 mb-2">😴 Sleep Quality</h4>
              <p className="text-gray-700 dark:text-gray-300">
                Avoid screens 1 hour before bed when possible. If watching late, use night mode/blue light filter. Don't sacrifice sleep to finish "just one more episode" - set a bedtime alarm. Quality sleep is more important than finishing the season tonight.
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            The Psychology of Binge-Watching 🧠
          </h3>

          <p className="text-gray-600 dark:text-gray-300">
            Binge-watching has become a cultural phenomenon in the streaming era. Understanding why we binge can help us enjoy it more mindfully:
          </p>

          <p className="text-gray-600 dark:text-gray-300">
            <strong>Why We Can't Stop Watching:</strong> Shows are designed with cliffhangers and compelling narratives that trigger our brain's reward system. The autoplay feature removes friction, making it effortless to continue. We form parasocial relationships with characters, making it emotionally rewarding to spend time in their world. The fear of missing out (FOMO) drives us to stay current with cultural conversations.
          </p>

          <p className="text-gray-600 dark:text-gray-300 mt-4">
            <strong>The Benefits:</strong> Binge-watching isn't all bad! It can provide stress relief, emotional connection, and a sense of accomplishment. It's a form of self-care when done mindfully. Shared viewing experiences create bonding opportunities with friends and family. It allows for deeper immersion in complex narratives and character development.
          </p>

          <p className="text-gray-600 dark:text-gray-300 mt-4">
            <strong>Finding Balance:</strong> The key is intentional viewing rather than mindless consumption. Plan your binge sessions, set time limits, and ensure they don't interfere with sleep, work, or relationships. Treat it as a special activity rather than default behavior. Mix in other hobbies and activities for a well-rounded lifestyle.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            Best Streaming Platforms for Binge-Watching 📱
          </h3>

          <p className="text-gray-600 dark:text-gray-300">
            Different platforms excel at different types of content. Here's where to find the best binge-worthy shows:
          </p>

          <div className="grid md:grid-cols-2 gap-4 my-6">
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4">
              <h4 className="font-bold text-red-700 dark:text-red-300 mb-2">Netflix</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">The binge-watching pioneer. Releases full seasons at once. Known for Stranger Things, The Crown, Squid Game, Wednesday.</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
              <h4 className="font-bold text-purple-700 dark:text-purple-300 mb-2">HBO Max</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Premium content with complete series. Game of Thrones, Succession, The Last of Us, House of the Dragon.</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
              <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-2">Disney+</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Marvel, Star Wars, and classics. The Mandalorian, Loki, WandaVision, Bluey for families.</p>
            </div>
            <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-xl p-4">
              <h4 className="font-bold text-cyan-700 dark:text-cyan-300 mb-2">Prime Video</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Original series and classics. The Boys, Reacher, The Marvelous Mrs. Maisel, Jack Ryan.</p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            Frequently Asked Questions 🤔
          </h3>

          <div className="space-y-6 my-6">
            <div>
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">How accurate is this calculator?</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Our calculator is highly accurate based on the runtime information you provide. Note that actual viewing time may vary slightly due to opening credits you skip, recap segments, or if you rewatch certain scenes. We calculate based on the full stated runtime.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Should I include credits in episode length?</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Use the full episode runtime shown on the streaming platform, which includes credits. Most streaming services list the total runtime. If you typically skip credits, you can subtract 1-2 minutes per episode from your total time estimate.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">What's a healthy amount of binge-watching?</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Health experts suggest limiting screen time to 2-3 hours per day for adults, with regular breaks. However, occasional weekend binges or vacation marathons are fine as long as you maintain good posture, stay hydrated, take breaks, and don't sacrifice sleep or responsibilities.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Can I calculate multiple shows at once?</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Currently, the calculator handles one show or movie collection at a time. For multiple shows, calculate each separately and add the total hours together. We recommend planning one series at a time to avoid overwhelming your schedule!
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            Start Planning Your Perfect Binge Session! 🎉
          </h3>

          <p className="text-gray-600 dark:text-gray-300">
            Ready to plan your next epic viewing session? Use our free How Long to Watch Calculator now to get precise viewing times, smart scheduling suggestions, and fun AI insights about your binge plans. Whether you're tackling a new obsession or finally catching up on that show everyone's been talking about, we'll help you plan the perfect viewing experience!
          </p>

          <p className="text-gray-600 dark:text-gray-300 mt-4">
            Remember: binge-watching should be enjoyable, not stressful. Use our calculator to plan realistically, take care of yourself during long sessions, and most importantly - have fun getting lost in the stories you love! 📺✨
          </p>
        </div>
          </div>
        </div>
      </div>
    </>
  );
}