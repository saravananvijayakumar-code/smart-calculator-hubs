// @ts-nocheck
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Camera, Upload, Loader2, AlertTriangle, Flame, Activity, Shield, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import backend from '~backend/client';
import { getBurnTimeForAllActivities, BurnTimeResult } from '@/lib/calculateBurnTime';
import { AIAnalysis } from '@/components/AIAnalysis';
import ExportShareButtons from '@/components/ExportShareButtons';
import { InFeedAd } from '@/components/ads/InFeedAd';

interface MobileCameraModeProps {
  onSwitchToDesktop?: () => void;
  onAddToHistory?: (item: any) => void;
}

export default function MobileCameraMode({ onSwitchToDesktop, onAddToHistory }: MobileCameraModeProps) {
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<'lbs' | 'kg'>('lbs');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedFood, setDetectedFood] = useState<string | null>(null);
  const [calories, setCalories] = useState<number | null>(null);
  const [burnResults, setBurnResults] = useState<BurnTimeResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const compressImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          const maxDimension = 1024;
          if (width > height && width > maxDimension) {
            height = (height / width) * maxDimension;
            width = maxDimension;
          } else if (height > maxDimension) {
            width = (width / height) * maxDimension;
            height = maxDimension;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          let quality = 0.8;
          let base64 = canvas.toDataURL('image/jpeg', quality);
          
          while (base64.length > 500000 && quality > 0.1) {
            quality -= 0.1;
            base64 = canvas.toDataURL('image/jpeg', quality);
          }
          
          resolve(base64.split(',')[1]);
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const weightValue = parseFloat(weight);
    const minWeight = weightUnit === 'lbs' ? 20 : 9;
    const maxWeight = weightUnit === 'lbs' ? 500 : 227;
    
    if (!weight || weightValue < minWeight || weightValue > maxWeight) {
      setError(`Please enter your weight (${minWeight}-${maxWeight} ${weightUnit}) first`);
      return;
    }

    try {
      setError(null);
      setIsAnalyzing(true);
      setSelectedImage(URL.createObjectURL(file));

      const base64 = await compressImage(file);

      const visionResult = await backend.vision.analyze({ imageBase64: base64 });
      
      const foodName = visionResult.topFood;
      setDetectedFood(foodName);

      const nutritionResult = await backend.vision.getNutrition({ foodName });
      
      const calorieAmount = nutritionResult.calories;
      setCalories(calorieAmount);

      const weightValue = parseFloat(weight);
      const weightInPounds = weightUnit === 'kg' ? weightValue * 2.20462 : weightValue;
      const results = getBurnTimeForAllActivities(calorieAmount, weightInPounds);
      setBurnResults(results);

      if (onAddToHistory) {
        onAddToHistory({
          food: foodName,
          calories: calorieAmount,
          weight: weightInPounds,
          weightUnit,
          timestamp: new Date().toISOString(),
          source: 'camera',
        });
      }

      setIsAnalyzing(false);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'Failed to analyze image. Please try again or use manual mode.');
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
        const fakeEvent = {
          target: { files: [file] }
        } as any;
        await handleImageUpload(fakeEvent);
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
    setDetectedFood(null);
    setCalories(null);
    setBurnResults(null);
    setError(null);
  };

  const intensityColor = (intensity: string) => {
    switch (intensity) {
      case 'High': return 'text-red-600 dark:text-red-400';
      case 'Medium': return 'text-orange-600 dark:text-orange-400';
      case 'Low': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const intensityBg = (intensity: string) => {
    switch (intensity) {
      case 'High': return 'bg-red-50 dark:bg-red-900/20';
      case 'Medium': return 'bg-orange-50 dark:bg-orange-900/20';
      case 'Low': return 'bg-green-50 dark:bg-green-900/20';
      default: return 'bg-gray-50 dark:bg-gray-900/20';
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
    <div className="space-y-6">
      <Card className="shadow-xl border-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Camera className="w-6 h-6 text-purple-600" />
            AI Camera Mode
          </CardTitle>
          <CardDescription>
            Snap a photo of your food and get instant calorie burn analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <Shield className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 dark:text-blue-200">
              Your photo is processed securely and never stored on our servers
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="weight-mobile" className="text-base font-semibold">Your Weight</Label>
            <div className="flex gap-2">
              <Input
                id="weight-mobile"
                type="number"
                placeholder="Enter your weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="text-lg h-12 flex-1"
                min={weightUnit === 'lbs' ? '20' : '9'}
                max={weightUnit === 'lbs' ? '500' : '227'}
              />
              <Select value={weightUnit} onValueChange={(value: 'lbs' | 'kg') => setWeightUnit(value)}>
                <SelectTrigger className="w-24 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lbs">lbs</SelectItem>
                  <SelectItem value="kg">kg</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={openCamera}
              disabled={isAnalyzing}
              className="h-24 flex-col gap-2 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Camera className="w-8 h-8" />
              <span>Take Photo</span>
            </Button>
            
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isAnalyzing}
              variant="outline"
              className="h-24 flex-col gap-2 border-2"
            >
              <Upload className="w-8 h-8" />
              <span>Upload</span>
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {onSwitchToDesktop && (
            <Button
              onClick={onSwitchToDesktop}
              variant="ghost"
              className="w-full"
            >
              Switch to Manual Mode
            </Button>
          )}
        </CardContent>
      </Card>

      {isAnalyzing && (
        <Card className="shadow-xl border-0">
          <CardContent className="pt-8 text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-600" />
            <h3 className="text-xl font-bold mb-2">Analyzing Your Food...</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Using AI to identify food and calculate calories
            </p>
          </CardContent>
        </Card>
      )}

      {selectedImage && !isAnalyzing && (
        <Card className="shadow-xl border-0">
          <CardContent className="pt-6">
            <img 
              src={selectedImage} 
              alt="Selected food" 
              className="w-full rounded-lg mb-4 max-h-64 object-cover"
            />
            <Button onClick={resetAnalysis} variant="outline" className="w-full">
              Analyze Another Food
            </Button>
          </CardContent>
        </Card>
      )}

      {detectedFood && calories !== null && burnResults && (
        <>
          <Card className="shadow-2xl border-0 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/40 dark:to-red-900/40">
            <CardContent className="pt-8 text-center">
              <div className="mb-6">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 rounded-full animate-pulse opacity-50"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Flame className="w-12 h-12 text-orange-600" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {detectedFood}
                </h2>
                <Badge className="text-lg px-4 py-2 bg-orange-500 text-white">
                  {calories} Calories
                </Badge>
              </div>

              <ExportShareButtons
                calculatorType="calorie-burn-ai"
                inputs={{ food: detectedFood, weight }}
                results={{ food: detectedFood, calories }}
                title={`🔥 ${detectedFood} has ${calories} calories! See how long it takes to burn off.`}
              />
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                AI Nutrition Insights
              </CardTitle>
              <CardDescription>
                Personalized recommendations based on your food analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                💡 <strong>Quick Tip:</strong> To burn off {detectedFood} ({calories} cal), the most efficient exercise is {burnResults[0].activity.name} for just {burnResults[0].minutes} minutes!
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                🔥 <strong>Calorie Context:</strong> {calories} calories represents {((calories / 2000) * 100).toFixed(1)}% of a typical 2,000 calorie daily diet.
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                ⚡ <strong>Activity Alternative:</strong> If high-intensity isn't your thing, you could also burn this with {burnResults[burnResults.length - 1].minutes} minutes of {burnResults[burnResults.length - 1].activity.name}.
              </p>
            </CardContent>
          </Card>

          <InFeedAd key="mobile-calorie-infeed" />

          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Activity className="w-6 h-6 text-red-600" />
                Time to Burn It Off
              </CardTitle>
              <CardDescription>
                Based on your weight of {weight} {weightUnit}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {burnResults.slice(0, 6).map((result, idx) => (
                <div key={idx} className={`p-4 ${intensityBg(result.activity.intensity)} rounded-lg`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{result.activity.emoji}</span>
                      <div>
                        <p className="font-bold text-lg">{result.activity.name}</p>
                        <Badge variant="outline" className={intensityColor(result.activity.intensity)}>
                          {result.activity.intensity} Intensity
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {result.minutes} min
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ({result.hours}h)
                      </p>
                    </div>
                  </div>
                  <Progress value={Math.min((result.minutes / 180) * 100, 100)} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
