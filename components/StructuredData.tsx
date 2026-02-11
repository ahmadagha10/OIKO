/**
 * Structured Data Component for SEO
 * Provides JSON-LD markup for better search engine understanding
 */

interface OrganizationSchemaProps {
  name?: string;
  url?: string;
  logo?: string;
  sameAs?: string[];
}

export function OrganizationSchema({
  name = "Oiko",
  url = "https://oiko.com",
  logo = "https://oiko.com/bar.svg",
  sameAs = [
    "https://www.instagram.com/oikoksa/",
    "https://tiktok.com/@oiko"
  ]
}: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": name,
    "url": url,
    "logo": logo,
    "description": "Premium custom streetwear brand in Saudi Arabia offering hoodies, t-shirts, and accessories with custom design options and try before you buy service.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "SA",
      "addressRegion": "Riyadh"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "email": "support@oiko.com"
    },
    "sameAs": sameAs
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

interface ProductSchemaProps {
  product: Product;
  url: string;
}

export function ProductSchema({ product, url }: ProductSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": `https://oiko.com${product.image}`,
    "url": url,
    "brand": {
      "@type": "Brand",
      "name": "Oiko"
    },
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "SAR",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Oiko"
      }
    },
    "category": product.category
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Oiko",
    "url": "https://oiko.com",
    "description": "Premium custom streetwear in Saudi Arabia",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://oiko.com/products?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema({ items }: { items: Array<{ name: string; url: string }> }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://oiko.com${item.url}`
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
