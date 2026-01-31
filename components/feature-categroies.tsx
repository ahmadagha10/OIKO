import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

// Define categories as an array
const categories = [
    {
        name: "Hoodies",
        slug: "hoodies",
        image: "/hoodie.png",
        description: "Hoodies",
        src: "/images/hoodies.png"
    },
    {
        name: "T-shirts",
        slug: "T-shirts",
        image: "/elegant-black-abaya-on-model.jpg",
        description: "T-shirts",
    },
    {
        name: "hats",
        slug: "hats",
        image: "/placeholder.svg?height=600&width=400",
        description: "Hats",
    },
    {
        name: "sucks", // Example of a new static category
        slug: "sucks",
        image: "/kids-collection.jpg",
        description: "Sucks",
    },
];

export default function FeaturedCategories() {
    return (
        <section className="container mx-auto px-4 py-20">
            {/* Section Header */}
            <div className="text-center space-y-4 mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
                    Explore our collections
                </h2>
                <p className="text-muted-foreground text-pretty max-w-2xl mx-auto">
                    
                </p>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {categories.map((category) => (
                    <Link
                        key={category.slug}
                        href={`/products?category=${category.slug}`}
                        className="group relative h-[400px] overflow-hidden rounded-lg"
                    >
                        <Image
                            src={category.image}
                            alt={`${category.name} Collection`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-foreground/0" />
                        <div className="absolute bottom-6 left-6 text-background">
                            <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                            <p className="text-sm text-background/80 mb-3">{category.description}</p>
                            <Button
                                variant="outline"
                                size="sm"
                                className="bg-background/10 border-background text-background hover:bg-background hover:text-foreground"
                            >
                                View Collection
                            </Button>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
