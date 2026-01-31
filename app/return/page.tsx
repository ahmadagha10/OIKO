import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Plane, Truck } from "lucide-react";

export default function ReturnPage() {
  return (
    <main className="bg-gradient-to-b from-muted/40 to-background">
      <div className="container mx-auto px-4 py-12 space-y-10">
        <section className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-wide text-primary">
                Returns
              </p>
              <h1 className="text-3xl font-bold md:text-4xl">
                Return policy & guidance
              </h1>
              <p className="max-w-2xl text-muted-foreground">
                We want you to love your order. If something is not quite right,
                you can return your items within the time windows below
                depending on your location.
              </p>
            </div>
            <Badge variant="outline" className="w-fit">
              Simple, time‑based return windows
            </Badge>
          </div>

          <Alert className="border-primary/20 bg-primary/5">
            <Info className="h-4 w-4" />
            <AlertTitle>Before you start a return</AlertTitle>
            <AlertDescription className="space-y-1">
              <p>
                Returns apply only to unworn, unwashed items with original tags
                and packaging.
              </p>
              <p>
                The return window always starts from the{" "}
                <span className="font-semibold">delivery date</span> shown in
                your shipment tracking.
              </p>
            </AlertDescription>
          </Alert>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <Card className="border-primary/15 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div className="space-y-1">
                <CardTitle>Local customers</CardTitle>
                <p className="text-sm text-muted-foreground">
                  For orders delivered within our local delivery area.
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Truck className="h-6 w-6 text-primary" />
                <Badge variant="secondary" className="text-xs">
                  2 days after delivery
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p>
                Local customers can request a return{" "}
                <span className="font-semibold">
                  within 2 days after the order has been delivered
                </span>
                . After this period, we can no longer accept the return.
              </p>
              <Separator />
              <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                <li>
                  Count the 2 days starting from the day your package is marked
                  as delivered.
                </li>
                <li>
                  Items must be in their original condition, with tags and
                  packaging.
                </li>
                <li>
                  Use your shipping page tracking to confirm the exact delivery
                  date.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-primary/15 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div className="space-y-1">
                <CardTitle>Worldwide customers</CardTitle>
                <p className="text-sm text-muted-foreground">
                  For international orders shipped outside our local area.
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Plane className="h-6 w-6 text-primary" />
                <Badge variant="secondary" className="text-xs">
                  7 days after delivery
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p>
                Worldwide customers can request a return{" "}
                <span className="font-semibold">
                  within 7 days after the order has been delivered
                </span>
                . This longer window allows for international transit and
                customs.
              </p>
              <Separator />
              <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                <li>
                  The 7‑day period starts from the confirmed delivery date in
                  your tracking.
                </li>
                <li>
                  Return shipping costs and customs fees may apply depending on
                  your country.
                </li>
                <li>
                  Items must arrive back to us in original, re‑sellable
                  condition.
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-3 text-sm text-muted-foreground">
          <h2 className="text-base font-semibold text-foreground">
            How to request a return
          </h2>
          <p>
            To start a return, contact our support team with your order number
            and the item(s) you wish to return. We’ll guide you through the
            steps and share the closest drop‑off or pickup option available for
            your area.
          </p>
        </section>
      </div>
    </main>
  );
}
