"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LAST_ORDER_POINTS_KEY } from "@/lib/rewards";

export default function OrderConfirmationPage() {
  const [orderPoints, setOrderPoints] = useState(0);

  useEffect(() => {
    const storedPoints = Number(sessionStorage.getItem(LAST_ORDER_POINTS_KEY) || "0");
    setOrderPoints(Number.isNaN(storedPoints) ? 0 : storedPoints);
  }, []);

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-2xl space-y-8 text-foreground">
        <section className="space-y-2">
          <h1 className="text-3xl font-semibold">Order confirmed</h1>
          <p className="text-base text-foreground/80">We&apos;re preparing your piece now.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">Rewards Journey</h2>
          <p className="text-base text-foreground/80">
            This order moves you forward. Some steps unlock rewards.
          </p>
          <p className="text-base text-foreground/80">
            This order added +{orderPoints} fragments to your journey.
          </p>
          <p className="text-sm text-muted-foreground/70">
            Track your journey anytime in your account.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">What happens next</h2>
          <ul className="space-y-1 text-sm text-foreground/80">
            <li>You&apos;ll receive a shipping email soon.</li>
            <li>Delivery details will be included.</li>
            <li>No action required right now.</li>
          </ul>
        </section>

        <Button variant="outline" asChild>
          <Link href="/products">Back to shop</Link>
        </Button>
      </div>
    </main>
  );
}
