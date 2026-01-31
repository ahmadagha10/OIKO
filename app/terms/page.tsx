import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions - Oiko",
  description: "Read Oiko's terms and conditions for using our website and purchasing our products",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 border-b border-neutral-200 pb-6">
          <h1 className="text-4xl font-bold text-black mb-2">Terms & Conditions</h1>
          <p className="text-sm text-neutral-500">Last updated: January 20, 2026</p>
        </div>

        <div className="prose prose-neutral max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-black mb-4">Agreement to Terms</h2>
            <p className="text-neutral-700 leading-relaxed mb-4">
              By accessing and using Oiko's website and services, you accept and agree to be bound by the
              terms and provision of this agreement. If you do not agree to abide by the above, please do
              not use this service.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-black mb-4">Use of the Website</h2>
            <p className="text-neutral-700 leading-relaxed mb-4">
              You may use our website for lawful purposes only. You agree not to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
              <li>Use the website in any way that breaches any applicable local, national or international law</li>
              <li>Use the website in any way that is unlawful or fraudulent</li>
              <li>Attempt to gain unauthorized access to our website, server, or database</li>
              <li>Attack our website via a denial-of-service attack or distributed denial-of-service attack</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-black mb-4">Products and Orders</h2>
            <h3 className="text-xl font-semibold text-black mb-3 mt-6">Product Information</h3>
            <p className="text-neutral-700 leading-relaxed mb-4">
              We make every effort to display as accurately as possible the colors and images of our products.
              However, we cannot guarantee that your device's display will accurately reflect the actual color
              of the product.
            </p>

            <h3 className="text-xl font-semibold text-black mb-3 mt-6">Pricing</h3>
            <p className="text-neutral-700 leading-relaxed mb-4">
              All prices are in Saudi Riyals (SAR) and include applicable taxes unless otherwise stated.
              We reserve the right to change prices at any time without prior notice.
            </p>

            <h3 className="text-xl font-semibold text-black mb-3 mt-6">Order Acceptance</h3>
            <p className="text-neutral-700 leading-relaxed mb-4">
              Your order constitutes an offer to us to buy a product. All orders are subject to acceptance
              by us, and we will confirm such acceptance by sending you an order confirmation email. The
              contract between us will only be formed when we send you the order confirmation email.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-black mb-4">Try Before You Buy Program</h2>
            <p className="text-neutral-700 leading-relaxed mb-4">
              Our Try Before You Buy program is subject to the following terms:
            </p>
            <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
              <li><strong>Eligibility:</strong> Available only to customers with a Riyadh delivery address</li>
              <li><strong>Trial Period:</strong> 24 hours from the time of pickup/delivery</li>
              <li><strong>Product Condition:</strong> Trial pieces must be returned in original, unworn condition with all tags attached</li>
              <li><strong>Damage Policy:</strong> Any damage, stains, odors, or removal of tags will result in automatic purchase at full retail price</li>
              <li><strong>Late Returns:</strong> Pieces not returned within 24 hours will be charged at full price</li>
              <li><strong>Limit:</strong> One trial piece per customer at a time</li>
              <li><strong>Product Types:</strong> Only t-shirts and hoodies are eligible for trial</li>
            </ul>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-amber-900">
                <strong>Important:</strong> By requesting a trial piece, you authorize Oiko to charge your
                payment method on file the full retail price if the product is damaged, not returned, or
                returned late.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-black mb-4">Shipping and Delivery</h2>
            <p className="text-neutral-700 leading-relaxed mb-4">
              We offer shipping throughout Saudi Arabia with the following terms:
            </p>
            <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
              <li>Standard shipping: SAR 25 per order</li>
              <li>Estimated delivery: 1-2 business days within Riyadh, 2-5 days for other regions</li>
              <li>Orders placed before 2 PM are typically processed the same day</li>
              <li>Delivery times are estimates and not guaranteed</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-black mb-4">Returns and Refunds</h2>
            <p className="text-neutral-700 leading-relaxed mb-4">
              You may return most new, unopened items within 14 days of delivery for a full refund.
              Please refer to our Returns page for complete details and conditions.
            </p>
            <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
              <li>Items must be unworn, unwashed, and in original condition with tags attached</li>
              <li>Custom-designed items are not eligible for return</li>
              <li>Return shipping costs are the responsibility of the customer unless the item is defective</li>
              <li>Refunds are processed within 5-7 business days of receiving the returned item</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-black mb-4">Rewards Program</h2>
            <p className="text-neutral-700 leading-relaxed mb-4">
              Our rewards program allows you to earn fragment points with each purchase:
            </p>
            <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
              <li>Points are non-transferable and have no cash value</li>
              <li>Points expire after 12 months of account inactivity</li>
              <li>We reserve the right to modify or discontinue the rewards program at any time</li>
              <li>Fraudulent activity will result in forfeiture of all points and account termination</li>
              <li>Reward redemptions are final and cannot be reversed</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-black mb-4">Intellectual Property</h2>
            <p className="text-neutral-700 leading-relaxed mb-4">
              All content on this website, including but not limited to text, graphics, logos, images, and
              software, is the property of Oiko and protected by copyright and other intellectual property laws.
              You may not reproduce, distribute, or create derivative works without our express written permission.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-black mb-4">Custom Design Service</h2>
            <p className="text-neutral-700 leading-relaxed mb-4">
              When using our custom design tool:
            </p>
            <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
              <li>You retain ownership of your original designs</li>
              <li>You grant us a license to produce the custom item for you</li>
              <li>You must have rights to any images, logos, or text you upload</li>
              <li>We reserve the right to refuse designs that infringe on intellectual property or are offensive</li>
              <li>Custom items are final sale and cannot be returned unless defective</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-black mb-4">Limitation of Liability</h2>
            <p className="text-neutral-700 leading-relaxed mb-4">
              To the fullest extent permitted by law, Oiko shall not be liable for any indirect, incidental,
              special, consequential or punitive damages, or any loss of profits or revenues, whether incurred
              directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-black mb-4">Governing Law</h2>
            <p className="text-neutral-700 leading-relaxed">
              These terms and conditions are governed by and construed in accordance with the laws of the
              Kingdom of Saudi Arabia. Any disputes relating to these terms and conditions will be subject
              to the exclusive jurisdiction of the courts of Saudi Arabia.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-black mb-4">Contact Information</h2>
            <p className="text-neutral-700 leading-relaxed mb-4">
              If you have any questions about these Terms & Conditions, please contact us:
            </p>
            <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
              <p className="text-neutral-700 mb-2"><strong>Email:</strong> support@oiko.com</p>
              <p className="text-neutral-700 mb-2"><strong>Address:</strong> Riyadh, Saudi Arabia</p>
              <p className="text-neutral-700"><strong>Phone:</strong> +966 50 000 0000</p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-black mb-4">Changes to Terms</h2>
            <p className="text-neutral-700 leading-relaxed">
              We reserve the right to modify these terms at any time. We will notify you of any changes by
              posting the new terms on this page and updating the "Last updated" date. Your continued use
              of the website after any changes constitutes acceptance of the new terms.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
