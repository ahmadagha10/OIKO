"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart } from "lucide-react";
import Image from "next/image";

interface Animation {
    id: number;
    type: 'cart' | 'wishlist';
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    image?: string;
}

interface AnimationContextType {
    triggerFlyTo: (
        type: 'cart' | 'wishlist',
        sourceRef: React.RefObject<HTMLElement | null>,
        targetId: string,
        image?: string
    ) => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export function AnimationProvider({ children }: { children: ReactNode }) {
    const [activeAnimations, setActiveAnimations] = useState<Animation[]>([]);

    const triggerFlyTo = (
        type: 'cart' | 'wishlist',
        sourceRef: React.RefObject<HTMLElement | null>,
        targetId: string,
        image?: string
    ) => {
        const sourceRect = sourceRef.current?.getBoundingClientRect();
        const targetRect = document.getElementById(targetId)?.getBoundingClientRect();

        if (sourceRect && targetRect) {
            const newAnim: Animation = {
                id: Date.now(),
                type,
                startX: sourceRect.left + sourceRect.width / 2,
                startY: sourceRect.top + sourceRect.height / 2,
                endX: targetRect.left + targetRect.width / 2,
                endY: targetRect.top + targetRect.height / 2,
                image,
            };
            setActiveAnimations((prev) => [...prev, newAnim]);
            // Cleanup
            setTimeout(() => {
                setActiveAnimations((prev) => prev.filter((a) => a.id !== newAnim.id));
            }, 1000);
        }
    };

    return (
        <AnimationContext.Provider value={{ triggerFlyTo }}>
            {children}
            <div className="fixed inset-0 pointer-events-none z-[9999]">
                <AnimatePresence>
                    {activeAnimations.map((anim) => (
                        <motion.div
                            key={anim.id}
                            initial={{
                                x: anim.startX - 10,
                                y: anim.startY - 10,
                                scale: 1,
                                opacity: 1
                            }}
                            animate={{
                                x: anim.endX - 10,
                                y: anim.endY - 10,
                                scale: 0.1,
                                opacity: 0
                            }}
                            transition={{
                                duration: 0.8,
                                ease: [0.16, 1, 0.3, 1],
                                opacity: { duration: 0.7, delay: 0.1 }
                            }}
                            className="absolute"
                            style={{ left: 0, top: 0 }}
                        >
                            {anim.type === 'wishlist' ? (
                                <Heart className="h-6 w-6 text-red-500 fill-red-500 drop-shadow-lg" />
                            ) : (
                                <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-white shadow-xl bg-muted">
                                    {anim.image && (
                                        <Image
                                            src={anim.image}
                                            alt="Flying Item"
                                            width={48}
                                            height={48}
                                            className="object-cover"
                                        />
                                    )}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </AnimationContext.Provider>
    );
}

export function useAnimation() {
    const context = useContext(AnimationContext);
    if (context === undefined) {
        throw new Error("useAnimation must be used within an AnimationProvider");
    }
    return context;
}
