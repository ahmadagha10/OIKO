"use client";
import React from "react";
import { MoveRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface ArrowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text: string;
    textColor?: string;
    buttonOverlayColor?: string;
    borderColor?: string;
    iconColor?: string;
    className?: string;
}

export default function ArrowButton({
    text = "Open",
    textColor = "black",
    buttonOverlayColor = "#6b7280",
    borderColor = "black",
    iconColor = "white",
    className,
    ...props
}: ArrowButtonProps) {
    return (
        <button
            style={{ borderColor: borderColor }}
            {...props}
            className={cn(
                "group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-black bg-background px-3 py-1 text-[10px] font-bold transition duration-300 ease-out",
                className,
            )}
        >
            <span
                style={{ background: buttonOverlayColor }}
                className={cn(
                    "ease absolute inset-0 flex h-full w-full -translate-x-full items-center justify-center text-white duration-300 group-hover:translate-x-0 font-bold",
                )}
            >
                <span className="flex items-center gap-1">
                    {text} <MoveRight style={{ color: iconColor }} className="h-3 w-3" />
                </span>
            </span>
            <span
                style={{ color: textColor }}
                className={cn(
                    "absolute flex h-full w-full transform items-center justify-center transition-all duration-300 ease-in-out group-hover:translate-x-full",
                )}
            >
                {text}
            </span>
            <span className="invisible relative px-3 py-1">{text}</span>
        </button>
    );
}
