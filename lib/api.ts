/**
 * API utility functions for making requests to the backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
  pagination?: {
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_URL}${endpoint}`;

    // Get token from localStorage for authenticated requests
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
    });

    const data = await response.json();

    // Don't throw for expected auth failures, just return the error response
    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.message || 'API request failed',
      };
    }

    return data;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'An error occurred',
    };
  }
}

// ==================== PRODUCTS API ====================

export interface Product {
  _id: string;
  id?: number; // For backward compatibility
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  colors?: string[];
  sizes?: string[];
  stock?: number;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductsQuery {
  category?: string;
  featured?: boolean;
  search?: string;
}

/**
 * Get all products with optional filters
 */
export async function getProducts(
  query?: ProductsQuery
): Promise<ApiResponse<Product[]>> {
  const params = new URLSearchParams();
  if (query?.category) params.append('category', query.category);
  if (query?.featured) params.append('featured', 'true');
  if (query?.search) params.append('search', query.search);

  const queryString = params.toString();
  const endpoint = `/api/products${queryString ? `?${queryString}` : ''}`;

  return fetchAPI<Product[]>(endpoint);
}

/**
 * Get a single product by ID
 */
export async function getProduct(id: string): Promise<ApiResponse<Product>> {
  return fetchAPI<Product>(`/api/products/${id}`);
}

/**
 * Create a new product (admin only)
 */
export async function createProduct(
  product: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>
): Promise<ApiResponse<Product>> {
  return fetchAPI<Product>('/api/products', {
    method: 'POST',
    body: JSON.stringify(product),
  });
}

/**
 * Update a product (admin only)
 */
