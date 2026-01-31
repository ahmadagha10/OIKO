# Welcome Animation Guide

Your website now has an animated welcome screen that greets users before they enter!

## ✅ What's Installed

**Files Created:**
- `/components/WelcomeAnimation.tsx` - Clean, elegant version (currently active)
- `/components/WelcomeAnimationEnhanced.tsx` - Dramatic, particle effects version
- `/components/WelcomeWrapper.tsx` - Wrapper component that controls when to show
- `/config/welcome.ts` - Configuration settings
- `/app/layout.tsx` - Updated to include welcome animation

## 🎬 Current Animation

**Style:** Clean & Professional
**Duration:** ~4.2 seconds
**Features:**
- ✅ Logo spin-in animation
- ✅ Brand name fade-in
- ✅ Tagline slide-in
- ✅ Gradient background effects
- ✅ Progress bar
- ✅ Skip button
- ✅ Shows once per session

## 🎨 Two Versions Available

### Version 1: Clean (Currently Active) ✓
**File:** `WelcomeAnimation.tsx`
**Best for:** Professional, subtle branding
**Features:**
- Logo rotates and scales in
- Smooth text animations
- Subtle gradient effects
- 4.2 second duration

### Version 2: Enhanced
**File:** `WelcomeAnimationEnhanced.tsx`
**Best for:** Bold, eye-catching entrance
**Features:**
- Animated particles floating
- Letter-by-letter brand reveal
- Glowing effects
- Pulse animations
- Corner decorations
- 4.8 second duration

## 🔄 Switch Between Versions

### To use the Enhanced version:

**Edit `/components/WelcomeWrapper.tsx`:**

```tsx
// Change this line:
import WelcomeAnimation from './WelcomeAnimation';

// To this:
import WelcomeAnimation from './WelcomeAnimationEnhanced';
```

That's it! Refresh your browser to see the enhanced version.

## ⚙️ Customization Options

### Change When It Shows

**Edit `/app/layout.tsx`:**

```tsx
<WelcomeWrapper showOnce={true}>   {/* Shows once per session */}
<WelcomeWrapper showOnce={false}>  {/* Shows every page load */}
```

### Disable Welcome Animation

**Option 1: Quick Disable**
Comment out the wrapper in `/app/layout.tsx`:

```tsx
{/* <WelcomeWrapper showOnce={true}> */}
  <Header />
  {children}
  <Footer />
{/* </WelcomeWrapper> */}
```

**Option 2: Configuration**
Edit `/config/welcome.ts`:

```ts
advanced: {
  enabled: false,  // Completely disable
}
```

### Adjust Timing

**Edit the animation file (e.g., `/components/WelcomeAnimation.tsx`):**

```tsx
const timers = [
  setTimeout(() => setStep(1), 500),    // Logo appears at 0.5s
  setTimeout(() => setStep(2), 1500),   // Brand at 1.5s
  setTimeout(() => setStep(3), 2500),   // Tagline at 2.5s
  setTimeout(() => setStep(4), 3500),   // Fade starts at 3.5s
  setTimeout(() => {
    setShowWelcome(false);
    onComplete?.();
  }, 4200),  // Total duration: 4.2s
];
```

Change the numbers (in milliseconds) to speed up or slow down.

### Change Colors

**Edit the animation file:**

```tsx
// Background color
className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
//                                                                     ^^^ Change this

// Gradient colors
className="absolute inset-0 bg-purple-600 blur-2xl"  // Purple glow
className="absolute ... bg-pink-600 blur-3xl"        // Pink glow

// Change to your brand colors!
```

### Change Text

**Edit `/components/WelcomeAnimation.tsx`:**

```tsx
<h1 className="...">
  Oiko   {/* Change brand name */}
</h1>

<p className="...">
  Premium Custom Streetwear  {/* Change tagline */}
</p>
```

### Change Logo

The logo is loaded from `/public/bar.svg`. Replace that file or change the path:

```tsx
<Image
  src="/bar.svg"           // Change to your logo path
  alt="Oiko Logo"
  fill
  className="object-contain"
  priority
/>
```

