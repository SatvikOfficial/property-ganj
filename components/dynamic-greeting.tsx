"use client"

import { useState, useEffect } from 'react';

const greetings = [
  { greeting: '<br>Good Morning', emoji: '☀️' },
  { greeting: '<br>Good Afternoon', emoji: '🌤️' },
  { greeting: 'Good Evening', emoji: '🌙' },
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
  const [messages, setMessages] = useState(['Welcome back!', '']);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const greeting = getGreeting();
    setMessages(['Welcome back!', `${greeting.greeting} ${greeting.emoji}`]);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [messages]);

  return (
    <h1 className="text-4xl font-bold text-foreground mb-3">
      <div className="relative h-10">
        {messages.map((message, index) => (
          <span
            key={index}
            className={`absolute w-full transition-all duration-500 ${
              index === currentIndex ? 'opacity-100 transform-none' : 'opacity-0 -translate-y-4'
            }`}
          >
            <span className="text-primary">{message}</span>
          </span>
        ))}
      </div>
      <span className="text-primary block">Every new home starts a new story.</span>
    </h1>
  );
}
