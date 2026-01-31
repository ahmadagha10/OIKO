'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Sparkles } from 'lucide-react';

export function PhoneHeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white py-16 md:py-24 lg:py-32">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full bg-black/5 backdrop-blur-sm border border-black/10 px-4 py-2 text-sm font-medium text-gray-900 mb-6"
            >
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span>Shop on the go with our mobile experience</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 mb-6"
            >
              Sustainable Fashion
              <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                At Your Fingertips
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl"
            >
              Browse our curated collection, customize your designs, and earn rewards—all from your phone. Experience seamless shopping with Oiko.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/products"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-black px-8 py-4 text-sm font-bold text-white transition-all hover:shadow-2xl hover:shadow-black/20 hover:scale-105"
              >
                Shop Now
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/customize"
                className="inline-flex items-center justify-center rounded-full border-2 border-black px-8 py-4 text-sm font-semibold text-black transition-all hover:bg-black hover:text-white"
              >
                Customize Your Design
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-12 grid grid-cols-3 gap-8"
            >
              <div>
                <p className="text-3xl font-black text-gray-900">100+</p>
                <p className="text-sm text-gray-600">Products</p>
              </div>
              <div>
                <p className="text-3xl font-black text-gray-900">5K+</p>
                <p className="text-sm text-gray-600">Happy Customers</p>
              </div>
              <div>
                <p className="text-3xl font-black text-gray-900">4.9★</p>
                <p className="text-sm text-gray-600">Rating</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {/* Floating Elements */}
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative z-10"
            >
              <Image
                src="/oiko-phone-mockup-optimized.png"
                alt="Oiko Mobile App Mockup"
                width={1080}
                height={1920}
                className="w-full h-auto max-w-md mx-auto drop-shadow-2xl"
                priority
              />
            </motion.div>

            {/* Decorative Circles */}
            <div className="absolute top-1/4 -left-12 w-24 h-24 bg-purple-400/30 rounded-full blur-2xl animate-pulse" />
            <div className="absolute bottom-1/4 -right-12 w-32 h-32 bg-blue-400/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />

            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 via-transparent to-blue-500/10 blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
