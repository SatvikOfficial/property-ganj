"use client";

import { useEffect, useState, useRef } from "react";

function TypingText({
  words = [
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
  ],
  typingSpeed = 100,
  deleteSpeed = 50,
  delayBeforeDelete = 5000, // 5 seconds as requested
}: {
  words?: string[];
  typingSpeed?: number;
  deleteSpeed?: number;
  delayBeforeDelete?: number;
}) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  
  // Use refs to track current state to avoid stale closures in recursive timeouts
  const currentTextRef = useRef(currentText);
  const isDeletingRef = useRef(isDeleting);
  const currentWordIndexRef = useRef(currentWordIndex);

  // Update refs when state changes
  useEffect(() => {
    currentTextRef.current = currentText;
  }, [currentText]);

  useEffect(() => {
    isDeletingRef.current = isDeleting;
  }, [isDeleting]);

  useEffect(() => {
    currentWordIndexRef.current = currentWordIndex;
  }, [currentWordIndex]);

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  // Initialize typing
  useEffect(() => {
    const startTyping = () => {
      typeWord();
    };
    
    const timer = setTimeout(startTyping, 100);
    return () => clearTimeout(timer);
  }, []);

  const typeWord = () => {
    const currentWord = words[currentWordIndexRef.current];
    
    if (!isDeletingRef.current) {
      // Typing forward
      if (currentTextRef.current.length < currentWord.length) {
        const nextCharIndex = currentTextRef.current.length;
        setCurrentText(currentWord.substring(0, nextCharIndex + 1));
        
        setTimeout(typeWord, typingSpeed);
      } else {
        // Word fully typed, start deleting after delay
        setTimeout(() => {
          setIsDeleting(true);
          isDeletingRef.current = true;
          setTimeout(deleteWord, delayBeforeDelete);
        }, 0);
      }
    }
  };

  const deleteWord = () => {
    const currentWord = words[currentWordIndexRef.current];
    
    if (currentTextRef.current.length > 0) {
      setCurrentText(currentWord.substring(0, currentTextRef.current.length - 1));
      setTimeout(deleteWord, deleteSpeed);
    } else {
      // Finished deleting, move to next word
      setIsDeleting(false);
      isDeletingRef.current = false;
      
      // Move to next word in the array
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
      
      // Start typing the next word after a brief pause
      setTimeout(typeWord, 100);
    }
  };

  return (
    <div className="w-full">
      <div className="text-primary text-xl md:text-2xl">
        {currentText}
        <span className={`ml-1 inline-block w-2 h-6 bg-current ${showCursor ? 'opacity-100' : 'opacity-0'}`}></span>
      </div>
    </div>
  );
}

export default function TypingAnimatedText({ words, typingSpeed, deleteSpeed, delayBeforeDelete }: {
  words?: string[];
  typingSpeed?: number;
  deleteSpeed?: number;
  delayBeforeDelete?: number;
}) {
  return <TypingText words={words} typingSpeed={typingSpeed} deleteSpeed={deleteSpeed} delayBeforeDelete={delayBeforeDelete} />;
}