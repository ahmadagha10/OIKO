import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  Truck,
} from "lucide-react";

const trackingSteps = [
  {
    label: "Order placed",
    description: "We received your order and are preparing it.",
    timestamp: "Tue, 9:15 AM",
    status: "done" as const,
    icon: Package,
  },
  {
    label: "Shipped",
    description: "Package left the warehouse and is in transit.",
    timestamp: "Wed, 6:40 PM",
    status: "done" as const,
    icon: Truck,
  },
  {
    label: "Out for delivery",
    description: "Courier is heading to your address.",
    timestamp: "Today, 8:10 AM",
    status: "current" as const,
    icon: MapPin,
  },
  {
    label: "Delivered",
    description: "We will confirm delivery once completed.",
    timestamp: "Pending",
    status: "pending" as const,
    icon: CheckCircle2,
  },
];

export default function ShippingPage() {
  return (
    <main className="bg-gradient-to-b from-muted/40 to-background">
      <div className="container mx-auto px-4 py-12 space-y-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-sm uppercase tracking-wide text-primary">
              Shipping
            </p>
            <h1 className="text-3xl font-bold md:text-4xl">
              Track your shipment & manage your address
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Enter your tracking number to see the latest updates and keep your
              delivery address ready for the courier.
            </p>
          </div>
          <Badge variant="outline" className="w-fit">
            Live status refreshed minutes ago
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr,0.85fr]">
          <Card className="border-primary/10 shadow-sm">
            <CardHeader>
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div className="space-y-1">
                  <CardTitle>Shipment tracking</CardTitle>
                  <CardDescription>
                    Use your tracking number to refresh the latest checkpoints.
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Carrier</p>
                  <p className="font-semibold">FastEx Express</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <form className="space-y-3">
                <Label htmlFor="tracking-number">Tracking number</Label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Input
                    id="tracking-number"
                    name="tracking-number"
                    placeholder="e.g. FX-4829-1920-AB"
                    defaultValue="FX-4829-1920-AB"
                    className="sm:max-w-md"
                  />
                  <Button type="submit" className="sm:w-auto">
                    Track shipment
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Tracking updates refresh every few minutes. If you just placed
                  your order, it can take up to an hour to appear.
                </p>
              </form>

              <div className="rounded-lg border bg-background/60 p-4 shadow-sm">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Current</p>
                    <p className="text-lg font-semibold">Out for delivery</p>
                    <p className="text-sm text-muted-foreground">
                      Expected today between 4:00 PM - 7:00 PM
                    </p>
                  </div>
                  <Badge variant="secondary" className="w-fit">
                    ETA • Today
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                {trackingSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isLast = index === trackingSteps.length - 1;
                  return (
                    <div key={step.label} className="flex gap-4">
                      <div className="relative flex flex-col items-center">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full border bg-background ${
                            step.status === "done"
                              ? "border-primary bg-primary text-primary-foreground"
                              : step.status === "current"
                                ? "border-primary/60 text-primary"
                                : "border-muted-foreground/30 text-muted-foreground"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        {!isLast && (
                          <div
                            className={`mt-1 h-full w-px flex-1 ${
                              step.status === "done"
                                ? "bg-primary/60"
                                : "bg-border"
                            }`}
                          />
                        )}
                      </div>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{step.label}</p>
                          {step.status === "done" && (
                            <Badge variant="outline" className="text-xs">
                              Completed
                            </Badge>
                          )}
                          {step.status === "current" && (
                            <Badge className="text-xs">In progress</Badge>
                          )}
                          {step.status === "pending" && (
                            <Badge variant="outline" className="text-xs">
                              Pending
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{step.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-primary/10 shadow-sm">
              <CardHeader>
                <CardTitle>Shipping address</CardTitle>
                <CardDescription>
                  Keep your delivery details up to date for smoother drop-offs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="full-name">Full name</Label>
                      <Input
                        id="full-name"
                        name="full-name"
                        placeholder="e.g. Ahmad Agha"
                        defaultValue="Ahmad Agha"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+963 9x xxx xxxx"
                        defaultValue="+963 9x xxx xxxx"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address-line1">Address line</Label>
                    <Input
                      id="address-line1"
                      name="address-line1"
                      placeholder="Building, street, and number"
                      defaultValue="Building 12, Main Street"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        placeholder="City"
                        defaultValue="Damascus"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postal-code">Postal code</Label>
                      <Input
                        id="postal-code"
                        name="postal-code"
                        placeholder="Postal / ZIP code"
                        defaultValue="0000"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Delivery instructions</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      placeholder="Gate code, floor, nearby landmark..."
                      defaultValue="Ring the doorbell twice and leave with the receptionist if I am out."
                    />
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-muted-foreground">
                      These details are shared with the courier for this order.
                    </p>
                    <Button type="submit" className="sm:w-auto">
                      Save address
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Shipment summary</CardTitle>
                <CardDescription>
                  Quick recap of your delivery preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-medium">Express (2-3 days)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Insurance</span>
                  <span className="font-medium">Included</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Signature</span>
                  <span className="font-medium">Required on delivery</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Support</span>
                  <span className="font-medium text-primary">
                    support@oiko.shop
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
