"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import CheckoutCompletionPopup from "@/components/CheckoutCompletionPopup";
import {
  clampProgress,
  FRAGMENTS_KEY,
  LAST_ORDER_POINTS_KEY,
  getOrderFragmentPoints,
} from "@/lib/rewards";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { MapPin, Loader2 } from "lucide-react";
import { createOrder, updateProfile } from "@/lib/api";

const LAST_MESSAGE_KEY = "oiko_last_post_purchase_message";
const PURCHASE_COUNT_KEY = "oiko_purchase_count";
const CHECKOUT_INFO_KEY = "oiko_checkout_info";

const checkoutFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").regex(/^[0-9+\-\s()]+$/, "Invalid phone number format"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  zipCode: z.string().min(5, "Zip code must be at least 5 characters"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

const getPostPurchaseMessage = (isFirstPurchase: boolean, fragments: number) => {
  if (fragments >= 1000) {
    return "You're closer than before.";
  }
  if (isFirstPurchase) {
    return "Something has begun.";
  }
  return "Something has taken shape.";
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalItems, getTotalPrice, clearCart } = useCart();
  const { user: authUser, refreshUser } = useAuth();
  const [showPopup, setShowPopup] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [orderRef, setOrderRef] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const shippingAmount = 25;

  const total = useMemo(() => getTotalPrice(), [getTotalPrice]);
  const orderPoints = useMemo(() => getOrderFragmentPoints(items), [items]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    reset,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      zipCode: "",
    },
  });

  const currentAddress = watch("address");
  const latitude = watch("latitude");
  const longitude = watch("longitude");

  // Load saved checkout info from localStorage
  useEffect(() => {
    const savedInfo = localStorage.getItem(CHECKOUT_INFO_KEY);
    if (savedInfo) {
      try {
        const parsed = JSON.parse(savedInfo);
        reset(parsed);
      } catch (err) {
        console.error("Failed to parse saved checkout info:", err);
      }
    }
  }, [reset]);

  const handleGetCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setValue("latitude", latitude);
        setValue("longitude", longitude);

        // Use reverse geocoding to get address (using a public API)
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          if (data.display_name) {
            setValue("address", data.display_name);
            toast.success("Location detected successfully!");
          }
        } catch (error) {
          toast.error("Failed to get address from location");
          setValue("address", `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`);
        }

        setIsGettingLocation(false);
        setShowLocationPicker(false);
      },
      (error) => {
        setIsGettingLocation(false);
        toast.error("Failed to get your location. Please enable location services.");
        console.error("Geolocation error:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsProcessing(true);

    try {
      // Save checkout info to localStorage for future use
      localStorage.setItem(CHECKOUT_INFO_KEY, JSON.stringify(data));

      const previousCount = Number(localStorage.getItem(PURCHASE_COUNT_KEY) || "0");
      const previousFragments = Number(localStorage.getItem(FRAGMENTS_KEY) || "0");
      const earnedFragments = orderPoints;
      const nextFragments = previousFragments + earnedFragments;
      const displayFragments = clampProgress(nextFragments);
      const storedFragments = clampProgress(nextFragments);
      const nextCount = previousCount + 1;
      const nextMessage = getPostPurchaseMessage(previousCount === 0, nextFragments);
      const nextOrderRef = `WR-${Date.now().toString().slice(-6)}`;

      // Prepare order data for API
      const orderData = {
        orderRef: nextOrderRef,
        customerInfo: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          zipCode: data.zipCode,
          latitude: data.latitude,
          longitude: data.longitude,
        },
        items: items.map((item) => ({
          productId: String(item.product.id),
          productName: item.product.name,
          productImage: item.product.image,
          category: item.product.category,
          price: item.product.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
        subtotal: total,
        shipping: shippingAmount,
        total: total + shippingAmount,
        pointsEarned: earnedFragments,
        paymentStatus: 'paid' as const, // Mock payment success
        status: 'pending' as const,
        userId: authUser?._id, // Link to user account if logged in
      };

      // Create order via API
      const response = await createOrder(orderData);

      if (!response.success) {
        throw new Error(response.error || 'Failed to create order');
      }

      // Also save to localStorage as backup
      const orders = JSON.parse(localStorage.getItem("oiko_orders") || "[]");
      orders.push({ ...orderData, timestamp: new Date().toISOString() });
      localStorage.setItem("oiko_orders", JSON.stringify(orders));

      // Update fragment points
      localStorage.setItem(PURCHASE_COUNT_KEY, String(nextCount));
      localStorage.setItem(FRAGMENTS_KEY, String(storedFragments));
      sessionStorage.setItem(LAST_ORDER_POINTS_KEY, String(earnedFragments));
      localStorage.setItem(LAST_MESSAGE_KEY, nextMessage);
      sessionStorage.setItem(LAST_MESSAGE_KEY, nextMessage);

      // Sync points to database if user is logged in
      if (authUser) {
        try {
          await updateProfile({ fragmentPoints: storedFragments } as any);
          await refreshUser(); // Refresh user data to update points in UI
        } catch (error) {
          console.error('Failed to sync points to database:', error);
          // Don't fail the order if points sync fails
        }
      }

      window.dispatchEvent(new Event("oiko:points-updated"));

      // Show success
      toast.success("Order placed successfully!");

      setPointsEarned(earnedFragments);
      setTotalPoints(displayFragments);
      setConfirmationMessage(nextMessage);
      setOrderRef(nextOrderRef);
      setShowPopup(true);
      clearCart();
    } catch (error: any) {
      console.error('Order creation failed:', error);
      toast.error(error.message || "Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    clearCart();
    router.push("/products");
  };

  return (
    <main className="container mx-auto px-4 py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
        <p className="text-sm text-muted-foreground">
          Complete your information to finalize your order.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6 lg:grid-cols-5">
          <Card className="border-primary/10 shadow-sm lg:col-span-3">
            <CardHeader>
              <CardTitle>Contact & Delivery Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Name Fields */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    First Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    {...register("firstName")}
                    placeholder="First name"
                    className={errors.firstName ? "border-destructive" : ""}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-destructive">{errors.firstName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    Last Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    {...register("lastName")}
                    placeholder="Last name"
                    className={errors.lastName ? "border-destructive" : ""}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-destructive">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="your@email.com"
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  placeholder="+966 50 123 4567"
                  className={errors.phone ? "border-destructive" : ""}
                />
                {errors.phone && (
                  <p className="text-xs text-destructive">{errors.phone.message}</p>
                )}
              </div>

              {/* Address with Map Picker */}
              <div className="space-y-2">
                <Label htmlFor="address">
                  Delivery Address <span className="text-destructive">*</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="address"
                    {...register("address")}
                    placeholder="Street address, city"
                    className={`flex-1 ${errors.address ? "border-destructive" : ""}`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowLocationPicker(true)}
                    className="shrink-0"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Map
                  </Button>
                </div>
                {errors.address && (
                  <p className="text-xs text-destructive">{errors.address.message}</p>
                )}
                {latitude && longitude && (
                  <p className="text-xs text-muted-foreground">
                    Location: {latitude.toFixed(6)}, {longitude.toFixed(6)}
                  </p>
                )}
              </div>

              {/* Zip Code */}
              <div className="space-y-2">
                <Label htmlFor="zipCode">
                  Zip Code <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="zipCode"
                  {...register("zipCode")}
                  placeholder="12345"
                  className={errors.zipCode ? "border-destructive" : ""}
                />
                {errors.zipCode && (
                  <p className="text-xs text-destructive">{errors.zipCode.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="order-last lg:order-none lg:col-span-2 lg:sticky lg:top-24 lg:self-start border-primary/10 shadow-sm h-fit">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <Link href="/cart" className="text-muted-foreground underline-offset-4 hover:underline">
                  Items
                </Link>
                <Link href="/cart" className="font-medium underline-offset-4 hover:underline">
                  {getTotalItems()}
                </Link>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">SAR {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">SAR {shippingAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total</span>
                <span className="font-semibold">SAR {(total + shippingAmount).toFixed(2)}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Rewards Journey: +{orderPoints} fragments
              </p>
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isProcessing || items.length === 0 || !isValid}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  "Complete Payment"
                )}
              </Button>
              {!isValid && items.length > 0 && (
                <p className="text-xs text-muted-foreground text-center">
                  Please fill in all required fields
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </form>

      {/* Location Picker Dialog */}
      <Dialog open={showLocationPicker} onOpenChange={setShowLocationPicker}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose Your Location</DialogTitle>
            <DialogDescription>
              We'll use your current location to autofill your delivery address.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-lg border p-4 space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <p className="font-medium">Use Current Location</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Allow us to access your location for accurate delivery. Your location data is only used for this order.
              </p>
              <Button
                onClick={handleGetCurrentLocation}
                disabled={isGettingLocation}
                className="w-full"
              >
                {isGettingLocation ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Getting Location...
                  </>
                ) : (
                  <>
                    <MapPin className="mr-2 h-4 w-4" />
                    Get My Location
                  </>
                )}
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Enter Address Manually</Label>
              <p className="text-sm text-muted-foreground">
                Close this dialog and type your address in the address field.
              </p>
              <Button
                variant="outline"
                onClick={() => setShowLocationPicker(false)}
                className="w-full"
              >
                Enter Manually
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <CheckoutCompletionPopup
        isOpen={showPopup}
        onClose={handlePopupClose}
        currentPoints={totalPoints}
        pointsEarned={pointsEarned}
        confirmationMessage={confirmationMessage}
        orderReference={orderRef}
      />
    </main>
  );
}
