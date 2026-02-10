import Stripe from 'stripe';

// Lazy initialization of Stripe to avoid build-time errors
let stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeInstance) {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not set');
    }
    stripeInstance = new Stripe(apiKey, {
      apiVersion: '2026-01-28.clover',
      typescript: true,
    });
  }
  return stripeInstance;
}

// Export a Proxy that lazily initializes Stripe
const stripe = new Proxy({} as Stripe, {
  get: (_, prop) => {
    const instance = getStripe();
    const value = (instance as any)[prop];
    return typeof value === 'function' ? value.bind(instance) : value;
  },
});

export default stripe;

// Payment amount must be in cents/smallest currency unit
export function convertToStripeAmount(amount: number): number {
  return Math.round(amount * 100);
}

export function convertFromStripeAmount(amount: number): number {
  return amount / 100;
}
