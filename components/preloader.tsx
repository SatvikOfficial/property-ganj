"use client"

import Lottie from "lottie-react";
import animationData from "@/public/home.json";

export default function Preloader() {
  return (
    <div className="fixed inset-0 bg-background z-[10000] flex items-center justify-center">
      <div className="w-64 h-64">
        <Lottie animationData={animationData} loop={true} />
      </div>
    </div>
  );
}