export async function updateProduct(
  id: string,
  updates: Partial<Product>
): Promise<ApiResponse<Product>> {
  return fetchAPI<Product>(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

/**
 * Delete a product (admin only)
 */
export async function deleteProduct(id: string): Promise<ApiResponse<{}>> {
  return fetchAPI<{}>(`/api/products/${id}`, {
    method: 'DELETE',
  });
}

// ==================== ORDERS API ====================

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  category?: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
}

export interface Order {
  _id?: string;
  orderRef: string;
  customerInfo: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  pointsEarned: number;
  status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrdersQuery {
  email?: string;
  orderRef?: string;
}

/**
 * Get orders with optional filters
 */
export async function getOrders(
  query?: OrdersQuery
): Promise<ApiResponse<Order[]>> {
  const params = new URLSearchParams();
  if (query?.email) params.append('email', query.email);
  if (query?.orderRef) params.append('orderRef', query.orderRef);

  const queryString = params.toString();
  const endpoint = `/api/orders${queryString ? `?${queryString}` : ''}`;

  return fetchAPI<Order[]>(endpoint);
}

/**
 * Get a single order by ID
 */
export async function getOrder(id: string): Promise<ApiResponse<Order>> {
  return fetchAPI<Order>(`/api/orders/${id}`);
}

/**
 * Create a new order
 */
export async function createOrder(
  order: Omit<Order, '_id' | 'createdAt' | 'updatedAt'>
): Promise<ApiResponse<Order>> {
  return fetchAPI<Order>('/api/orders', {
    method: 'POST',
    body: JSON.stringify(order),
  });
}

/**
 * Update order status (admin only)
 */
export async function updateOrderStatus(
  id: string,
  updates: {
    status?: Order['status'];
    paymentStatus?: Order['paymentStatus'];
    trackingNumber?: string;
    trackingUrl?: string;
  }
): Promise<ApiResponse<Order>> {
  return fetchAPI<Order>(`/api/orders/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

// ==================== AUTHENTICATION API ====================

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'customer' | 'admin';
  fragmentPoints: number;
  addresses: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
    latitude?: number;
    longitude?: number;
    isDefault: boolean;
  }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

/**
 * Sign up a new user
 */
export async function signup(data: SignupData): Promise<ApiResponse<AuthResponse>> {
  return fetchAPI<AuthResponse>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Login user
 */
export async function login(data: LoginData): Promise<ApiResponse<AuthResponse>> {
  return fetchAPI<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Logout user
 */
export async function logout(): Promise<ApiResponse<{}>> {
  return fetchAPI<{}>('/api/auth/logout', {
    method: 'POST',
  });
}

/**
 * Get current user profile
 */
export async function getCurrentUser(): Promise<ApiResponse<User>> {
  return fetchAPI<User>('/api/auth/me');
}

/**
 * Update current user profile
 */
export async function updateProfile(updates: {
  firstName?: string;
  lastName?: string;
  phone?: string;
  fragmentPoints?: number;
}): Promise<ApiResponse<User>> {
  return fetchAPI<User>('/api/auth/me', {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

// ==================== REWARDS API ====================

export interface RewardClaim {
  _id: string;
  userId: string;
  pointsUsed: number;
  rewardType: 'free_product' | 'discount' | 'cashback';
  status: 'pending' | 'fulfilled' | 'cancelled';
  claimedAt: string;
  fulfilledAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Claim a reward
 */
export async function claimReward(rewardType: 'free_product' | 'discount' | 'cashback'): Promise<ApiResponse<{ claim: RewardClaim; message: string }>> {
  return fetchAPI<{ claim: RewardClaim; message: string }>('/api/rewards/claim', {
    method: 'POST',
    body: JSON.stringify({ rewardType }),
  });
}

/**
 * Get reward claim history
 */
export async function getRewardHistory(): Promise<ApiResponse<RewardClaim[]>> {
  return fetchAPI<RewardClaim[]>('/api/rewards/history');
}

// ==================== UPLOAD API ====================

/**
 * Upload design image
 */
export async function uploadDesign(file: File): Promise<ApiResponse<{ url: string; publicId: string }>> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload/design', {
    method: 'POST',
    body: formData,
  });

  return response.json();
}

/**
 * Upload product image (admin only)
 */
export async function uploadProductImage(file: File): Promise<ApiResponse<{ url: string; publicId: string }>> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload/product', {
    method: 'POST',
    body: formData,
  });

  return response.json();
}

/**
 * Delete image
 */
export async function deleteImage(publicId: string): Promise<ApiResponse<{}>> {
  return fetchAPI<{}>(`/api/upload/${encodeURIComponent(publicId)}`, {
    method: 'DELETE',
  });
}

// ==================== ADMIN API ====================

export interface AdminOrdersQuery {
  page?: number;
  limit?: number;
  status?: string;
  paymentStatus?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AdminUsersQuery {
  page?: number;
  limit?: number;
  role?: 'customer' | 'admin';
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface BulkProductOperation {
  operation: 'delete' | 'update' | 'updateStock' | 'toggleFeatured' | 'setCategory';
  productIds: string[];
  updates?: {
    stock?: number;
    category?: string;
    [key: string]: any;
  };
}

/**
 * Get all orders (admin only)
 */
export async function getAdminOrders(query?: AdminOrdersQuery): Promise<ApiResponse<Order[]>> {
  const params = new URLSearchParams();
  if (query?.page) params.append('page', query.page.toString());
  if (query?.limit) params.append('limit', query.limit.toString());
  if (query?.status) params.append('status', query.status);
  if (query?.paymentStatus) params.append('paymentStatus', query.paymentStatus);
  if (query?.search) params.append('search', query.search);
  if (query?.sortBy) params.append('sortBy', query.sortBy);
  if (query?.sortOrder) params.append('sortOrder', query.sortOrder);

  const queryString = params.toString();
  const endpoint = `/api/admin/orders${queryString ? `?${queryString}` : ''}`;

  return fetchAPI<Order[]>(endpoint);
}

/**
 * Get all users (admin only)
 */
export async function getAdminUsers(query?: AdminUsersQuery): Promise<ApiResponse<User[]>> {
  const params = new URLSearchParams();
  if (query?.page) params.append('page', query.page.toString());
  if (query?.limit) params.append('limit', query.limit.toString());
  if (query?.role) params.append('role', query.role);
  if (query?.search) params.append('search', query.search);
  if (query?.sortBy) params.append('sortBy', query.sortBy);
  if (query?.sortOrder) params.append('sortOrder', query.sortOrder);

  const queryString = params.toString();
  const endpoint = `/api/admin/users${queryString ? `?${queryString}` : ''}`;

  return fetchAPI<User[]>(endpoint);
}

/**
 * Bulk product operations (admin only)
 */
export async function bulkProductOperation(operation: BulkProductOperation): Promise<ApiResponse<any>> {
  return fetchAPI<any>('/api/admin/products/bulk', {
    method: 'POST',
    body: JSON.stringify(operation),
  });
}

// ==================== SEARCH API ====================

export interface ProductSearchQuery {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  sizes?: string[];
  featured?: boolean;
  inStock?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'name' | 'newest';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Advanced product search
 */
export async function searchProducts(query: ProductSearchQuery): Promise<ApiResponse<Product[]>> {
  const params = new URLSearchParams();
  if (query.q) params.append('q', query.q);
  if (query.category) params.append('category', query.category);
  if (query.minPrice) params.append('minPrice', query.minPrice.toString());
  if (query.maxPrice) params.append('maxPrice', query.maxPrice.toString());
  if (query.colors) params.append('colors', query.colors.join(','));
  if (query.sizes) params.append('sizes', query.sizes.join(','));
  if (query.featured !== undefined) params.append('featured', query.featured.toString());
  if (query.inStock !== undefined) params.append('inStock', query.inStock.toString());
  if (query.page) params.append('page', query.page.toString());
  if (query.limit) params.append('limit', query.limit.toString());
  if (query.sortBy) params.append('sortBy', query.sortBy);
  if (query.sortOrder) params.append('sortOrder', query.sortOrder);

  const queryString = params.toString();
  return fetchAPI<Product[]>(`/api/products/search?${queryString}`);
}

/**
 * Get search suggestions
 */
export async function getSearchSuggestions(q: string, limit?: number): Promise<ApiResponse<any>> {
  const params = new URLSearchParams();
  params.append('q', q);
  if (limit) params.append('limit', limit.toString());

  return fetchAPI<any>(`/api/products/suggestions?${params.toString()}`);
}

/**
 * Get available product filters
 */
export async function getProductFilters(): Promise<ApiResponse<any>> {
  return fetchAPI<any>('/api/products/filters');
}

// ==================== ANALYTICS API (ADMIN) ====================

export interface AnalyticsQuery {
  period?: '7days' | '30days' | '90days' | '1year' | 'all';
  startDate?: string;
  endDate?: string;
  category?: string;
}

/**
 * Get sales analytics (admin only)
 */
export async function getSalesAnalytics(query?: AnalyticsQuery): Promise<ApiResponse<any>> {
  const params = new URLSearchParams();
  if (query?.period) params.append('period', query.period);
  if (query?.startDate) params.append('startDate', query.startDate);
  if (query?.endDate) params.append('endDate', query.endDate);

  const queryString = params.toString();
  return fetchAPI<any>(`/api/admin/analytics/sales${queryString ? `?${queryString}` : ''}`);
}

/**
 * Get customer analytics (admin only)
 */
export async function getCustomerAnalytics(query?: AnalyticsQuery): Promise<ApiResponse<any>> {
  const params = new URLSearchParams();
  if (query?.period) params.append('period', query.period);

  const queryString = params.toString();
  return fetchAPI<any>(`/api/admin/analytics/customers${queryString ? `?${queryString}` : ''}`);
}

/**
 * Get product analytics (admin only)
 */
export async function getProductAnalytics(query?: AnalyticsQuery): Promise<ApiResponse<any>> {
  const params = new URLSearchParams();
  if (query?.period) params.append('period', query.period);
  if (query?.category) params.append('category', query.category);

  const queryString = params.toString();
  return fetchAPI<any>(`/api/admin/analytics/products${queryString ? `?${queryString}` : ''}`);
}

/**
 * Update order (admin only)
 */
export async function updateOrder(orderId: string, updates: Partial<Order>): Promise<ApiResponse<Order>> {
  return fetchAPI<Order>(`/api/admin/orders/${orderId}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

/**
 * Delete user (admin only)
 */
export async function deleteUser(userId: string): Promise<ApiResponse<any>> {
  return fetchAPI<any>(`/api/admin/users/${userId}`, {
    method: 'DELETE',
  });
}
