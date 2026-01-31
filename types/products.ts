
export interface Product {
  id: string               // معرف فريد للمنتج
  name: string             // اسم المنتج
  slug: string             // الرابط الصديق للـ URL
  price: number            // سعر المنتج الحالي
  originalPrice?: number   // السعر الأصلي (اختياري، للخصم)
  category: string         // الفئة التي ينتمي لها المنتج
  description: string      // وصف المنتج
  images: string[]         // مصفوفة روابط الصور
  sizes: string[]          // الأحجام المتاحة
  colors: string[]         // الألوان المتاحة
  inStock: boolean         // هل المنتج متوفر في المخزون
  featured?: boolean       // مميز أو لا (اختياري)
}
