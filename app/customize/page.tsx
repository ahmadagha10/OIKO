"use client";

import { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Sparkles, Upload, X, Save, ShoppingCart, Info, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image as KonvaImage, Layer, Stage, Transformer } from "react-konva";
import { CldUploadWidget } from "next-cloudinary";
import { useCart } from "@/contexts/cart-context";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamically import 3D viewer to avoid SSR issues
const Product3DViewer = dynamic(() => import("@/components/Product3DViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96 bg-neutral-100 rounded-lg">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400 mx-auto mb-2" />
        <p className="text-sm text-neutral-600">Loading 3D viewer...</p>
      </div>
    </div>
  ),
});

type ProductType = "hoodies" | "tshirts" | "hats" | "socks" | "totebags";
type DesignSlot = {
  id: number;
  file: File | null;
  previewUrl: string | null;
  name: string | null;
  placement: string;
  location: string;
  transform: {
    x: number;
    y: number;
    scale: number;
    rotation: number;
  };
};

type DesignDropzoneProps = {
  design: DesignSlot;
  onFileSelect: (file: File) => void;
  onCloudinarySelect: (url: string, name?: string) => void;
  onRemove: () => void;
};

type DesignEditorProps = {
  design: DesignSlot;
  onTransformChange: (transform: DesignSlot["transform"]) => void;
  onReset: () => void;
};

type DesignAnglePreviewProps = {
  angles: string[];
  designs: DesignSlot[];
  selectedProduct: ProductType;
  selectedColor: string;
  method: "print" | "embroidered";
  colorMap: Record<string, string>;
  aspectRatio: string;
  getPlacementStyle: (product: ProductType, placement: string, location: string) => {
    width: string;
    top: string;
    left: string;
  };
  getMockupForPlacement: (product: ProductType, placement: string) => string;
  angleLabelMap: Map<string, string>;
  showEmptyState: boolean;
  enableDrag?: boolean;
  onTransformChange?: (designId: number, transform: DesignSlot["transform"]) => void;
  activeDesignId?: number;
  mainEmphasisId?: number;
};

const formSchema = z.object({
  product: z.string().min(1, "Choose a product"),
  size: z.string().min(1, "Select a size"),
  color: z.string().min(1, "Select a color"),
  method: z.enum(["print", "embroidered"]),
});

type FormValues = z.infer<typeof formSchema>;

