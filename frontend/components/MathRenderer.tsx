// @ts-nocheck
import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    katex: any;
    renderMathInElement: any;
  }
}

interface MathRendererProps {
  children: string;
  className?: string;
}

export const MathRenderer = ({ children, className = '' }: MathRendererProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadKaTeX = async () => {
      // Load KaTeX CSS if not already loaded
      if (!document.querySelector('link[href*="katex"]')) {
        const css = document.createElement('link');
        css.rel = 'stylesheet';
        css.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
        css.integrity = 'sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV';
        css.crossOrigin = 'anonymous';
        document.head.appendChild(css);
      }

      // Load KaTeX JS if not already loaded
      if (!window.katex) {
        return new Promise<void>((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
          script.integrity = 'sha384-XjKyOOlGwcjNTAIQHIpVOOVA+xP0j3z6+1vSdXDV+bWlvpT7fY4pjy2F8Q9P0Qh2';
          script.crossOrigin = 'anonymous';
          script.onload = () => {
            // Also load auto-render extension
            const autoRenderScript = document.createElement('script');
            autoRenderScript.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js';
            autoRenderScript.integrity = 'sha384-+VBxd3r6XgURycqtZ117nYw44OOcIax56Z4dCRWbxyPt0Koah1uHoK0o4+/RRE05';
            autoRenderScript.crossOrigin = 'anonymous';
            autoRenderScript.onload = () => resolve();
            document.head.appendChild(autoRenderScript);
          };
          document.head.appendChild(script);
        });
      }
    };

    const renderMath = () => {
      if (contentRef.current && window.katex && window.renderMathInElement) {
        // Set the content first
        contentRef.current.innerHTML = children;
        
        // Then render math
        window.renderMathInElement(contentRef.current, {
          delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false},
            {left: '\\[', right: '\\]', display: true},
            {left: '\\(', right: '\\)', display: false}
          ],
          throwOnError: false,
          errorColor: '#cc0000',
          strict: 'warn'
        });
      }
    };

    loadKaTeX().then(renderMath);
  }, [children]);

  return (
    <div 
      ref={contentRef}
      className={`prose prose-lg prose-blue max-w-none ${className}`}
      style={{ whiteSpace: 'pre-wrap' }}
    />
  );
};