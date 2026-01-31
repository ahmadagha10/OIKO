/**
 * Welcome Animation Configuration
 *
 * Customize the welcome screen behavior and appearance
 */

export const welcomeConfig = {
  // When to show the welcome animation
  showOnce: true, // If true, only shows once per browser session

  // Animation timing (in milliseconds)
  timing: {
    logoAppear: 500,
    brandNameAppear: 1500,
    taglineAppear: 2500,
    fadeStart: 3500,
    complete: 4200,
  },

  // Content
  content: {
    brandName: "Oiko",
    tagline: "Premium Custom Streetwear",
    logoPath: "/bar.svg",
  },

  // Visual settings
  visual: {
    backgroundColor: "#000000", // Black background
    showGradients: true, // Purple/pink gradient effects
    showLoadingBar: true, // Animated progress bar
    showSkipButton: true, // Allow users to skip
  },

  // Advanced settings
  advanced: {
    // Set to false to completely disable welcome animation
    enabled: true,

    // Custom duration (overrides timing if set)
    customDuration: null as number | null,

    // Show only on specific pages (empty = all pages)
    showOnPages: [] as string[],

    // Don't show on specific pages
    hideOnPages: ['/admin', '/api'] as string[],
  },
};

export type WelcomeConfig = typeof welcomeConfig;
