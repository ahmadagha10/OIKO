# Quick Start: Adding 3D Models

## Fastest Way to Get Started (5 minutes)

### Step 1: Download Free Models

Visit Sketchfab and download these models:

1. **Hoodie:**
   - Go to: https://sketchfab.com/search?q=hoodie&type=models&features=downloadable
   - Choose a free model with "Download 3D Model" option
   - Download as "glTF Binary (.glb)"
   - Rename to `hoodie.glb`

2. **T-Shirt:**
   - Search: https://sketchfab.com/search?q=t-shirt&type=models&features=downloadable
   - Download as GLB
   - Rename to `tshirt.glb`

3. **Hat:**
   - Search: https://sketchfab.com/search?q=cap&type=models&features=downloadable
   - Download as GLB
   - Rename to `hat.glb`

### Step 2: Place Files

Place downloaded .glb files in this directory:
```
/public/models/
  ├── hoodie.glb
  ├── tshirt.glb
  ├── hat.glb
  ├── socks.glb
  └── tote-bag.glb
```

### Step 3: Test

1. Open your app: http://localhost:3000/customize
2. Click "3D Rotate" button
3. Model should load and be rotatable!

## Recommended Free Models (Ready to Use)

These specific models work great:

### Hoodie Model
- **Link:** Search "Hoodie Template" on Sketchfab
- **License:** CC BY (free with attribution)
- **Size:** ~2-5MB

### T-Shirt Model  
- **Link:** Search "T-Shirt Mockup" on Sketchfab
- **License:** CC0 (public domain)
- **Size:** ~1-3MB

## Alternative: Use Placeholder Until You Have Models

The 3D viewer includes a fallback 2D preview that works immediately.
Users will see:
- Interactive 2D preview with design overlays
- "Try 3D" button (shows message if models not found)
- Full functionality without 3D models

This means your customizer works NOW, and you can add 3D models later!

## Budget Option: Commission on Fiverr

1. Go to Fiverr.com
2. Search "3d clothing model glb"
3. Find sellers for $20-50 per model
4. Provide your product images as reference
5. Request GLB format with UV mapping

Total cost: ~$100-150 for all 5 products

## Next Steps

Once you have basic models:
1. Test them in the customizer
2. Optimize file sizes if needed (see README.md)
3. Consider adding texture mapping for design application
4. Enable AR features (works automatically on iOS/Android)

That's it! You're ready to go. 🚀
