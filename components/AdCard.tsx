"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

interface AdCardProps {
    image: string;
    title: string;
    redirectUrl: string;
}

export default function AdCard({ image, title, redirectUrl }: AdCardProps) {
    return (
        <Link
            href={redirectUrl}
            className="group relative block w-full aspect-[4/3] overflow-hidden rounded-xl bg-gray-100 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
            {/* Background Image */}
            <Image
                src={image}
                alt={title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 w-full p-4 md:p-5">
                <div className="flex items-end justify-between gap-2">
                    <h3 className="text-lg md:text-xl font-bold text-white leading-tight line-clamp-2">
                        {title}
                    </h3>
                    <div className="flex-shrink-0 rounded-full bg-white/20 p-2 backdrop-blur-sm transition-colors group-hover:bg-white/30">
                        <ArrowUpRight className="h-5 w-5 text-white" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
