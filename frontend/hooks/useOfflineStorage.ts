import { useState, useEffect } from 'react';

interface OfflineData {
  id: string;
  data: any;
  timestamp: number;
  type: string;
}

export function useOfflineStorage() {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('indexedDB' in window);
  }, []);

  const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('CalculatorHub', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create stores for different types of offline data
        if (!db.objectStoreNames.contains('pendingForms')) {
          db.createObjectStore('pendingForms', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('calculations')) {
          db.createObjectStore('calculations', { keyPath: 'id' });
        }
      };
    });
  };

  const storeData = async (storeName: string, data: any, type: string): Promise<string> => {
    if (!isSupported) throw new Error('IndexedDB not supported');
    
    const db = await openDB();
    const id = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const offlineData: OfflineData = {
      id,
      data,
      timestamp: Date.now(),
      type
    };
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(offlineData);
      
      request.onsuccess = () => resolve(id);
      request.onerror = () => reject(request.error);
    });
  };

  const getData = async (storeName: string): Promise<OfflineData[]> => {
    if (!isSupported) return [];
    
    const db = await openDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  const removeData = async (storeName: string, id: string): Promise<void> => {
    if (!isSupported) return;
    
    const db = await openDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  };

  const clearStore = async (storeName: string): Promise<void> => {
    if (!isSupported) return;
    
    const db = await openDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  };

  // Store contact form for offline submission
  const storeContactForm = async (formData: any): Promise<string> => {
    return storeData('pendingForms', formData, 'contact');
  };

  // Store calculation results for offline access
  const storeCalculation = async (calculation: any): Promise<string> => {
    return storeData('calculations', calculation, 'calculation');
  };

  // Get pending forms for background sync
  const getPendingForms = async (): Promise<OfflineData[]> => {
    return getData('pendingForms');
  };

  // Get stored calculations
  const getStoredCalculations = async (): Promise<OfflineData[]> => {
    return getData('calculations');
  };

  // Remove synced form
  const removePendingForm = async (id: string): Promise<void> => {
    return removeData('pendingForms', id);
  };

  return {
    isSupported,
    storeContactForm,
    storeCalculation,
    getPendingForms,
    getStoredCalculations,
    removePendingForm,
    clearStore
  };
}