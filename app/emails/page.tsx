import OrderConfirmedEmail from "@/components/emails/OrderConfirmed";
import OrderDeliveredEmail from "@/components/emails/OrderDelivered";
import OrderShippedEmail from "@/components/emails/OrderShipped";
import RewardUnlockedEmail from "@/components/emails/RewardUnlocked";
import BirthdayEmail from "@/components/emails/BirthdayEmail";

export default function EmailsPreviewPage() {
  return (
    <main className="min-h-screen bg-neutral-100 px-4 py-12">
      <div className="mx-auto w-full max-w-5xl space-y-16">
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-neutral-900">Order Confirmed</h2>
          <OrderConfirmedEmail ctaUrl="https://oiko.example/orders/123" orderPoints={30} />
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-neutral-900">Order Shipped</h2>
          <OrderShippedEmail
            ctaUrl="https://oiko.example/track/123"
            trackingNumber="WX-394102"
            estimatedDelivery="Aug 14, 2026"
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-neutral-900">Order Delivered</h2>
          <OrderDeliveredEmail ctaUrl="https://oiko.example/rewards" />
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-neutral-900">Reward Unlocked</h2>
          <div className="space-y-10">
            <RewardUnlockedEmail ctaUrl="https://oiko.example/rewards" currentPoints={30} />
            <RewardUnlockedEmail
              ctaUrl="https://oiko.example/rewards"
              currentPoints={70}
              discountPercent={20}
            />
            <RewardUnlockedEmail ctaUrl="https://oiko.example/rewards" currentPoints={100} />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-neutral-900">Birthday Email</h2>
          <BirthdayEmail customerName="Ahmad" age={26} bonusPoints={50} currentPoints={50} />
        </section>
      </div>
    </main>
  );
}
