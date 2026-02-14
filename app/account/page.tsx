"use client";

import React, { useState, useEffect } from 'react';
import {
  Award, ChevronRight, Crown, Edit2, Gift, Mail, MapPin, Package,
  Phone, Star, User, CreditCard, Plus, Trash2, Check, X, Bell,
  MessageSquare, ShoppingBag, Download, Search, Filter, Calendar,
  AlertTriangle, ShoppingCart, Clock
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { getOrders, Order as ApiOrder, updateProfile, getAddresses, addAddress, deleteAddress, Address } from '@/lib/api';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  zipCode: string;
  country: string;
  birthday: string; // YYYY-MM-DD format
}

interface Order {
  _id: string;
  orderRef: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    zipCode: string;
  };
  items: Array<{
    productId: string;
    productName: string;
    productImage: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
  }>;
  subtotal: number;
  shipping: number;
  total: number;
  pointsEarned: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt?: string;
  updatedAt?: string;
}

interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  country: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'Visa' | 'Mastercard';
  lastFour: string;
  expiryDate: string;
  isDefault: boolean;
}

interface Preferences {
  emailNotifications: boolean;
  smsUpdates: boolean;
  marketingEmails: boolean;
}

const FRAGMENTS_KEY = "oiko_fragment_points";
const PURCHASE_COUNT_KEY = "oiko_purchase_count";
const USER_PROFILE_KEY = "oiko_user_profile";
const BIRTHDAY_GIFT_CLAIMED_KEY = "oiko_birthday_gift_claimed";

