export interface Product {
  id: number
  name: string
  price: number
  description: string
  image: string
  category: string
  colors?: string[]
  sizes?: string[]
}

export const categories = [
  { slug: "all", name: "All" },
  { slug: "hoodies", name: "Hoodies" },
  { slug: "tshirts", name: "T-Shirts" },
  { slug: "accessories", name: "Accessories" },
]

export const products: Product[] = [
  // THIS SECTION FOR HOODIES
  {
    id: 1,
    name: "OIKO Hoodie 01",
    price: 199,
    description: "Made to belong.",
    image: "/images/collections/cozyguyhoodie.png",
    category: "hoodies",
    colors: ["grey", "black",],
    sizes: ["S", "M", "L",],
  },
  {
    id: 4,
    name: "OIKO Hoodie 02",
    price: 199,
    description: "Made to belong.",
    image: "/images/collections/winterhoodie.png",
    category: "hoodies",
    colors: ["white", "bage"],
    sizes: ["S", "M", "L",],
  },
  // THIS SECTION FOR T-SHIRTS
  {
    id: 2,
    name: "OIKO T-Shirt Core",
    price: 149,
    description: "Made to belong.",
    image: "/images/collections/guytshirt.png",
    category: "tshirts",
    colors: ["black", "white"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 7,
    name: "OIKO T-Shirt 02",
    price: 149,
    description: "Made to belong.",
    image: "/images/collections/sasuketshirt.png",
    category: "tshirts",
    colors: ["black", "white"],
    sizes: ["S", "M", "L", "XL"],
  },
  // THIS SECTION FOR ACCESSORIES
  // HATS
  {
    id: 3,
    name: "OIKO Hat 01",
    price: 15.99,
    description: "Made to belong.",
    image: "/images/accessories/hats.png",
    category: "hats",
    colors: ["black", "brown"],
    sizes: ["One Size"],
  },
  // SOCKS
  {
    id: 5,
    name: "OIKO Socks Core",
    price: 9.99,
    description: "Made to belong.",
    image: "/images/accessories/socks.png",
    category: "socks",
    colors: ["white", "black", "gray"],
    sizes: ["S", "M", "L"],
  },
  // TOTE BAGS
  {
    id: 6,
    name: "OIKO Tote 01",
    price: 24.99,
    description: "Made to belong.",
    image: "/images/accessories/totebags.png",
    category: "totebags",
    colors: ["beige", "black"],
    sizes: ["One Size"],
  }
]

// Helper function to get products by category
export function getProductsByCategory(category: string): Product[] {
  if (category === "all") return products

  // For accessories, return all hats, socks, and totebags
  if (category === "accessories") {
    return products.filter(p =>
      ["hats", "socks", "totebags"].includes(p.category.toLowerCase())
    )
  }

  return products.filter(p => p.category.toLowerCase() === category.toLowerCase())
}

// Helper function to get a single product by ID
export function getProductById(id: number): Product | undefined {
  return products.find(product => product.id === id)
}
