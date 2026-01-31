import { Metadata } from "next";
import { Ruler, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Size Guide - Oiko",
  description: "Find your perfect fit with Oiko's comprehensive size guide",
};

export default function SizeGuidePage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 border-b border-neutral-200 pb-6">
          <div className="flex items-center gap-3 justify-center mb-2">
            <Ruler className="h-8 w-8 text-neutral-600" />
            <h1 className="text-4xl font-bold text-black">Size Guide</h1>
          </div>
          <p className="text-neutral-600 text-center">Find your perfect fit</p>
        </div>

        {/* Coming Soon Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-10">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-900 mb-1">Size Guide Under Development</p>
              <p className="text-sm text-blue-700">
                We're working on detailed size charts for all our products. In the meantime, you can:
              </p>
              <ul className="list-disc list-inside text-sm text-blue-700 mt-2 space-y-1 ml-4">
                <li>Use our Try Before You Buy service (Riyadh only)</li>
                <li>Contact us for sizing recommendations</li>
                <li>Check product descriptions for fit notes</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Placeholder Structure - To be filled with actual measurements */}
        <div className="space-y-10">
          {/* Hoodies Section */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-neutral-900 rounded"></span>
              Hoodies
            </h2>
            <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
              <p className="text-sm text-neutral-600 mb-4">
                Measurements in centimeters (cm). All measurements are approximate.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-900 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left">Size</th>
                      <th className="px-4 py-3 text-center">Chest</th>
                      <th className="px-4 py-3 text-center">Length</th>
                      <th className="px-4 py-3 text-center">Sleeve</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {['S', 'M', 'L', 'XL'].map((size, idx) => (
                      <tr key={size} className={idx % 2 === 0 ? 'bg-neutral-50' : ''}>
                        <td className="px-4 py-3 font-semibold">{size}</td>
                        <td className="px-4 py-3 text-center text-neutral-500">TBD</td>
                        <td className="px-4 py-3 text-center text-neutral-500">TBD</td>
                        <td className="px-4 py-3 text-center text-neutral-500">TBD</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* T-Shirts Section */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-neutral-900 rounded"></span>
              T-Shirts
            </h2>
            <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
              <p className="text-sm text-neutral-600 mb-4">
                Measurements in centimeters (cm). All measurements are approximate.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-900 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left">Size</th>
                      <th className="px-4 py-3 text-center">Chest</th>
                      <th className="px-4 py-3 text-center">Length</th>
                      <th className="px-4 py-3 text-center">Sleeve</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {['S', 'M', 'L', 'XL'].map((size, idx) => (
                      <tr key={size} className={idx % 2 === 0 ? 'bg-neutral-50' : ''}>
                        <td className="px-4 py-3 font-semibold">{size}</td>
                        <td className="px-4 py-3 text-center text-neutral-500">TBD</td>
                        <td className="px-4 py-3 text-center text-neutral-500">TBD</td>
                        <td className="px-4 py-3 text-center text-neutral-500">TBD</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* How to Measure */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-neutral-900 rounded"></span>
              How to Measure
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
                <h3 className="font-semibold mb-3">Chest</h3>
                <p className="text-sm text-neutral-600">
                  Measure around the fullest part of your chest, keeping the tape horizontal.
                </p>
              </div>
              <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
                <h3 className="font-semibold mb-3">Length</h3>
                <p className="text-sm text-neutral-600">
                  Measure from the highest point of the shoulder to the hem.
                </p>
              </div>
              <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
                <h3 className="font-semibold mb-3">Sleeve</h3>
                <p className="text-sm text-neutral-600">
                  Measure from the center back neck to the end of the sleeve.
                </p>
              </div>
              <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
                <h3 className="font-semibold mb-3">Fit Tips</h3>
                <p className="text-sm text-neutral-600">
                  If you're between sizes, we recommend sizing up for a more relaxed fit.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <div className="bg-neutral-900 text-white rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-3">Still Unsure?</h3>
            <p className="text-white/80 mb-6">
              Try our Try Before You Buy service or contact us for personalized sizing help
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href="/account"
                className="inline-block bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-neutral-100 transition"
              >
                Try Before You Buy
              </a>
              <a
                href="/contact"
                className="inline-block border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