const editorBaseWidth = 500; // Increased from 400 for better drag space
const editorAspectRatio = 3 / 4;
const cloudinaryEnabled =
  Boolean(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) &&
  Boolean(process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

function DesignDropzone({ design, onFileSelect, onCloudinarySelect, onRemove }: DesignDropzoneProps) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    accept: { "image/*": [] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    onDropAccepted: (files) => {
      if (files[0]) {
        onFileSelect(files[0]);
      }
    },
  });
  const rejectionMessage = fileRejections[0]?.errors[0]?.message;

  if (design.previewUrl) {
    return (
      <div className="relative group">
        <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted flex items-center justify-center p-4">
          <img
            src={design.previewUrl}
            alt={`Design preview ${design.id}`}
            className="max-h-full object-contain"
          />
        </div>
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          {design.name || design.file?.name}
        </p>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-6 text-center bg-muted/30 cursor-pointer transition-colors",
        isDragActive ? "border-primary/60 bg-primary/10" : "border-muted-foreground/25",
        isDragReject ? "border-destructive/70 bg-destructive/10" : ""
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-full bg-primary/10 p-3">
          <Upload className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium">
            {isDragActive ? "Drop your design here" : "Click to upload or drag and drop"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            PNG, JPG, SVG up to 10MB
          </p>
          {isDragReject && (
            <p className="text-xs text-destructive mt-2">
              {rejectionMessage || "Unsupported file. Use an image under 10MB."}
            </p>
          )}
        </div>
        {cloudinaryEnabled && (
          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            options={{ sources: ["local", "url", "camera"], multiple: false }}
            onUpload={(result) => {
              const info = result?.info;
              if (info && typeof info === "object" && "secure_url" in info) {
                const name = "original_filename" in info ? String(info.original_filename) : "Cloudinary upload";
                onCloudinarySelect(String(info.secure_url), name);
              }
            }}
          >
            {({ open }) => (
              <Button type="button" variant="secondary" size="sm" onClick={() => open?.()}>
                Upload with Cloudinary
              </Button>
            )}
          </CldUploadWidget>
        )}
      </div>
    </div>
  );
}

function DesignEditor({ design, onTransformChange, onReset }: DesignEditorProps) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const imageRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);
  const [isSelected, setIsSelected] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(editorBaseWidth);
  const canvasHeight = Math.round(canvasWidth * editorAspectRatio);

  useEffect(() => {
    if (!design.previewUrl) {
      setImage(null);
      return;
    }
    const img = new window.Image();
    img.src = design.previewUrl;
    img.onload = () => setImage(img);
  }, [design.previewUrl]);

  useEffect(() => {
    if (transformerRef.current && imageRef.current && isSelected) {
      transformerRef.current.nodes([imageRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [image, isSelected]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    const observer = new ResizeObserver((entries) => {
      const nextWidth = Math.max(240, Math.floor(entries[0].contentRect.width));
      setCanvasWidth(nextWidth);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const baseWidth = canvasWidth * 0.5;
  const imageRatio = image ? image.height / image.width : 1;
  const baseHeight = baseWidth * imageRatio;

  const updateTransform = (scaleOverride?: number) => {
    if (!imageRef.current) {
      return;
    }
    const node = imageRef.current;
    const nextScale = Math.max(0.3, Math.min(4, scaleOverride ?? node.scaleX())); // Increased range: 0.3 to 4
    const nextRotation = node.rotation();
    // Allow more dragging range - increased from 100 to 150 for better coverage
    const nextX = ((node.x() - canvasWidth / 2) / canvasWidth) * 150;
    const nextY = ((node.y() - canvasHeight / 2) / canvasHeight) * 150;
    onTransformChange({
      x: nextX,
      y: nextY,
      scale: nextScale,
      rotation: nextRotation,
    });
  };

  if (!image) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">Adjust design</p>
      <div
        ref={containerRef}
        className="flex items-center justify-center rounded-md border bg-background w-full max-w-[400px] mx-auto overflow-hidden"
      >
        <div className="w-full">
          <Stage width={canvasWidth} height={canvasHeight}>
            <Layer>
              <KonvaImage
                ref={imageRef}
                image={image}
                x={canvasWidth / 2 + (design.transform.x / 150) * canvasWidth}
                y={canvasHeight / 2 + (design.transform.y / 150) * canvasHeight}
                width={baseWidth}
                height={baseHeight}
                offsetX={baseWidth / 2}
                offsetY={baseHeight / 2}
                draggable
                rotation={design.transform.rotation}
                scaleX={design.transform.scale}
                scaleY={design.transform.scale}
                onClick={() => setIsSelected(true)}
                onTap={() => setIsSelected(true)}
                onDragMove={(evt) => updateTransform(evt.target.scaleX())}
                onDragEnd={(evt) => updateTransform(evt.target.scaleX())}
                onTransformEnd={() => {
                  if (!imageRef.current) {
                    return;
                  }
                  const node = imageRef.current;
                  const nextScale = Math.max(0.3, Math.min(4, node.scaleX()));
                  node.scaleX(1);
                  node.scaleY(1);
                  updateTransform(nextScale);
                }}
              />
              {isSelected && (
                <Transformer
                  ref={transformerRef}
                  rotationSnaps={[0, 90, 180, 270]}
                  keepRatio
                  enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
                  boundBoxFunc={(oldBox, newBox) => {
                    // Allow smaller minimum size and larger maximum
                    if (newBox.width < 30 || newBox.height < 30) {
                      return oldBox;
                    }
                    // Allow up to 4x the canvas size
                    if (newBox.width > canvasWidth * 4 || newBox.height > canvasHeight * 4) {
                      return oldBox;
                    }
                    return newBox;
                  }}
                />
              )}
            </Layer>
          </Stage>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Drag, resize, or rotate.</span>
        <Button type="button" variant="ghost" size="sm" onClick={onReset}>
          Reset
        </Button>
      </div>
    </div>
  );
}

function DesignAnglePreview({
  angles,
  designs,
  selectedProduct,
  selectedColor,
  method,
  colorMap,
  aspectRatio,
  getPlacementStyle,
  getMockupForPlacement,
  angleLabelMap,
  showEmptyState,
  enableDrag = false,
  onTransformChange,
  activeDesignId,
  mainEmphasisId,
}: DesignAnglePreviewProps) {
  const activeDragRef = useRef<{
    designId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    containerWidth: number;
    containerHeight: number;
  } | null>(null);

  useEffect(() => {
    if (!enableDrag) {
      return;
    }
    const handleMove = (event: PointerEvent) => {
      if (!activeDragRef.current || !onTransformChange) {
        return;
      }
      const { designId, startX, startY, originX, originY, containerWidth, containerHeight } =
        activeDragRef.current;
      const deltaX = ((event.clientX - startX) / containerWidth) * 100;
      const deltaY = ((event.clientY - startY) / containerHeight) * 100;
      onTransformChange(designId, {
        x: originX + deltaX,
        y: originY + deltaY,
        scale: designs.find((design) => design.id === designId)?.transform.scale || 1,
        rotation: designs.find((design) => design.id === designId)?.transform.rotation || 0,
      });
    };
    const handleUp = () => {
      activeDragRef.current = null;
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, [enableDrag, designs, onTransformChange]);

  const startDrag = (event: React.PointerEvent<HTMLImageElement>, design: DesignSlot) => {
    if (!enableDrag || !onTransformChange) {
      return;
    }
    const container = (event.currentTarget.closest("[data-preview-container]") as HTMLElement) || null;
    if (!container) {
      return;
    }
    activeDragRef.current = {
      designId: design.id,
      startX: event.clientX,
      startY: event.clientY,
      originX: design.transform.x,
      originY: design.transform.y,
      containerWidth: container.clientWidth,
      containerHeight: container.clientHeight,
    };
  };

  return (
    <div className="grid gap-3">
      {angles.map((angle) => {
        const angleLabel = angleLabelMap.get(angle) || angle.replace("_", " ");
        const angleDesigns = designs.filter(
          (design) => design.previewUrl && design.placement === angle
        );
        return (
          <div key={angle} className="space-y-2">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {angleLabel}
            </p>
            <div
              data-preview-container
              className="relative w-full overflow-hidden rounded-lg border bg-neutral-100"
              style={{
                aspectRatio,
                backgroundColor: selectedColor ? `${colorMap[selectedColor]}10` : "#f5f5f5",
              }}
            >
              <div className="absolute inset-0 p-4 flex items-center justify-center">
                <img
                  src={getMockupForPlacement(selectedProduct, angle)}
                  alt={`${angleLabel} preview`}
                  className="w-full h-full object-contain select-none pointer-events-none drop-shadow-sm"
                />
              </div>
              <div className="absolute inset-0 z-10">
                {angleDesigns.length ? (
                  angleDesigns.map((design) => {
                    const style = getPlacementStyle(selectedProduct, design.placement, design.location);
                    const transform = design.transform;
                    const isActive = activeDesignId === design.id;
                    const isDimmed = activeDesignId !== undefined && !isActive;
                    return (
                      <div
                        key={design.id}
                        className={cn(
                          "absolute flex items-center justify-center transition-opacity duration-200",
                          isDimmed ? "opacity-80" : "opacity-100"
                        )}
                        style={{
                          width: style.width,
                          top: style.top,
                          left: style.left,
                          transform: `translate(calc(-50% + ${transform.x / 1.5}%), calc(-50% + ${transform.y / 1.5}%)) scale(${transform.scale}) rotate(${transform.rotation}deg)`,
                          zIndex: isActive ? 2 : 1,
                        }}
                      >
                        <img
                          src={design.previewUrl as string}
                          alt={`${angleLabel} design ${design.id}`}
                          onPointerDown={(event) => startDrag(event, design)}
                          className={cn(
                            "w-full h-auto object-contain drop-shadow-md",
                            (selectedColor === "White" || selectedColor === "Beige")
                              ? "mix-blend-multiply opacity-90"
                              : "opacity-95",
                            method === "embroidered" ? "contrast-125 brightness-110 saturate-50" : ""
                          )}
                        />
                      </div>
                    );
                  })
                ) : showEmptyState ? (
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center p-3 space-y-2 bg-white/50 backdrop-blur-sm rounded-lg border border-dashed border-primary/20">
                    <p className="text-[10px] font-medium uppercase tracking-widest opacity-40">
                      No design on this angle
                    </p>
                  </div>
                ) : null}
              </div>
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/10 to-transparent z-20" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function CustomizePage() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [activeAngle, setActiveAngle] = useState<string>("front");
  const [activeDesignId, setActiveDesignId] = useState<number>(1);
  const [mainEmphasisId, setMainEmphasisId] = useState<number>(1);
  const [previewMode, setPreviewMode] = useState<"edit" | "final">("final");
  const [showExtraDesigns, setShowExtraDesigns] = useState<boolean>(false);
  const [designError, setDesignError] = useState<string | null>(null);
  const [conflictDesignId, setConflictDesignId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [showGuidelines, setShowGuidelines] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const previewIdleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [designs, setDesigns] = useState<DesignSlot[]>([
    {
      id: 1,
      file: null,
      previewUrl: null,
      name: null,
      placement: "front",
      location: "chest",
      transform: { x: 0, y: 0, scale: 1, rotation: 0 },
    },
    {
      id: 2,
      file: null,
      previewUrl: null,
      name: null,
      placement: "back",
      location: "upper",
      transform: { x: 0, y: 0, scale: 1, rotation: 0 },
    },
    {
      id: 3,
      file: null,
      previewUrl: null,
      name: null,
      placement: "hood",
      location: "center",
      transform: { x: 0, y: 0, scale: 1, rotation: 0 },
    },
    {
      id: 4,
      file: null,
      previewUrl: null,
      name: null,
      placement: "left_sleeve",
      location: "upper",
      transform: { x: 0, y: 0, scale: 1, rotation: 0 },
    },
    {
      id: 5,
      file: null,
      previewUrl: null,
      name: null,
      placement: "right_sleeve",
      location: "upper",
      transform: { x: 0, y: 0, scale: 1, rotation: 0 },
    },
  ]);
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product: "hoodies",
      size: "",
      color: "",
      method: "print",
    },
  });
  const selectedProduct = watch("product") as ProductType;
  const selectedSize = watch("size");
  const selectedColor = watch("color");
  const method = watch("method");

  const enterEditView = () => {
    if (previewIdleTimer.current) {
      clearTimeout(previewIdleTimer.current);
    }
    setPreviewMode("edit");
  };

  const scheduleFinalView = (delay = 700) => {
    if (previewIdleTimer.current) {
      clearTimeout(previewIdleTimer.current);
    }
    previewIdleTimer.current = setTimeout(() => {
      setPreviewMode("final");
    }, delay);
  };

  useEffect(() => {
    return () => {
      if (previewIdleTimer.current) {
        clearTimeout(previewIdleTimer.current);
      }
    };
  }, []);

  const focusDesign = (design: DesignSlot) => {
    enterEditView();
    setActiveDesignId(design.id);
    setActiveAngle(design.placement);
  };

  const setDesignErrorFor = (designIndex: number, message: string, isConflict = false) => {
    setDesignError(message);
    setConflictDesignId(isConflict ? designs[designIndex].id : null);
    focusDesign(designs[designIndex]);
  };

  const clearDesignError = () => {
    setDesignError(null);
    setConflictDesignId(null);
  };

  const isAreaTaken = (placement: string, location: string, excludeIndex: number) => {
    return designs.some(
      (design, index) =>
        index !== excludeIndex &&
        Boolean(design.previewUrl) &&
        design.placement === placement &&
        design.location === location
    );
  };

  const handleFileSelect = async (index: number, file: File) => {
    if (!file.type.startsWith("image/")) {
      setDesignErrorFor(index, "Please upload an image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setDesignErrorFor(index, "File size must be less than 10MB");
      return;
    }
    if (isAreaTaken(designs[index].placement, designs[index].location, index)) {
      setDesignErrorFor(index, "This area is already used. Try another placement.", true);
      return;
    }

    setIsUploading(true);
    clearDesignError();
    focusDesign(designs[index]);

    // Simulate upload delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));

    scheduleFinalView();
    setDesigns((prev) =>
      prev.map((design, designIndex) => {
        if (designIndex !== index) {
          return design;
        }
        if (design.previewUrl?.startsWith("blob:")) {
          URL.revokeObjectURL(design.previewUrl);
        }
        return {
          ...design,
          file,
          previewUrl: URL.createObjectURL(file),
          name: file.name,
          transform: { x: 0, y: 0, scale: 1, rotation: 0 },
        };
      })
    );
    setIsUploading(false);
  };

  const handleRemoveFile = (index: number) => {
    const removedId = designs[index]?.id;
    setDesigns((prev) =>
      prev.map((design, designIndex) => {
        if (designIndex !== index) {
          return design;
        }
        if (design.previewUrl?.startsWith("blob:")) {
          URL.revokeObjectURL(design.previewUrl);
        }
        return {
          ...design,
          file: null,
          previewUrl: null,
          name: null,
          transform: { x: 0, y: 0, scale: 1, rotation: 0 },
        };
      })
    );
    if (removedId === mainEmphasisId) {
      setMainEmphasisId(1);
    }
    if (removedId === activeDesignId) {
      setActiveDesignId(1);
    }
    if (removedId === conflictDesignId) {
      clearDesignError();
    }
  };

  const handleCloudinarySelect = (index: number, url: string, name?: string) => {
    if (isAreaTaken(designs[index].placement, designs[index].location, index)) {
      setDesignErrorFor(index, "This area is already used. Try another placement.", true);
      return;
    }
    clearDesignError();
    focusDesign(designs[index]);
    scheduleFinalView();
    setDesigns((prev) =>
      prev.map((design, designIndex) => {
        if (designIndex !== index) {
          return design;
        }
        if (design.previewUrl?.startsWith("blob:")) {
          URL.revokeObjectURL(design.previewUrl);
        }
        return {
          ...design,
          file: null,
          previewUrl: url,
          name: name || "Cloudinary upload",
          transform: { x: 0, y: 0, scale: 1, rotation: 0 },
        };
      })
    );
  };

  const handleTransformChange = (index: number, transform: DesignSlot["transform"]) => {
    enterEditView();
    scheduleFinalView();
    focusDesign(designs[index]);
    setDesigns((prev) =>
      prev.map((design, designIndex) =>
        designIndex === index ? { ...design, transform } : design
      )
    );
  };

  const handleResetTransform = (index: number) => {
    enterEditView();
    scheduleFinalView();
    focusDesign(designs[index]);
    setDesigns((prev) =>
      prev.map((design, designIndex) =>
        designIndex === index
          ? { ...design, transform: { x: 0, y: 0, scale: 1, rotation: 0 } }
          : design
      )
    );
  };

  const calculatePrice = () => {
    const basePrice = 250;
    const methodPrice = method === "print" ? 50 : 100;
    const designCount = designs.filter(d => d.previewUrl).length;
    const extraDesignPrice = Math.max(0, designCount - 2) * 30; // Extra charge for more than 2 designs
    return basePrice + methodPrice + extraDesignPrice;
  };

  const handleSaveDesign = () => {
    try {
      setIsSaving(true);
      const designData = {
        product: selectedProduct,
        size: selectedSize,
        color: selectedColor,
        method,
        designs: designs.map(d => ({
          id: d.id,
          placement: d.placement,
          location: d.location,
          transform: d.transform,
          name: d.name,
          // Note: previewUrl (blob URLs) cannot be saved to localStorage
          // In production, you'd save the actual image to server/cloudinary
        })),
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem('oiko_saved_design', JSON.stringify(designData));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save design:', error);
      setDesignError('Failed to save design. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const onSubmit = (data: FormValues) => {
    if (!designs.some((design) => design.previewUrl)) {
      setDesignError("Please upload at least one design");
      return;
    }
    clearDesignError();

    // Create custom product for cart
    const customProduct = {
      id: Date.now(), // Unique ID for custom product
      name: `Custom ${currentProduct.label} - ${data.color} ${data.size}`,
      price: calculatePrice(),
      description: `Custom ${currentProduct.label} with ${designs.filter(d => d.previewUrl).length} design(s) using ${data.method} method`,
      image: getMockupForPlacement(selectedProduct, "front"), // Use the front mockup as preview
      category: "Custom",
      customization: {
        product: data.product,
        size: data.size,
        color: data.color,
        method: data.method,
        designCount: designs.filter(d => d.previewUrl).length,
      }
    };

    addToCart(customProduct);
    router.push('/cart');
  };

  const productOptions = [
    { value: "hoodies", label: "Hoodies", colors: ["Black", "Grey", "White", "Navy"], sizes: ["S", "M", "L", "XL"] },
    { value: "tshirts", label: "T-Shirts", colors: ["Black", "White", "Grey", "Navy"], sizes: ["S", "M", "L", "XL", "XXL"] },
    { value: "hats", label: "Hats", colors: ["Black", "White", "Navy", "Beige"], sizes: ["One Size"] },
    { value: "socks", label: "Socks", colors: ["White", "Black", "Gray"], sizes: ["S", "M", "L"] },
    { value: "totebags", label: "Tote Bags", colors: ["Beige", "Black", "Navy"], sizes: ["One Size"] },
  ];

  const currentProduct = productOptions.find((p) => p.value === selectedProduct) || productOptions[0];

  // Mockup color mapping
  const colorMap: Record<string, string> = {
    "Black": "#1a1a1a",
    "White": "#f5f5f5",
    "Grey": "#808080",
    "Gray": "#808080",
    "Navy": "#000080",
    "Beige": "#f5f5dc",
  };

  const placementOptions: Record<ProductType, { value: string; label: string; locations: string[] }[]> = {
    hoodies: [
      { value: "front", label: "Front", locations: ["chest", "center"] },
      { value: "back", label: "Back", locations: ["upper", "center"] },
      { value: "hood", label: "Hood", locations: ["center"] },
      { value: "left_sleeve", label: "Left Sleeve", locations: ["upper"] },
      { value: "right_sleeve", label: "Right Sleeve", locations: ["upper"] },
    ],
    tshirts: [
      { value: "front", label: "Front", locations: ["chest", "center"] },
      { value: "back", label: "Back", locations: ["upper", "center"] },
    ],
    hats: [
      { value: "front", label: "Front", locations: ["center"] },
      { value: "brim", label: "Brim", locations: ["center"] },
      { value: "left", label: "Left Side", locations: ["center"] },
      { value: "right", label: "Right Side", locations: ["center"] },
    ],
    socks: [
      { value: "left", label: "Left Sock", locations: ["top", "middle"] },
      { value: "right", label: "Right Sock", locations: ["top", "middle"] },
    ],
    totebags: [
      { value: "front", label: "Front", locations: ["top", "center", "bottom"] },
      { value: "back", label: "Back", locations: ["top", "center", "bottom"] },
    ],
  };

  const getLocationOptions = (product: ProductType, placement: string) => {
    return placementOptions[product].find((option) => option.value === placement)?.locations ?? ["center"];
  };

  const getDefaultPlacement = (product: ProductType) => placementOptions[product][0].value;
  const getDefaultLocation = (product: ProductType, placement: string) => getLocationOptions(product, placement)[0];
  const getPreferredPlacement = (product: ProductType, designIndex: number) => {
    const preferredByDesign: Record<number, Record<ProductType, string>> = {
      1: {
        hoodies: "back",
        tshirts: "back",
        hats: "right",
        socks: "right",
        totebags: "back",
      },
      2: {
        hoodies: "hood",
        tshirts: "back",
        hats: "front",
        socks: "left",
        totebags: "front",
      },
      3: {
        hoodies: "left_sleeve",
        tshirts: "front",
        hats: "left",
        socks: "left",
        totebags: "front",
      },
      4: {
        hoodies: "right_sleeve",
        tshirts: "front",
        hats: "right",
        socks: "right",
        totebags: "back",
      },
    };
    const placement = preferredByDesign[designIndex]?.[product];
    if (!placement) {
      return null;
    }
    const locations = getLocationOptions(product, placement);
    return { placement, location: locations[0] };
  };

  const getAvailableAreas = (product: ProductType) => {
    return placementOptions[product].flatMap((option) =>
      option.locations.map((location) => ({
        placement: option.value,
        location,
      }))
    );
  };

  const productMockups: Record<ProductType, Record<string, string>> = {
    hoodies: {
      front: "/images/mokeups/fronthoodie.avif",
      back: "/images/mokeups/backhoodie.avif",
      hood: "/images/mokeups/hoodie-hood.avif",
      left_sleeve: "/images/mokeups/hoodie-left-sleeve.avif",
      right_sleeve: "/images/mokeups/hoodie-right-sleeve.avif",
    },
    tshirts: {
      front: "/images/mokeups/fronttshirt.png",
      back: "/images/mokeups/backtshirt.png",
    },
    hats: {
      front: "/images/mokeups/hat.png",
      brim: "/images/mokeups/hat.png",
      left: "/images/mokeups/hat-left.png",
      right: "/images/mokeups/hat-right.png",
    },
    socks: {
      left: "/images/mokeups/socks.png",
      right: "/images/mokeups/socks.png",
    },
    totebags: {
      front: "/images/mokeups/tote-bag.png",
      back: "/images/mokeups/tote-bag.png",
    },
  };

  const getMockupForPlacement = (product: ProductType, placement: string) => {
    return productMockups[product][placement] || productMockups[product][getDefaultPlacement(product)];
  };

  const getPlacementStyle = (product: ProductType, placement: string, location: string) => {
    const baseStyles: Record<ProductType, Record<string, Record<string, { width: string; top: string; left: string }>>> = {
      hoodies: {
        front: {
          chest: { width: "22%", top: "35%", left: "50%" },
          center: { width: "35%", top: "48%", left: "50%" },
        },
        back: {
          upper: { width: "22%", top: "30%", left: "50%" },
          center: { width: "32%", top: "46%", left: "50%" },
        },
        hood: {
          center: { width: "20%", top: "20%", left: "50%" },
        },
        left_sleeve: {
          upper: { width: "24%", top: "52%", left: "28%" },
        },
        right_sleeve: {
          upper: { width: "24%", top: "52%", left: "72%" },
        },
      },
      tshirts: {
        front: {
          chest: { width: "18%", top: "32%", left: "50%" },
          center: { width: "30%", top: "47%", left: "50%" },
        },
        back: {
          upper: { width: "18%", top: "26%", left: "50%" },
          center: { width: "26%", top: "44%", left: "50%" },
        },
      },
      hats: {
        front: { center: { width: "34%", top: "50%", left: "50%" } },
        brim: { center: { width: "40%", top: "68%", left: "50%" } },
        left: { center: { width: "22%", top: "50%", left: "34%" } },
        right: { center: { width: "22%", top: "50%", left: "66%" } },
      },
      socks: {
        left: {
          top: { width: "16%", top: "32%", left: "40%" },
          middle: { width: "16%", top: "52%", left: "38%" },
        },
        right: {
          top: { width: "16%", top: "32%", left: "60%" },
          middle: { width: "16%", top: "54%", left: "62%" },
        },
      },
      totebags: {
        front: {
          top: { width: "40%", top: "36%", left: "50%" },
          center: { width: "55%", top: "54%", left: "50%" },
          bottom: { width: "42%", top: "70%", left: "50%" },
        },
        back: {
          top: { width: "40%", top: "36%", left: "50%" },
          center: { width: "55%", top: "54%", left: "50%" },
          bottom: { width: "42%", top: "70%", left: "50%" },
        },
      },
    };

    const placementStyles = baseStyles[product]?.[placement];
    const fallbackLocation = placementStyles ? Object.keys(placementStyles)[0] : "center";
    return placementStyles?.[location] || placementStyles?.[fallbackLocation] || { width: "36%", top: "48%", left: "50%" };
  };

  const handlePlacementChange = (index: number, placement: string) => {
    const locations = getLocationOptions(selectedProduct, placement);
    const nextLocation = locations.includes(designs[index].location) ? designs[index].location : locations[0];
    if (isAreaTaken(placement, nextLocation, index)) {
      setDesignErrorFor(index, "This area is already used. Try another placement.", true);
      return;
    }
    enterEditView();
    setDesigns((prev) =>
      prev.map((design, designIndex) => {
        if (designIndex !== index) {
          return design;
        }
        return {
          ...design,
          placement,
          location: nextLocation,
          transform: { ...design.transform, x: 0, y: 0 },
        };
      })
    );
    clearDesignError();
    focusDesign({ ...designs[index], placement: nextLocation ? placement : designs[index].placement });
    scheduleFinalView();
  };

  const handleLocationChange = (index: number, location: string) => {
    if (isAreaTaken(designs[index].placement, location, index)) {
      setDesignErrorFor(index, "This area is already used. Try another placement.", true);
      return;
    }
    enterEditView();
    setDesigns((prev) =>
      prev.map((design, designIndex) =>
        designIndex === index
          ? { ...design, location, transform: { ...design.transform, x: 0, y: 0 } }
          : design
      )
    );
    clearDesignError();
    focusDesign(designs[index]);
    scheduleFinalView();
  };

  const angleOptions = placementOptions[selectedProduct];
  const hasAnyDesign = designs.some((design) => design.previewUrl);

  const angleLabelMap = new Map(
    placementOptions[selectedProduct].map((option) => [option.value, option.label])
  );

  const getPreviewAngles = () => {
    let baseAngles: string[] = [];
    if (selectedProduct === "hats") {
      baseAngles = ["front", "left"];
    } else if (selectedProduct === "socks") {
      baseAngles = ["left", "right"];
    } else {
      baseAngles = ["front", "back"];
    }

    const uniqueAngles = [...new Set([...baseAngles, activeAngle])];
    if (uniqueAngles.length < 3) {
      const fallback = angleOptions.find((option) => !uniqueAngles.includes(option.value));
      if (fallback) {
        uniqueAngles.push(fallback.value);
      }
    }
    return uniqueAngles.slice(0, 3);
  };

  const previewAngles = getPreviewAngles();

  const getDesignPreviewAngles = (designIndex: number) => {
    const available = placementOptions[selectedProduct].map((option) => option.value);
    const normalize = (values: string[]) => values.filter((value) => available.includes(value));
    const preferred = getPreferredPlacement(selectedProduct, designIndex);
    if (preferred && available.includes(preferred.placement)) {
      return [preferred.placement];
    }
    const slots: Record<number, string[]> = {
      0: normalize(["front"]),
      1: normalize(["back"]),
      2: normalize(["hood"]),
      3: normalize(["left_sleeve"]),
      4: normalize(["right_sleeve"]),
    };
    const desired = slots[designIndex] || [];
    if (desired.length) {
      return desired;
    }
    return available.length ? [available[0]] : [];
  };

  const simulatorAspect: Record<ProductType, string> = {
    hoodies: "1 / 1",
    tshirts: "1 / 1",
    hats: "4 / 3",
    socks: "3 / 2",
    totebags: "4 / 3",
  };

  const renderDesignSection = (design: DesignSlot, index: number) => {
    const availableLocations = getLocationOptions(selectedProduct, design.placement);
    return (
      <div
        key={design.id}
        className="space-y-4"
        onClick={() => focusDesign(design)}
        onFocusCapture={() => focusDesign(design)}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Design {design.id}</p>
          <div className="flex items-center gap-2">
            {design.id > 2 && (
              <Badge variant="secondary" className="text-[10px]">Optional</Badge>
            )}
          </div>
        </div>
        <DesignDropzone
          design={design}
          onFileSelect={(file) => handleFileSelect(index, file)}
          onCloudinarySelect={(url, name) => handleCloudinarySelect(index, url, name)}
          onRemove={() => handleRemoveFile(index)}
        />
        {conflictDesignId === design.id && designError && (
          <p className="text-xs text-destructive">{designError}</p>
        )}
        <div className="rounded-lg border bg-muted/20 p-3 md:p-4">
          <div className="grid gap-3 md:gap-4 lg:grid-cols-2 items-start">
            <div className="space-y-3 md:space-y-4">
              {design.previewUrl ? (
                <DesignEditor
                  design={design}
                  onTransformChange={(transform) => handleTransformChange(index, transform)}
                  onReset={() => handleResetTransform(index)}
                />
              ) : (
                <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Adjust design</p>
                  <div className="flex items-center justify-center rounded-md border bg-background p-6 text-xs text-muted-foreground">
                    Upload a design to start editing.
                  </div>
                </div>
              )}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">Placement</Label>
                  <Select
                    value={design.placement}
                    onValueChange={(value) => handlePlacementChange(index, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select placement" />
                    </SelectTrigger>
                    <SelectContent>
                      {placementOptions[selectedProduct].map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">Location</Label>
                  <Select
                    value={design.location}
                    onValueChange={(value) => handleLocationChange(index, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableLocations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location.replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                3D Preview
              </p>
              <DesignAnglePreview
                angles={getDesignPreviewAngles(index)}
                designs={[design]}
                selectedProduct={selectedProduct}
                selectedColor={selectedColor}
                method={method as "print" | "embroidered"}
                colorMap={colorMap}
                aspectRatio={simulatorAspect[selectedProduct]}
                getPlacementStyle={getPlacementStyle}
                getMockupForPlacement={getMockupForPlacement}
                angleLabelMap={angleLabelMap}
                showEmptyState={Boolean(design.previewUrl)}
                enableDrag
                onTransformChange={(designId, transform) =>
                  handleTransformChange(
                    index,
                    designId === design.id ? transform : design.transform
                  )
                }
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="bg-gradient-to-b from-muted/40 to-background min-h-screen">
      {/* Loading Overlay */}
      {isUploading && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium">Uploading design...</p>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {saveSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="h-5 w-5" />
          <span className="font-medium">Design saved successfully!</span>
        </div>
      )}

      {/* Error Notification */}
      {designError && !conflictDesignId && (
        <div className="fixed top-4 right-4 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="h-5 w-5" />
          <span className="font-medium">{designError}</span>
          <button onClick={clearDesignError} className="ml-2">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="container mx-auto px-4 py-6 md:py-12 space-y-6 md:space-y-8">
        <section className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-2">
            <p className="text-xs md:text-sm uppercase tracking-wide text-primary">
              Customize
            </p>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 md:h-7 md:w-7" />
              Create your custom design
            </h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
              Upload your design and choose how you want it applied to your
              favorite product.
            </p>
          </div>
          <Badge variant="outline" className="w-fit text-xs md:text-sm">
            Custom orders available
          </Badge>
        </section>

        {/* Quick Start Guide */}
        {!designs.some(d => d.previewUrl) && (
          <Card className="border-green-200 bg-green-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-green-600" />
                Quick Start Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-sm text-green-900">
                <li>Choose your product type (Hoodie, T-Shirt, etc.)</li>
                <li>Upload your design image (PNG recommended)</li>
                <li>Select where you want the design placed</li>
                <li>Choose print method, size, and color</li>
                <li>Preview your design and add to cart!</li>
              </ol>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:gap-8 lg:grid-cols-[1fr,400px]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
            {/* Product Selection (Quick Access) */}
            <Card className="border-primary/10 shadow-sm">
              <CardHeader>
                <CardTitle>Choose product</CardTitle>
                <CardDescription>
                  Select the product you want to customize before uploading designs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {productOptions.map((product) => (
                    <Button
                      key={product.value}
                      type="button"
                      variant={
                        selectedProduct === product.value
                          ? "default"
                          : "outline"
                      }
                      onClick={() => {
                        const nextProduct = product.value as ProductType;
                        setValue("product", nextProduct, { shouldValidate: true });
                        setValue("size", "", { shouldValidate: true });
                        setValue("color", "", { shouldValidate: true });
                        const availableAreas = getAvailableAreas(nextProduct);
                        const usedAreas = new Set<string>();
                        const nextDesigns = designs.map((design) => {
                          const designIndex = design.id - 1;
                          const preferred = getPreferredPlacement(nextProduct, designIndex);
                          const preferredArea = preferred
                            ? availableAreas.find(
                                (area) =>
                                  area.placement === preferred.placement &&
                                  area.location === preferred.location
                              )
                            : null;
                          const desiredArea = preferredArea
                            ? preferredArea
                            : availableAreas.find(
                                (area) =>
                                  area.placement === design.placement &&
                                  area.location === design.location
                              );
                          let assignedArea = desiredArea;
                          if (!assignedArea || usedAreas.has(`${assignedArea.placement}:${assignedArea.location}`)) {
                            assignedArea =
                              availableAreas.find(
                                (area) => !usedAreas.has(`${area.placement}:${area.location}`)
                              ) || availableAreas[0];
                          }
                          if (assignedArea) {
                            usedAreas.add(`${assignedArea.placement}:${assignedArea.location}`);
                          }
                          return {
                            ...design,
                            placement: assignedArea?.placement || getDefaultPlacement(nextProduct),
                            location:
                              assignedArea?.location ||
                              getDefaultLocation(nextProduct, assignedArea?.placement || getDefaultPlacement(nextProduct)),
                          };
                        });
                        setDesigns(nextDesigns);
                        setActiveAngle(nextDesigns[0]?.placement || getDefaultPlacement(nextProduct));
                        clearDesignError();
                      }}
                      className="h-auto py-2 px-1 text-[11px]"
                    >
                      {product.label}
                    </Button>
                  ))}
                </div>
                {errors.product && (
                  <p className="text-xs text-destructive mt-2">{errors.product.message}</p>
                )}
              </CardContent>
            </Card>

            {/* Design Upload Section */}
            <Card className="border-primary/10 shadow-sm">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Upload your designs</CardTitle>
                    <CardDescription>
                      Upload up to two image files (PNG, JPG, SVG) and choose their placement.
                    </CardDescription>
                  </div>
                  {designs.some(d => d.previewUrl) && (
                    <Badge variant="secondary" className="text-xs">
                      {designs.filter(d => d.previewUrl).length} / {designs.length} slots
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {!cloudinaryEnabled && (
                  <p className="text-xs text-muted-foreground">
                    Cloudinary upload is unavailable. Set `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` and
                    `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` to enable it.
                  </p>
                )}
                <div className="space-y-6">
                  {designs
                    .filter((design) => design.id <= 2)
                    .map((design) => {
                      const designIndex = designs.findIndex((item) => item.id === design.id);
                      return renderDesignSection(design, designIndex);
                    })}

                  <button
                    type="button"
                    className="w-full flex items-center justify-between rounded-lg border border-dashed bg-muted/20 px-4 py-3 text-xs uppercase tracking-widest font-semibold text-muted-foreground hover:bg-muted/30 transition-colors"
                    onClick={() => setShowExtraDesigns((prev) => !prev)}
                  >
                    <span>{showExtraDesigns ? "Hide additional designs" : "Add more designs"}</span>
                    <span className={cn("text-base transition-transform", showExtraDesigns ? "rotate-180" : "")}>
                      ˅
                    </span>
                  </button>

                  {showExtraDesigns &&
                    designs
                      .filter((design) => design.id > 2)
                      .map((design) => {
                        const designIndex = designs.findIndex((item) => item.id === design.id);
                        return renderDesignSection(design, designIndex);
                      })}
                </div>
                {designError && conflictDesignId === null && (
                  <p className="text-xs text-destructive">{designError}</p>
                )}
              </CardContent>
            </Card>

            {/* Customization Options */}
            <div className="space-y-6">
              {/* Method Selection */}
              <Card className="border-primary/10 shadow-sm">
                <CardHeader>
                  <CardTitle>Application method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={method}
                    onValueChange={(value) =>
                      setValue("method", value as "print" | "embroidered", { shouldValidate: true })
                    }
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-accent cursor-pointer">
                      <RadioGroupItem value="print" id="print" />
                      <Label
                        htmlFor="print"
                        className="flex-1 cursor-pointer font-normal"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">Print</p>
                            <p className="text-[10px] text-muted-foreground">
                              Direct-to-garment
                            </p>
                          </div>
                          <Badge variant="secondary" className="text-[10px]">+SAR 50</Badge>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-accent cursor-pointer">
                      <RadioGroupItem
                        value="embroidered"
                        id="embroidered"
                      />
                      <Label
                        htmlFor="embroidered"
                        className="flex-1 cursor-pointer font-normal"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">Embroidered</p>
                            <p className="text-[10px] text-muted-foreground">
                              Premium quality
                            </p>
                          </div>
                          <Badge variant="secondary" className="text-[10px]">+SAR 100</Badge>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                  {errors.method && (
                    <p className="text-xs text-destructive mt-2">{errors.method.message}</p>
                  )}
                </CardContent>
              </Card>

              {/* Product Selection */}
              <Card className="border-primary/10 shadow-sm">
                <CardHeader>
                  <CardTitle>Product Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Size Selection */}
                  <div className="space-y-3">
                    <Label className="text-xs uppercase tracking-widest text-muted-foreground">Size</Label>
                    <div className="flex flex-wrap gap-2">
                      {currentProduct.sizes.map((size) => (
                        <Button
                          key={size}
                          type="button"
                          variant={selectedSize === size ? "default" : "outline"}
                          size="sm"
                          className="w-12 h-10"
                          onClick={() => setValue("size", size, { shouldValidate: true })}
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                    {errors.size && (
                      <p className="text-xs text-destructive">{errors.size.message}</p>
                    )}
                  </div>

                  {/* Color Selection */}
                  <div className="space-y-3">
                    <Label className="text-xs uppercase tracking-widest text-muted-foreground">Color</Label>
                    <div className="flex flex-wrap gap-3">
                      {currentProduct.colors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setValue("color", color, { shouldValidate: true })}
                          className={cn(
                            "group relative w-10 h-10 rounded-full border-2 transition-all p-0.5",
                            selectedColor === color ? "border-primary" : "border-transparent"
                          )}
                          title={color}
                        >
                          <div
                            className="w-full h-full rounded-full shadow-inner"
                            style={{ backgroundColor: colorMap[color] || "#ddd" }}
                          />
                          {selectedColor === color && (
                            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap font-medium text-primary">
                              {color}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                    {errors.color && (
                      <p className="text-xs text-destructive">{errors.color.message}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Design Guidelines */}
              <Card className="border-blue-200 bg-blue-50/50">
                <CardHeader className="pb-3">
                  <button
                    type="button"
                    onClick={() => setShowGuidelines(!showGuidelines)}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-blue-600" />
                      <CardTitle className="text-sm">Design Guidelines</CardTitle>
                    </div>
                    <span className={cn("text-base transition-transform", showGuidelines ? "rotate-180" : "")}>
                      ˅
                    </span>
                  </button>
                </CardHeader>
                {showGuidelines && (
                  <CardContent className="space-y-3 text-sm text-blue-900">
                    <div>
                      <p className="font-semibold mb-1">Image Requirements:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Format: PNG, JPG, or SVG (PNG with transparent background recommended)</li>
                        <li>Resolution: Minimum 300 DPI for best print quality</li>
                        <li>Size: Maximum 10MB per file</li>
                        <li>Dimensions: At least 2000x2000 pixels for large prints</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Design Tips:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Use high contrast colors for better visibility</li>
                        <li>Avoid very thin lines (minimum 2px for print)</li>
                        <li>Text should be at least 12pt for readability</li>
                        <li>Leave some margin around your design</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Production Time:</p>
                      <p className="text-xs">
                        • Print: 5-7 business days<br />
                        • Embroidered: 7-10 business days<br />
                        Plus shipping time
                      </p>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Pricing Summary */}
              <Card className="border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Price Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base product</span>
                    <span className="font-medium">SAR 250</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {method === "print" ? "Printing" : "Embroidery"}
                    </span>
                    <span className="font-medium">SAR {method === "print" ? 50 : 100}</span>
                  </div>
                  {designs.filter(d => d.previewUrl).length > 2 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Extra designs ({designs.filter(d => d.previewUrl).length - 2})
                      </span>
                      <span className="font-medium">
                        SAR {(designs.filter(d => d.previewUrl).length - 2) * 30}
                      </span>
                    </div>
                  )}
                  <div className="pt-2 border-t flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">SAR {calculatePrice()}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleSaveDesign}
                  disabled={isSaving || !designs.some(d => d.previewUrl)}
                  className="w-full sm:w-auto"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : saveSuccess ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      Saved!
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Draft
                    </>
                  )}
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  disabled={!designs.some(d => d.previewUrl)}
                  className="flex-1 h-12 sm:h-14 text-base sm:text-lg"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </form>

          {/* Simulator Window */}
          <div className="lg:sticky lg:top-24 h-fit">
            <Card className="border-primary/20 shadow-xl overflow-hidden bg-white/50 backdrop-blur-sm">
              <div className="bg-primary px-4 md:px-6 py-3">
                <h3 className="text-primary-foreground font-bold tracking-widest uppercase text-xs">
                  Final Product Preview
                </h3>
              </div>
              <CardContent className="p-4 md:p-6 space-y-3 md:space-y-5">
                {/* View Mode Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 bg-muted rounded-lg p-1">
                    <Button
                      type="button"
                      variant={viewMode === '2d' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('2d')}
                      className="text-xs h-7"
                    >
                      2D View
                    </Button>
                    <Button
                      type="button"
                      variant={viewMode === '3d' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('3d')}
                      className="text-xs h-7"
                    >
                      3D Rotate
                    </Button>
                  </div>
                  {previewMode === "final" && hasAnyDesign && viewMode === '2d' && (
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60">
                      Final view
                    </p>
                  )}
                </div>

                {viewMode === '2d' && (
                  <div className="flex flex-wrap gap-2">
                    {angleOptions.map((option) => (
                      <Button
                        key={option.value}
                        type="button"
                        variant={activeAngle === option.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveAngle(option.value)}
                        className="text-[11px]"
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                )}

                <div className="grid gap-4 md:gap-6 lg:grid-cols-[1fr,2fr]">
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex justify-between items-center text-xs md:text-sm">
                      <span className="text-muted-foreground">Product</span>
                      <span className="font-bold capitalize">{selectedProduct}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs md:text-sm">
                      <span className="text-muted-foreground">Method</span>
                      <span className="font-bold capitalize">{method}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs md:text-sm">
                      <span className="text-muted-foreground">Base Color</span>
                      <span className="font-bold">{selectedColor || "Not selected"}</span>
                    </div>
                    <div className="pt-4 border-t flex justify-between items-center text-base md:text-lg font-bold">
                      <span>Total Price</span>
                      <span className="text-primary italic">SAR {calculatePrice()}</span>
                    </div>
                    {designs.filter(d => d.previewUrl).length > 0 && (
                      <p className="text-xs text-muted-foreground pt-2">
                        {designs.filter(d => d.previewUrl).length} design{designs.filter(d => d.previewUrl).length > 1 ? 's' : ''} added
                      </p>
                    )}
                  </div>

                  {/* Conditional Rendering: 2D vs 3D Preview */}
                  {viewMode === '3d' ? (
                    <div className="w-full">
                      <Product3DViewer
                        productType={selectedProduct}
                        color={selectedColor}
                        designs={designs}
                        fallbackImage={getMockupForPlacement(selectedProduct, "front")}
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <DesignAnglePreview
                      angles={previewAngles}
                      designs={designs}
                      selectedProduct={selectedProduct}
                      selectedColor={selectedColor}
                      method={method as "print" | "embroidered"}
                      colorMap={colorMap}
                      aspectRatio={simulatorAspect[selectedProduct]}
                      getPlacementStyle={getPlacementStyle}
                      getMockupForPlacement={getMockupForPlacement}
                      angleLabelMap={angleLabelMap}
                      showEmptyState={hasAnyDesign}
                      activeDesignId={previewMode === "edit" ? activeDesignId : undefined}
                      mainEmphasisId={mainEmphasisId}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Design Templates Section */}
        <Card className="border-purple-200 bg-purple-50/50">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              Need Inspiration?
            </CardTitle>
            <CardDescription className="text-xs">
              Check out our design templates and examples for ideas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: "Minimalist Logo", style: "Simple & Clean" },
                { name: "Bold Typography", style: "Statement Piece" },
                { name: "Abstract Art", style: "Creative & Unique" },
                { name: "Vintage Badge", style: "Retro Style" },
              ].map((template, idx) => (
                <div
                  key={idx}
                  className="group relative aspect-square rounded-lg border-2 border-dashed border-purple-200 bg-white hover:border-purple-400 transition-all cursor-pointer overflow-hidden"
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <Sparkles className="h-6 w-6 text-purple-600" />
                    </div>
                    <p className="text-xs font-semibold text-purple-900">{template.name}</p>
                    <p className="text-[10px] text-purple-600 mt-1">{template.style}</p>
                  </div>
                  <div className="absolute inset-0 bg-purple-600/0 group-hover:bg-purple-600/10 transition-colors" />
                </div>
              ))}
            </div>
            <p className="text-xs text-purple-700 mt-4 text-center">
              Coming soon: Browse our full template library and use designs created by our team!
            </p>
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </main>
  );
}
