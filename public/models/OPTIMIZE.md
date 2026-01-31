# Optimizing Your 3D Models

Your current hoodie.glb is 15MB - this is quite large for web delivery. Here's how to optimize it:

## Target File Size

- **Ideal:** 2-5MB per model
- **Acceptable:** 5-10MB
- **Large:** 10-15MB (current)
- **Too Large:** 15MB+ (slow loading)

## Quick Optimization Methods

### Option 1: Online Tool (Easiest)
1. Go to: https://products.aspose.app/3d/compression
2. Upload your `hoodie.glb`
3. Select compression level: "Medium" or "High"
4. Download optimized file
5. Replace original with optimized version

**Expected result:** 15MB → 3-7MB

### Option 2: glTF Pipeline (Best Quality)
```bash
# Install globally
npm install -g gltf-pipeline

# Optimize with Draco compression
gltf-pipeline -i hoodie.glb -o hoodie-optimized.glb -d

# Or with specific settings
gltf-pipeline -i hoodie.glb -o hoodie-optimized.glb \
  --draco.compressionLevel=10 \
  --draco.quantizePositionBits=14 \
  --draco.quantizeNormalBits=10 \
  --draco.quantizeTexcoordBits=12
```

**Expected result:** 15MB → 2-5MB

### Option 3: Blender Re-export
1. Open Blender
2. File → Import → glTF 2.0 (.glb)
3. Select `hoodie.glb`
4. File → Export → glTF 2.0 (.glb)
5. Export settings:
   - ✅ Apply Modifiers
   - ✅ Compression: Draco
   - ✅ Compression level: 6-10
   - Textures: Resize to 1024x1024 or 2048x2048
6. Save as `hoodie-optimized.glb`

**Expected result:** 15MB → 3-8MB

## What Gets Optimized

1. **Geometry Compression (Draco):**
   - Reduces vertex data size by 90%+
   - No visible quality loss

2. **Texture Optimization:**
   - Resize oversized textures
   - Use JPEG for color maps
   - Use PNG only for alpha/transparency

3. **Remove Unused Data:**
   - Extra UV channels
   - Unused materials
   - Animation data (if not needed)
   - Hidden geometry

## Testing After Optimization

1. **Visual Check:**
   - Load in https://gltf-viewer.donmccurdy.com/
   - Compare with original
   - Should look nearly identical

2. **Performance Check:**
   - File size reduced?
   - Loads in < 3 seconds?
   - Rotates smoothly at 60fps?

3. **In Your App:**
   - Replace file in `/public/models/`
   - Refresh browser
   - Test all features

## Current Performance Impact

With 15MB hoodie.glb:
- **Fast internet (50+ Mbps):** ~3-4 seconds load
- **Medium internet (10 Mbps):** ~12-15 seconds load
- **Slow internet (3G):** ~40+ seconds load
- **Mobile data:** May timeout or be too slow

After optimization to 3-5MB:
- **Fast internet:** < 1 second load
- **Medium internet:** ~2-4 seconds load
- **Slow internet (3G):** ~8-12 seconds load
- **Mobile data:** Acceptable experience

## Recommended Action

For production, optimize your model to under 5MB. But for testing right now, the 15MB file will work fine on localhost!

## Progressive Loading (Advanced)

If you want to keep high quality but improve perceived performance:

```tsx
// In Product3DViewer.tsx, add:
<model-viewer
  src="/models/hoodie.glb"
  poster="/images/hoodie-poster.jpg"  // Shows while loading
  reveal="interaction"                // Waits for user interaction
  loading="lazy"                      // Only loads when visible
  // ... other props
>
```

This shows a static image first, then loads 3D model on demand.