export default function EnhancedAccountPage() {
  const router = useRouter();
  const { user: authUser, isAuthenticated, loading: authLoading, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize with default values to match server-side render
  const defaultUser: UserProfile = {
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    zipCode: "",
    country: "Saudi Arabia",
    birthday: ""
  };

  const [user, setUser] = useState<UserProfile>(defaultUser);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/account');
    }
  }, [authLoading, isAuthenticated, router]);

  // Sync auth user data with local state
  useEffect(() => {
    if (authUser) {
      const defaultAddress = authUser.addresses && authUser.addresses.length > 0
        ? authUser.addresses.find(addr => addr.isDefault) || authUser.addresses[0]
        : null;

      setUser({
        name: `${authUser.firstName} ${authUser.lastName}`,
        email: authUser.email,
        phone: authUser.phone || "",
        street: defaultAddress?.street || "",
        city: defaultAddress?.city || "",
        zipCode: defaultAddress?.zipCode || "",
        country: defaultAddress?.country || "Saudi Arabia",
        birthday: "" // TODO: Get from authUser if available
      });
    }
  }, [authUser]);

  // Sync localStorage points to database when user logs in
  useEffect(() => {
    const syncPointsToDatabase = async () => {
      if (!authUser) return;

      const localPoints = Number(localStorage.getItem(FRAGMENTS_KEY) || "0");
      const dbPoints = authUser.fragmentPoints || 0;

      // If localStorage has more points than database, sync them
      if (localPoints > dbPoints) {
        try {
          await updateProfile({ fragmentPoints: localPoints });
          await refreshUser();
          console.log('Points synced to database:', localPoints);
        } catch (error) {
          console.error('Failed to sync points to database:', error);
        }
      } else if (dbPoints > localPoints) {
        // If database has more points, update localStorage
        localStorage.setItem(FRAGMENTS_KEY, String(dbPoints));
        window.dispatchEvent(new Event("oiko:points-updated"));
      }
    };

    syncPointsToDatabase();
  }, [authUser?._id]); // Only run when user logs in/out

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<UserProfile>(defaultUser);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showRewardClaim, setShowRewardClaim] = useState(false);
  const [showTrialRequest, setShowTrialRequest] = useState(false);
  const [trialAgreed, setTrialAgreed] = useState(false);
  const [trialProductType, setTrialProductType] = useState('');
  const [trialSize, setTrialSize] = useState('');
  const [showBirthdayGift, setShowBirthdayGift] = useState(false);
  const [birthdayGiftClaimed, setBirthdayGiftClaimed] = useState(false);
  const [showIncompleteProfile, setShowIncompleteProfile] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [orderFilter, setOrderFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  const [preferences, setPreferences] = useState<Preferences>({
    emailNotifications: true,
    smsUpdates: true,
    marketingEmails: false
  });

  // Check if today is user's birthday
  const checkBirthday = (birthday: string) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    const currentYear = today.getFullYear();

    // Check if month and day match
    return (
      today.getMonth() === birthDate.getMonth() &&
      today.getDate() === birthDate.getDate()
    );
  };

  // Check if birthday gift was already claimed this year
  const wasBirthdayGiftClaimedThisYear = () => {
    const lastClaimed = localStorage.getItem(BIRTHDAY_GIFT_CLAIMED_KEY);
    if (!lastClaimed) return false;

    const lastClaimedYear = new Date(lastClaimed).getFullYear();
    const currentYear = new Date().getFullYear();

    return lastClaimedYear === currentYear;
  };

  // Check if profile is complete
  const isProfileComplete = (profile: typeof user) => {
    return (
      profile.name.trim() !== "" &&
      profile.email.trim() !== "" &&
      profile.phone.trim() !== "" &&
      profile.street.trim() !== "" &&
      profile.city.trim() !== "" &&
      profile.zipCode.trim() !== "" &&
      profile.country.trim() !== "" &&
      profile.birthday !== ""
    );
  };

  useEffect(() => {
    // Load user profile from localStorage (client-side only) - fallback for additional data
    const savedProfile = localStorage.getItem(USER_PROFILE_KEY);
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        let currentUserProfile: UserProfile;

        // Only use localStorage for fields not available in auth user
        if (!authUser) {
          setUser(parsed);
          setDraft(parsed);
          currentUserProfile = parsed;
        } else {
          // Get default address from auth user
          const defaultAddress = authUser.addresses && authUser.addresses.length > 0
            ? authUser.addresses.find(addr => addr.isDefault) || authUser.addresses[0]
            : null;

          // Merge auth user data with localStorage data
          const mergedUser = {
            name: `${authUser.firstName} ${authUser.lastName}`,
            email: authUser.email,
            phone: authUser.phone || parsed.phone || "",
            street: defaultAddress?.street || parsed.street || "",
            city: defaultAddress?.city || parsed.city || "",
            zipCode: defaultAddress?.zipCode || parsed.zipCode || "",
            country: defaultAddress?.country || parsed.country || "Saudi Arabia",
            birthday: parsed.birthday || ""
          };
          setUser(mergedUser);
          setDraft(mergedUser);
          currentUserProfile = mergedUser;
        }

        // Check if profile is complete using the newly constructed profile
        if (!isProfileComplete(currentUserProfile)) {
          setShowIncompleteProfile(true);
        } else {
          setShowIncompleteProfile(false);
        }

        // Check if it's user's birthday and they haven't claimed gift
        if (currentUserProfile.birthday && checkBirthday(currentUserProfile.birthday)) {
          if (!wasBirthdayGiftClaimedThisYear()) {
            setShowBirthdayGift(true);
          } else {
            setBirthdayGiftClaimed(true);
          }
        }
      } catch (e) {
        console.error('Failed to parse user profile', e);
      }
    } else if (!authUser) {
      // No profile found and not authenticated - prompt to complete profile
      setShowIncompleteProfile(true);
    }

    // Load real points from backend user or localStorage
    const storedPoints = authUser?.fragmentPoints || Number(localStorage.getItem(FRAGMENTS_KEY) || "0");
    const storedOrders = Number(localStorage.getItem(PURCHASE_COUNT_KEY) || "0");
    setCurrentPoints(Number.isNaN(storedPoints) ? 0 : storedPoints);
    setTotalOrders(Number.isNaN(storedOrders) ? 0 : storedOrders);

    // Load orders from database
    const loadOrders = async () => {
      try {
        setIsLoading(true);

        // Get orders by email (for both authenticated and guest users)
        const userEmail = authUser?.email || user.email;
        if (!userEmail) {
          setIsLoading(false);
          return;
        }

        const response = await getOrders({ email: userEmail });

        if (response.success && response.data) {
          setOrders(response.data as any);
          setFilteredOrders(response.data as any);
          setTotalOrders(response.data.length);
        } else {
          console.error('Failed to load orders:', response.error);
        }
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();

    // Load addresses from database
    const loadAddresses = async () => {
      if (authUser) {
        const response = await getAddresses();
        if (response.success && response.data) {
          setAddresses(response.data.map((addr: Address) => ({
            id: addr._id || '',
            label: addr.isDefault ? 'Default' : 'Address',
            street: addr.street,
            city: addr.city,
            country: addr.country,
            isDefault: addr.isDefault
          })));
        }
      }
    };

    loadAddresses();

    // Payment methods (mock data for now - Stripe payment methods integration can be added later)
    setPaymentMethods([
      { id: '1', type: 'Visa', lastFour: '4242', expiryDate: '12/26', isDefault: true },
      { id: '2', type: 'Mastercard', lastFour: '8888', expiryDate: '09/25', isDefault: false }
    ]);
  }, [authUser, user.email]);

  useEffect(() => {
    let filtered = orders;

    if (orderFilter !== 'all') {
      filtered = filtered.filter(order => order.status === orderFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.orderRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some(item => item.productName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredOrders(filtered);
  }, [orderFilter, searchQuery, orders]);

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all required fields
    if (!draft.name.trim()) {
      showToastMessage('Name is required');
      return;
    }
    if (!draft.email.trim()) {
      showToastMessage('Email is required');
      return;
    }
    if (!draft.phone.trim()) {
      showToastMessage('Phone is required');
      return;
    }
    if (!draft.street.trim()) {
      showToastMessage('Street address is required');
      return;
    }
    if (!draft.city.trim()) {
      showToastMessage('City is required');
      return;
    }
    if (!draft.zipCode.trim()) {
      showToastMessage('Zip code is required');
      return;
    }
    if (!draft.country.trim()) {
      showToastMessage('Country is required');
      return;
    }
    if (!draft.birthday) {
      showToastMessage('Birthday is required');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(draft.email)) {
      showToastMessage('Please enter a valid email address');
      return;
    }

    // Validate birthday is in the past
    const birthDate = new Date(draft.birthday);
    const today = new Date();
    if (birthDate >= today) {
      showToastMessage('Birthday must be in the past');
      return;
    }

    setUser(draft);
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(draft));
    setIsEditing(false);

    // Hide incomplete profile popup if profile is now complete
    if (isProfileComplete(draft)) {
      setShowIncompleteProfile(false);
    }

    showToastMessage('Profile updated successfully!');
  };

  const handleResetCounters = () => {
    localStorage.setItem(FRAGMENTS_KEY, "0");
    localStorage.setItem(PURCHASE_COUNT_KEY, "0");
    setCurrentPoints(0);
    setTotalOrders(0);
    setShowConfirm(false);
    showToastMessage('Counters reset successfully!');
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
    showToastMessage('Address deleted!');
  };

  const handleDeletePayment = (id: string) => {
    setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
    showToastMessage('Payment method removed!');
  };

  const handleSetDefaultAddress = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
    showToastMessage('Default address updated!');
  };

  const handleSetDefaultPayment = (id: string) => {
    setPaymentMethods(paymentMethods.map(pm => ({
      ...pm,
      isDefault: pm.id === id
    })));
    showToastMessage('Default payment updated!');
  };

  const togglePreference = (key: keyof Preferences) => {
    setPreferences({...preferences, [key]: !preferences[key]});
    showToastMessage('Preference updated!');
  };

  const handleClaimReward = () => {
    localStorage.setItem(FRAGMENTS_KEY, "0");
    setCurrentPoints(0);
    setShowRewardClaim(false);
    showToastMessage('Congratulations! Reward claimed successfully! Starting new journey.');

    // Dispatch event to sync across components
    window.dispatchEvent(new Event('oiko:points-updated'));
  };

  const handleTrialRequest = () => {
    if (!isProfileComplete(user)) {
      setShowTrialRequest(false);
      showToastMessage('Please complete your profile first');
      setShowIncompleteProfile(true);
      return;
    }

    if (!trialProductType) {
      showToastMessage('Please select a product type');
      return;
    }

    if (!trialSize) {
      showToastMessage('Please select a size');
      return;
    }

    if (!trialAgreed) {
      showToastMessage('Please agree to the terms and conditions');
      return;
    }

    // Log the trial request details (in production, send to backend)
    console.log('Trial Request:', {
      productType: trialProductType,
      size: trialSize,
      street: user.street,
      city: user.city,
      zipCode: user.zipCode,
      country: user.country,
      phone: user.phone,
      email: user.email
    });

    setShowTrialRequest(false);
    setTrialAgreed(false);
    setTrialProductType('');
    setTrialSize('');
    showToastMessage(`Trial request submitted! ${trialProductType === 'tshirt' ? 'T-Shirt' : 'Hoodie'} size ${trialSize}. We will contact you within 24 hours.`);
  };

  const handleClaimBirthdayGift = () => {
    // Award 50 bonus points as birthday gift
    const currentFragments = Number(localStorage.getItem(FRAGMENTS_KEY) || "0");
    const newPoints = Math.min(currentFragments + 50, 100); // Cap at 100
    localStorage.setItem(FRAGMENTS_KEY, String(newPoints));
    setCurrentPoints(newPoints);

    // Mark gift as claimed for this year
    localStorage.setItem(BIRTHDAY_GIFT_CLAIMED_KEY, new Date().toISOString());
    setBirthdayGiftClaimed(true);
    setShowBirthdayGift(false);

    // Dispatch event to sync points across components
    window.dispatchEvent(new Event('oiko:points-updated'));

    showToastMessage('🎉 Happy Birthday! 50 bonus points added to your account!');

    // TODO: Send birthday email with personalized message and gift
    // await fetch('/api/emails/birthday', {
    //   method: 'POST',
    //   body: JSON.stringify({ email: user.email, name: user.name })
    // });
  };

  // Check if user is in Riyadh
  const isInRiyadh = user.city ? user.city.toLowerCase().includes('riyadh') : false;

  // Calculate age from birthday
  const calculateAge = (birthday: string) => {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const nextReward = { points: 100, name: 'Free product' };
  const progressPercent = Math.min(100, Math.round((currentPoints / nextReward.points) * 100));

  const SkeletonLoader = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-neutral-200 rounded w-1/3"></div>
      <div className="h-4 bg-neutral-200 rounded"></div>
      <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
    </div>
  );

  return (
    <main className="min-h-screen bg-white">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 bg-neutral-800 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fadeIn">
          <Check className="h-4 w-4" />
          {toastMessage}
        </div>
      )}

      {/* Incomplete Profile Banner */}
      {showIncompleteProfile && !isEditing && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 max-w-md w-full mx-4">
          <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 shadow-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-amber-900 mb-1">Complete Your Profile</h3>
                <p className="text-sm text-amber-700 mb-3">
                  Please fill in all required information to unlock all features including rewards, Try Before You Buy, and birthday gifts!
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowIncompleteProfile(false);
                      setIsEditing(true);
                    }}
                    className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-semibold hover:bg-amber-700 transition"
                  >
                    Complete Profile
                  </button>
                  <button
                    onClick={() => setShowIncompleteProfile(false)}
                    className="px-4 py-2 border border-amber-300 text-amber-700 rounded-lg text-sm font-semibold hover:bg-amber-100 transition"
                  >
                    Later
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowIncompleteProfile(false)}
                className="text-amber-600 hover:text-amber-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-4 border-b border-neutral-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-full border border-neutral-200 p-3">
              <User className="h-5 w-5 text-neutral-500" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-black">{user.name || "Guest User"}</h1>
              <div className="mt-2 flex items-center gap-2 text-sm text-neutral-500">
                <Mail className="h-4 w-4 text-neutral-400" />
                <span>{user.email || "No email added"}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => { setDraft(user); setIsEditing(true); }}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-50"
          >
            <Edit2 className="h-4 w-4" />
            Edit Profile
          </button>
        </header>

        {/* Tabs - Mobile and Desktop */}
        <div className="flex gap-2 mb-6 border-b border-neutral-200 overflow-x-auto pb-2">
          {['overview', 'orders', 'settings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition ${
                activeTab === tab ? 'bg-neutral-600 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-8">
            <SkeletonLoader />
            <SkeletonLoader />
          </div>
        ) : (
          <>
            {/* Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="grid gap-8 md:grid-cols-2">
                  <section>
                    <h2 className="mb-4 text-xs font-bold uppercase tracking-wide text-neutral-500">Contact</h2>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="h-4 w-4 text-neutral-400" />
                        <span className={user.phone ? "" : "text-neutral-400"}>{user.phone || "No phone added"}</span>
                      </div>
                      <div className="flex items-start gap-3 text-sm">
                        <MapPin className="h-4 w-4 text-neutral-400 mt-0.5 flex-shrink-0" />
                        <div>
                          {user.street && user.city ? (
                            <>
                              <div>{user.street}</div>
                              <div>{user.city}, {user.zipCode}</div>
                              <div className="text-neutral-500">{user.country}</div>
                            </>
                          ) : (
                            <span className="text-neutral-400">No address added</span>
                          )}
                        </div>
                      </div>
                      {user.birthday ? (
                        <div className="flex items-center gap-3 text-sm">
                          <Gift className="h-4 w-4 text-neutral-400" />
                          <span>
                            Birthday: {new Date(user.birthday).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                            {checkBirthday(user.birthday) && !birthdayGiftClaimed && (
                              <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                                🎂 Today!
                              </span>
                            )}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 text-sm">
                          <Gift className="h-4 w-4 text-neutral-400" />
                          <span className="text-neutral-400">No birthday added</span>
                        </div>
                      )}
                    </div>
                  </section>

                  <section>
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-xs font-bold uppercase tracking-wide text-neutral-500">Statistics</h2>
                      <button onClick={() => setShowConfirm(true)} className="text-xs text-neutral-500 hover:text-neutral-700">
                        Reset
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-2xl font-semibold">{currentPoints}</p>
                        <p className="text-xs text-neutral-500 mt-1">Reward Points</p>
                      </div>
                      <div>
                        <p className="text-2xl font-semibold">{totalOrders}</p>
                        <p className="text-xs text-neutral-500 mt-1">Total Orders</p>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Try Before You Buy Section */}
                <section className="rounded-lg border border-neutral-200 p-6">
                  <div className="mb-6 flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5 text-neutral-600" />
                        Try Before You Buy
                      </h2>
                      <p className="mt-2 text-sm text-neutral-500">
                        Test our products for free before purchasing
                      </p>
                    </div>
                    {isInRiyadh ? (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                        Available
                      </span>
                    ) : (
                      <span className="bg-neutral-100 text-neutral-600 px-3 py-1 rounded-full text-xs font-semibold">
                        Riyadh Only
                      </span>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex gap-3">
                        <Clock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-sm text-blue-900">How it works</p>
                          <p className="text-sm text-blue-700 mt-1">
                            Request a trial piece of any t-shirt or hoodie. Try it for one day and return it in the same condition.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-sm text-amber-900">Important Notice</p>
                          <ul className="text-sm text-amber-700 mt-1 space-y-1 list-disc list-inside">
                            <li>Trial period: 24 hours only</li>
                            <li>Must be returned in original condition</li>
                            <li>Any damage requires full price payment</li>
                            <li>Available only for Riyadh residents</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {isInRiyadh ? (
                      <button
                        onClick={() => setShowTrialRequest(true)}
                        className="w-full bg-neutral-600 text-white py-3 rounded-lg font-semibold hover:bg-neutral-700 transition flex items-center justify-center gap-2"
                      >
                        <Package className="h-4 w-4" />
                        Request Trial Piece
                      </button>
                    ) : (
                      <div className="text-center py-3 bg-neutral-50 rounded-lg">
                        <p className="text-sm text-neutral-600">
                          This service is currently only available in Riyadh
                        </p>
                        <p className="text-xs text-neutral-500 mt-1">
                          Update your address to Riyadh to access this feature
                        </p>
                      </div>
                    )}
                  </div>
                </section>

                <section className="rounded-lg border border-neutral-200 p-6">
                  <div className="mb-6 flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold">Rewards Journey</h2>
                      <p className="mt-2 text-sm text-neutral-500">
                        {currentPoints >= 100
                          ? 'Congratulations! You can claim your reward now!'
                          : 'Track your progress and unlock rewards'}
                      </p>
                    </div>
                    <Star className="h-6 w-6 text-neutral-600" />
                  </div>

                  {currentPoints >= 100 ? (
                    <div className="mb-6 text-center">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
                        <Gift className="h-10 w-10 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Reward Unlocked!</h3>
                      <p className="text-sm text-neutral-600 mb-6">You've earned a free product! Claim it now to start your next journey.</p>
                      <button
                        onClick={() => setShowRewardClaim(true)}
                        className="w-full bg-neutral-600 text-white py-3 rounded-lg font-semibold hover:bg-neutral-700 transition"
                      >
                        Claim Your Reward
                      </button>
                    </div>
                  ) : (
                    <div className="mb-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-neutral-600">Progress</span>
                        <span className="font-semibold">{currentPoints} / {nextReward.points} pts</span>
                      </div>
                      <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                        <div className="h-full bg-neutral-600 transition-all" style={{ width: `${progressPercent}%` }} />
                      </div>
                      <p className="text-xs text-neutral-500 mt-2">Next: {nextReward.name}</p>
                    </div>
                  )}

                  {currentPoints < 100 && (
                    <button
                      onClick={() => router.push('/rewards')}
                      className="w-full border-2 border-neutral-600 text-neutral-600 py-3 rounded-lg font-semibold hover:bg-neutral-600 hover:text-white transition"
                    >
                      View Full Journey
                    </button>
                  )}
                </section>
              </div>
            )}

            {/* Orders */}
            {activeTab === 'orders' && (
              <section>
                <div className="mb-6 flex flex-col sm:flex-row gap-4 sm:justify-between">
                  <h2 className="text-xs font-bold uppercase tracking-wide text-neutral-500">Order History</h2>
                  <div className="flex gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border rounded-lg text-sm w-full sm:w-auto"
                      />
                    </div>
                    <select
                      value={orderFilter}
                      onChange={(e) => setOrderFilter(e.target.value)}
                      className="px-4 py-2 border rounded-lg text-sm"
                    >
                      <option value="all">All</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>

                {filteredOrders.length === 0 ? (
                  <div className="text-center py-12 bg-neutral-50 rounded-xl">
                    <ShoppingBag className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                    <p className="font-semibold mb-2">No orders found</p>
                    <p className="text-sm text-neutral-500 mb-6">Start shopping to see orders here</p>
                    <button className="bg-neutral-600 text-white px-6 py-3 rounded-lg font-semibold">
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredOrders.map((order) => {
                      const statusColors = {
                        pending: 'bg-yellow-100 text-yellow-700',
                        processing: 'bg-blue-100 text-blue-700',
                        shipped: 'bg-indigo-100 text-indigo-700',
                        delivered: 'bg-green-100 text-green-700',
                        cancelled: 'bg-red-100 text-red-700'
                      };

                      const statusLabels = {
                        pending: 'Pending',
                        processing: 'Processing',
                        shipped: 'Shipped',
                        delivered: 'Delivered',
                        cancelled: 'Cancelled'
                      };

                      return (
                        <div key={order._id} className="border rounded-xl p-4 hover:bg-neutral-50">
                          <div className="flex justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <p className="font-semibold text-sm">Order #{order.orderRef}</p>
                                <span className={`px-2 py-1 rounded-full text-xs ${statusColors[order.status]}`}>
                                  {statusLabels[order.status]}
                                </span>
                              </div>
                              <div className="text-xs text-neutral-500 space-y-1">
                                <p>{new Date(order.createdAt || '').toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                <p className="font-semibold text-black">SAR {order.total.toFixed(2)}</p>
                              </div>
                            </div>
                            <button className="p-2 hover:bg-neutral-100 rounded-lg h-fit">
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Order Items */}
                          <div className="space-y-2 mt-3 pt-3 border-t">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-3 text-xs">
                                <img
                                  src={item.productImage}
                                  alt={item.productName}
                                  className="w-10 h-10 object-cover rounded"
                                />
                                <div className="flex-1">
                                  <p className="font-medium">{item.productName}</p>
                                  <p className="text-neutral-500">
                                    {item.size && `Size: ${item.size}`}
                                    {item.size && item.color && ' • '}
                                    {item.color && `Color: ${item.color}`}
                                    {' • '}
                                    Qty: {item.quantity}
                                  </p>
                                </div>
                                <p className="font-medium">SAR {item.price.toFixed(2)}</p>
                              </div>
                            ))}
                          </div>

                          {/* Points Earned */}
                          {order.pointsEarned > 0 && (
                            <div className="mt-3 pt-3 border-t flex items-center gap-2 text-xs text-green-600">
                              <Star className="h-3 w-3 fill-current" />
                              <span>+{order.pointsEarned} fragment points earned</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            )}

            {/* Settings */}
            {activeTab === 'settings' && (
              <div className="space-y-8">
                <section>
                  <h2 className="mb-4 text-xs font-bold uppercase tracking-wide text-neutral-500">Saved Addresses</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {addresses.map((addr) => (
                      <div key={addr.id} className="border rounded-xl p-4 relative">
                        {addr.isDefault && (
                          <span className="absolute top-3 right-3 bg-neutral-600 text-white px-2 py-1 rounded-full text-xs">
                            Default
                          </span>
                        )}
                        <p className="font-semibold mb-1">{addr.label}</p>
                        <p className="text-sm text-neutral-600">{addr.street}</p>
                        <p className="text-sm text-neutral-600">{addr.city}</p>
                        <div className="flex gap-2 mt-3">
                          {!addr.isDefault && (
                            <button onClick={() => handleSetDefaultAddress(addr.id)} className="text-xs text-neutral-600">
                              Set default
                            </button>
                          )}
                          <button onClick={() => handleDeleteAddress(addr.id)} className="text-xs text-red-600 ml-auto">
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="mb-4 text-xs font-bold uppercase tracking-wide text-neutral-500">Payment Methods</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {paymentMethods.map((pm) => (
                      <div key={pm.id} className="border rounded-xl p-4 relative">
                        {pm.isDefault && (
                          <span className="absolute top-3 right-3 bg-neutral-600 text-white px-2 py-1 rounded-full text-xs">
                            Default
                          </span>
                        )}
                        <div className="flex items-center gap-3 mb-3">
                          <CreditCard className="h-8 w-8 text-neutral-400" />
                          <div>
                            <p className="font-semibold">{pm.type} •••• {pm.lastFour}</p>
                            <p className="text-sm text-neutral-600">Expires {pm.expiryDate}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {!pm.isDefault && (
                            <button onClick={() => handleSetDefaultPayment(pm.id)} className="text-xs text-neutral-600">
                              Set default
                            </button>
                          )}
                          <button onClick={() => handleDeletePayment(pm.id)} className="text-xs text-red-600 ml-auto">
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="mb-4 text-xs font-bold uppercase tracking-wide text-neutral-500">Preferences</h2>
                  <div className="border rounded-xl p-6 space-y-4">
                    {[
                      { key: 'emailNotifications' as const, icon: Bell, title: 'Email Notifications', desc: 'Order updates via email' },
                      { key: 'smsUpdates' as const, icon: MessageSquare, title: 'SMS Updates', desc: 'Shipping updates via SMS' },
                      { key: 'marketingEmails' as const, icon: Mail, title: 'Marketing Emails', desc: 'Promotional offers' }
                    ].map(({ key, icon: Icon, title, desc }) => (
                      <div key={key} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-neutral-400" />
                          <div>
                            <p className="font-semibold text-sm">{title}</p>
                            <p className="text-xs text-neutral-500">{desc}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => togglePreference(key)}
                          className={`w-12 h-6 rounded-full transition ${preferences[key] ? 'bg-neutral-600' : 'bg-neutral-200'}`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full transition-transform ${preferences[key] ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6">
            <div className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">Edit Profile</h2>
                  <p className="text-xs text-neutral-500 mt-1">All fields are required</p>
                </div>
                <button onClick={() => setIsEditing(false)} type="button">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={draft.name}
                  onChange={(e) => setDraft({...draft, name: e.target.value})}
                  className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                  minLength={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={draft.email}
                  onChange={(e) => setDraft({...draft, email: e.target.value})}
                  className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={draft.phone}
                  onChange={(e) => setDraft({...draft, phone: e.target.value})}
                  className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent"
                  placeholder="+966 50 000 0000"
                  required
                  minLength={10}
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Include country code (e.g., +966)
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={draft.street}
                  onChange={(e) => setDraft({...draft, street: e.target.value})}
                  className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent"
                  placeholder="Street name and number"
                  required
                  minLength={5}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={draft.city}
                    onChange={(e) => setDraft({...draft, city: e.target.value})}
                    className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent"
                    placeholder="City"
                    required
                    minLength={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Zip Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={draft.zipCode}
                    onChange={(e) => setDraft({...draft, zipCode: e.target.value})}
                    className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent"
                    placeholder="Zip Code"
                    required
                    minLength={4}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Country <span className="text-red-500">*</span>
                </label>
                <select
                  value={draft.country}
                  onChange={(e) => setDraft({...draft, country: e.target.value})}
                  className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent"
                  required
                >
                  <option value="Saudi Arabia">Saudi Arabia</option>
                  <option value="United Arab Emirates">United Arab Emirates</option>
                  <option value="Kuwait">Kuwait</option>
                  <option value="Qatar">Qatar</option>
                  <option value="Bahrain">Bahrain</option>
                  <option value="Oman">Oman</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Birthday <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={draft.birthday}
                  onChange={(e) => setDraft({...draft, birthday: e.target.value})}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent"
                  required
                />
                <p className="text-xs text-neutral-500 mt-1">
                  We'll send you a special gift on your birthday! 🎁
                </p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setIsEditing(false)} className="flex-1 border px-4 py-2 rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-neutral-600 text-white px-4 py-2 rounded-lg">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6">
            <h3 className="text-lg font-semibold mb-2">Reset Counters?</h3>
            <p className="text-sm text-neutral-500 mb-6">This will reset your points and order count to zero.</p>
            <div className="flex gap-2">
              <button onClick={() => setShowConfirm(false)} className="flex-1 border px-4 py-2 rounded-lg">
                Cancel
              </button>
              <button onClick={handleResetCounters} className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg">
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reward Claim Modal */}
      {showRewardClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-4">
              <Crown className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Claim Your Reward!</h3>
            <p className="text-sm text-neutral-600 mb-2">Congratulations on reaching 100 fragments!</p>
            <p className="text-sm text-neutral-500 mb-6">
              You've earned a <strong className="text-neutral-900">free product</strong>. Your points will reset to 0 and you can start a new rewards journey.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowRewardClaim(false)}
                className="flex-1 border px-4 py-3 rounded-lg hover:bg-neutral-50 transition"
              >
                Later
              </button>
              <button
                onClick={handleClaimReward}
                className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Claim Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Birthday Gift Modal */}
      {showBirthdayGift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 text-center relative overflow-hidden">
            {/* Confetti decoration */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500"></div>

            <div className="mb-4">
              <div className="text-6xl mb-2">🎂</div>
              <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Happy Birthday, {user.name.split(' ')[0]}!
              </h3>
              <p className="text-neutral-600 mb-1">
                Wishing you an amazing {calculateAge(user.birthday)}th birthday! 🎉
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 mb-6 border-2 border-purple-200">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Gift className="h-8 w-8 text-purple-600" />
                <div>
                  <h4 className="text-xl font-bold text-purple-900">Your Birthday Gift</h4>
                  <p className="text-sm text-purple-700">Special reward just for you!</p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 mb-3">
                <div className="flex items-center justify-center gap-2">
                  <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                  <span className="text-3xl font-bold text-purple-600">+50</span>
                  <span className="text-lg text-neutral-600">Bonus Points</span>
                </div>
              </div>
              <p className="text-xs text-purple-600">
                Use these points towards your next purchase or save them for a free product!
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleClaimBirthdayGift}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition shadow-lg"
              >
                Claim My Gift! 🎁
              </button>
              <button
                onClick={() => setShowBirthdayGift(false)}
                className="w-full text-neutral-600 text-sm hover:text-neutral-800 transition"
              >
                I'll claim it later
              </button>
            </div>

            <p className="text-xs text-neutral-500 mt-4">
              We've also sent you a special birthday email with exclusive offers!
            </p>
          </div>
        </div>
      )}

      {/* Trial Request Modal */}
      {showTrialRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">Request Trial Piece</h3>
                <p className="text-sm text-neutral-500 mt-1">Try before you buy - 24 hours trial</p>
              </div>
              <button onClick={() => {
                setShowTrialRequest(false);
                setTrialAgreed(false);
                setTrialProductType('');
                setTrialSize('');
              }}>
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Product Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Select Product Type</label>
              <select
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:border-transparent"
                value={trialProductType}
                onChange={(e) => setTrialProductType(e.target.value)}
              >
                <option value="">Choose a product type</option>
                <option value="tshirt">T-Shirt</option>
                <option value="hoodie">Hoodie</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Select Size</label>
              <div className="flex gap-2">
                {['S', 'M', 'L', 'XL'].map(size => (
                  <button
                    key={size}
                    onClick={() => setTrialSize(size)}
                    className={`flex-1 border-2 rounded-lg py-2 font-semibold transition ${
                      trialSize === size
                        ? 'border-neutral-600 bg-neutral-600 text-white'
                        : 'border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex gap-3 mb-3">
                <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm text-red-900">Terms & Conditions</p>
                </div>
              </div>
              <ul className="text-sm text-red-700 space-y-2 ml-8 list-disc">
                <li>The trial piece must be returned within 24 hours from pickup</li>
                <li>The product must be returned in its original condition (no stains, tears, or damages)</li>
                <li>If the product is damaged or not returned, you will be charged the full retail price</li>
                <li>Only one trial piece is allowed per customer at a time</li>
                <li>Trial pieces are not for sale and must be returned</li>
                <li>This service is only available for customers in Riyadh</li>
              </ul>
            </div>

            {/* Agreement Checkbox */}
            <label className="flex items-start gap-3 mb-6 cursor-pointer">
              <input
                type="checkbox"
                checked={trialAgreed}
                onChange={(e) => setTrialAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 accent-neutral-600"
              />
              <span className="text-sm text-neutral-700">
                I understand and agree to the terms and conditions. I will return the trial piece in original condition within 24 hours, or pay the full price if damaged.
              </span>
            </label>

            {/* Contact Information */}
            <div className="mb-6 bg-neutral-50 rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">Delivery Information</p>
              <div className="space-y-2 text-sm text-neutral-600">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <div>{user.street}</div>
                    <div>{user.city}, {user.zipCode}</div>
                    <div className="text-neutral-500">{user.country}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{user.phone}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowTrialRequest(false);
                  setTrialAgreed(false);
                  setTrialProductType('');
                  setTrialSize('');
                }}
                className="flex-1 border px-4 py-3 rounded-lg hover:bg-neutral-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleTrialRequest}
                disabled={!trialAgreed || !trialProductType || !trialSize}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition ${
                  trialAgreed && trialProductType && trialSize
                    ? 'bg-neutral-600 text-white hover:bg-neutral-700'
                    : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                }`}
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </main>
  );
}
