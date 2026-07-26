"use client";

import { useEffect, useState } from "react";

interface TypingTextProps {
  words: string[];
  className?: string;
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
}

export function TypingText({
  words,
  className = "",
  typeSpeed = 120,
  deleteSpeed = 70,
  pauseDuration = 1800,
}: TypingTextProps) {
  const [display, setDisplay] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex % words.length];

    if (!isDeleting && display === current) {
      const timer = setTimeout(() => setIsDeleting(true), pauseDuration);
      return () => clearTimeout(timer);
    }

    if (isDeleting && display === "") {
      setIsDeleting(false);
      setWordIndex((i) => i + 1);
      return;
    }

    const nextChar = isDeleting
      ? current.slice(0, display.length - 1)
      : current.slice(0, display.length + 1);

    const timer = setTimeout(
      () => setDisplay(nextChar),
      isDeleting ? deleteSpeed : typeSpeed,
    );

    return () => clearTimeout(timer);
  }, [display, isDeleting, wordIndex, words, typeSpeed, deleteSpeed, pauseDuration]);

  return (
    <span className={className}>
      {display}
      <span className="animate-pulse">|</span>
    </span>
  );
}
