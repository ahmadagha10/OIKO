"use client";

import Script from 'next/script';
import { useState } from 'react';

export default function Test3DPage() {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  return (
    <main className="min-h-screen p-8">
      <Script
        src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js"
        type="module"
        onLoad={() => {
          console.log('model-viewer script loaded!');
          setScriptLoaded(true);
        }}
        onError={(e) => {
          console.error('Failed to load model-viewer:', e);
        }}
      />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">3D Model Test</h1>

        {!scriptLoaded ? (
          <div className="bg-neutral-100 p-8 rounded-lg text-center">
            <p>Loading 3D viewer script...</p>
          </div>
        ) : (
          <>
            <p className="text-green-600 mb-4">✓ Script loaded successfully!</p>

            <div className="bg-neutral-100 rounded-lg overflow-hidden" style={{ height: '600px' }}>
              {/* @ts-ignore */}
              <model-viewer
                src="/models/hoodie.glb"
                alt="Hoodie 3D model"
                auto-rotate
                camera-controls
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#f5f5f5',
                }}
                shadow-intensity="1"
                exposure="1"
                environment-image="neutral"
                camera-orbit="0deg 75deg 105%"
                onLoad={(e: any) => console.log('Model loaded!', e)}
                onError={(e: any) => console.error('Model error!', e)}
              >
                <div slot="progress-bar" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                  <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-neutral-300 border-t-neutral-600 rounded-full mx-auto mb-2"></div>
                    <p>Loading 3D model...</p>
                  </div>
                </div>
              {/* @ts-ignore */}
              </model-viewer>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h2 className="font-semibold mb-2">Model Info:</h2>
              <ul className="text-sm space-y-1">
                <li>Path: /models/hoodie.glb</li>
                <li>Size: ~15MB</li>
                <li>Format: glTF Binary 2.0</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
