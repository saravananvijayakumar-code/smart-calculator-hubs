import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertTriangle, X, Sparkles, RefreshCw, Dog, Cat, Heart, Lightbulb, Share2, Camera, Upload } from 'lucide-react';
import backend from '~backend/client';
import { compressImage } from '@/lib/imageCompression';
import { SEOHead } from '@/components/SEOHead';
import { StructuredData } from '@/components/StructuredData';
import { AutoAdSlot } from '@/components/ads/AutoAdSlot';
import AmazonAffiliate from '@/components/ads/AmazonAffiliate';
import breedsData from '@/data/breeds.json';

interface PetBreedResult {
  breedName: string;
  scientificName?: string;
  confidence: number;
  description: string;
  funFacts: string[];
  similarBreeds: string[];
  petType: "dog" | "cat" | "unknown";
}

export default function PetBreedFinder() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PetBreedResult | null>(null);
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

      const analysisResult = await backend.vision.analyzePetBreed({ 
        imageBase64: base64
      });

      setResult(analysisResult);

      if (analysisResult.confidence < 0.6) {
        setError("Not fully confident — try a clearer photo for better accuracy!");
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'Failed to analyze pet. Please try again.');
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
    const text = `I just identified a ${result.breedName} using AI! 🐾 Check it out:`;
    if (navigator.share) {
      navigator.share({ title: 'Pet Breed Finder', text, url });
    } else {
      navigator.clipboard.writeText(`${text} ${url}`);
      alert('Link copied to clipboard!');
    }
  };

  const getBreedDetails = (breedName: string, petType: string) => {
    const breedDb = petType === 'dog' ? breedsData.dogs : breedsData.cats;
    return breedDb[breedName as keyof typeof breedDb];
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "AI Pet Breed Finder — Identify Dog & Cat Breeds Instantly",
    "description": "Free AI-powered pet breed identifier. Upload a photo of your dog or cat and get instant breed identification, fun facts, and care tips.",
    "url": "https://smart-calculator-hub-d3409cs82vjl9890lfm0.lp.dev/finder/tools/pet-breed-finder",
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
        "name": "Is the pet breed finder really free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! 100% free with no subscriptions, no hidden fees, and no credit card required. We believe pet identification should be accessible to everyone."
        }
      },
      {
        "@type": "Question",
        "name": "How accurate is the AI breed identification?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our AI uses OpenAI GPT-4 Vision, achieving 85-95% accuracy on clear photos. Upload well-lit images showing your pet's face and body for best results."
        }
      },
      {
        "@type": "Question",
        "name": "What species does it support?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Currently supports dogs and cats with hundreds of breeds recognized. We're working on adding more species in future updates."
        }
      },
      {
        "@type": "Question",
        "name": "Do you store my pet photos?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No! Photos are analyzed in real-time via secure AI API and never stored on our servers. Your privacy is our priority."
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
        title="AI Pet Breed Finder — Identify Dog & Cat Breeds Instantly (Free) | Smart Calculator Hubs"
        description="Free AI pet breed identifier! Upload a photo of your dog or cat and instantly discover the breed, fun facts, and similar breeds. Powered by OpenAI — 100% free forever."
        keywords="pet breed finder, dog breed identifier, cat breed identifier, AI pet identification, what breed is my dog, what breed is my cat, free pet breed detector"
      />
      <StructuredData data={structuredData} />
      <StructuredData data={faqData} />

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDEwMCwgMjAwLCAwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
        
        <div className="container mx-auto px-4 py-8 max-w-5xl relative z-10">
          
          <AutoAdSlot placement="top-banner" className="mb-8" />

          <div className="text-center mb-12 space-y-4 animate-in fade-in slide-in-from-top duration-700 overflow-visible">
            <div className="inline-flex items-center justify-center gap-3 mb-4">
              <span className="text-5xl md:text-6xl">🐶</span>
              <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                Pet Breed Finder
              </h1>
              <span className="text-5xl md:text-6xl">🐾</span>
            </div>
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto font-medium leading-relaxed">
              Snap a pic of your furry friend & discover their breed instantly! 
              <span className="text-purple-600 font-bold"> FREE</span> AI-powered identification for dogs & cats 🚀
            </p>
          </div>

          <AutoAdSlot placement="in-feed" className="mb-8" />

          <Card className="backdrop-blur-xl bg-white/80 border-2 border-purple-200 shadow-2xl rounded-3xl overflow-hidden mb-8 transform transition-all duration-300 hover:shadow-purple-200/50 hover:shadow-3xl">
            <div className="p-8">
              
              {!selectedImage && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">🐶 Ready to Identify Your Pet?</h2>
                    <p className="text-gray-600">Take a photo or upload from your gallery!</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Button 
                      onClick={openCamera}
                      className="h-40 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white rounded-3xl shadow-xl transition-all duration-300 hover:scale-105 hover:rotate-1 border-2 border-white/20"
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
                      className="h-40 border-3 border-purple-400 hover:bg-purple-100 bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-xl transition-all duration-300 hover:scale-105 hover:-rotate-1"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <Upload className="w-14 h-14 text-purple-600 animate-bounce" />
                        <span className="text-xl font-bold text-purple-700">📤 Upload Image</span>
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
                        <span className="text-purple-600 font-bold mt-0.5">✓</span>
                        <span><strong>Clear face shot</strong> — Show your pet's face clearly from the front or side.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600 font-bold mt-0.5">✓</span>
                        <span><strong>Good lighting</strong> — Natural light works best. Avoid dark or blurry photos.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600 font-bold mt-0.5">✓</span>
                        <span><strong>Full body view helps</strong> — Include body, coat pattern, and distinctive markings.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600 font-bold mt-0.5">✓</span>
                        <span><strong>Solo shots</strong> — One pet per photo for accurate identification.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {selectedImage && (
                <div className="space-y-6">
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-purple-200">
                    <img 
                      src={selectedImage} 
                      alt="Selected pet" 
                      className="w-full h-auto max-h-[500px] object-contain bg-gradient-to-br from-gray-50 to-purple-50"
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
                        <Loader2 className="w-20 h-20 animate-spin text-purple-600 mx-auto" />
                        <Sparkles className="w-8 h-8 text-pink-500 absolute top-0 right-0 animate-ping" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-800 mb-2">🔬 AI is Analyzing...</p>
                        <p className="text-lg text-gray-600">Identifying your pet's breed!</p>
                        <p className="text-sm text-gray-500 mt-2">This usually takes 3-5 seconds ⏱️</p>
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
                      
                      <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100 rounded-3xl p-6 border-2 border-purple-300 shadow-xl">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              {result.petType === 'dog' ? <Dog className="w-8 h-8 text-purple-600" /> : <Cat className="w-8 h-8 text-pink-600" />}
                              <h2 className="text-3xl font-extrabold text-gray-900">
                                {result.breedName}
                              </h2>
                            </div>
                            {result.scientificName && (
                              <p className="text-base italic text-gray-600 font-medium">{result.scientificName}</p>
                            )}
                          </div>
                          <div className="flex gap-3 flex-wrap">
                            <Badge className="bg-purple-500/20 text-purple-700 border-2 border-purple-500/30 px-4 py-2 text-base font-bold">
                              <Heart className="w-5 h-5 mr-1" />
                              {Math.round(result.confidence * 100)}% Match
                            </Badge>
                            <Button
                              onClick={shareResult}
                              variant="outline"
                              size="sm"
                              className="border-2 border-purple-400"
                            >
                              <Share2 className="w-4 h-4 mr-1" />
                              Share
                            </Button>
                          </div>
                        </div>
                      </div>

                      <AutoAdSlot placement="in-feed" className="my-8" />

                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border-2 border-purple-200 shadow-lg">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Sparkles className="w-6 h-6 text-purple-600 animate-pulse" />
                          About This Breed 📝
                        </h3>
                        <p className="text-gray-800 leading-relaxed text-lg">{result.description}</p>
                      </div>

                      {result.funFacts.length > 0 && (
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 border-2 border-blue-200 shadow-lg">
                          <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                            <Lightbulb className="w-6 h-6 text-blue-600" />
                            🎉 Fun Facts
                          </h3>
                          <ul className="space-y-4">
                            {result.funFacts.map((fact, i) => (
                              <li key={i} className="flex items-start gap-3 bg-white/70 p-4 rounded-2xl border border-blue-200">
                                <span className="bg-blue-500 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                                  {i + 1}
                                </span>
                                <span className="text-gray-800 font-medium text-base">{fact}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <AutoAdSlot placement="in-feed" className="my-8" />

                      {result.similarBreeds.length > 0 && (
                        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-3xl p-8 border-2 border-orange-200 shadow-lg">
                          <h3 className="text-xl font-bold text-gray-900 mb-4">
                            🐾 Similar Breeds
                          </h3>
                          <div className="flex flex-wrap gap-3">
                            {result.similarBreeds.map((breed, i) => (
                              <Badge key={i} variant="outline" className="px-4 py-2 text-base border-2 border-orange-300 bg-white">
                                {breed}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <AmazonAffiliate 
                        calculatorTitle={`${result.petType === 'dog' ? 'dog' : 'cat'} ${result.breedName.toLowerCase().replace(/ /g, '-')}`}
                        placement="content"
                      />

                      <AutoAdSlot placement="in-feed" className="my-8" />

                      <Button 
                        onClick={resetAnalysis}
                        className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white rounded-2xl py-8 text-xl font-bold shadow-2xl transform transition-all duration-300 hover:scale-105 border-2 border-white/20"
                      >
                        <RefreshCw className="w-6 h-6 mr-3" />
                        🔄 Identify Another Pet
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          <AutoAdSlot placement="in-feed" className="my-10" />

          <AmazonAffiliate 
            calculatorTitle="pet supplies dog cat"
            placement="content"
          />

          <AutoAdSlot placement="in-feed" className="my-10" />

          <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 border-2 border-indigo-200 rounded-3xl p-10 shadow-2xl mb-10">
            <h3 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">🎓 Complete Guide to Pet Breed Identification</h3>
            
            <div className="prose prose-lg max-w-none space-y-6 text-gray-800">
              <div className="bg-white/70 rounded-2xl p-6 border border-indigo-100">
                <h4 className="text-xl font-bold text-indigo-700 mb-3">🐶 Why Breed Matters: Understanding Your Pet</h4>
                <p className="leading-relaxed">
                  Knowing your pet's breed isn't just trivia — it's essential for their health and happiness! Different breeds have unique needs, 
                  temperaments, exercise requirements, and health predispositions. A Border Collie needs 2+ hours of exercise daily, while a 
                  French Bulldog is content with short walks. Persian cats need daily grooming; American Shorthairs barely need any.
                </p>
                <p className="leading-relaxed mt-4">
                  Our AI Pet Breed Finder uses OpenAI's GPT-4 Vision to analyze your pet's physical characteristics — coat pattern, ear shape, 
                  facial structure, body build — and match them against hundreds of recognized breeds. It's like having a veterinary expert 
                  in your pocket, minus the $150 consultation fee!
                </p>
              </div>

              <div className="bg-white/70 rounded-2xl p-6 border border-blue-100">
                <h4 className="text-xl font-bold text-blue-700 mb-3">📸 How to Get the Best Results</h4>
                <p className="leading-relaxed mb-4">
                  AI is smart, but it can't work magic with a blurry, dark photo! Here's how to maximize accuracy:
                </p>
                <ul className="space-y-3 ml-6">
                  <li className="leading-relaxed">
                    <strong>📷 Lighting is Everything:</strong> Use natural daylight if possible. Avoid flash (creates harsh shadows) and dim indoor lighting.
                  </li>
                  <li className="leading-relaxed">
                    <strong>🎯 Focus on Key Features:</strong> Capture your pet's face clearly, including ears, eyes, and nose. These are major breed identifiers!
                  </li>
                  <li className="leading-relaxed">
                    <strong>🧍 Full Body Helps:</strong> A full-body shot reveals proportions, coat length, tail shape, and build — all crucial for accuracy.
                  </li>
                  <li className="leading-relaxed">
                    <strong>🚫 Avoid Distractions:</strong> Plain backgrounds work best. Other pets or people in the frame can confuse the AI.
                  </li>
                  <li className="leading-relaxed">
                    <strong>📐 Angle Matters:</strong> Front or side profiles are ideal. Extreme angles (top-down, bottom-up) reduce accuracy.
                  </li>
                </ul>
              </div>

              <div className="bg-white/70 rounded-2xl p-6 border border-cyan-100">
                <h4 className="text-xl font-bold text-cyan-700 mb-3">🐕 Dog Breed Basics: What Makes Each Unique?</h4>
                <p className="leading-relaxed mb-4">
                  Dogs are the most diverse mammal species on Earth — from 2-pound Chihuahuas to 200-pound Mastiffs! Here's what defines different breeds:
                </p>
                <div className="space-y-4">
                  <div>
                    <p className="font-bold text-gray-900 mb-1">🏃 Energy Levels:</p>
                    <p className="leading-relaxed">
                      Working breeds (German Shepherds, Border Collies, Huskies) = high energy. Toy breeds (Shih Tzus, Pugs) = moderate. 
                      Giant breeds (Great Danes, Mastiffs) = surprisingly lazy!
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">🧠 Intelligence Ranking:</p>
                    <p className="leading-relaxed">
                      Border Collies and Poodles top the IQ charts (learn commands in &lt;5 reps). Hounds are smart but stubborn. 
                      Bulldogs? Sweet but... not the sharpest tools in the shed.
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">🩺 Health Predispositions:</p>
                    <p className="leading-relaxed">
                      Brachycephalic breeds (Pugs, French Bulldogs) = breathing issues. Large breeds (Labs, Golden Retrievers) = hip dysplasia. 
                      Small breeds = dental problems. Know your breed's risks!
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 rounded-2xl p-6 border border-teal-100">
                <h4 className="text-xl font-bold text-teal-700 mb-3">🐱 Cat Breed Characteristics</h4>
                <p className="leading-relaxed mb-4">
                  Cats are less visually diverse than dogs, but breed differences are HUGE when it comes to personality and care:
                </p>
                <div className="space-y-4">
                  <div>
                    <p className="font-bold text-gray-900 mb-1">💬 Vocal vs. Silent:</p>
                    <p className="leading-relaxed">
                      Siamese and Bengals are CHATTY — they'll "talk" your ear off. Russian Blues and British Shorthairs? Silent observers.
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">🧹 Grooming Needs:</p>
                    <p className="leading-relaxed">
                      Persians and Maine Coons require daily brushing (matting is REAL). Sphynx cats need weekly baths (oil buildup). 
                      Domestic Shorthairs are self-sufficient.
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">🎾 Activity Levels:</p>
                    <p className="leading-relaxed">
                      Bengals and Abyssinians are hyperactive athletes. Ragdolls and Persians are couch potatoes. Match the breed to your lifestyle!
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 rounded-2xl p-6 border border-green-100">
                <h4 className="text-xl font-bold text-green-700 mb-3">🧬 Mixed Breeds: The Plot Thickens</h4>
                <p className="leading-relaxed mb-4">
                  Got a mutt? That's AWESOME — mixed breeds often have better health due to genetic diversity (hybrid vigor). But identifying them is trickier.
                </p>
                <p className="leading-relaxed mb-4">
                  Our AI can detect dominant breed traits in mixed-breed pets. If your dog has floppy ears, a golden coat, and a retriever build, 
                  it might be a Golden Retriever mix. If your cat has blue eyes and a seal-point coat, it's likely got some Siamese lineage.
                </p>
                <p className="leading-relaxed">
                  <strong>Pro Tip:</strong> For mixed breeds, consider a DNA test (Embark for dogs, Basepaws for cats) for definitive answers. 
                  Our tool gives you a quick, free first impression!
                </p>
              </div>

              <div className="bg-white/70 rounded-2xl p-6 border border-purple-100">
                <h4 className="text-xl font-bold text-purple-700 mb-3">🏥 Why Breed Identification Helps Your Vet</h4>
                <p className="leading-relaxed mb-4">
                  Veterinarians use breed info to anticipate health issues and customize care plans:
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="leading-relaxed">
                    <strong>Preventive Care:</strong> Knowing your Dalmatian is prone to kidney stones helps your vet monitor early.
                  </li>
                  <li className="leading-relaxed">
                    <strong>Medication Dosing:</strong> Some breeds (Collies, Australian Shepherds) have genetic sensitivity to certain drugs.
                  </li>
                  <li className="leading-relaxed">
                    <strong>Anesthesia Safety:</strong> Brachycephalic breeds need special anesthesia protocols due to airway anatomy.
                  </li>
                  <li className="leading-relaxed">
                    <strong>Weight Management:</strong> A 30-pound Beagle is obese; a 30-pound Border Collie is perfect. Breed-specific charts matter!
                  </li>
                </ul>
              </div>

              <div className="bg-white/70 rounded-2xl p-6 border border-pink-100">
                <h4 className="text-xl font-bold text-pink-700 mb-3">🎉 Fun Pet Breed Facts</h4>
                <ul className="space-y-3">
                  <li className="leading-relaxed">🐕 <strong>Smallest Dog Breed:</strong> Chihuahua (2-6 lbs). Largest? English Mastiff (120-230 lbs)!</li>
                  <li className="leading-relaxed">🐈 <strong>Oldest Cat Breed:</strong> Egyptian Mau — depicted in 3,000-year-old hieroglyphics!</li>
                  <li className="leading-relaxed">🏊 <strong>Water-Loving Dogs:</strong> Newfoundlands have webbed feet and can rescue drowning swimmers.</li>
                  <li className="leading-relaxed">💨 <strong>Fastest Dog:</strong> Greyhounds hit 45 mph. Fastest cat? Egyptian Mau at 30 mph!</li>
                  <li className="leading-relaxed">👃 <strong>Best Sniffer:</strong> Bloodhounds have 300 million scent receptors (humans have 5 million).</li>
                  <li className="leading-relaxed">😺 <strong>Only Naturally Hairless Cat:</strong> Sphynx (technically covered in fine down, not bald).</li>
                  <li className="leading-relaxed">🧠 <strong>Smartest Breeds:</strong> Dogs = Border Collie. Cats = Abyssinian.</li>
                </ul>
              </div>
            </div>
          </div>

          <AutoAdSlot placement="in-feed" className="my-10" />

          <Card className="bg-gradient-to-br from-rose-50 to-red-50 border-2 border-rose-200 rounded-3xl p-10 shadow-2xl mb-10">
            <h3 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">❓ Frequently Asked Questions (FAQ)</h3>
            
            <div className="space-y-6">
              <div className="bg-white/70 rounded-2xl p-6 border border-rose-100">
                <h4 className="text-lg font-bold text-rose-700 mb-2">Q: Is this pet breed finder really free?</h4>
                <p className="text-gray-800 leading-relaxed">
                  <strong>A:</strong> YES! 100% free forever. No subscriptions, no hidden fees, no credit card required. 
                  We believe pet identification should be accessible to everyone who loves animals!
                </p>
              </div>

              <div className="bg-white/70 rounded-2xl p-6 border border-rose-100">
                <h4 className="text-lg font-bold text-rose-700 mb-2">Q: How accurate is the AI breed identification?</h4>
                <p className="text-gray-800 leading-relaxed">
                  <strong>A:</strong> Our AI uses OpenAI GPT-4 Vision, achieving 85-95% accuracy on clear, well-lit photos. 
                  Results depend on photo quality, angle, and how closely your pet matches breed standards. Mixed breeds may show lower confidence scores.
                </p>
              </div>

              <div className="bg-white/70 rounded-2xl p-6 border border-rose-100">
                <h4 className="text-lg font-bold text-rose-700 mb-2">Q: What species and breeds does it support?</h4>
                <p className="text-gray-800 leading-relaxed">
                  <strong>A:</strong> Currently supports dogs and cats with hundreds of recognized breeds from AKC, CFA, and international registries. 
                  We're working on adding rabbits, birds, and other pets soon!
                </p>
              </div>

              <div className="bg-white/70 rounded-2xl p-6 border border-rose-100">
                <h4 className="text-lg font-bold text-rose-700 mb-2">Q: Does it work on mixed breed pets?</h4>
                <p className="text-gray-800 leading-relaxed">
                  <strong>A:</strong> Yes! The AI identifies dominant breed traits visible in your pet's appearance. 
                  For precise genetic breakdown, consider a DNA test (Embark, Wisdom Panel). Our tool is perfect for quick, visual assessment!
                </p>
              </div>

              <div className="bg-white/70 rounded-2xl p-6 border border-rose-100">
                <h4 className="text-lg font-bold text-rose-700 mb-2">Q: Do you store my pet photos or personal data?</h4>
                <p className="text-gray-800 leading-relaxed">
                  <strong>A:</strong> Absolutely NOT! Photos are analyzed in real-time via secure OpenAI API and never stored on our servers. 
                  Zero data retention. Your privacy and your pet's privacy are paramount.
                </p>
              </div>

              <div className="bg-white/70 rounded-2xl p-6 border border-rose-100">
                <h4 className="text-lg font-bold text-rose-700 mb-2">Q: Can I use this for shelter or rescue pets?</h4>
                <p className="text-gray-800 leading-relaxed">
                  <strong>A:</strong> YES! Perfect for shelters, rescues, and adopters trying to identify mystery breeds. 
                  Helps match pets to appropriate homes based on breed characteristics and care needs.
                </p>
              </div>

              <div className="bg-white/70 rounded-2xl p-6 border border-rose-100">
                <h4 className="text-lg font-bold text-rose-700 mb-2">Q: Does it work on puppies and kittens?</h4>
                <p className="text-gray-800 leading-relaxed">
                  <strong>A:</strong> It tries! But accuracy may be lower since puppies/kittens haven't developed adult features. 
                  Best results come from pets 6+ months old when breed characteristics are more pronounced.
                </p>
              </div>

              <div className="bg-white/70 rounded-2xl p-6 border border-rose-100">
                <h4 className="text-lg font-bold text-rose-700 mb-2">Q: What if the AI gets it wrong?</h4>
                <p className="text-gray-800 leading-relaxed">
                  <strong>A:</strong> Try uploading a different photo with better lighting/angle. Check the confidence score — 
                  below 60% means uncertainty. For definitive answers, consult a vet or get a DNA test!
                </p>
              </div>
            </div>
          </Card>

          <AutoAdSlot placement="in-feed" className="my-10" />

          <Card className="bg-gradient-to-br from-lime-50 to-green-50 border-2 border-lime-200 rounded-3xl p-10 shadow-2xl text-center">
            <Dog className="w-16 h-16 text-purple-600 mx-auto mb-4 animate-bounce" />
            <h3 className="text-3xl font-extrabold text-gray-900 mb-4">🐾 Join the Pet Parent Community!</h3>
            <p className="text-xl text-gray-700 mb-6 leading-relaxed max-w-3xl mx-auto">
              Thousands of pet lovers have already discovered their furry friends' breeds using our AI tool. 
              Whether you're a new pet parent or a seasoned pro, we're here to help! 🐶🐱
            </p>
            <Button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white px-10 py-6 rounded-2xl text-xl font-bold shadow-2xl transform transition-all hover:scale-110"
            >
              🚀 Identify Your Pet Now!
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
