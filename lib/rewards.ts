import type { Product } from "@/lib/products";

export const FRAGMENTS_KEY = "oiko_fragment_points";
export const LAST_ORDER_POINTS_KEY = "oiko_last_order_points";
export const MAX_PROGRESS = 100;
export const REWARD_THRESHOLDS = {
  cashback: 30,
  discount: 70,
  free: 100,
} as const;

export type RewardType = "cashback" | "discount" | "free";

const ACCESSORY_CATEGORIES = new Set(["hats", "socks", "totebags", "accessories"]);

export function getProductFragmentPoints(product: Pick<Product, "category">): number {
  const category = product.category.toLowerCase();
  if (category === "hoodies") {
    return 18;
  }
  if (category === "tshirts") {
    return 12;
  }
  if (ACCESSORY_CATEGORIES.has(category)) {
    return 3;
  }
  return 0;
}

export function getOrderFragmentPoints(
  items: { product: Pick<Product, "category">; quantity: number }[]
): number {
  return items.reduce(
    (total, item) => total + getProductFragmentPoints(item.product) * item.quantity,
    0
  );
}

export function clampProgress(points: number): number {
  return Math.min(points, MAX_PROGRESS);
}

export function getRewardTypeForProgress(points: number): RewardType | null {
  if (points >= REWARD_THRESHOLDS.free) {
    return "free";
  }
  if (points >= REWARD_THRESHOLDS.discount) {
    return "discount";
  }
  if (points >= REWARD_THRESHOLDS.cashback) {
    return "cashback";
  }
  return null;
}
