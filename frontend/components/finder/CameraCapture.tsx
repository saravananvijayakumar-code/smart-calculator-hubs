// @ts-nocheck
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Upload, X } from 'lucide-react';

interface CameraCaptureProps {
  onImageCapture: (file: File) => Promise<void>;
  acceptedFormats?: string;
  maxSizeMB?: number;
  captureButtonText?: string;
  uploadButtonText?: string;
}

export default function CameraCapture({
  onImageCapture,
  acceptedFormats = 'image/*',
  maxSizeMB = 10,
  captureButtonText = '📸 Take Photo',
  uploadButtonText = '📤 Upload Image'
}: CameraCaptureProps) {
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setShowCamera(true);
    } catch (err) {
      console.error('Camera error:', err);
      setError('Unable to access camera. Please use file upload instead.');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(videoRef.current, 0, 0);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      
      const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
      stopCamera();
      await onImageCapture(file);
    }, 'image/jpeg', 0.9);
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Image size must be less than ${maxSizeMB}MB. Please choose a smaller image.`);
      return;
    }

    setError(null);
    await onImageCapture(file);
  };

  if (showCamera) {
    return (
      <div className="space-y-4 animate-in fade-in zoom-in duration-500">
        <div className="relative">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full rounded-3xl shadow-2xl border-4 border-green-300"
          />
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
            🔴 LIVE
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={capturePhoto}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-14 rounded-2xl shadow-lg"
          >
            <Camera className="w-6 h-6 mr-2" />
            <span className="text-lg font-bold">Capture 📸</span>
          </Button>
          <Button 
            onClick={stopCamera}
            variant="outline"
            className="h-14 px-6 rounded-2xl border-2 border-gray-300"
          >
            <X className="w-6 h-6 mr-2" />
            Cancel
          </Button>
        </div>
        {error && (
          <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Button 
          onClick={startCamera}
          className="h-40 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white rounded-3xl shadow-xl transition-all duration-300 hover:scale-105 hover:rotate-1 border-2 border-white/20"
        >
          <div className="flex flex-col items-center gap-3">
            <Camera className="w-14 h-14 animate-pulse" />
            <span className="text-xl font-bold">{captureButtonText}</span>
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
            <span className="text-xl font-bold text-green-700">{uploadButtonText}</span>
            <span className="text-xs text-gray-600">From your gallery</span>
          </div>
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats}
        onChange={handleFileUpload}
        className="hidden"
      />

      {error && (
        <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
          {error}
        </div>
      )}
    </div>
  );
}
