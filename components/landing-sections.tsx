"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import {
  Award,
  ChevronRight,
  Clock,
  Crown,
  Gift,
  Heart,
  Package,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap,
  Check,
} from "lucide-react";

export function SocialProofWall() {
  const placeholders = Array.from({ length: 8 }, (_, index) => index + 1);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 md:mb-16"
      >
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
          Styled by Our Community
        </h2>
        <p className="text-base md:text-lg text-muted-foreground">Real customers, real style</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-4">
        {placeholders.map((item, index) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200"
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-500 group-hover:scale-110">
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Users className="h-10 w-10 md:h-12 md:w-12 text-neutral-300" />
              </motion.div>
              <p className="text-xs text-neutral-400 mt-2 font-medium">Photo {item}</p>
              <p className="text-xs text-neutral-300">Coming Soon</p>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            {/* Username Badge */}
            <div className="absolute bottom-3 left-3 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1.5 text-xs font-bold text-black opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2">
              @customer{item}
            </div>

            {/* Border Glow */}
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/20 transition-colors duration-500" />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-10 md:mt-12 text-center"
      >
        <p className="text-sm md:text-base text-muted-foreground mb-6 font-medium">
          Share your style with <span className="font-bold text-foreground">#Oiko</span>
        </p>
        <button
          type="button"
          className="group relative rounded-full bg-foreground px-8 py-4 text-sm font-bold text-background transition-all hover:shadow-2xl hover:shadow-foreground/20 hover:scale-105"
        >
          <span className="relative z-10">Follow @oiko</span>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-foreground via-foreground/90 to-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </motion.div>
    </section>
  );
}

export function RewardsBanner() {
  const rewards = [
    { icon: TrendingUp, label: "Cashback" },
    { icon: Gift, label: "Discounts" },
    { icon: Crown, label: "Free products" }
  ];

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 p-8 md:p-12 text-white"
      >
        {/* Animated Background Orbs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Noise Texture */}
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`
          }}
        />

        <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, type: "spring" }}
              className="inline-block mb-4"
            >
              <Award className="h-10 w-10 md:h-12 md:w-12 text-white" />
            </motion.div>

            <h3 className="text-3xl md:text-5xl font-black tracking-tight mb-3 md:mb-4">
              Join Our Rewards Program
            </h3>
            <p className="text-base md:text-xl text-white/80 mb-6 max-w-xl">
              Earn 100 points with every order. Unlock cashback, discounts, and free products.
            </p>

            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              {rewards.map((reward, index) => (
                <motion.div
                  key={reward.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group flex items-center gap-2 text-sm md:text-base text-white/70 hover:text-white transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <reward.icon className="h-4 w-4" />
                  </div>
                  <span className="font-medium">{reward.label}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
            <Link
              href="/rewards"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-black transition-all hover:shadow-2xl hover:shadow-white/20 hover:scale-105"
            >
              Start Earning Now
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/rewards"
              className="inline-flex items-center justify-center rounded-full border-2 border-white/30 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white hover:bg-white/10"
            >
              Learn More
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export function LimitedDrops() {
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="overflow-hidden rounded-3xl md:rounded-[2.5rem] bg-black text-white shadow-2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Side */}
          <div className="relative aspect-square md:aspect-auto bg-neutral-800">
            <motion.div
              initial={{ scale: 1.2, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="absolute left-4 top-4 md:left-6 md:top-6 z-10"
            >
              <div className="flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs font-bold uppercase shadow-lg">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                Limited Edition
              </div>
            </motion.div>

            <div className="flex h-full flex-col items-center justify-center text-center p-8">
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Zap className="h-24 w-24 md:h-32 md:w-32 text-neutral-600" />
              </motion.div>
              <p className="text-sm text-neutral-500 mt-4 font-medium">Product Image</p>
            </div>

            {/* Decorative Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          </div>

          {/* Content Side */}
          <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="mb-4 w-fit rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-widest"
            >
              New Drop
            </motion.span>

            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4"
            >
              Winter Collection 2025
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base md:text-lg text-white/70 mb-8 leading-relaxed"
            >
              Exclusive designs dropping this Friday. Limited to 100 pieces worldwide.
            </motion.p>

            {/* Countdown Timer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 md:p-8"
            >
              <div className="flex items-center gap-2 text-sm text-white/60 mb-4">
                <Clock className="h-4 w-4 text-white/50" />
                Drops in
              </div>
              <div className="flex items-center gap-4 text-center">
                {Object.entries(timeLeft).map(([unit, value], index) => (
                  <div key={unit}>
                    {index > 0 && <div className="text-2xl md:text-3xl font-bold text-white/30 mx-2">:</div>}
                    <div className="flex-1">
                      <motion.div
                        key={value}
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-3xl md:text-4xl font-black tabular-nums"
                      >
                        {value.toString().padStart(2, '0')}
                      </motion.div>
                      <div className="text-xs text-white/60 mt-1 capitalize">{unit}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex gap-3"
            >
              <Link
                href="/contact"
                className="group flex-1 rounded-full bg-white px-6 py-4 text-center text-sm font-bold text-black transition-all hover:shadow-2xl hover:shadow-white/20 hover:scale-105"
              >
                Get Notified
              </Link>
              <button
                type="button"
                className="group flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/30 transition-all hover:border-white hover:bg-white/10 hover:scale-110"
                aria-label="Save drop"
              >
                <Heart className="h-5 w-5 transition-transform group-hover:scale-110" />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-4 flex items-center gap-2 text-xs text-white/50"
            >
              <Package className="h-4 w-4 text-white/40" />
              <span className="font-medium">Join 2,847 people waiting for this drop</span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export function ReviewsCarousel() {
  const reviews = [
    {
      name: "Sarah M.",
      rating: 5,
      text: "The quality is incredible! The hoodie fits perfectly and the material is so soft. Worth every riyal.",
      product: "Classic Hoodie",
    },
    {
      name: "Ahmed K.",
      rating: 5,
      text: "Best streetwear brand in Riyadh. The customization options are amazing and delivery was super fast.",
      product: "Custom Tee",
    },
    {
      name: "Layla A.",
      rating: 5,
      text: "I've ordered 3 times now and every piece exceeds my expectations. The attention to detail is unmatched.",
      product: "Accessories Pack",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-neutral-50 to-white py-16 md:py-24">
      <div className="mx-auto w-full max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
            What Our Customers Say
          </h2>
          <div className="flex items-center justify-center gap-2 mb-3">
            {[...Array(5)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Star className="h-6 w-6 md:h-7 md:w-7 text-yellow-400 fill-yellow-400" />
              </motion.div>
            ))}
            <span className="text-lg md:text-xl font-black text-black ml-2">4.9/5</span>
          </div>
          <p className="text-sm md:text-base text-muted-foreground">Based on 1,234 verified reviews</p>
        </motion.div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:gap-8 md:grid-cols-3">
          {reviews.map((review, index) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative rounded-2xl bg-white p-6 md:p-8 shadow-md hover:shadow-2xl transition-all duration-300 border border-neutral-100"
            >
              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-neutral-100 to-transparent rounded-bl-full opacity-50" />

              <div className="relative z-10">
                <div className="mb-4 flex items-center gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="mb-6 text-sm md:text-base leading-relaxed text-gray-700">
                  &quot;{review.text}&quot;
                </p>
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <div>
                    <p className="text-sm font-bold text-black">{review.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{review.product}</p>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-neutral-100 to-neutral-200 text-base font-black text-black shadow-sm"
                  >
                    {review.name.charAt(0)}
                  </motion.div>
                </div>
              </div>

              {/* Verified Badge */}
              <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-green-50 border border-green-200 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Check className="h-3 w-3 text-green-600" />
                <span className="text-[10px] font-bold text-green-700 uppercase">Verified</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 md:mt-12 text-center"
        >
          <button
            type="button"
            className="group rounded-full border-2 border-black px-8 py-4 text-sm font-bold text-black transition-all hover:bg-black hover:text-white hover:shadow-xl hover:scale-105"
          >
            Read All Reviews
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export function StyleQuiz() {
  const questions = [
    {
      question: "What's your style vibe?",
      options: ["Minimal & Clean", "Bold & Graphic", "Streetwear", "Vintage"],
    },
    {
      question: "Favorite colors?",
      options: ["Black & White", "Earth Tones", "Bright Colors", "Pastels"],
    },
    {
      question: "Perfect fit?",
      options: ["Oversized", "Fitted", "Relaxed", "Baggy"],
    },
  ];

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const isComplete = step >= questions.length;

  const handleAnswer = (option: string) => {
    setAnswers([...answers, option]);
    setStep((current) => current + 1);
  };

  const reset = () => {
    setStep(0);
    setAnswers([]);
  };

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl border-2 border-black bg-white p-8 md:p-12 lg:p-16 shadow-2xl"
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-neutral-100 to-transparent rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-neutral-100 to-transparent rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <div className="text-center mb-10 md:mb-12">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, type: "spring" }}
              className="inline-block"
            >
              <Sparkles className="h-14 w-14 md:h-16 md:w-16 text-neutral-700 mx-auto mb-6" />
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
              Find Your Perfect Style
            </h2>
            <p className="text-sm md:text-base text-neutral-600">
              Answer 3 quick questions to get personalized recommendations
            </p>
          </div>

          {!isComplete ? (
            <div>
              {/* Progress Bar */}
              <div className="mb-8 flex gap-2">
                {questions.map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: index <= step ? 1 : 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="h-2 flex-1 rounded-full bg-black origin-left"
                    style={{
                      backgroundColor: index <= step ? 'black' : '#e5e5e5'
                    }}
                  />
                ))}
              </div>

              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <p className="text-sm text-gray-500 mb-3 font-medium">
                  Question {step + 1} of {questions.length}
                </p>
                <h3 className="text-2xl md:text-3xl font-black text-black mb-8">
                  {questions[step].question}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {questions[step].options.map((option, index) => (
                    <motion.button
                      key={option}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => handleAnswer(option)}
                      className="group relative rounded-2xl border-2 border-gray-200 p-6 text-left text-sm md:text-base font-bold text-black transition-all hover:border-black hover:shadow-lg"
                    >
                      <span className="relative z-10">{option}</span>
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neutral-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: "spring", delay: 0.2 }}
                className="mx-auto mb-6 flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-green-200 shadow-lg"
              >
                <Award className="h-10 w-10 md:h-12 md:w-12 text-green-700" />
              </motion.div>
              <h3 className="text-3xl md:text-4xl font-black text-black mb-4">
                Your Style Profile is Ready!
              </h3>
              <p className="text-base md:text-lg text-neutral-600 mb-8">
                We found <span className="font-bold text-black">12 products</span> perfect for you
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  className="flex-1 rounded-full bg-black px-8 py-4 text-sm font-bold text-white transition-all hover:shadow-2xl hover:shadow-black/20 hover:scale-105"
                >
                  View Recommendations
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="flex-1 rounded-full border-2 border-black px-8 py-4 text-sm font-bold text-black transition-all hover:bg-neutral-50 hover:scale-105"
                >
                  Retake Quiz
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
