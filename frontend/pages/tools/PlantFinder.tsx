import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, Loader2, AlertTriangle, X, Droplet, Sun, Thermometer, Heart, MapPin, Sparkles, RefreshCw, Leaf, Bug, Flower2, TreeDeciduous, Sprout } from 'lucide-react';
import backend from '~backend/client';
import { compressImage } from '@/lib/imageCompression';
import { SEOHead } from '@/components/SEOHead';
import { StructuredData } from '@/components/StructuredData';
import { AutoAdSlot } from '@/components/ads/AutoAdSlot';
import AmazonAffiliate from '@/components/ads/AmazonAffiliate';

interface PlantCareTips {
  wateringFrequency: string;
  sunlightPreference: string;
  temperatureRange: string;
  commonProblems: string[];
  remedies: string[];
}

interface PlantAnalysisResult {
  plantName: string;
  scientificName?: string;
  healthStatus: "Healthy" | "Underwatered" | "Overwatered" | "Diseased" | "Unknown";
  confidence: number;
  summary: string;
  careTips: PlantCareTips;
  regionSpecificAdvice?: string;
}

export default function PlantFinder() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PlantAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [userLocation, setUserLocation] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    detectUserLocation();
  }, []);

  const detectUserLocation = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      if (data.city && data.country_name) {
        setUserLocation(`${data.city}, ${data.country_name}`);
      }
    } catch (err) {
      console.error('Failed to detect location:', err);
    }
  };

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

      const analysisResult = await backend.vision.analyzePlant({ 
        imageBase64: base64,
        userLocation: userLocation || undefined
      });

      setResult(analysisResult);

      if (analysisResult.confidence < 0.6) {
        setError("We're not fully sure — please retake or upload a clearer photo.");
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'Failed to analyze plant. Please try again.');
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

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'Healthy': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'Underwatered': return 'bg-amber-500/20 text-amber-700 border-amber-500/30';
      case 'Overwatered': return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      case 'Diseased': return 'bg-red-500/20 text-red-700 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "AI Plant Finder & Health Analyzer",
    "description": "Identify your plant and check its health using AI. Upload a photo to get instant care tips — 100% free and powered by OpenAI.",
    "url": "https://smart-calculator-hub-d3409cs82vjl9890lfm0.lp.dev/finder/tools/plantfinder",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  if (showCamera) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
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
        title="AI Plant Finder & Health Analyzer - Free Plant Identification Tool | Smart Calculator Hubs"
        description="Identify any plant instantly with AI! Upload a photo and get plant name, health diagnosis, care tips, and climate-specific advice. 100% free plant identifier powered by OpenAI."
        keywords="plant identifier, plant finder, AI plant identification, plant health checker, free plant app, what plant is this, plant care tips, plant disease detector"
      />
      <StructuredData data={structuredData} />

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDIwMCwwLDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
        
        <div className="container mx-auto px-4 py-8 max-w-5xl relative z-10">
          
          <AutoAdSlot placement="top-banner" className="mb-8" />

          <div className="text-center mb-12 space-y-4 animate-in fade-in slide-in-from-top duration-700">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="relative">
                <Leaf className="w-12 h-12 text-green-600 animate-bounce" />
                <Sparkles className="w-6 h-6 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                AI Plant Finder 🌿
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto font-medium leading-relaxed">
              Your <span className="text-green-600 font-bold">FREE</span> pocket botanist! Snap a pic, discover your plant's name, 
              health status, and get personalized care tips in seconds 🚀
            </p>
            {userLocation && (
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-green-200">
                <MapPin className="w-4 h-4 text-green-600 animate-pulse" />
                <span className="text-sm font-medium text-gray-700">Detected: {userLocation}</span>
              </div>
            )}
          </div>

          <AutoAdSlot placement="in-feed" className="mb-8" />

          <Card className="backdrop-blur-xl bg-white/80 border-2 border-green-200 shadow-2xl rounded-3xl overflow-hidden mb-8 transform transition-all duration-300 hover:shadow-green-200/50 hover:shadow-3xl">
            <div className="p-8">
              
              {!selectedImage && (
                <div className="space-y-8 animate-in fade-in zoom-in duration-500">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">🌱 Ready to Identify Your Plant?</h2>
                    <p className="text-gray-600">Choose your preferred method below — camera or upload!</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Button 
                      onClick={openCamera}
                      className="h-40 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white rounded-3xl shadow-xl transition-all duration-300 hover:scale-105 hover:rotate-1 border-2 border-white/20"
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
                      className="h-40 border-3 border-green-400 hover:bg-green-100 bg-gradient-to-br from-white to-green-50 rounded-3xl shadow-xl transition-all duration-300 hover:scale-105 hover:-rotate-1"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <Upload className="w-14 h-14 text-green-600 animate-bounce" />
                        <span className="text-xl font-bold text-green-700">📤 Upload Image</span>
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
                        <span className="text-green-600 font-bold mt-0.5">✓</span>
                        <span><strong>Good lighting</strong> — natural light works best! Avoid dark/shadowy photos.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold mt-0.5">✓</span>
                        <span><strong>Clear focus</strong> — get close, but not too close. Show leaves and stems clearly.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold mt-0.5">✓</span>
                        <span><strong>Clean background</strong> — plain backgrounds help AI focus on your plant.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold mt-0.5">✓</span>
                        <span><strong>Under 10MB</strong> — keep file size reasonable for faster uploads.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}



              {selectedImage && (
                <div className="space-y-6">
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-green-200">
                    <img 
                      src={selectedImage} 
                      alt="Selected plant" 
                      className="w-full h-auto max-h-[500px] object-contain bg-gradient-to-br from-gray-50 to-green-50"
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

                  <AutoAdSlot placement="in-feed" className="my-8" />

                  {isAnalyzing && (
                    <div className="text-center py-16 space-y-6 animate-pulse">
                      <div className="relative inline-block">
                        <Loader2 className="w-20 h-20 animate-spin text-green-600 mx-auto" />
                        <Sparkles className="w-8 h-8 text-yellow-500 absolute top-0 right-0 animate-ping" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-800 mb-2">🔬 AI is Analyzing...</p>
                        <p className="text-lg text-gray-600">Hang tight! Our AI botanist is examining your plant</p>
                        <p className="text-sm text-gray-500 mt-2">This usually takes 3-5 seconds ⏱️</p>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  )}

                  {error && (
                    <Alert className="border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 animate-in slide-in-from-top duration-500">
                      <AlertTriangle className="w-6 h-6 text-amber-600" />
                      <AlertDescription className="text-amber-900 font-medium">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  {result && !isAnalyzing && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                      
                      <div className="bg-gradient-to-r from-green-100 via-emerald-100 to-teal-100 rounded-3xl p-6 border-2 border-green-300 shadow-xl">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div>
                            <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
                              <Flower2 className="w-8 h-8 text-pink-500" />
                              {result.plantName}
                            </h2>
                            {result.scientificName && (
                              <p className="text-base italic text-gray-600 mt-1 font-medium">{result.scientificName}</p>
                            )}
                          </div>
                          <div className="flex gap-3 flex-wrap">
                            <Badge className={`${getHealthStatusColor(result.healthStatus)} border-2 px-4 py-2 text-base font-bold`}>
                              <Heart className="w-5 h-5 mr-1" />
                              {result.healthStatus}
                            </Badge>
                            <Badge variant="outline" className="px-4 py-2 text-base border-2 border-green-400 bg-white font-bold">
                              {Math.round(result.confidence * 100)}% Match
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <AutoAdSlot placement="in-feed" className="my-8" />

                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border-2 border-green-200 shadow-lg">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Sparkles className="w-6 h-6 text-green-600 animate-pulse" />
                          AI Summary 📝
                        </h3>
                        <p className="text-gray-800 leading-relaxed text-lg">{result.summary}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-6 border-2 border-blue-200 shadow-lg transform transition-all hover:scale-105 hover:shadow-xl">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-blue-500 p-3 rounded-2xl">
                              <Droplet className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="text-lg font-bold text-gray-900">💧 Watering</h4>
                          </div>
                          <p className="text-gray-800 font-medium">{result.careTips.wateringFrequency}</p>
                        </div>

                        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-3xl p-6 border-2 border-amber-200 shadow-lg transform transition-all hover:scale-105 hover:shadow-xl">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-amber-500 p-3 rounded-2xl">
                              <Sun className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="text-lg font-bold text-gray-900">☀️ Sunlight</h4>
                          </div>
                          <p className="text-gray-800 font-medium">{result.careTips.sunlightPreference}</p>
                        </div>

                        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-3xl p-6 border-2 border-red-200 shadow-lg transform transition-all hover:scale-105 hover:shadow-xl">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-red-500 p-3 rounded-2xl">
                              <Thermometer className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="text-lg font-bold text-gray-900">🌡️ Temperature</h4>
                          </div>
                          <p className="text-gray-800 font-medium">{result.careTips.temperatureRange}</p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-3xl p-6 border-2 border-purple-200 shadow-lg transform transition-all hover:scale-105 hover:shadow-xl">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-purple-500 p-3 rounded-2xl">
                              <Bug className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="text-lg font-bold text-gray-900">🐛 Common Issues</h4>
                          </div>
                          {result.careTips.commonProblems.length > 0 ? (
                            <ul className="text-gray-800 space-y-2 font-medium">
                              {result.careTips.commonProblems.slice(0, 2).map((problem, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-purple-600 font-bold mt-0.5">•</span>
                                  <span>{problem}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-600 italic">None identified — you're doing great! 🎉</p>
                          )}
                        </div>
                      </div>

                      <AutoAdSlot placement="in-feed" className="my-8" />

                      {result.careTips.remedies.length > 0 && (
                        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl p-8 border-2 border-emerald-300 shadow-xl">
                          <h4 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                            <Sprout className="w-7 h-7 text-emerald-600" />
                            🌿 Care Remedies & Solutions
                          </h4>
                          <ul className="space-y-4">
                            {result.careTips.remedies.map((remedy, i) => (
                              <li key={i} className="flex items-start gap-3 bg-white/70 p-4 rounded-2xl border border-emerald-200">
                                <span className="bg-emerald-500 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                                  {i + 1}
                                </span>
                                <span className="text-gray-800 font-medium text-base">{remedy}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {result.regionSpecificAdvice && (
                        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-3xl p-8 border-2 border-teal-300 shadow-xl">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-teal-500 p-3 rounded-2xl">
                              <MapPin className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="text-2xl font-bold text-gray-900">🌍 Local Climate Tips</h4>
                          </div>
                          <p className="text-gray-800 font-medium text-lg leading-relaxed">{result.regionSpecificAdvice}</p>
                        </div>
                      )}

                      <AutoAdSlot placement="in-feed" className="my-8" />

                      <Button 
                        onClick={resetAnalysis}
                        className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white rounded-2xl py-8 text-xl font-bold shadow-2xl transform transition-all duration-300 hover:scale-105 border-2 border-white/20"
                      >
                        <RefreshCw className="w-6 h-6 mr-3" />
                        🔄 Analyze Another Plant
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          <AutoAdSlot placement="in-feed" className="my-10" />

          <AmazonAffiliate 
            calculatorTitle="Plant Care Tools Garden"
            placement="content"
          />

          <AutoAdSlot placement="in-feed" className="my-10" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TreeDeciduous className="w-7 h-7 text-purple-600" />
                🌳 How It Works
              </h3>
              <div className="space-y-4 text-gray-800">
                <p className="flex items-start gap-3">
                  <span className="bg-purple-500 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">1</span>
                  <span className="font-medium pt-1"><strong>Snap or Upload</strong> — Take a clear photo of your plant or upload from your gallery.</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="bg-purple-500 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">2</span>
                  <span className="font-medium pt-1"><strong>AI Analysis</strong> — Our OpenAI GPT-4 Vision model identifies the species and checks health.</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="bg-purple-500 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">3</span>
                  <span className="font-medium pt-1"><strong>Get Results</strong> — Receive plant name, health status, care tips, and climate advice.</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="bg-purple-500 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">4</span>
                  <span className="font-medium pt-1"><strong>Take Action</strong> — Follow our personalized recommendations to keep your plant thriving!</span>
                </p>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-7 h-7 text-orange-600 animate-pulse" />
                ✨ Why Choose Us?
              </h3>
              <div className="space-y-4 text-gray-800">
                <p className="flex items-start gap-3">
                  <span className="text-2xl">🤖</span>
                  <span className="font-medium pt-1"><strong>AI-Powered</strong> — Using cutting-edge OpenAI GPT-4 Vision technology for accurate identification.</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-2xl">💯</span>
                  <span className="font-medium pt-1"><strong>100% Free</strong> — No subscriptions, no hidden fees, no BS. Seriously free forever.</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-2xl">⚡</span>
                  <span className="font-medium pt-1"><strong>Lightning Fast</strong> — Get results in 3-5 seconds. No waiting around!</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-2xl">🌍</span>
                  <span className="font-medium pt-1"><strong>Climate-Smart</strong> — Auto-detects your location for region-specific plant care advice.</span>
                </p>
              </div>
            </Card>
          </div>

          <AutoAdSlot placement="in-feed" className="my-10" />

          <Card className="bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 border-2 border-indigo-200 rounded-3xl p-10 shadow-2xl mb-10">
            <h3 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">🎓 Plant Care 101: Everything You Need to Know</h3>
            
            <div className="prose prose-lg max-w-none space-y-6 text-gray-800">
              <div className="bg-white/70 rounded-2xl p-6 border border-indigo-100">
                <h4 className="text-xl font-bold text-indigo-700 mb-3">🌱 Understanding Your Plant's Needs</h4>
                <p className="leading-relaxed">
                  Every plant is unique, just like us! Some crave sunshine like a beach bum, while others prefer the shade like a vampire. 
                  The key to happy plants? Understanding what YOUR specific plant species needs. That's where our AI Plant Finder comes in clutch — 
                  it tells you EXACTLY what your green buddy wants, from water to light to temperature.
                </p>
              </div>

              <div className="bg-white/70 rounded-2xl p-6 border border-blue-100">
                <h4 className="text-xl font-bold text-blue-700 mb-3">💧 Watering Wisdom: Not Too Much, Not Too Little</h4>
                <p className="leading-relaxed mb-4">
                  Here's the deal: <strong>overwatering kills more plants than underwatering</strong>. Shocking, right? Most people think "more water = more love," 
                  but plants don't work that way. Too much water drowns the roots and causes root rot (basically plant pneumonia). 
                </p>
                <p className="leading-relaxed">
                  <strong>The finger test:</strong> Stick your finger 1-2 inches into the soil. If it's dry, water it. If it's moist, wait. 
                  Simple! Our AI will tell you the ideal watering frequency for your specific plant, so you don't have to guess.
                </p>
              </div>

              <div className="bg-white/70 rounded-2xl p-6 border border-cyan-100">
                <h4 className="text-xl font-bold text-cyan-700 mb-3">☀️ Light Levels: The Secret Sauce for Growth</h4>
                <p className="leading-relaxed mb-4">
                  Light is food for plants. Without it, they literally starve. But here's the catch — different plants need different "portions" of light:
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="leading-relaxed"><strong>☀️☀️☀️ Full Sun:</strong> 6+ hours of direct sunlight daily (think cacti, succulents, tomatoes).</li>
                  <li className="leading-relaxed"><strong>⛅ Partial Sun:</strong> 3-6 hours of direct sunlight (roses, lavender, many veggies).</li>
                  <li className="leading-relaxed"><strong>🌤️ Bright Indirect:</strong> Lots of light, but not direct rays (most houseplants LOVE this!).</li>
                  <li className="leading-relaxed"><strong>🌫️ Low Light:</strong> Minimal light (snake plants, pothos, ZZ plants are champs here).</li>
                </ul>
                <p className="leading-relaxed mt-4">
                  Not sure what yours needs? Upload a pic to our AI Plant Finder and we'll tell you the exact light requirements!
                </p>
              </div>

              <div className="bg-white/70 rounded-2xl p-6 border border-teal-100">
                <h4 className="text-xl font-bold text-teal-700 mb-3">🌡️ Temperature & Humidity: Creating the Perfect Environment</h4>
                <p className="leading-relaxed mb-4">
                  Most houseplants are tropical divas that love temps between 65-75°F (18-24°C). Too cold? Growth slows. Too hot? They get stressed and crispy.
                </p>
                <p className="leading-relaxed mb-4">
                  <strong>Humidity matters too!</strong> If your plant's leaves are turning brown at the tips, it might be crying for moisture in the air. 
                  Quick fixes: mist regularly, use a humidifier, or group plants together (they create their own humidity party!).
                </p>
                <p className="leading-relaxed">
                  Our AI Plant Finder detects your location and gives you climate-specific advice, so your plant thrives in YOUR environment — not just in theory.
                </p>
              </div>

              <div className="bg-white/70 rounded-2xl p-6 border border-green-100">
                <h4 className="text-xl font-bold text-green-700 mb-3">🐛 Common Plant Problems (And How to Fix Them!)</h4>
                <div className="space-y-4">
                  <div>
                    <p className="font-bold text-gray-900 mb-1">🍂 Yellow Leaves:</p>
                    <p className="leading-relaxed">Usually means overwatering. Let the soil dry out between waterings. Check for root rot!</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">🍃 Brown Crispy Tips:</p>
                    <p className="leading-relaxed">Low humidity or underwatering. Mist your plant or move it away from heating vents.</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">🦗 Pests (Aphids, Spider Mites, etc.):</p>
                    <p className="leading-relaxed">Wipe leaves with soapy water or neem oil spray. Isolate infected plants ASAP!</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">😴 Droopy Leaves:</p>
                    <p className="leading-relaxed">Could be underwatering OR overwatering (confusing, we know). Check the soil moisture!</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">🌿 Leggy Growth (Tall & Thin):</p>
                    <p className="leading-relaxed">Not enough light. Move closer to a window or add a grow light.</p>
                  </div>
                </div>
                <p className="leading-relaxed mt-4 text-center font-bold">
                  🔍 Upload your plant photo to our AI and get instant health diagnosis + solutions!
                </p>
              </div>

              <div className="bg-white/70 rounded-2xl p-6 border border-purple-100">
                <h4 className="text-xl font-bold text-purple-700 mb-3">🪴 Repotting 101: When & How to Give Your Plant More Space</h4>
                <p className="leading-relaxed mb-4">
                  Plants outgrow their pots, just like kids outgrow shoes. <strong>Signs your plant needs a bigger home:</strong>
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="leading-relaxed">Roots poking out of drainage holes</li>
                  <li className="leading-relaxed">Water drains SUPER fast (roots have taken over the soil)</li>
                  <li className="leading-relaxed">Plant is top-heavy and keeps tipping over</li>
                  <li className="leading-relaxed">Growth has slowed or stopped</li>
                </ul>
                <p className="leading-relaxed mt-4">
                  <strong>How to repot:</strong> Choose a pot 1-2 inches larger in diameter. Gently remove the plant, loosen roots, add fresh soil, 
                  and water thoroughly. Easy peasy! Do this every 1-2 years for most plants.
                </p>
              </div>

              <div className="bg-white/70 rounded-2xl p-6 border border-pink-100">
                <h4 className="text-xl font-bold text-pink-700 mb-3">🌸 Fun Plant Facts to Impress Your Friends</h4>
                <ul className="space-y-3">
                  <li className="leading-relaxed">🌿 <strong>Plants can "hear" water</strong> — roots literally grow toward the sound of water!</li>
                  <li className="leading-relaxed">🗣️ <strong>Talking to plants helps them grow</strong> — carbon dioxide from your breath is like food to them.</li>
                  <li className="leading-relaxed">🌲 <strong>A single tree produces enough oxygen</strong> for 2 people annually. Plant more trees!</li>
                  <li className="leading-relaxed">🌵 <strong>Cacti can live 200+ years</strong> — that's commitment!</li>
                  <li className="leading-relaxed">🌺 <strong>The corpse flower smells like rotting meat</strong> — thankfully, it only blooms once every 7-10 years.</li>
                  <li className="leading-relaxed">🪴 <strong>Bamboo is the fastest-growing plant</strong> — some species grow 3 feet PER DAY!</li>
                </ul>
              </div>
            </div>
          </Card>

          <AutoAdSlot placement="in-feed" className="my-10" />

          <Card className="bg-gradient-to-br from-rose-50 to-red-50 border-2 border-rose-200 rounded-3xl p-10 shadow-2xl mb-10">
            <h3 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">❓ Frequently Asked Questions (FAQ)</h3>
            
            <div className="space-y-6">
              <div className="bg-white/70 rounded-2xl p-6 border border-rose-100">
                <h4 className="text-lg font-bold text-rose-700 mb-2">Q: Is this plant finder really free?</h4>
                <p className="text-gray-800 leading-relaxed">
                  <strong>A:</strong> YES! 100% free, no strings attached. No credit card required, no sneaky subscriptions, nada. 
                  We believe plant care should be accessible to everyone!
                </p>
              </div>

              <div className="bg-white/70 rounded-2xl p-6 border border-rose-100">
                <h4 className="text-lg font-bold text-rose-700 mb-2">Q: How accurate is the AI plant identification?</h4>
                <p className="text-gray-800 leading-relaxed">
                  <strong>A:</strong> Our AI uses OpenAI's GPT-4 Vision, which is crazy accurate (typically 85-95% confidence). 
                  For best results, upload clear, well-lit photos showing leaves, stems, and any flowers. The AI will also tell you its confidence level!
                </p>
              </div>

              <div className="bg-white/70 rounded-2xl p-6 border border-rose-100">
                <h4 className="text-lg font-bold text-rose-700 mb-2">Q: Can it identify ALL plants?</h4>
                <p className="text-gray-800 leading-relaxed">
                  <strong>A:</strong> It covers a HUGE range — houseplants, garden plants, succulents, herbs, veggies, flowers, trees, and more. 
                  Super rare or obscure species might stump it, but for 99% of plants you'll encounter, it works like magic!
                </p>
              </div>

              <div className="bg-white/70 rounded-2xl p-6 border border-rose-100">
                <h4 className="text-lg font-bold text-rose-700 mb-2">Q: What if my plant is sick or dying?</h4>
                <p className="text-gray-800 leading-relaxed">
                  <strong>A:</strong> That's exactly what we're here for! The AI checks health status (Healthy, Underwatered, Overwatered, Diseased) 
                  and gives you specific remedies to nurse it back to life. It's like having a plant doctor in your pocket!
                </p>
              </div>

              <div className="bg-white/70 rounded-2xl p-6 border border-rose-100">
                <h4 className="text-lg font-bold text-rose-700 mb-2">Q: Does it work on my phone?</h4>
                <p className="text-gray-800 leading-relaxed">
                  <strong>A:</strong> Absolutely! Works on iPhone, Android, tablets, laptops — any device with a camera or photo gallery. 
                  The responsive design looks beautiful everywhere.
                </p>
              </div>

              <div className="bg-white/70 rounded-2xl p-6 border border-rose-100">
                <h4 className="text-lg font-bold text-rose-700 mb-2">Q: Do you save my photos or personal data?</h4>
                <p className="text-gray-800 leading-relaxed">
                  <strong>A:</strong> Nope! We only detect your city/country for climate advice (via your IP address). 
                  Your plant photos are analyzed in real-time and NOT stored on our servers. Your privacy = our priority.
                </p>
              </div>

              <div className="bg-white/70 rounded-2xl p-6 border border-rose-100">
                <h4 className="text-lg font-bold text-rose-700 mb-2">Q: Can I use this for my garden or outdoor plants?</h4>
                <p className="text-gray-800 leading-relaxed">
                  <strong>A:</strong> YES! It works for indoor houseplants AND outdoor garden plants, trees, shrubs, flowers, 
                  vegetables, herbs — you name it. Snap a pic and find out what it is!
                </p>
              </div>

              <div className="bg-white/70 rounded-2xl p-6 border border-rose-100">
                <h4 className="text-lg font-bold text-rose-700 mb-2">Q: What's the catch? Why is it free?</h4>
                <p className="text-gray-800 leading-relaxed">
                  <strong>A:</strong> No catch! We monetize through ethical ads (Google AdSense + Amazon affiliate links for plant care products). 
                  That's it. We make the tool free so everyone can keep their plants happy and healthy 🌱
                </p>
              </div>
            </div>
          </Card>

          <AutoAdSlot placement="in-feed" className="my-10" />

          <Card className="bg-gradient-to-br from-lime-50 to-green-50 border-2 border-lime-200 rounded-3xl p-10 shadow-2xl text-center">
            <Leaf className="w-16 h-16 text-green-600 mx-auto mb-4 animate-bounce" />
            <h3 className="text-3xl font-extrabold text-gray-900 mb-4">🌍 Join the Plant Parent Revolution!</h3>
            <p className="text-xl text-gray-700 mb-6 leading-relaxed max-w-3xl mx-auto">
              Over <strong className="text-green-600">10,000+ plant parents</strong> have already identified their plants using our AI tool. 
              Whether you're a total beginner or a seasoned gardener, we're here to help you grow! 🌱
            </p>
            <p className="text-lg text-gray-600 mb-8">
              Got questions? Found a rare plant? Share your plant journey with us on social media using <strong>#AIPlantFinder</strong> 💚
            </p>
            <Button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white px-10 py-6 rounded-2xl text-xl font-bold shadow-2xl transform transition-all hover:scale-110"
            >
              🚀 Identify Your Plant Now!
            </Button>
          </Card>

          <AutoAdSlot placement="bottom-sticky" className="mt-10" />
        </div>
      </div>
    </>
  );
}
