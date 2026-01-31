"use client";

import { useEffect, useRef, useState } from 'react';
import { RotateCw, Maximize2, Minimize2, Move, Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Script from 'next/script';

// Extend JSX to include model-viewer element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

// Check if model-viewer is loaded
const isModelViewerLoaded = () => {
  return typeof window !== 'undefined' && customElements.get('model-viewer');
};

interface Product3DViewerProps {
  productType: string;
  color?: string;
  modelUrl?: string; // Path to .glb 3D model file
  designs?: Array<{
    id: number;
    previewUrl: string | null;
    placement: string;
    location: string;
    transform: {
      x: number;
      y: number;
      scale: number;
      rotation: number;
    };
  }>;
  fallbackImage?: string; // 2D fallback image
  className?: string;
}

export default function Product3DViewer({
  productType,
  color = 'Black',
  modelUrl,
  designs = [],
  fallbackImage,
  className = '',
}: Product3DViewerProps) {
  const modelViewerRef = useRef<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [use3D, setUse3D] = useState(!!modelUrl);
  const [autoRotate, setAutoRotate] = useState(true);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);

  // Check if script is already loaded
  useEffect(() => {
    if (isModelViewerLoaded()) {
      setScriptLoaded(true);
    }
  }, []);

  // Apply designs to model when loaded
  useEffect(() => {
    if (!modelViewerRef.current || !isLoaded || designs.length === 0) return;

    const viewer = modelViewerRef.current;

    // This is a placeholder for texture application
    // In production, you'd need proper UV mapping on the 3D model
    console.log('Designs to apply:', designs.filter(d => d.previewUrl));
  }, [isLoaded, designs]);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      modelViewerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  const resetCamera = () => {
    if (modelViewerRef.current) {
      modelViewerRef.current.resetTurntableRotation?.();
      modelViewerRef.current.fieldOfView = 'auto';
    }
  };

  // Default model URLs (you'll need to add these .glb files to /public/models/)
  const defaultModels: Record<string, string> = {
    hoodies: '/models/hoodie.glb',
    tshirts: '/models/tshirt.glb',
    hats: '/models/hat.glb',
    socks: '/models/socks.glb',
    totebags: '/models/tote-bag.glb',
  };

  const finalModelUrl = modelUrl || defaultModels[productType] || null;

  // If no 3D model available or script not loaded, show enhanced 2D preview
  if (!finalModelUrl || !use3D || !scriptLoaded) {
    return (
      <>
        {/* Load model-viewer script */}
        {!scriptLoaded && (
          <Script
            src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js"
            type="module"
            onLoad={() => setScriptLoaded(true)}
            onError={() => {
              console.error('Failed to load model-viewer');
              setModelError('Failed to load 3D viewer');
            }}
          />
        )}

        <div className={`relative ${className}`}>
          <div className="relative bg-neutral-100 rounded-lg overflow-hidden" style={{ height: '500px' }}>
            {/* 2D Fallback with rotation simulation */}
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <img
                src={fallbackImage || '/images/mokeups/fronthoodie.png'}
                alt={`${productType} preview`}
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </div>

            {/* Design overlays */}
            {designs.map((design) => {
              if (!design.previewUrl) return null;
              return (
                <div
                  key={design.id}
                  className="absolute"
                  style={{
                    width: '30%',
                    top: '40%',
                    left: '50%',
                    transform: `translate(-50%, -50%) scale(${design.transform.scale}) rotate(${design.transform.rotation}deg)`,
                    zIndex: 10,
                  }}
                >
                  <img
                    src={design.previewUrl}
                    alt={`Design ${design.id}`}
                    className="w-full h-auto object-contain drop-shadow-lg"
                    style={{ mixBlendMode: color === 'White' ? 'multiply' : 'normal' }}
                  />
                </div>
              );
            })}

            {!scriptLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-neutral-400 mx-auto mb-2" />
                  <p className="text-sm text-neutral-600">Loading 3D viewer...</p>
                </div>
              </div>
            )}

            <Badge variant="secondary" className="absolute top-2 left-2 text-xs">
              {scriptLoaded && finalModelUrl ? '3D Ready' : '2D Preview'}
            </Badge>

            {scriptLoaded && finalModelUrl && (
              <div className="absolute bottom-2 right-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setUse3D(true)}
                  className="text-xs"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View 3D
                </Button>
              </div>
            )}
          </div>

          <p className="text-xs text-center text-muted-foreground mt-2">
            {scriptLoaded && finalModelUrl
              ? 'Click "View 3D" for interactive rotation'
              : 'Interactive 2D preview'}
          </p>
        </div>
      </>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Design overlay canvas - positioned on top of 3D model */}
      {designs.some(d => d.previewUrl) && isLoaded && (
        <div className="absolute inset-0 pointer-events-none z-20">
          <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
            Design Preview
          </div>
          {designs.map((design) => {
            if (!design.previewUrl) return null;

            // Calculate position based on placement
            // Note: These positions are approximations for overlay on the static 3D view
            // Adjust based on your specific 3D model's geometry and camera angle
            const getOverlayPosition = () => {
              switch (design.placement) {
                case 'front':
                  // Center chest area for front design
                  return design.location === 'chest'
                    ? { top: '42%', left: '50%', width: '22%' }
                    : { top: '48%', left: '50%', width: '32%' };
                case 'back':
                  // Upper back or full back design
                  return design.location === 'upper'
                    ? { top: '36%', left: '50%', width: '20%' }
                    : { top: '46%', left: '50%', width: '28%' };
                case 'hood':
                  // Hood area (top of garment)
                  return { top: '20%', left: '50%', width: '18%' };
                case 'left_sleeve':
                  // Left sleeve upper area
                  return { top: '50%', left: '28%', width: '20%' };
                case 'right_sleeve':
                  // Right sleeve upper area
                  return { top: '50%', left: '72%', width: '20%' };
                default:
                  return { top: '45%', left: '50%', width: '24%' };
              }
            };

            const position = getOverlayPosition();

            return (
              <div
                key={design.id}
                className="absolute transition-all duration-200"
                style={{
                  ...position,
                  transform: `translate(calc(-50% + ${design.transform.x / 1.5}%), calc(-50% + ${design.transform.y / 1.5}%)) scale(${design.transform.scale}) rotate(${design.transform.rotation}deg)`,
                  opacity: 0.85,
                }}
              >
                <img
                  src={design.previewUrl}
                  alt={`Design ${design.id}`}
                  className="w-full h-auto object-contain"
                  style={{
                    mixBlendMode: color === 'White' || color === 'Beige' ? 'multiply' : 'normal',
                    filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4)) contrast(1.1)',
                  }}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* @ts-ignore */}
      <model-viewer
        ref={modelViewerRef}
        src={finalModelUrl}
        alt={`3D model of ${productType}`}
        auto-rotate={autoRotate}
        camera-controls
        touch-action="pan-y"
        disable-zoom={false}
        loading="eager"
        reveal="auto"
        style={{
          width: '100%',
          height: '500px',
          backgroundColor: '#f5f5f5',
          borderRadius: '0.5rem',
        }}
        onLoad={(e: any) => {
          console.log('Model loaded successfully');
          setIsLoaded(true);
          setModelError(null);
        }}
        onError={(e: any) => {
          console.error('Model load error:', e);
          setModelError('Failed to load 3D model');
          setIsLoaded(false);
        }}
        shadow-intensity="1"
        exposure="1"
        environment-image="neutral"
        poster={fallbackImage}
        camera-orbit="0deg 75deg 105%"
        min-camera-orbit="auto auto 50%"
        max-camera-orbit="auto auto 200%"
      >
        {/* AR button (works on iOS/Android) */}
        <button
          slot="ar-button"
          className="absolute bottom-4 left-4 bg-white text-black px-4 py-2 rounded-lg shadow-lg text-sm font-semibold hover:bg-neutral-100 transition"
        >
          View in AR
        </button>

        {/* Loading indicator */}
        {!isLoaded && !modelError && (
          <div
            slot="progress-bar"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              zIndex: 100,
            }}
          >
            <Loader2 className="h-12 w-12 animate-spin text-neutral-600 mx-auto mb-3" />
            <p className="text-sm font-medium text-neutral-700">Loading 3D model...</p>
            <p className="text-xs text-neutral-500 mt-1">This may take a few seconds</p>
          </div>
        )}

        {/* Error state */}
        {modelError && (
          <div
            slot="poster"
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fef2f2',
            }}
          >
            <div className="text-center p-6">
              <p className="text-sm font-medium text-red-600 mb-2">{modelError}</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setModelError(null);
                  setUse3D(false);
                }}
              >
                Back to 2D View
              </Button>
            </div>
          </div>
        )}
      {/* @ts-ignore */}
      </model-viewer>

      {/* Control Panel */}
      <div className="absolute top-2 right-2 flex flex-col gap-2">
        <Button
          size="icon"
          variant="secondary"
          onClick={() => setAutoRotate(!autoRotate)}
          title={autoRotate ? 'Stop rotation' : 'Start rotation'}
          className="h-8 w-8"
        >
          <RotateCw className={`h-4 w-4 ${autoRotate ? 'animate-spin' : ''}`} />
        </Button>

        <Button
          size="icon"
          variant="secondary"
          onClick={resetCamera}
          title="Reset camera"
          className="h-8 w-8"
        >
          <Move className="h-4 w-4" />
        </Button>

        <Button
          size="icon"
          variant="secondary"
          onClick={toggleFullscreen}
          title="Fullscreen"
          className="h-8 w-8"
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      </div>

      <Badge variant="default" className="absolute top-2 left-2 text-xs">
        3D View
      </Badge>

      <div className="absolute bottom-2 left-2 right-2">
        <div className="space-y-1">
          <p className="text-xs text-center text-white bg-black/50 backdrop-blur-sm px-3 py-1 rounded">
            Click & drag to rotate • Scroll to zoom • Pinch on mobile
          </p>
          {designs.some(d => d.previewUrl) && (
            <p className="text-xs text-center text-blue-600 bg-white/90 backdrop-blur-sm px-3 py-1 rounded">
              Design preview shown - Final product will have design printed on fabric
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
