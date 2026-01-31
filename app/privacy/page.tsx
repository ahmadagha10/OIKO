import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Oiko",
  description: "Learn how Oiko collects, uses, and protects your personal information",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 border-b border-neutral-200 pb-6">
          <h1 className="text-4xl font-bold text-black mb-2">Privacy Policy</h1>
          <p className="text-sm text-neutral-500">Last updated: January 20, 2026</p>
        </div>

        <div className="prose prose-neutral max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-black mb-4">Introduction</h2>
            <p className="text-neutral-700 leading-relaxed mb-4">
              Welcome to Oiko. We respect your privacy and are committed to protecting your personal data.
              This privacy policy will inform you about how we look after your personal data when you visit
              our website and tell you about your privacy rights and how the law protects you.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-black mb-4">Information We Collect</h2>
            <p className="text-neutral-700 leading-relaxed mb-4">
              We may collect, use, store and transfer different kinds of personal data about you:
            </p>
            <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
              <li><strong>Identity Data:</strong> Name, username or similar identifier</li>
              <li><strong>Contact Data:</strong> Email address, telephone number, billing and delivery addresses</li>
              <li><strong>Transaction Data:</strong> Details about payments and products you have purchased from us</li>
              <li><strong>Technical Data:</strong> IP address, browser type and version, device information</li>
              <li><strong>Profile Data:</strong> Your preferences, feedback, and survey responses</li>
              <li><strong>Usage Data:</strong> Information about how you use our website and products</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-black mb-4">How We Use Your Information</h2>
            <p className="text-neutral-700 leading-relaxed mb-4">
              We will only use your personal data when the law allows us to. Most commonly, we will use your
              personal data in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
              <li>To process and deliver your orders including managing payments and collecting money owed</li>
              <li>To manage our relationship with you including notifying you about changes to our terms or privacy policy</li>
              <li>To enable you to participate in our rewards program and promotions</li>
              <li>To deliver relevant website content and advertisements to you</li>
              <li>To use data analytics to improve our website, products, marketing, customer relationships and experiences</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-black mb-4">Try Before You Buy Program</h2>
            <p className="text-neutral-700 leading-relaxed mb-4">
              When you participate in our Try Before You Buy program, we collect:
            </p>
            <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
              <li>Your delivery address and contact information</li>
              <li>Product preferences and sizing information</li>
              <li>Trial agreement acceptance data</li>
              <li>Return condition documentation</li>
            </ul>
            <p className="text-neutral-700 leading-relaxed mt-4">
              This information is used solely to facilitate the trial program and ensure compliance with
              program terms.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-black mb-4">Data Security</h2>
            <p className="text-neutral-700 leading-relaxed mb-4">
              We have put in place appropriate security measures to prevent your personal data from being
              accidentally lost, used or accessed in an unauthorized way, altered or disclosed. We limit
              access to your personal data to those employees, agents, contractors and other third parties
              who have a business need to know.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-black mb-4">Your Legal Rights</h2>
            <p className="text-neutral-700 leading-relaxed mb-4">
              Under certain circumstances, you have rights under data protection laws in relation to your personal data:
            </p>
            <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
              <li>Request access to your personal data</li>
              <li>Request correction of your personal data</li>
              <li>Request erasure of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Request restriction of processing your personal data</li>
              <li>Request transfer of your personal data</li>
              <li>Right to withdraw consent</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-black mb-4">Cookies</h2>
            <p className="text-neutral-700 leading-relaxed mb-4">
              Our website uses cookies to distinguish you from other users. This helps us to provide you
              with a good experience when you browse our website and also allows us to improve our site.
              Cookies are stored locally on your device and include:
            </p>
            <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
              <li>Shopping cart data</li>
              <li>Wishlist preferences</li>
              <li>Reward points and fragment tracking</li>
              <li>User preferences and settings</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-black mb-4">Third-Party Links</h2>
            <p className="text-neutral-700 leading-relaxed mb-4">
              This website may include links to third-party websites, plug-ins and applications (such as
              Instagram and WhatsApp). Clicking on those links or enabling those connections may allow
              third parties to collect or share data about you. We do not control these third-party websites
              and are not responsible for their privacy statements.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-black mb-4">Contact Us</h2>
            <p className="text-neutral-700 leading-relaxed mb-4">
              If you have any questions about this privacy policy or our privacy practices, please contact us:
            </p>
            <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
              <p className="text-neutral-700 mb-2"><strong>Email:</strong> privacy@oiko.com</p>
              <p className="text-neutral-700 mb-2"><strong>Address:</strong> Riyadh, Saudi Arabia</p>
              <p className="text-neutral-700"><strong>Phone:</strong> +966 50 000 0000</p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-black mb-4">Changes to This Policy</h2>
            <p className="text-neutral-700 leading-relaxed">
              We may update this privacy policy from time to time. We will notify you of any changes by
              posting the new privacy policy on this page and updating the "Last updated" date at the top
              of this policy.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
