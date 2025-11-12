"use client"

import { useState, useEffect } from 'react';
import TypingAnimatedText from '@/components/ui/typing';

const greetings = [
  { greeting: 'Good Morning', emoji: '🌅' },
  { greeting: 'Good Afternoon', emoji: '🌇' },
  { greeting: 'Good Evening', emoji: '🌆' },
];

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) {
    return greetings[0];
  } else if (hour < 18) {
    return greetings[1];
  } else {
    return greetings[2];
  }
};

export default function DynamicGreeting() {
  const [greetingMessages, setGreetingMessages] = useState(['Welcome back!', '']);
  const [greetingIndex, setGreetingIndex] = useState(0);

  useEffect(() => {
    const greeting = getGreeting();
    setGreetingMessages(['Welcome back!', `${greeting.greeting} ${greeting.emoji}`]);
  }, []);

  // Greeting messages rotation
  useEffect(() => {
    const greetingInterval = setInterval(() => {
      setGreetingIndex((prevIndex) => (prevIndex + 1) % greetingMessages.length);
    }, 5000);

    return () => clearInterval(greetingInterval);
  }, [greetingMessages]);

  return (
    <h1 className="text-4xl font-bold text-foreground mb-3">
      <div className="relative h-10">
        {greetingMessages.map((message, index) => (
          <span
            key={index}
            className={`absolute w-full transition-all duration-500 ${
              index === greetingIndex ? 'opacity-100 transform-none' : 'opacity-0 -translate-y-4'
            }`}
          >
            <span className="text-primary">{message}</span>
          </span>
        ))}
      </div>
      <div className="mt-2 text-primary block">
        <TypingAnimatedText 
          delayBeforeDelete={3000} // Changed to 3 seconds as requested
        />
      </div>
    </h1>
  );
}