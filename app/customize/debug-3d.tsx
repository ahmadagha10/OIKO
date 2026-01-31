"use client";

import { useEffect } from 'react';

export function Debug3D() {
  useEffect(() => {
    // Check if model-viewer is available
    const checkModelViewer = () => {
      const hasCustomElement = customElements.get('model-viewer');
      console.log('=== 3D Model Debug ===');
      console.log('model-viewer registered:', !!hasCustomElement);
      console.log('Window defined:', typeof window !== 'undefined');
      console.log('CustomElements API:', !!window.customElements);

      // Check if script tag exists
      const script = document.querySelector('script[src*="model-viewer"]');
      console.log('Script tag exists:', !!script);

      // Try to load model directly
      if (hasCustomElement) {
        console.log('model-viewer is ready!');
      } else {
        console.warn('model-viewer not loaded yet, checking in 2s...');
        setTimeout(checkModelViewer, 2000);
      }
    };

    setTimeout(checkModelViewer, 1000);
  }, []);

  return null;
}
