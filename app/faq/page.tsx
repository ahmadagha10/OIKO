"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Metadata } from "next";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  // Orders & Shipping
  {
    category: "Orders & Shipping",
    question: "How long does shipping take?",
    answer: "We offer fast delivery across Saudi Arabia. Orders within Riyadh are typically delivered within 1-2 business days. For other regions, delivery takes 2-5 business days. Orders placed before 2 PM are usually processed the same day."
  },
  {
    category: "Orders & Shipping",
    question: "What are the shipping costs?",
    answer: "Standard shipping is SAR 25 for all orders across Saudi Arabia. We currently do not offer free shipping, but keep an eye out for special promotions!"
  },
  {
    category: "Orders & Shipping",
    question: "Can I track my order?",
    answer: "Yes! Once your order ships, you'll receive a tracking number via email. You can also view your order status in your account dashboard under 'Order History'."
  },
  {
    category: "Orders & Shipping",
    question: "Do you ship internationally?",
    answer: "Currently, we only ship within Saudi Arabia. We're working on expanding internationally soon. Sign up for our newsletter to be notified when we launch international shipping."
  },

  // Try Before You Buy
  {
    category: "Try Before You Buy",
    question: "What is the Try Before You Buy program?",
    answer: "Our Try Before You Buy program allows you to test t-shirts or hoodies for 24 hours before making a purchase. Request a trial piece, try it at home, and return it if it's not perfect for you. This service is currently available only in Riyadh."
  },
  {
    category: "Try Before You Buy",
    question: "How do I request a trial piece?",
    answer: "Go to your account dashboard and click on the 'Try Before You Buy' section. Select your product type and size, agree to the terms, and submit your request. We'll contact you within 24 hours to arrange delivery."
  },
  {
    category: "Try Before You Buy",
    question: "What happens if I damage the trial piece?",
    answer: "Trial pieces must be returned in original condition with all tags attached. If the item is damaged, stained, or tags are removed, you will be automatically charged the full retail price of the product."
  },
  {
    category: "Try Before You Buy",
    question: "Can I keep the trial piece?",
    answer: "If you love the trial piece and want to keep it, simply don't return it within the 24-hour period. We'll automatically process the purchase and charge your payment method on file."
  },

  // Returns & Refunds
  {
    category: "Returns & Refunds",
    question: "What is your return policy?",
    answer: "You can return most items within 14 days of delivery for a full refund. Items must be unworn, unwashed, and in original condition with tags attached. Custom-designed items are not eligible for return unless defective."
  },
  {
    category: "Returns & Refunds",
    question: "How do I return an item?",
    answer: "Visit our Returns page and fill out the return request form. You'll receive a return authorization and shipping instructions. Return shipping costs are the customer's responsibility unless the item is defective."
  },
  {
    category: "Returns & Refunds",
    question: "When will I receive my refund?",
    answer: "Refunds are processed within 5-7 business days of receiving your returned item. The refund will be credited to your original payment method. Please allow additional time for your bank to process the refund."
  },

  // Rewards Program
  {
    category: "Rewards Program",
    question: "How does the rewards program work?",
    answer: "Earn fragment points with every purchase! Hoodies earn 18 points, t-shirts earn 12 points, and accessories earn 3 points. Collect 100 points to unlock a free product. Your progress is tracked in your account dashboard."
  },
  {
    category: "Rewards Program",
    question: "Do my points expire?",
    answer: "Points expire after 12 months of account inactivity. Stay active by making purchases or logging into your account to keep your points valid."
  },
  {
    category: "Rewards Program",
    question: "Can I transfer my points to someone else?",
    answer: "No, points are non-transferable and tied to your account. They also have no cash value and cannot be exchanged for money."
  },
  {
    category: "Rewards Program",
    question: "What happens after I claim my reward?",
    answer: "After claiming your reward at 100 points, your points reset to 0 and you can start earning again! It's a repeating cycle, so you can earn unlimited rewards."
  },

  // Products & Sizing
  {
    category: "Products & Sizing",
    question: "How do I know what size to order?",
    answer: "We recommend checking our Size Guide page for detailed measurements. If you're between sizes, we suggest sizing up. You can also use our Try Before You Buy program (Riyadh only) to test the fit before purchasing."
  },
  {
    category: "Products & Sizing",
    question: "Can I customize my own design?",
    answer: "Yes! Use our custom design tool to create your unique piece. Upload images, add text, and choose colors. Custom items are final sale and cannot be returned unless defective."
  },
  {
    category: "Products & Sizing",
    question: "Are your products true to size?",
    answer: "Yes, our products generally run true to size. Each product page includes detailed size information. For the most accurate fit, refer to our Size Guide and measure yourself before ordering."
  },

  // Account & Payment
  {
    category: "Account & Payment",
    question: "Do I need an account to order?",
    answer: "While you can browse without an account, we recommend creating one to track orders, earn rewards points, save addresses, and access exclusive features like Try Before You Buy."
  },
  {
    category: "Account & Payment",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, Amex) and debit cards. We use secure payment processing to protect your information."
  },
  {
    category: "Account & Payment",
    question: "Is my payment information secure?",
    answer: "Absolutely. We use industry-standard encryption and secure payment processors. We never store your full credit card information on our servers."
  },

  // General
  {
    category: "General",
    question: "How can I contact customer support?",
    answer: "You can reach us via WhatsApp, Instagram DM, or email at support@oiko.com. Our business hours are listed on the Contact page. We typically respond within 24 hours."
  },
  {
    category: "General",
    question: "Can I change or cancel my order?",
    answer: "If you need to modify or cancel your order, contact us immediately. Once an order is processed and shipped, it cannot be cancelled, but you can return it according to our return policy."
  }
];

const categories = Array.from(new Set(faqs.map(faq => faq.category)));

function FAQAccordion({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-neutral-50 transition text-left"
      >
        <span className="font-semibold text-black pr-4">{question}</span>
        <ChevronDown
          className={`h-5 w-5 text-neutral-500 flex-shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200">
          <p className="text-neutral-700 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredFAQs = selectedCategory
    ? faqs.filter(faq => faq.category === selectedCategory)
    : faqs;

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 text-center border-b border-neutral-200 pb-6">
          <h1 className="text-4xl font-bold text-black mb-2">Frequently Asked Questions</h1>
          <p className="text-neutral-600">Find answers to common questions about Oiko</p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedCategory === null
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedCategory === category
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {filteredFAQs.map((faq, index) => (
            <FAQAccordion key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        {/* Still have questions? */}
        <div className="mt-12 text-center bg-neutral-50 rounded-xl p-8 border border-neutral-200">
          <h2 className="text-2xl font-bold text-black mb-2">Still have questions?</h2>
          <p className="text-neutral-600 mb-6">
            Can't find the answer you're looking for? Our customer support team is here to help.
          </p>
          <a
            href="/contact"
            className="inline-block bg-neutral-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-neutral-800 transition"
          >
            Contact Support
          </a>
        </div>
      </div>
    </main>
  );
}
