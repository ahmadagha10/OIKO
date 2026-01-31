"use client";

import Image from "next/image";
import Link from "next/link";
import { Truck, Hand, Palette, Paintbrush, Package, Clock, MapPin, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  LimitedDrops,
  RewardsBanner,
  ReviewsCarousel,
  SocialProofWall,
  StyleQuiz,
} from "@/components/landing-sections";

export default function HomePage() {
  const collections = [
    {
      category: "Hoodies",
      title: "Ultimate Comfort",
      src: "/images/collections/hoodies.png",
      link: "/products?category=hoodies",
      gridClass: "col-span-full md:col-span-7 md:row-span-2",
    },
    {
      category: "T-Shirts",
      title: "Everyday Essential",
      src: "/images/collections/T-shirts.png",
      link: "/products?category=tshirts",
      gridClass: "col-span-full md:col-span-5",
    },
    {
      category: "Accessories",
      title: "Final Touch",
      src: "/images/collections/mainaccessories.png",
      link: "/products?category=accessories",
      gridClass: "col-span-full md:col-span-5",
    },
  ];

  return (
    <>
      <main className="overflow-hidden">
        {/* Hero Section - Enhanced */}
        <section className="relative w-full min-h-[80vh] md:min-h-screen flex flex-col justify-center items-center overflow-hidden">
          {/* Background Image with Parallax Effect */}
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0"
          >
            {/* Mobile Image */}
            <Image
              src="/hero-mobile-final.jpeg"
              alt=""
              fill
              className="md:hidden object-cover object-center select-none pointer-events-none"
              priority
            />
            {/* Desktop Image */}
            <Image
              src="/hero-desktop-final.jpeg"
              alt=""
              fill
              className="hidden md:block object-cover object-center select-none pointer-events-none"
              priority
            />
          </motion.div>

          {/* Noise Texture Overlay */}
          <div className="absolute inset-0 bg-black/30 z-0" />
          <div
            className="absolute inset-0 opacity-[0.03] mix-blend-overlay z-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`
            }}
          />

          {/* Explore Collections Button at Bottom */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-10"
          >
            <Button
              asChild
              size="lg"
              className="bg-white text-black hover:bg-white/90 font-bold text-base px-8 py-6 rounded-full group shadow-2xl"
            >
              <Link href="/products" className="flex items-center gap-2">
                Explore Collections
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </section>

        {/* Collections Section - Bento Grid */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
              EXPLORE OUR COLLECTIONS
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Curated pieces designed for the modern streetwear enthusiast
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 auto-rows-[280px] md:auto-rows-[320px]">
            {collections.map((collection, index) => (
              <motion.div
                key={collection.category}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={collection.gridClass}
              >
                <Link href={collection.link} className="group relative block h-full overflow-hidden rounded-3xl bg-neutral-100">
                  {/* Image with Hover Effect */}
                  <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                    <Image
                      src={collection.src}
                      alt={collection.category}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                  {/* Content */}
                  <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                    <motion.div
                      initial={{ x: 0 }}
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="inline-block px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-3">
                        <span className="text-white text-xs font-medium tracking-wider uppercase">
                          {collection.category}
                        </span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
                        {collection.title}
                      </h3>
                      <div className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors">
                        <span className="text-sm font-medium">Shop Now</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Hover Border Effect */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-3xl transition-colors duration-500" />
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Existing Sections */}
        <LimitedDrops />
        <SocialProofWall />
        <RewardsBanner />
        <ReviewsCarousel />
        <StyleQuiz />

        {/* Try Before You Buy - Enhanced */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="relative bg-neutral-900 rounded-3xl md:rounded-[2.5rem] p-8 md:p-16 text-white overflow-hidden"
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="max-w-4xl mx-auto relative z-10">
              <div className="text-center mb-12 md:mb-16">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 mb-6"
                >
                  <Package className="h-8 w-8 md:h-10 md:w-10 text-white" />
                </motion.div>
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4">
                  Try Before You Buy
                </h2>
                <p className="text-base md:text-xl text-white/70 max-w-2xl mx-auto">
                  Not sure about your size or style? Get a free trial piece delivered to your door in Riyadh
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
                {[
                  { icon: Package, title: "Request a Trial", desc: "Choose any t-shirt or hoodie to try at home" },
                  { icon: Clock, title: "24-Hour Trial", desc: "Test the fit and quality for one full day" },
                  { icon: MapPin, title: "Riyadh Only", desc: "Currently available for Riyadh residents" }
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
                        <item.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-bold text-lg pt-2">{item.title}</h3>
                    </div>
                    <p className="text-sm md:text-base text-white/60 leading-relaxed">
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="text-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-black hover:bg-white/90 font-bold px-8 py-6 rounded-full group"
                >
                  <Link href="/account" className="flex items-center gap-2">
                    Request Trial Piece
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <p className="text-xs md:text-sm text-white/50 mt-4">
                  No commitment required • Return in original condition
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* USP Section - Enhanced */}
        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 max-w-6xl mx-auto">
            {[
              {
                icon: Truck,
                decorIcon: Hand,
                label: "Order today",
                value: "Receive tomorrow",
                animation: { rotate: [0, -15, 0, 15, 0] }
              },
              {
                icon: Palette,
                decorIcon: Paintbrush,
                label: "Your vision",
                value: "Design your own",
                animation: { x: [0, 8, 0, -8, 0], y: [0, -4, 0, -4, 0], rotate: [0, 10, 0, -10, 0] }
              },
              {
                icon: Package,
                decorIcon: null,
                label: "Before it becomes yours",
                value: "Available on selected pieces, where clarity matters.",
                animation: null
              }
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="flex flex-col items-center text-center gap-4 group"
              >
                <div className="relative flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <item.icon className="h-12 w-12 md:h-14 md:w-14 text-foreground" />
                  </motion.div>
                  {item.decorIcon && (
                    <motion.div
                      animate={item.animation}
                      transition={{
                        duration: item.label === "Order today" ? 1.5 : 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute -top-3 -right-2 origin-bottom-left"
                    >
                      <item.decorIcon className="h-6 w-6 text-foreground fill-foreground" />
                    </motion.div>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-xs md:text-sm font-medium tracking-[0.2em] uppercase text-muted-foreground">
                    {item.label}
                  </p>
                  <p className={`${index < 2 ? 'text-lg md:text-xl font-bold italic' : 'text-xs md:text-sm text-muted-foreground/80'} leading-relaxed`}>
                    {item.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

