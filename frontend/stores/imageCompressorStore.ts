import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CompressedImage {
  id: string;
  originalFile: File;
  originalSize: number;
  compressedBlob: Blob;
  compressedSize: number;
  compressionRatio: number;
  quality: number;
  previewUrl: string;
  originalPreviewUrl: string;
  timestamp: number;
}

interface ImageCompressorState {
  images: CompressedImage[];
  quality: number;
  totalCompressed: number;
  
  setQuality: (quality: number) => void;
  addImage: (image: CompressedImage) => void;
  removeImage: (id: string) => void;
  clearImages: () => void;
  incrementTotalCompressed: (count?: number) => void;
}

export const useImageCompressorStore = create<ImageCompressorState>()(
  persist(
    (set) => ({
      images: [],
      quality: 80,
      totalCompressed: 0,
      
      setQuality: (quality) => set({ quality }),
      
      addImage: (image) => set((state) => ({
        images: [...state.images, image]
      })),
      
      removeImage: (id) => set((state) => ({
        images: state.images.filter((img) => img.id !== id)
      })),
      
      clearImages: () => set({ images: [] }),
      
      incrementTotalCompressed: (count = 1) => set((state) => ({
        totalCompressed: state.totalCompressed + count
      })),
    }),
    {
      name: 'image-compressor-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        totalCompressed: state.totalCompressed,
        quality: state.quality,
      }),
    }
  )
);
