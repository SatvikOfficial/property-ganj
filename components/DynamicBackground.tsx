"use client";

import React from "react";

type Variant = "landing" | "blog" | "tools";

interface DynamicBackgroundProps {
    variant?: Variant;
}

export default function DynamicBackground({ variant = "landing" }: DynamicBackgroundProps) {
    // Specific configurations for each variant
    const getVariantStyles = () => {
        switch (variant) {
            case "landing":
                return {
                    container: "bg-black",
                    // Vibrant Orange/Red/Yellow blobs for "Orange Black kind of background"
                    blob1: "bg-orange-600",
                    blob2: "bg-red-600",
                    blob3: "bg-yellow-600",
                    overlay: "bg-black/20", // Light overlay to keep colors visible
                };
            case "blog":
                return {
                    container: "bg-slate-900",
                    // Deep Purple/Blue for Blog
                    blob1: "bg-purple-600",
                    blob2: "bg-blue-600",
                    blob3: "bg-indigo-600",
                    overlay: "bg-black/30",
                };
            case "tools":
                return {
                    container: "bg-gray-900",
                    // Teal/Emerald for Tools
                    blob1: "bg-teal-600",
                    blob2: "bg-emerald-600",
                    blob3: "bg-cyan-600",
                    overlay: "bg-black/30",
                };
            default:
                return {
                    container: "bg-black",
                    blob1: "bg-primary",
                    blob2: "bg-secondary",
                    blob3: "bg-accent",
                    overlay: "bg-black/20",
                };
        }
    };

    const styles = getVariantStyles();

    return (
        <div className={`absolute inset-0 z-0 overflow-hidden ${styles.container}`}>
            {/* Animated Blobs - Increased opacity and size for visibility */}
            <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full mix-blend-screen filter blur-[80px] opacity-60 animate-blob ${styles.blob1}`}></div>
            <div className={`absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full mix-blend-screen filter blur-[80px] opacity-60 animate-blob animation-delay-2000 ${styles.blob2}`}></div>
            <div className={`absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] rounded-full mix-blend-screen filter blur-[80px] opacity-60 animate-blob animation-delay-4000 ${styles.blob3}`}></div>

            {/* Grid Pattern Overlay for texture */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>

            {/* Final Overlay */}
            <div className={`absolute inset-0 ${styles.overlay}`}></div>
        </div>
    );
}
