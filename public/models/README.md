# 3D Models Directory

This directory contains 3D models (.glb format) for the product customizer's 3D preview feature.

## Required Models

Place the following .glb files in this directory:

- `hoodie.glb` - 3D model of a hoodie
- `tshirt.glb` - 3D model of a t-shirt
- `hat.glb` - 3D model of a hat/cap
- `socks.glb` - 3D model of socks
- `tote-bag.glb` - 3D model of a tote bag

## Where to Get 3D Models

### Option 1: Free Resources
1. **Sketchfab** (https://sketchfab.com)
   - Search for "hoodie", "t-shirt", etc.
   - Filter by "Downloadable" and license type
   - Download as GLB/glTF format

2. **TurboSquid** (https://www.turbosquid.com/Search/3D-Models/free)
   - Filter by "Free" models
   - Look for clothing/apparel category
   - Download and convert to .glb if needed

3. **Google Poly Archive** (via third-party mirrors)
   - Search for clothing models
   - Download GLB format

4. **Free3D** (https://free3d.com)
   - Clothing & Accessories category
   - Download and convert to GLB

### Option 2: Commission Custom Models
1. **Fiverr** - Find 3D modelers for $20-100 per model
2. **Upwork** - Professional 3D artists
3. **CGTrader** - Marketplace for custom 3D work

### Option 3: Create Your Own
Use these free 3D modeling tools:
1. **Blender** (https://www.blender.org) - Free & open source
2. **Spline** (https://spline.design) - Web-based 3D design tool
3. **Tinkercad** (https://www.tinkercad.com) - Simple browser-based tool

## Converting Other Formats to GLB

If you have models in other formats (.obj, .fbx, .dae), convert them using:

### Online Converters:
- https://products.aspose.app/3d/conversion
- https://imagetostl.com/convert/file/obj/to/glb
- https://anyconv.com/obj-to-glb-converter/

### Blender (Desktop):
1. Install Blender (free)
2. File → Import → [Your Format]
3. File → Export → glTF 2.0 (.glb)
4. Export settings:
   - Format: GLB (Binary)
   - Include: Selected Objects
   - Apply Modifiers: Yes

## Model Requirements

For best results, your 3D models should:

### Technical Specs:
- **Format:** GLB (Binary glTF 2.0)
- **File size:** Under 10MB (optimized for web)
- **Polygon count:** 5,000-50,000 triangles
- **Textures:** Baked into the model or included
- **Scale:** Normalized (fits in unit cube)

### UV Mapping:
- Models should have proper UV unwrapping
- Design areas should have dedicated UV islands
- Front, back, sleeves should have separate UV sections

### Orientation:
- Front of garment facing +Z axis
- Up direction: +Y axis
- Centered at origin (0,0,0)

## Optimizing Models for Web

Use these tools to optimize your models:

1. **glTF Pipeline** (Command line)
   ```bash
   npm install -g gltf-pipeline
   gltf-pipeline -i input.glb -o output.glb -d
   ```

2. **Blender glTF Exporter**
   - Use "Apply Transform" option
   - Enable "Compression"
   - Disable unused features

3. **Online Tools:**
   - https://gltf.report/ - Analyze model
   - https://products.aspose.app/3d/viewer/glb - Preview GLB
   - https://github.khronos.org/glTF-Sample-Viewer-Release/ - Test viewer

## Testing Your Models

Before adding to production:

1. **Preview in Browser:**
   - Upload to https://gltf-viewer.donmccurdy.com/
   - Check rotation, textures, scale

2. **Model Viewer Test:**
   - Use https://model-viewer.glitch.me/
   - Test camera controls, AR support

3. **Performance Check:**
   - File should load in < 3 seconds
   - Smooth rotation at 60fps
   - Works on mobile devices

## Adding Texture Mapping for Custom Designs

To allow user designs to appear on the 3D model:

1. **Create UV Map:**
   - Unwrap model in Blender
   - Export UV layout as image
   - Mark areas for custom designs

2. **Dynamic Texturing (Advanced):**
   ```javascript
   // In Product3DViewer component
   const applyCustomTexture = (modelViewer, designImage) => {
     const model = modelViewer.model;
     const material = model.materials[0];
     // Apply design image to material
   };
   ```

## Troubleshooting

### Model doesn't appear:
- Check browser console for errors
- Verify .glb file is valid
- Test in online GLB viewer first

### Model is too large/small:
- Scale in Blender before export
- Or adjust camera in model-viewer

### Textures missing:
- Ensure textures are embedded in GLB
- Use "Pack Resources" in Blender export

### Slow loading:
- Reduce polygon count
- Compress textures
- Optimize with glTF Pipeline

## Example GLB Sources

Here are some free models you can use as placeholders:

- **Hoodie:** https://sketchfab.com/3d-models/hoodie-[search]
- **T-Shirt:** https://sketchfab.com/3d-models/tshirt-[search]
- **Hat:** https://sketchfab.com/3d-models/cap-[search]

Remember to check licenses before using!

## Current Fallback Behavior

If no 3D models are found, the component will:
1. Show enhanced 2D preview with design overlays
2. Display "Try 3D" button
3. Provide instructions to add models

Users can still use the customizer with 2D previews until 3D models are added.