## 📱 Mobile Responsive

Both versions are fully responsive:
- Logo sizes adjust (24px → 32px on mobile, 28px → 40px on desktop)
- Text scales (5xl → 7xl on desktop)
- Touch-friendly skip button
- Optimized animations for mobile performance

## 🎯 Common Customizations

### Make it Faster

```tsx
// Reduce all timings by 50%
setTimeout(() => setStep(1), 250),    // Was 500
setTimeout(() => setStep(2), 750),    // Was 1500
setTimeout(() => setStep(3), 1250),   // Was 2500
setTimeout(() => setStep(4), 1750),   // Was 3500
setTimeout(() => {
  setShowWelcome(false);
  onComplete?.();
}, 2100),  // Was 4200
```

### Make it Slower/More Dramatic

```tsx
// Increase all timings by 50%
setTimeout(() => setStep(1), 750),    // Was 500
setTimeout(() => setStep(2), 2250),   // Was 1500
setTimeout(() => setStep(3), 3750),   // Was 2500
setTimeout(() => setStep(4), 5250),   // Was 3500
setTimeout(() => {
  setShowWelcome(false);
  onComplete?.();
}, 6300),  // Was 4200
```

### Remove Skip Button

```tsx
{/* Comment out or remove: */}
{/* <motion.button ... onClick={handleSkip}>Skip</motion.button> */}
```

### Auto-Skip After User Interaction

```tsx
// Add to component
useEffect(() => {
  const handleInteraction = () => {
    setShowWelcome(false);
    onComplete?.();
  };

  window.addEventListener('click', handleInteraction);
  window.addEventListener('keydown', handleInteraction);

  return () => {
    window.removeEventListener('click', handleInteraction);
    window.removeEventListener('keydown', handleInteraction);
  };
}, [onComplete]);
```

## 🚀 Testing

### Test Welcome Animation
1. Open your site: `http://localhost:3000`
2. You'll see the welcome animation play
3. It automatically transitions to the main site
4. Refresh the page - animation won't show again (session storage)

### Force Show Every Time
1. Open DevTools (F12)
2. Go to Application → Session Storage
3. Delete `oiko_welcome_shown` key
4. Or set `showOnce={false}` in layout

### Clear Session Storage
```javascript
// In browser console
sessionStorage.clear();
```

## 📊 Performance

**Impact:**
- Initial bundle: +15KB (framer-motion already included)
- Animation runs only once per session
- No performance impact after animation completes
- Optimized for mobile

**Loading:**
- Uses Next.js Image optimization
- Framer-motion loads with main bundle
- No additional HTTP requests

## 🎨 Advanced: Create Your Own

Want a completely custom animation? Copy one of the existing files and modify:

```bash
cp components/WelcomeAnimation.tsx components/WelcomeAnimationCustom.tsx
```

Then edit it and update the import in `WelcomeWrapper.tsx`.

## 🐛 Troubleshooting

### Animation Doesn't Show
- Check that `WelcomeWrapper` is in layout.tsx
- Verify `showOnce` setting
- Clear session storage

### Animation Stuck/Won't Complete
- Check browser console for errors
- Verify all timings are set correctly
- Make sure `onComplete` is called

### Logo Not Showing
- Verify `/public/bar.svg` exists
- Check image path in component
- Ensure Next.js Image is configured

### Flashing Content
- Normal during development (hot reload)
- Won't happen in production build
- Can be reduced by adding loading state

## 📦 Production Build

Before deploying:

```bash
npm run build
npm start
```

Test the animation in production mode to ensure smooth performance.

## ✨ Summary

Your site now has:
- ✅ Animated welcome screen
- ✅ Two versions to choose from
- ✅ Fully customizable
- ✅ Mobile responsive
- ✅ Session-aware (shows once)
- ✅ Skip button for impatient users
- ✅ Smooth transitions

**Current Status:** Clean version active, shows once per session, 4.2s duration

Enjoy your new welcome animation! 🎉
