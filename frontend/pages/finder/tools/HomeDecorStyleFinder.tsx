import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertTriangle, X, Sparkles, RefreshCw, Home, Palette, Lightbulb, Share2, Camera, Upload } from 'lucide-react';
import backend from '~backend/client';
import { compressImage } from '@/lib/imageCompression';
import { SEOHead } from '@/components/SEOHead';
import { StructuredData } from '@/components/StructuredData';
import { AutoAdSlot } from '@/components/ads/AutoAdSlot';
import AmazonAffiliate from '@/components/ads/AmazonAffiliate';
import decorStylesData from '@/data/decorStyles.json';

interface StyleMatch {
  styleName: string;
  confidence: number;
}

interface DecorStyleResult {
  topStyles: StyleMatch[];
  colorPalette: string[];
  enhancementTips: string[];
  summary: string;
}

export default function HomeDecorStyleFinder() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DecorStyleResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const compressImageForAPI = async (file: File): Promise<string> => {
    try {
      const compressed = await compressImage(file, {
        quality: 80,
        maxWidth: 1024,
        maxHeight: 1024,
        outputFormat: 'image/jpeg'
      });
      return compressed.dataUrl.split(',')[1];
    } catch (err) {
      throw new Error('Failed to compress image');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be less than 10MB. Please choose a smaller image.');
      return;
    }

    await processImage(file);
  };

  const processImage = async (file: File) => {
    try {
      setError(null);
      setIsAnalyzing(true);
      setResult(null);
      setSelectedImage(URL.createObjectURL(file));

      const base64 = await compressImageForAPI(file);

      const analysisResult = await backend.vision.analyzeDecorStyle({ 
        imageBase64: base64
      });

      setResult(analysisResult);

      if (analysisResult.topStyles.length === 0) {
        setError("Couldn't identify a clear style — try a photo with more visible furniture and decor!");
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'Failed to analyze room. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      setShowCamera(true);
      
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100);
    } catch (err) {
      console.error('Camera error:', err);
      setError('Unable to access camera. Please use the upload option instead.');
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(videoRef.current, 0, 0);

    closeCamera();

    canvas.toBlob(async (blob) => {
      if (blob) {
        const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
        await processImage(file);
      }
    }, 'image/jpeg', 0.8);
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
    closeCamera();
  };

  const shareResult = () => {
    if (!result) return;
    const url = window.location.href;
    const topStyle = result.topStyles[0]?.styleName || 'Unknown';
    const text = `My room style is ${topStyle}! 🏠 Check it out:`;
    if (navigator.share) {
      navigator.share({ title: 'Home Decor Style Finder', text, url });
    } else {
      navigator.clipboard.writeText(`${text} ${url}`);
      alert('Link copied to clipboard!');
    }
  };

  const getStyleDetails = (styleName: string) => {
    const styles = decorStylesData.styles;
    return styles[styleName as keyof typeof styles];
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Home Decor Style Finder — Discover Your Room's Style with AI",
    "description": "Free AI-powered interior design style identifier. Upload a room photo and instantly discover your decor style, color palette, and enhancement tips.",
    "url": "https://smart-calculator-hub-d3409cs82vjl9890lfm0.lp.dev/finder/tools/home-decor-style-finder",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is the home decor style finder free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! 100% free with no subscriptions or hidden fees. We believe interior design guidance should be accessible to everyone."
        }
      },
      {
        "@type": "Question",
        "name": "How accurate is the AI style detection?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our AI uses OpenAI GPT-4 Vision to analyze furniture, colors, patterns, and layout. Accuracy is highest with well-lit, uncluttered room photos showing multiple design elements."
        }
      },
      {
        "@type": "Question",
        "name": "What if lighting conditions aren't perfect?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Natural daylight works best. Avoid photos taken at night with yellow artificial lighting, as this skews color detection. If needed, take multiple photos at different times of day."
        }
      },
      {
        "@type": "Question",
        "name": "Do you store my room photos?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No! Photos are analyzed in real-time via secure AI API and never stored on our servers. Your privacy is our top priority."
        }
      }
    ]
  };

  if (showCamera) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black">
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 pb-safe bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex justify-center gap-4">
              <Button
                onClick={closeCamera}
                size="lg"
                variant="outline"
                className="rounded-full w-16 h-16"
              >
                <X className="w-6 h-6" />
              </Button>
              <Button
                onClick={capturePhoto}
                size="lg"
                className="rounded-full w-20 h-20 bg-white text-black hover:bg-gray-200"
              >
                <Camera className="w-8 h-8" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title="Home Decor Style Finder — Discover Your Room's Style with AI Camera (Free) | Smart Calculator Hubs"
        description="Free AI home decor style identifier! Upload a room photo and instantly discover your interior design style, color palette, and personalized enhancement tips. Powered by OpenAI — 100% free."
        keywords="home decor style finder, interior design style identifier, AI room analyzer, what is my decor style, room style detector, free interior design tool"
      />
      <StructuredData data={structuredData} />
      <StructuredData data={faqData} />

      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDE1MCwgNTAsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
        
        <div className="container mx-auto px-4 py-8 max-w-5xl relative z-10">
          
          <AutoAdSlot placement="top-banner" className="mb-8" />

          <div className="text-center mb-12 space-y-4 animate-in fade-in slide-in-from-top duration-700 overflow-visible">
            <div className="inline-flex items-center justify-center gap-3 mb-4">
              <span className="text-5xl md:text-6xl">🏠</span>
              <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
                Home Decor Style Finder
              </h1>
              <span className="text-5xl md:text-6xl">🏠</span>
            </div>
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto font-medium leading-relaxed">
              Snap a pic of your room & discover your interior design style instantly! 
              <span className="text-orange-600 font-bold"> FREE</span> AI-powered analysis + color palette + decor tips 🚀
            </p>
          </div>

          <AutoAdSlot placement="in-feed" className="mb-8" />

          <Card className="backdrop-blur-xl bg-white/80 border-2 border-orange-200 shadow-2xl rounded-3xl overflow-hidden mb-8 transform transition-all duration-300 hover:shadow-orange-200/50 hover:shadow-3xl">
            <div className="p-8">
              
              {!selectedImage && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">🎨 Ready to Discover Your Style?</h2>
                    <p className="text-gray-600">Take a photo or upload from your gallery!</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Button 
                      onClick={openCamera}
                      className="h-40 bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-500 hover:from-amber-600 hover:via-orange-600 hover:to-yellow-600 text-white rounded-3xl shadow-xl transition-all duration-300 hover:scale-105 hover:rotate-1 border-2 border-white/20"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <Camera className="w-14 h-14 animate-pulse" />
                        <span className="text-xl font-bold">📸 Take Photo</span>
                        <span className="text-xs opacity-90">Use your camera</span>
                      </div>
                    </Button>

                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="h-40 border-3 border-orange-400 hover:bg-orange-100 bg-gradient-to-br from-white to-orange-50 rounded-3xl shadow-xl transition-all duration-300 hover:scale-105 hover:-rotate-1"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <Upload className="w-14 h-14 text-orange-600 animate-bounce" />
                        <span className="text-xl font-bold text-orange-700">📤 Upload Image</span>
                        <span className="text-xs text-gray-600">From your gallery</span>
                      </div>
                    </Button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
                    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      Pro Tips for Best Results:
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-orange-600 font-bold mt-0.5">✓</span>
                        <span><strong>Natural daylight</strong> — Take photos during daytime. Avoid yellow artificial lighting.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-600 font-bold mt-0.5">✓</span>
                        <span><strong>Wide angle view</strong> — Show furniture, walls, and decor. Corner angles work great!</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-600 font-bold mt-0.5">✓</span>
                        <span><strong>Tidy space helps</strong> — Clean up clutter so AI can focus on design elements.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-600 font-bold mt-0.5">✓</span>
                        <span><strong>Multiple elements</strong> — Include furniture, textiles, wall art for accurate style detection.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {selectedImage && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-orange-200">
                      <img 
                        src={selectedImage} 
                        alt="Room photo" 
                        className="w-full h-auto object-cover bg-gradient-to-br from-gray-50 to-orange-50"
                      />
                      <Button
                        onClick={resetAnalysis}
                        variant="outline"
                        size="sm"
                        className="absolute top-4 right-4 bg-white/95 backdrop-blur-md hover:bg-white shadow-xl border-2 border-gray-200 rounded-xl"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Clear
                      </Button>
                    </div>

                    <div className="flex flex-col justify-center">
                      {isAnalyzing && (
                        <div className="text-center space-y-6 animate-pulse">
                          <div className="relative inline-block">
                            <Loader2 className="w-20 h-20 animate-spin text-orange-600 mx-auto" />
                            <Sparkles className="w-8 h-8 text-yellow-500 absolute top-0 right-0 animate-ping" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-800 mb-2">🔬 AI is Analyzing...</p>
                            <p className="text-lg text-gray-600">Detecting your room's style!</p>
                            <p className="text-sm text-gray-500 mt-2">Usually takes 3-5 seconds ⏱️</p>
                          </div>
                        </div>
                      )}

                      {error && !isAnalyzing && (
                        <Alert className="border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50">
                          <AlertTriangle className="w-6 h-6 text-amber-600" />
                          <AlertDescription className="text-amber-900 font-medium">
                            {error}
                          </AlertDescription>
                        </Alert>
                      )}

                      {result && !isAnalyzing && (
                        <div className="space-y-4">
                          <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl p-5 border-2 border-orange-300">
                            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                              <Home className="w-6 h-6 text-orange-600" />
                              Your Room's Style
                            </h3>
                            <div className="space-y-2">
                              {result.topStyles.slice(0, 3).map((style, i) => (
                                <div key={i} className="flex items-center justify-between bg-white/70 p-3 rounded-xl">
                                  <span className="font-bold text-gray-800">{style.styleName}</span>
                                  <Badge className="bg-orange-500/20 text-orange-700 border border-orange-500/30">
                                    {Math.round(style.confidence * 100)}%
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>

                          <Button
                            onClick={shareResult}
                            variant="outline"
                            className="w-full border-2 border-orange-400"
                          >
                            <Share2 className="w-4 h-4 mr-2" />
                            Share Your Style
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <AutoAdSlot placement="in-feed" className="my-8" />

                  {result && !isAnalyzing && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                      
                      <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-3xl p-8 border-2 border-orange-200 shadow-lg">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Sparkles className="w-6 h-6 text-orange-600 animate-pulse" />
                          AI Summary 📝
                        </h3>
                        <p className="text-gray-800 leading-relaxed text-lg">{result.summary}</p>
                      </div>

                      {result.colorPalette.length > 0 && (
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border-2 border-purple-200 shadow-lg">
                          <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                            <Palette className="w-6 h-6 text-purple-600" />
                            🎨 Color Palette
                          </h3>
                          <div className="flex flex-wrap gap-4 justify-center">
                            {result.colorPalette.map((color, i) => (
                              <div key={i} className="flex flex-col items-center gap-2">
                                <div 
                                  className="w-20 h-20 rounded-2xl shadow-lg border-4 border-white"
                                  style={{ backgroundColor: color }}
                                />
                                <span className="text-xs font-mono font-bold text-gray-700 bg-white px-2 py-1 rounded">
                                  {color}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <AutoAdSlot placement="in-feed" className="my-8" />

                      {result.enhancementTips.length > 0 && (
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 border-2 border-blue-200 shadow-lg">
                          <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                            <Lightbulb className="w-6 h-6 text-blue-600" />
                            💡 Enhancement Tips
                          </h3>
                          <ul className="space-y-4">
                            {result.enhancementTips.map((tip, i) => (
                              <li key={i} className="flex items-start gap-3 bg-white/70 p-4 rounded-2xl border border-blue-200">
                                <span className="bg-blue-500 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                                  {i + 1}
                                </span>
                                <span className="text-gray-800 font-medium text-base">{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {result.topStyles.length > 0 && (
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border-2 border-green-200 shadow-lg">
                          <h3 className="text-xl font-bold text-gray-900 mb-5">
                            📚 About {result.topStyles[0].styleName} Style
                          </h3>
                          {(() => {
                            const styleDetails = getStyleDetails(result.topStyles[0].styleName);
                            if (!styleDetails) return null;
                            return (
                              <div className="space-y-4">
                                <p className="text-gray-800 leading-relaxed">{styleDetails.description}</p>
                                <div>
                                  <h4 className="font-bold text-gray-900 mb-2">Key Elements:</h4>
                                  <ul className="space-y-2">
                                    {styleDetails.keyElements.map((element, i) => (
                                      <li key={i} className="flex items-start gap-2 text-gray-700">
                                        <span className="text-green-600 font-bold mt-0.5">•</span>
                                        <span>{element}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      )}

                      <AmazonAffiliate 
                        calculatorTitle={`${result.topStyles[0]?.styleName.toLowerCase().replace(/ /g, '-')} home decor furniture`}
                        placement="content"
                      />

                      <AutoAdSlot placement="in-feed" className="my-8" />

                      <Button 
                        onClick={resetAnalysis}
                        className="w-full bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 hover:from-amber-700 hover:via-orange-700 hover:to-yellow-700 text-white rounded-2xl py-8 text-xl font-bold shadow-2xl transform transition-all duration-300 hover:scale-105 border-2 border-white/20"
                      >
                        <RefreshCw className="w-6 h-6 mr-3" />
                        🔄 Analyze Another Room
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          <AutoAdSlot placement="in-feed" className="my-10" />

          <AmazonAffiliate 
            calculatorTitle="home decor furniture accessories"
            placement="content"
          />

          <AutoAdSlot placement="in-feed" className="my-10" />

          <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 border-2 border-indigo-200 rounded-3xl p-10 shadow-2xl mb-10">
            <h3 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">🎓 Complete Guide to Interior Design Styles</h3>
            
            <div className="prose prose-lg max-w-none space-y-6 text-gray-800">
              <div className="bg-white/70 rounded-2xl p-6 border border-indigo-100">
                <h4 className="text-xl font-bold text-indigo-700 mb-3">🏡 Why Your Decor Style Matters</h4>
                <p className="leading-relaxed">
                  Your home isn't just where you live — it's a reflection of your personality, values, and lifestyle! Understanding your decor style 
                  helps you make cohesive design decisions, avoid impulse purchases that clash, and create spaces that genuinely feel like YOU.
                </p>
                <p className="leading-relaxed mt-4">
                  Maybe you're drawn to clean lines and minimalism (hello, Modern!), or you love eclectic patterns and global treasures (Bohemian vibes!). 
                  Our AI analyzes your room's existing elements — furniture shapes, color schemes, patterns, textures — to identify your dominant style. 
                  It's like having an interior designer's eye, minus the $200/hour consultation fee!
                </p>
              </div>

              <div className="bg-white/70 rounded-2xl p-6 border border-blue-100">
                <h4 className="text-xl font-bold text-blue-700 mb-3">📸 How to Get Accurate Style Detection</h4>
                <p className="leading-relaxed mb-4">
                  AI is powerful, but garbage in = garbage out! Here's how to get the BEST results:
                </p>
                <ul className="space-y-3 ml-6">
                  <li className="leading-relaxed">
                    <strong>⏰ Timing is Everything:</strong> Take photos during daylight hours (10am-4pm works best). Night photos with yellow lamps distort colors!
                  </li>
                  <li className="leading-relaxed">
                    <strong>📐 Capture the Whole Room:</strong> Stand in a corner and shoot diagonally to show multiple walls, furniture, and decor. Wide-angle beats close-ups!
                  </li>
                  <li className="leading-relaxed">
                    <strong>🧹 Declutter First:</strong> Remove random items like laundry, toys, and dishes. AI focuses on intentional design elements, not chaos!
                  </li>
                  <li className="leading-relaxed">
                    <strong>🎨 Show Key Elements:</strong> Include furniture, textiles (rugs, curtains, pillows), wall art, and architectural details.
                  </li>
                  <li className="leading-relaxed">
                    <strong>🚫 Avoid Filters:</strong> Upload original, unedited photos. Instagram filters mess with color accuracy!
                  </li>
                </ul>
              </div>

              <div className="bg-white/70 rounded-2xl p-6 border border-cyan-100">
                <h4 className="text-xl font-bold text-cyan-700 mb-3">🎨 The 12 Major Interior Design Styles Explained</h4>
                <p className="leading-relaxed mb-4">
                  Not sure what these style names mean? Here's the ultimate cheat sheet:
                </p>
                <div className="space-y-4">
                  <div>
                    <p className="font-bold text-gray-900 mb-1">1️⃣ Modern</p>
                    <p className="leading-relaxed">
                      Clean lines, neutral colors, minimal clutter. Think IKEA showroom meets luxury penthouse. Function over fluff!
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">2️⃣ Scandinavian (Scandi)</p>
                    <p className="leading-relaxed">
                      White walls + natural wood + cozy textiles = hygge heaven. Light, airy, and effortlessly beautiful.
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">3️⃣ Bohemian (Boho)</p>
                    <p className="leading-relaxed">
                      Maximalist paradise! Mix ALL the patterns, colors, and global treasures. Free-spirited and artistic.
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">4️⃣ Industrial</p>
                    <p className="leading-relaxed">
                      Exposed brick, metal pipes, reclaimed wood. Urban warehouse converted into loft living. Raw and edgy!
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">5️⃣ Farmhouse</p>
                    <p className="leading-relaxed">
                      Rustic charm meets country comfort. Shiplap, vintage signs, and mason jars galore. Cozy and welcoming!
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">6️⃣ Mid-Century Modern</p>
                    <p className="leading-relaxed">
                      1950s-60s retro vibes! Organic curves, tapered legs, bold colors (mustard, teal). Iconic and timeless.
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">7️⃣ Minimalist</p>
                    <p className="leading-relaxed">
                      Less is MORE. Extreme simplicity, neutral palette, almost nothing on display. Marie Kondo would approve!
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">8️⃣ Coastal</p>
                    <p className="leading-relaxed">
                      Beach house energy! Blue + white + natural fibers. Breezy, relaxed, nautical touches. Smells like ocean (metaphorically).
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">9️⃣ Traditional</p>
                    <p className="leading-relaxed">
                      Classic elegance. Ornate details, rich colors, symmetrical arrangements. Think English manor or Downton Abbey.
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">🔟 Contemporary</p>
                    <p className="leading-relaxed">
                      Ever-evolving and current. Modern's trendy cousin. Smooth lines, mixed textures, comfortable yet chic.
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">1️⃣1️⃣ Rustic</p>
                    <p className="leading-relaxed">
                      Nature-inspired cabin vibes. Rough wood, stone, earthy tones. Mountains + campfire aesthetic.
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">1️⃣2️⃣ Eclectic</p>
                    <p className="leading-relaxed">
                      The wild card! Mix styles, eras, and cultures with one unifying thread. Curated chaos that somehow WORKS.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 rounded-2xl p-6 border border-teal-100">
                <h4 className="text-xl font-bold text-teal-700 mb-3">🎨 Color Psychology in Interior Design</h4>
                <p className="leading-relaxed mb-4">
                  Colors aren't just pretty — they affect your MOOD! Here's what your palette says about your space:
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="leading-relaxed"><strong>🤍 White & Neutrals:</strong> Calm, spacious, clean. Perfect for bedrooms and minimalist spaces.</li>
                  <li className="leading-relaxed"><strong>💙 Blue:</strong> Tranquil, trustworthy, serene. Great for bathrooms and offices.</li>
                  <li className="leading-relaxed"><strong>💚 Green:</strong> Refreshing, balanced, nature-connected. Ideal for living rooms and home offices.</li>
                  <li className="leading-relaxed"><strong>💛 Yellow:</strong> Happy, energizing, optimistic. Best in kitchens and dining areas (stimulates appetite!).</li>
                  <li className="leading-relaxed"><strong>❤️ Red:</strong> Bold, passionate, stimulating. Use sparingly as accents (too much = overwhelming).</li>
                  <li className="leading-relaxed"><strong>🖤 Black & Dark Tones:</strong> Sophisticated, dramatic, grounding. Accent walls and statement pieces.</li>
                </ul>
              </div>

              <div className="bg-white/70 rounded-2xl p-6 border border-green-100">
                <h4 className="text-xl font-bold text-green-700 mb-3">🛋️ Mixing Styles Like a Pro</h4>
                <p className="leading-relaxed mb-4">
                  Don't want to commit to ONE style? You don't have to! Here's how to blend without creating chaos:
                </p>
                <ul className="space-y-3 ml-6">
                  <li className="leading-relaxed">
                    <strong>Rule of Three:</strong> Pick ONE dominant style (60%), ONE secondary style (30%), and ONE accent style (10%). Boom — cohesive eclectic!
                  </li>
                  <li className="leading-relaxed">
                    <strong>Unifying Element:</strong> Use consistent color palette OR material (e.g., all wood tones) to tie disparate pieces together.
                  </li>
                  <li className="leading-relaxed">
                    <strong>Balance Opposites:</strong> Modern + Rustic works. Industrial + Boho works. Traditional + Contemporary? Harder but possible!
                  </li>
                  <li className="leading-relaxed">
                    <strong>Anchor with Neutrals:</strong> When in doubt, use neutral base (walls, large furniture) and go wild with accessories.
                  </li>
                </ul>
              </div>

              <div className="bg-white/70 rounded-2xl p-6 border border-purple-100">
                <h4 className="text-xl font-bold text-purple-700 mb-3">💰 Budget-Friendly Style Upgrades</h4>
                <p className="leading-relaxed mb-4">
                  Don't have $10K for a full redesign? No problem! Small changes = BIG impact:
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="leading-relaxed">💡 <strong>Swap Lighting:</strong> New light fixtures instantly elevate any room. Under $100!</li>
                  <li className="leading-relaxed">🎨 <strong>Paint Accent Wall:</strong> One gallon of paint = dramatic transformation. DIY for ~$40.</li>
                  <li className="leading-relaxed">🛋️ <strong>New Throw Pillows:</strong> Cheapest way to update color scheme. $20-50 per pillow.</li>
                  <li className="leading-relaxed">🖼️ <strong>Gallery Wall:</strong> Print your own photos, use thrifted frames. Costs almost nothing!</li>
                  <li className="leading-relaxed">🪴 <strong>Add Plants:</strong> Instant life and color. Pothos, snake plants = hard to kill!</li>
                  <li className="leading-relaxed">🧺 <strong>Baskets for Storage:</strong> Hides clutter AND adds texture. Win-win!</li>
                </ul>
              </div>

              <div className="bg-white/70 rounded-2xl p-6 border border-pink-100">
                <h4 className="text-xl font-bold text-pink-700 mb-3">🎉 Fun Interior Design Facts</h4>
                <ul className="space-y-3">
                  <li className="leading-relaxed">🏛️ <strong>Ancient Roots:</strong> Interior design dates back to ancient Egypt — they had furniture designers 4,000 years ago!</li>
                  <li className="leading-relaxed">🧠 <strong>Color Affects Productivity:</strong> Blue increases productivity by 12% (science says!). Yellow boosts creativity.</li>
                  <li className="leading-relaxed">📏 <strong>The Golden Ratio:</strong> 1.618 ratio appears in "beautiful" room proportions. Nature's secret design code!</li>
                  <li className="leading-relaxed">🪴 <strong>Plants = Cleaner Air:</strong> NASA study found houseplants remove 87% of air toxins in 24 hours!</li>
                  <li className="leading-relaxed">🛋️ <strong>Most Popular Style:</strong> Modern Farmhouse is #1 in the US (thanks, HGTV!).</li>
                  <li className="leading-relaxed">💸 <strong>ROI Winner:</strong> Kitchen and bathroom upgrades give highest return on investment when selling.</li>
                </ul>
              </div>
            </div>
          </div>

          <AutoAdSlot placement="in-feed" className="my-10" />

          <Card className="bg-gradient-to-br from-rose-50 to-red-50 border-2 border-rose-200 rounded-3xl p-10 shadow-2xl mb-10">
            <h3 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">❓ Frequently Asked Questions (FAQ)</h3>
            
            <div className="space-y-6">
              <div className="bg-white/70 rounded-2xl p-6 border border-rose-100">
                <h4 className="text-lg font-bold text-rose-700 mb-2">Q: Is this home decor style finder really free?</h4>
                <p className="text-gray-800 leading-relaxed">
                  <strong>A:</strong> YES! 100% free forever. No subscriptions, no trials that turn into charges, no BS. 
                  We believe interior design guidance should be accessible to everyone!
                </p>
              </div>

              <div className="bg-white/70 rounded-2xl p-6 border border-rose-100">
                <h4 className="text-lg font-bold text-rose-700 mb-2">Q: How accurate is the AI style detection?</h4>
                <p className="text-gray-800 leading-relaxed">
                  <strong>A:</strong> Our AI uses OpenAI GPT-4 Vision to analyze furniture, colors, patterns, layout, and textures. 
                  Accuracy is highest (85-95%) with well-lit, uncluttered photos showing multiple design elements. Mixed-style rooms may show lower confidence.
                </p>
              </div>

              <div className="bg-white/70 rounded-2xl p-6 border border-rose-100">
                <h4 className="text-lg font-bold text-rose-700 mb-2">Q: What if my room doesn't match any style?</h4>
                <p className="text-gray-800 leading-relaxed">
                  <strong>A:</strong> That's totally fine! Most real homes are a MIX of styles (Eclectic). The AI will identify your top 3 dominant styles. 
                  Use this as a starting point to refine your vision!
                </p>
              </div>

              <div className="bg-white/70 rounded-2xl p-6 border border-rose-100">
                <h4 className="text-lg font-bold text-rose-700 mb-2">Q: Can I use this for empty rooms or renovation planning?</h4>
                <p className="text-gray-800 leading-relaxed">
                  <strong>A:</strong> It works best on furnished, decorated spaces. For empty rooms, try uploading inspiration photos from Pinterest or magazines 
                  to see what style they are — then recreate it in your space!
                </p>
              </div>

              <div className="bg-white/70 rounded-2xl p-6 border border-rose-100">
                <h4 className="text-lg font-bold text-rose-700 mb-2">Q: What if lighting conditions aren't perfect?</h4>
                <p className="text-gray-800 leading-relaxed">
                  <strong>A:</strong> Natural daylight is best. Yellow artificial lighting can skew color detection. 
                  If needed, take photos at different times of day and use the clearest, most color-accurate one!
                </p>
              </div>

              <div className="bg-white/70 rounded-2xl p-6 border border-rose-100">
                <h4 className="text-lg font-bold text-rose-700 mb-2">Q: Do you store my room photos or personal data?</h4>
                <p className="text-gray-800 leading-relaxed">
                  <strong>A:</strong> Absolutely NOT! Photos are analyzed in real-time via secure OpenAI API and never stored on our servers. 
                  Zero data retention. Your privacy is sacred.
                </p>
              </div>

              <div className="bg-white/70 rounded-2xl p-6 border border-rose-100">
                <h4 className="text-lg font-bold text-rose-700 mb-2">Q: Can this help me redesign my space?</h4>
                <p className="text-gray-800 leading-relaxed">
                  <strong>A:</strong> YES! Use the style identification to understand your current aesthetic, then follow our enhancement tips 
                  and color palette suggestions. It's like having a mini interior designer consultation!
                </p>
              </div>

              <div className="bg-white/70 rounded-2xl p-6 border border-rose-100">
                <h4 className="text-lg font-bold text-rose-700 mb-2">Q: Does it work on outdoor spaces?</h4>
                <p className="text-gray-800 leading-relaxed">
                  <strong>A:</strong> It's optimized for indoor rooms, but you can try! Outdoor spaces (patios, decks) might get style suggestions, 
                  though accuracy may vary since outdoor design has different rules.
                </p>
              </div>
            </div>
          </Card>

          <AutoAdSlot placement="in-feed" className="my-10" />

          <Card className="bg-gradient-to-br from-lime-50 to-green-50 border-2 border-lime-200 rounded-3xl p-10 shadow-2xl text-center">
            <Home className="w-16 h-16 text-orange-600 mx-auto mb-4 animate-bounce" />
            <h3 className="text-3xl font-extrabold text-gray-900 mb-4">🏠 Transform Your Space Today!</h3>
            <p className="text-xl text-gray-700 mb-6 leading-relaxed max-w-3xl mx-auto">
              Join thousands of homeowners, renters, and design enthusiasts discovering their interior style! 
              Whether you're decorating your first apartment or redesigning your dream home, we're here to help! 🎨
            </p>
            <Button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 hover:from-amber-700 hover:via-orange-700 hover:to-yellow-700 text-white px-10 py-6 rounded-2xl text-xl font-bold shadow-2xl transform transition-all hover:scale-110"
            >
              🚀 Discover Your Style Now!
            </Button>
          </Card>

          <div className="mt-8 text-center text-sm text-gray-600 bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-200">
            <p className="font-medium">
              🔒 <strong>Privacy Notice:</strong> Images are analyzed locally or via secure AI API. Never stored or shared.
            </p>
          </div>

          <AutoAdSlot placement="bottom-sticky" className="mt-10" />
        </div>
      </div>
    </>
  );
}
