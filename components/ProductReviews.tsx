"use client";

import { useState } from "react";
import { Star, ThumbsUp, Info } from "lucide-react";

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  verified: boolean;
  helpful: number;
  size?: string;
  fit?: "Small" | "True to Size" | "Large";
}

// Mock data - to be replaced with real reviews from database
const mockReviews: Review[] = [
  {
    id: "1",
    author: "Ahmad K.",
    rating: 5,
    date: "2026-01-15",
    title: "Perfect quality!",
    content: "The fabric quality is amazing and the fit is just right. Highly recommend!",
    verified: true,
    helpful: 12,
    size: "M",
    fit: "True to Size"
  },
  {
    id: "2",
    author: "Sara M.",
    rating: 4,
    date: "2026-01-10",
    title: "Great hoodie, runs a bit large",
    content: "Love the design and material. Just note it runs slightly larger than expected.",
    verified: true,
    helpful: 8,
    size: "L",
    fit: "Large"
  },
  {
    id: "3",
    author: "Mohammed A.",
    rating: 5,
    date: "2026-01-05",
    title: "Exceeded expectations",
    content: "Fast delivery and excellent quality. The Try Before You Buy service helped me get the perfect size.",
    verified: true,
    helpful: 15,
    size: "XL",
    fit: "True to Size"
  }
];

function StarRating({ rating, size = "small" }: { rating: number; size?: "small" | "large" }) {
  const starSize = size === "large" ? "h-6 w-6" : "h-4 w-4";

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${starSize} ${
            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-neutral-300"
          }`}
        />
      ))}
    </div>
  );
}

export default function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [sortBy, setSortBy] = useState<"recent" | "helpful" | "rating">("recent");

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  // Calculate rating distribution
  const ratingCounts = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 : 0
  }));

  return (
    <div className="py-12">
      {/* Under Development Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-900 text-sm mb-1">Review System Under Development</p>
            <p className="text-xs text-blue-700">
              We're building a comprehensive review system. The reviews shown below are placeholders for development purposes.
            </p>
          </div>
        </div>
      </div>

      {/* Reviews Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Customer Reviews</h2>
          <div className="flex items-center gap-3">
            <StarRating rating={Math.round(averageRating)} size="large" />
            <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
            <span className="text-neutral-600">({reviews.length} reviews)</span>
          </div>
        </div>

        <button
          disabled
          className="inline-flex items-center justify-center px-6 py-3 bg-neutral-900 text-white rounded-lg font-semibold hover:bg-neutral-800 transition opacity-50 cursor-not-allowed"
        >
          Write a Review (Coming Soon)
        </button>
      </div>

      {/* Rating Distribution */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="space-y-2">
          {ratingCounts.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center gap-3">
              <span className="text-sm font-medium w-12">{rating} stars</span>
              <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-neutral-600 w-8">{count}</span>
            </div>
          ))}
        </div>

        {/* Fit Information */}
        <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
          <h3 className="font-semibold mb-4">How does it fit?</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Runs Small</span>
              <span className="font-semibold">True to Size</span>
              <span>Runs Large</span>
            </div>
            <div className="relative h-2 bg-neutral-200 rounded-full">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-neutral-900 rounded-full" />
            </div>
            <p className="text-xs text-neutral-600 mt-2">
              Based on {reviews.length} reviews
            </p>
          </div>
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-sm font-medium">Sort by:</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400"
        >
          <option value="recent">Most Recent</option>
          <option value="helpful">Most Helpful</option>
          <option value="rating">Highest Rating</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border border-neutral-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-semibold">{review.author}</span>
                  {review.verified && (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                      Verified Purchase
                    </span>
                  )}
                </div>
                <StarRating rating={review.rating} />
              </div>
              <span className="text-sm text-neutral-500">{review.date}</span>
            </div>

            <h4 className="font-semibold mb-2">{review.title}</h4>
            <p className="text-neutral-700 mb-4">{review.content}</p>

            {/* Review Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600 mb-4">
              {review.size && <span>Size: {review.size}</span>}
              {review.fit && (
                <span className="bg-neutral-100 px-2 py-1 rounded">
                  Fit: {review.fit}
                </span>
              )}
            </div>

            {/* Helpful Button */}
            <button className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition">
              <ThumbsUp className="h-4 w-4" />
              <span>Helpful ({review.helpful})</span>
            </button>
          </div>
        ))}
      </div>

      {/* Load More (placeholder) */}
      <div className="text-center mt-8">
        <button
          disabled
          className="px-6 py-3 border border-neutral-300 rounded-lg font-semibold hover:bg-neutral-50 transition opacity-50 cursor-not-allowed"
        >
          Load More Reviews (Coming Soon)
        </button>
      </div>
    </div>
  );
}
