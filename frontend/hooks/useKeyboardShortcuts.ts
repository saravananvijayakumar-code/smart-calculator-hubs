import { useEffect, useCallback, useState, RefObject } from 'react';

interface KeyboardShortcutHandlers {
  onSpace?: () => void;
  onReset?: () => void;
  onFullscreen?: () => void;
  onEscape?: () => void;
}

export function useKeyboardShortcuts({
  onSpace,
  onReset,
  onFullscreen,
  onEscape
}: KeyboardShortcutHandlers) {
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    const target = event.target as HTMLElement;
    const isInputField = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
    
    if (isInputField) return;

    switch (event.code) {
      case 'Space':
        event.preventDefault();
        onSpace?.();
        break;
      case 'KeyR':
        if (!event.ctrlKey && !event.metaKey) {
          event.preventDefault();
          onReset?.();
        }
        break;
      case 'KeyF':
        if (!event.ctrlKey && !event.metaKey) {
          event.preventDefault();
          onFullscreen?.();
        }
        break;
      case 'Escape':
        event.preventDefault();
        onEscape?.();
        break;
    }
  }, [onSpace, onReset, onFullscreen, onEscape]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);
}

export function useFullscreen(elementRef: RefObject<HTMLElement | null>) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    const checkSupport = () => {
      const hasFullscreenAPI = !!(
        document.fullscreenEnabled ||
        (document as any).webkitFullscreenEnabled ||
        (document as any).mozFullScreenEnabled ||
        (document as any).msFullscreenEnabled
      );
      setIsSupported(hasFullscreenAPI);
    };

    checkSupport();

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!elementRef.current || !isSupported) {
      console.warn('Fullscreen API is not supported or not allowed by permissions policy');
      return;
    }

    try {
      if (!document.fullscreenElement) {
        const element = elementRef.current as any;
        
        if (element.requestFullscreen) {
          await element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
          await element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
          await element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          await element.msRequestFullscreen();
        }
      } else {
        const doc = document as any;
        if (doc.exitFullscreen) {
          await doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen();
        } else if (doc.mozCancelFullScreen) {
          await doc.mozCancelFullScreen();
        } else if (doc.msExitFullscreen) {
          await doc.msExitFullscreen();
        }
      }
    } catch (err: any) {
      if (err.name === 'TypeError' && err.message.includes('permissions policy')) {
        console.warn('Fullscreen blocked by permissions policy. This may occur in embedded contexts.');
      } else {
        console.error('Error toggling fullscreen:', err);
      }
    }
  }, [elementRef, isSupported]);

  return { isFullscreen, toggleFullscreen, isSupported };
}
