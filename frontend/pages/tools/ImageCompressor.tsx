import { useState, useCallback, useRef } from 'react';
import { 
  Upload, 
  Download, 
  X, 
  Image as ImageIcon, 
  Zap,
  Check,
  TrendingDown,
  FileImage,
  Sparkles
} from 'lucide-react';
import { AppleStyleCard } from '@/components/AppleStyleCard';
import { AutoAdSlot } from '@/components/ads/AutoAdSlot';
import { SEOHead } from '@/components/SEOHead';
import { AffiliateBanner } from '@/components/AffiliateBanner';
import { useImageCompressorStore } from '@/stores/imageCompressorStore';
import {
  compressImage,
  formatFileSize,
  calculateCompressionRatio,
  createPreviewUrl,
  downloadBlob,
  getOutputFilename,
  isSupportedFormat,
} from '@/lib/imageCompression';
import type { CompressedImage } from '@/stores/imageCompressorStore';

export default function ImageCompressor() {
  const { 
    quality, 
    totalCompressed,
    setQuality, 
    addImage,
    clearImages,
    incrementTotalCompressed 
  } = useImageCompressorStore();

  const [images, setImages] = useState<CompressedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    const newImages: CompressedImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!isSupportedFormat(file)) {
        continue;
      }

      try {
        const originalPreview = await createPreviewUrl(file);
        
        const result = await compressImage(file, {
          quality,
          maxWidth: 4000,
          maxHeight: 4000,
        });

        const compressionRatio = calculateCompressionRatio(file.size, result.size);

        const compressedImage: CompressedImage = {
          id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          originalFile: file,
          originalSize: file.size,
          compressedBlob: result.blob,
          compressedSize: result.size,
          compressionRatio,
          quality,
          previewUrl: result.dataUrl,
          originalPreviewUrl: originalPreview,
          timestamp: Date.now(),
        };

        newImages.push(compressedImage);
      } catch (error) {
        console.error('Error compressing image:', error);
      }
    }

    setImages((prev) => [...prev, ...newImages]);
    incrementTotalCompressed(newImages.length);
    setIsProcessing(false);
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    await processFiles(e.dataTransfer.files);
  }, [quality]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await processFiles(e.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownload = async (image: CompressedImage) => {
    const filename = getOutputFilename(
      image.originalFile.name,
      image.compressedBlob.type
    );
    await downloadBlob(image.compressedBlob, filename);
  };

  const handleDownloadAll = async () => {
    for (const image of images) {
      await handleDownload(image);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  };

  const handleRemove = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleClearAll = () => {
    setImages([]);
  };

  return (
    <>
      <SEOHead
        title="Free Image Compressor - Reduce Image Size Online | Smart Calculator Hub"
        description="Compress PNG, JPG, JPEG, and WEBP images online for free. Reduce file size while maintaining quality. Fast, secure, client-side compression with no upload required."
        keywords="image compressor, compress images online, reduce image size, optimize images, PNG compressor, JPG compressor, WEBP compressor, image optimization"
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <AutoAdSlot placement="top-banner" className="mb-8" />

          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
              <Sparkles className="w-4 h-4" />
              <span>{totalCompressed.toLocaleString()} Images Compressed</span>
            </div>
            
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Image Compressor
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Compress your images instantly. Fast, secure, and 100% client-side processing.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <AppleStyleCard variant="elevated" className="hover:scale-105 transition-transform">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Lightning Fast</h3>
                  <p className="text-sm text-muted-foreground">Instant compression</p>
                </div>
              </div>
            </AppleStyleCard>

            <AppleStyleCard variant="elevated" className="hover:scale-105 transition-transform">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                  <Check className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">100% Private</h3>
                  <p className="text-sm text-muted-foreground">No server uploads</p>
                </div>
              </div>
            </AppleStyleCard>

            <AppleStyleCard variant="elevated" className="hover:scale-105 transition-transform">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-xl">
                  <FileImage className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Multi-Format</h3>
                  <p className="text-sm text-muted-foreground">PNG, JPG, WEBP</p>
                </div>
              </div>
            </AppleStyleCard>
          </div>

          <AutoAdSlot placement="mid-content" className="mb-8" />

          <div className="animate-fade-in">
            <AppleStyleCard variant="elevated" className="mb-8">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105'
                    : 'border-border hover:border-blue-400 dark:hover:border-blue-600'
                }`}
              >
                <div className={`transition-transform duration-200 ${isDragging ? 'scale-110' : 'scale-100'}`}>
                  <Upload className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                  <h3 className="text-2xl font-semibold mb-2">
                    Drop your images here
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    or click to select files (PNG, JPG, JPEG, WEBP)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-input"
                  />
                  <label
                    htmlFor="file-input"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold cursor-pointer hover:shadow-lg transform hover:scale-105 transition-all"
                  >
                    <ImageIcon className="w-5 h-5" />
                    Select Files
                  </label>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium mb-3">
                  Compression Quality: {quality}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Smaller file</span>
                  <span>Better quality</span>
                </div>
              </div>
            </AppleStyleCard>
          </div>

          {isProcessing && (
            <div className="animate-fade-in text-center mb-8">
              <div className="inline-flex items-center gap-3 bg-blue-100 dark:bg-blue-900/30 px-6 py-3 rounded-full">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  Compressing images...
                </span>
              </div>
            </div>
          )}

          {images.length > 0 && (
            <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    Compressed Images ({images.length})
                  </h2>
                  <div className="flex gap-3">
                    <button
                      onClick={handleDownloadAll}
                      className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      Download All
                    </button>
                    <button
                      onClick={handleClearAll}
                      className="inline-flex items-center gap-2 px-6 py-2 bg-red-500 text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
                    >
                      <X className="w-4 h-4" />
                      Clear All
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {images.map((image, index) => (
                    <div
                      key={image.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <AppleStyleCard variant="elevated" className="overflow-hidden">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg truncate">
                              {image.originalFile.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {image.originalFile.type.split('/')[1].toUpperCase()}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemove(image.id)}
                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          >
                            <X className="w-5 h-5 text-red-500" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-2">Original</p>
                            <img
                              src={image.originalPreviewUrl}
                              alt="Original"
                              className="w-full h-32 object-cover rounded-lg border border-border"
                            />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-2">Compressed</p>
                            <img
                              src={image.previewUrl}
                              alt="Compressed"
                              className="w-full h-32 object-cover rounded-lg border border-border"
                            />
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 mb-4">
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Original</p>
                              <p className="font-semibold text-sm">
                                {formatFileSize(image.originalSize)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Compressed</p>
                              <p className="font-semibold text-sm text-green-600 dark:text-green-400">
                                {formatFileSize(image.compressedSize)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Saved</p>
                              <div className="flex items-center justify-center gap-1">
                                <TrendingDown className="w-4 h-4 text-green-600" />
                                <p className="font-semibold text-sm text-green-600 dark:text-green-400">
                                  {image.compressionRatio.toFixed(1)}%
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDownload(image)}
                          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
                        >
                          <Download className="w-5 h-5" />
                          Download Compressed
                        </button>
                      </AppleStyleCard>
                    </div>
                  ))}
                </div>
              </div>
            )}

          <AutoAdSlot placement="mid-content" className="my-8" />

          <AutoAdSlot placement="mid-content" className="mt-8" />

          <div className="mt-8">
            <ImageCompressionGuide />
          </div>

          <AutoAdSlot placement="mid-content" className="mt-8" />

          <AffiliateBanner type="amazon-tools" className="mt-8" />

          <AutoAdSlot placement="bottom-sticky" className="mt-8" />
        </div>
      </div>
    </>
  );
}

function ImageCompressionGuide() {
  return (
    <div className="animate-fade-in">
      <AppleStyleCard variant="elevated" className="prose prose-lg max-w-none dark:prose-invert">
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          The Complete Guide to Image Compression
        </h2>

        <div className="space-y-8">
          <section>
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-500" />
              What is Image Compression?
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Image compression is the process of reducing the file size of digital images while maintaining acceptable visual quality. 
              In today's digital world, where billions of images are uploaded and shared daily, compression is essential for faster loading 
              times, reduced bandwidth usage, and improved user experience. Whether you're a web developer optimizing site performance, 
              a photographer managing large portfolios, or a social media enthusiast sharing memories, understanding image compression 
              can save you time, money, and storage space.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <FileImage className="w-6 h-6 text-purple-500" />
              Understanding Image Formats
            </h3>
            
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                <h4 className="text-xl font-semibold mb-3">JPEG (Joint Photographic Experts Group)</h4>
                <p className="text-muted-foreground mb-3">
                  JPEG is the most widely used image format on the web, perfect for photographs and images with gradients. 
                  It uses lossy compression, meaning some data is permanently discarded to achieve smaller file sizes.
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li><strong>Best for:</strong> Photographs, complex images with many colors</li>
                  <li><strong>Compression:</strong> Lossy (60-90% quality recommended)</li>
                  <li><strong>Transparency:</strong> Not supported</li>
                  <li><strong>Use cases:</strong> Website images, digital photography, social media</li>
                </ul>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl">
                <h4 className="text-xl font-semibold mb-3">PNG (Portable Network Graphics)</h4>
                <p className="text-muted-foreground mb-3">
                  PNG is ideal for images requiring transparency or sharp edges. It uses lossless compression, 
                  preserving all image data at the cost of larger file sizes compared to JPEG.
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li><strong>Best for:</strong> Logos, icons, text-heavy images, screenshots</li>
                  <li><strong>Compression:</strong> Lossless or lossy (with quality adjustment)</li>
                  <li><strong>Transparency:</strong> Full alpha channel support</li>
                  <li><strong>Use cases:</strong> Web graphics, logos, images with transparency</li>
                </ul>
              </div>

              <div className="bg-pink-50 dark:bg-pink-900/20 p-6 rounded-xl">
                <h4 className="text-xl font-semibold mb-3">WebP (Web Picture Format)</h4>
                <p className="text-muted-foreground mb-3">
                  WebP is a modern format developed by Google, offering superior compression for both lossy and lossless images. 
                  It typically produces files 25-35% smaller than JPEG while maintaining similar quality.
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li><strong>Best for:</strong> All web images, modern browsers</li>
                  <li><strong>Compression:</strong> Both lossy and lossless</li>
                  <li><strong>Transparency:</strong> Supported</li>
                  <li><strong>Use cases:</strong> Modern websites, web applications, e-commerce</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-500" />
              How Image Compression Works
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Image compression algorithms work by identifying and eliminating redundant data. There are two main approaches:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-xl">
                <h4 className="text-xl font-semibold mb-3">Lossy Compression</h4>
                <p className="text-muted-foreground mb-3">
                  Permanently removes data deemed less important to human perception. This achieves higher compression ratios 
                  but may introduce artifacts at very low quality settings.
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Example:</strong> JPEG uses discrete cosine transform (DCT) to convert spatial image data into frequency 
                  components, then quantizes and discards high-frequency details.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-xl">
                <h4 className="text-xl font-semibold mb-3">Lossless Compression</h4>
                <p className="text-muted-foreground mb-3">
                  Reduces file size without any quality loss by identifying patterns and encoding them more efficiently. 
                  The original image can be perfectly reconstructed.
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Example:</strong> PNG uses DEFLATE algorithm with filtering and prediction to remove redundancy 
                  while preserving every pixel exactly.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <TrendingDown className="w-6 h-6 text-green-500" />
              Optimization Best Practices
            </h3>
            
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-6 py-2">
                <h4 className="font-semibold text-lg mb-2">1. Choose the Right Format</h4>
                <p className="text-muted-foreground">
                  Use JPEG for photos, PNG for graphics with transparency or sharp edges, and WebP for modern web applications 
                  where browser support allows.
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-6 py-2">
                <h4 className="font-semibold text-lg mb-2">2. Optimize Quality Settings</h4>
                <p className="text-muted-foreground">
                  For most web images, 75-85% quality offers the best balance between file size and visual quality. 
                  Going below 70% often introduces noticeable artifacts.
                </p>
              </div>

              <div className="border-l-4 border-pink-500 pl-6 py-2">
                <h4 className="font-semibold text-lg mb-2">3. Resize Before Compressing</h4>
                <p className="text-muted-foreground">
                  Never serve images larger than displayed. A 4000x3000px image displayed at 800x600px wastes bandwidth. 
                  Resize to the maximum display size first, then compress.
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-6 py-2">
                <h4 className="font-semibold text-lg mb-2">4. Remove Metadata</h4>
                <p className="text-muted-foreground">
                  EXIF data (camera settings, GPS coordinates) can add significant size. Remove it unless needed 
                  for specific purposes like photography portfolios.
                </p>
              </div>

              <div className="border-l-4 border-yellow-500 pl-6 py-2">
                <h4 className="font-semibold text-lg mb-2">5. Use Progressive Loading</h4>
                <p className="text-muted-foreground">
                  Progressive JPEGs load in multiple passes, showing a low-quality preview that gradually improves. 
                  This improves perceived performance on slower connections.
                </p>
              </div>

              <div className="border-l-4 border-red-500 pl-6 py-2">
                <h4 className="font-semibold text-lg mb-2">6. Implement Lazy Loading</h4>
                <p className="text-muted-foreground">
                  Load images only when they're about to enter the viewport. This dramatically reduces initial page load time 
                  and bandwidth usage for pages with many images.
                </p>
              </div>
            </div>
          </section>

          <AutoAdSlot placement="in-article" className="my-8" />

          <section>
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Check className="w-6 h-6 text-green-500" />
              SEO Benefits of Image Optimization
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Optimized images directly impact your website's search engine ranking and user experience:
            </p>
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl space-y-4">
              <div>
                <h4 className="font-semibold text-lg mb-2">Page Speed Impact</h4>
                <p className="text-muted-foreground">
                  Google considers page speed a ranking factor. Compressed images load faster, reducing Time to First Byte (TTFB) 
                  and Largest Contentful Paint (LCP), key Core Web Vitals metrics.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-2">Mobile-First Indexing</h4>
                <p className="text-muted-foreground">
                  With Google's mobile-first approach, optimized images are crucial for mobile users on slower connections. 
                  Smaller files mean better mobile experience and improved rankings.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-2">User Engagement</h4>
                <p className="text-muted-foreground">
                  Studies show 53% of mobile users abandon sites that take over 3 seconds to load. Optimized images keep 
                  bounce rates low and engagement high, indirectly boosting SEO.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-2">Bandwidth & Hosting Costs</h4>
                <p className="text-muted-foreground">
                  Smaller images reduce bandwidth consumption, lowering hosting costs and allowing you to serve more users 
                  with the same infrastructure.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <ImageIcon className="w-6 h-6 text-blue-500" />
              Advanced Techniques
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-lg mb-3">Responsive Images</h4>
                <p className="text-muted-foreground mb-3">
                  Use the `srcset` attribute to serve different image sizes based on device resolution and viewport width. 
                  This ensures users download only what they need.
                </p>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  <code className="text-sm">
                    &lt;img srcset="small.jpg 480w, medium.jpg 800w, large.jpg 1200w" 
                    sizes="(max-width: 600px) 480px, (max-width: 900px) 800px, 1200px" 
                    src="medium.jpg" alt="Description" /&gt;
                  </code>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-3">Content Delivery Networks (CDN)</h4>
                <p className="text-muted-foreground">
                  CDNs like Cloudflare or AWS CloudFront cache and serve images from servers geographically closer to users, 
                  reducing latency. Many CDNs offer automatic image optimization and format conversion.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-3">Next-Gen Formats</h4>
                <p className="text-muted-foreground mb-3">
                  AVIF (AV1 Image File Format) offers even better compression than WebP but has limited browser support. 
                  Use it with fallbacks for maximum optimization.
                </p>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  <code className="text-sm">
                    &lt;picture&gt;<br />
                    &nbsp;&nbsp;&lt;source srcset="image.avif" type="image/avif" /&gt;<br />
                    &nbsp;&nbsp;&lt;source srcset="image.webp" type="image/webp" /&gt;<br />
                    &nbsp;&nbsp;&lt;img src="image.jpg" alt="Description" /&gt;<br />
                    &lt;/picture&gt;
                  </code>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-semibold mb-4">Common Mistakes to Avoid</h3>
            <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl space-y-3">
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Over-Compression</h4>
                  <p className="text-sm text-muted-foreground">
                    Setting quality too low introduces visible artifacts, making images look pixelated or blocky.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Wrong Format Selection</h4>
                  <p className="text-sm text-muted-foreground">
                    Using PNG for photos or JPEG for logos results in larger files or quality loss.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Serving Oversized Images</h4>
                  <p className="text-sm text-muted-foreground">
                    Uploading 4K images when thumbnails are displayed wastes bandwidth and slows loading.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Ignoring Alt Text</h4>
                  <p className="text-sm text-muted-foreground">
                    Missing alt attributes hurt SEO and accessibility. Always describe images meaningfully.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Not Testing Results</h4>
                  <p className="text-sm text-muted-foreground">
                    Always preview compressed images before deploying to ensure acceptable quality.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-2xl">
            <h3 className="text-2xl font-bold mb-4">Why Our Tool is Different</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-lg mb-1">100% Client-Side Processing</h4>
                  <p className="text-white/90 text-sm">
                    Your images never leave your device. Everything happens in your browser using modern HTML5 Canvas API, 
                    ensuring complete privacy and security.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-lg mb-1">Instant Results</h4>
                  <p className="text-white/90 text-sm">
                    No waiting for uploads or server processing. Compression happens instantly, even for dozens of images.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-lg mb-1">Real-Time Quality Preview</h4>
                  <p className="text-white/90 text-sm">
                    See exactly how your compressed images look before downloading. Adjust quality settings with 
                    immediate visual feedback.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-lg mb-1">No File Size Limits</h4>
                  <p className="text-white/90 text-sm">
                    Process as many images as your device can handle. No arbitrary upload limits or premium tiers.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-lg mb-1">Completely Free Forever</h4>
                  <p className="text-white/90 text-sm">
                    No hidden costs, subscriptions, or watermarks. Professional-grade compression accessible to everyone.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-6 py-3">
                <h4 className="font-semibold mb-2">Is my data safe?</h4>
                <p className="text-muted-foreground text-sm">
                  Absolutely. All compression happens locally in your browser. No images are uploaded to any server, 
                  and no data is collected or stored.
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-6 py-3">
                <h4 className="font-semibold mb-2">What quality setting should I use?</h4>
                <p className="text-muted-foreground text-sm">
                  For web use, 75-85% is ideal for most images. For printing or archival, use 90-95%. 
                  Below 70%, artifacts become noticeable.
                </p>
              </div>

              <div className="border-l-4 border-pink-500 pl-6 py-3">
                <h4 className="font-semibold mb-2">Can I compress images in bulk?</h4>
                <p className="text-muted-foreground text-sm">
                  Yes! Select multiple files at once or drag and drop an entire folder. All images will be processed 
                  with your chosen quality setting.
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-6 py-3">
                <h4 className="font-semibold mb-2">Will compression reduce image quality?</h4>
                <p className="text-muted-foreground text-sm">
                  Some quality reduction is inevitable with lossy compression, but at recommended settings (75-85%), 
                  the difference is imperceptible to most viewers while achieving 50-80% size reduction.
                </p>
              </div>

              <div className="border-l-4 border-yellow-500 pl-6 py-3">
                <h4 className="font-semibold mb-2">Which browsers are supported?</h4>
                <p className="text-muted-foreground text-sm">
                  All modern browsers including Chrome, Firefox, Safari, and Edge. The tool uses standard HTML5 APIs 
                  supported by all browsers from the last 5+ years.
                </p>
              </div>
            </div>
          </section>

          <section className="text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-8 rounded-2xl">
            <h3 className="text-2xl font-bold mb-4">Start Optimizing Your Images Today</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of developers, designers, and content creators who trust our tool for fast, 
              secure, and effective image compression. No signup required.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              <Upload className="w-6 h-6" />
              Compress Images Now
            </button>
          </section>
        </div>
      </AppleStyleCard>
    </div>
  );
}
