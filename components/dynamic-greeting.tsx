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
  const [greetingMessages, setGreetingMessages] = useState(['Welcome back!', '']);
  const [greetingIndex, setGreetingIndex] = useState(0);
  
  const typewriterMessages = [
    "A new address. A new way to live.",
    "Every new home starts a new story.",
    "Your next address isn't just a place — it's progress.",
    "Because every move should move your life forward.",
    "Turn your next address into your next chapter.",
    "Find the home that changes everything.",
    "New address, new beginnings — your story awaits.",
    "Where your next address becomes your next upgrade.",
    "Redefine your world, one home at a time.",
    "Life looks different from a better address."
  ];
  
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(100);

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

  // Typewriter animation
  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % typewriterMessages.length;
      const fullText = typewriterMessages[i];

      if (isDeleting) {
        setCurrentText(fullText.substring(0, currentText.length - 1));
        setTypingSpeed(50);
      } else {
        setCurrentText(fullText.substring(0, currentText.length + 1));
        setTypingSpeed(100);
      }

      if (!isDeleting && currentText === fullText) {
        setTimeout(() => setIsDeleting(true), 5000); // Stay for 5 seconds
      } else if (isDeleting && currentText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, loopNum, typewriterMessages]);

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
      <span className="text-primary block mt-2">
        {currentText}
        <span className="ml-1 inline-block w-2 h-6 bg-current animate-pulse"></span>
      </span>
    </h1>
  );
}
