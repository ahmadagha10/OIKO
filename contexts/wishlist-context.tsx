"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Product } from "@/lib/products";

interface WishlistContextType {
    items: Product[];
    isInitialized: boolean;
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (productId: number) => void;
    isInWishlist: (productId: number) => boolean;
    toggleWishlist: (product: Product) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<Product[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load wishlist from localStorage on mount
    useEffect(() => {
        const savedWishlist = localStorage.getItem("wishlist");
        if (savedWishlist) {
            try {
                setItems(JSON.parse(savedWishlist));
            } catch (e) {
                console.error("Failed to parse wishlist from localStorage", e);
            }
        }
        setIsInitialized(true);
    }, []);

    // Save wishlist to localStorage whenever it changes, but only after initialization
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("wishlist", JSON.stringify(items));
        }
    }, [items, isInitialized]);

    const addToWishlist = (product: Product) => {
        setItems((prevItems) => {
            if (prevItems.some((item) => item.id === product.id)) {
                return prevItems;
            }
            return [...prevItems, product];
        });
    };

    const removeFromWishlist = (productId: number) => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    };

    const isInWishlist = (productId: number) => {
        return items.some((item) => item.id === productId);
    };

    const toggleWishlist = (product: Product) => {
        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <WishlistContext.Provider
            value={{
                items,
                isInitialized,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
                toggleWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
}
