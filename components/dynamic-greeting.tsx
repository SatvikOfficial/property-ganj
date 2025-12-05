"use client"

import { useState, useEffect } from 'react';
import TypingAnimatedText from '@/components/ui/typing';

const greetings = [
  { greeting: 'Good Morning', image: '/assets/sunrise.gif' },
  { greeting: 'Good Afternoon', image: '/assets/sunevening.gif' },
  { greeting: 'Good Evening', image: 'assets/sunset.webp' },
];

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return greetings[0];
  } else if (hour >= 12 && hour < 17) {
    return greetings[1];
  } else {
    return greetings[2];
  }
};

export default function DynamicGreeting() {
  const [greetingMessages, setGreetingMessages] = useState<React.ReactNode[]>(['Welcome back!', '']);
  const [greetingIndex, setGreetingIndex] = useState(0);

  useEffect(() => {
    const greeting = getGreeting();
    setGreetingMessages([
      'Welcome back!',
      <span key="dynamic-greeting" className="flex items-center gap-2">
        {greeting.greeting}
        <img
          src={greeting.image}
          alt={greeting.greeting}
          className="h-8 w-8 md:h-10 md:w-10 object-contain inline-block"
        />
      </span>
    ]);
  }, []);

  // Greeting messages rotation
  useEffect(() => {
    const greetingInterval = setInterval(() => {
      setGreetingIndex((prevIndex) => (prevIndex + 1) % greetingMessages.length);
    }, 5000);

    return () => clearInterval(greetingInterval);
  }, [greetingMessages]);

  return (
    <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-2 md:mb-3">
      <div className="relative h-8 md:h-10 overflow-hidden">
        {greetingMessages.map((message, index) => (
          <span
            key={index}
            className={`absolute w-full transition-all duration-500 ${index === greetingIndex ? 'opacity-100 transform-none' : 'opacity-0 -translate-y-4'
              }`}
          >
            <span className="text-primary whitespace-nowrap">{message}</span>
          </span>
        ))}
      </div>
      <div className="mt-1 md:mt-2 text-primary block overflow-hidden">
        <TypingAnimatedText
          delayBeforeDelete={3000} // Changed to 3 seconds as requested
        />
      </div>
    </h1>
  );
}