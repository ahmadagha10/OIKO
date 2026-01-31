"use client";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface GibberishTextProps {
    /**
     * The text to animate.
     */
    text: string;

    /**
     * The class name to apply to each letter.
     */
    className?: string;

    /**
     * The duration of the animation in seconds.
     * If not provided, a random duration between 120ms and 360ms will be used.
     */
    duration?: number;

    /**
     * The delay before the animation starts in seconds.
     * Default is 0.
     */
    delay?: number;
}

const Letter = ({ letter, className, duration, delay }: { letter: string; className?: string; duration?: number; delay?: number }) => {
    const [code, setCode] = useState(letter.toUpperCase().charCodeAt(0));

    useEffect(() => {
        let count = duration ? Math.floor((duration * 1000) / 24) : Math.floor(Math.random() * 10) + 5;
        let interval: NodeJS.Timeout;

        const startAnimation = () => {
            interval = setInterval(() => {
                setCode(() => Math.floor(Math.random() * 26) + 65);
                count--;
                if (count === 0) {
                    setCode(letter.toUpperCase().charCodeAt(0));
                    clearInterval(interval);
                }
            }, 24);
        };

        let timeout: NodeJS.Timeout;
        if (delay) {
            timeout = setTimeout(startAnimation, delay * 1000);
        } else {
            startAnimation();
        }

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [letter, duration, delay]);

    return (
        <span className={cn("whitespace-pre text-foreground", className)}>
            {String.fromCharCode(code)}
        </span>
    );
};

/**
 * Animate each letter in the text using gibberish text effect.
 * Renders a random letter first and then animates it to the correct letter.
 */
export default function GibberishText({ text, className, duration, delay }: GibberishTextProps) {
    return (
        <>
            {text.split("").map((letter, index) => {
                return (
                    <Letter
                        className={className}
                        letter={letter}
                        key={`${index}-${letter}`}
                        duration={duration}
                        delay={delay}
                    />
                );
            })}
        </>
    );
}
