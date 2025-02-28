"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export type MessageLength = "very-short" | "short" | "medium" | "long";

interface MessageLengthOption {
  id: MessageLength;
  title: string;
  description: string;
  wordCount: string;
  icon?: React.ReactNode;
}

interface MessageLengthSelectorProps {
  onSelect: (length: MessageLength) => void;
}

export function MessageLengthSelector({ onSelect }: MessageLengthSelectorProps) {
  const [selectedLength, setSelectedLength] = useState<MessageLength>("short");

  const lengthOptions: MessageLengthOption[] = [
    {
      id: "very-short",
      title: "Very Short",
      description: "25-50 words, brief and human-like",
      wordCount: "25-50 words",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 9h16.5m-16.5 6.75h6"
          />
        </svg>
      ),
    },
    {
      id: "short",
      title: "Short",
      description: "Brief and to the point",
      wordCount: "50-100 words",
    },
    {
      id: "medium",
      title: "Medium",
      description: "Balanced length",
      wordCount: "100-150 words",
    },
    {
      id: "long",
      title: "Long",
      description: "More detailed",
      wordCount: "150-200 words",
    },
  ];

  const handleSelect = (length: MessageLength) => {
    setSelectedLength(length);
    onSelect(length);
  };

  return (
    <div className="w-full">
      <h3 className="mb-4 text-sm font-medium">Select Message Length</h3>
      <div className="grid grid-cols-3 gap-4">
        {lengthOptions.map((option) => (
          <motion.div
            key={option.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(option.id)}
            className={`cursor-pointer rounded-lg border p-4 transition-colors ${
              selectedLength === option.id
                ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20"
                : "border-gray-200 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-800"
            }`}
          >
            <div className="flex flex-col items-start gap-2">
              <h4 className="font-medium">{option.title}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {option.description}
              </p>
              <span className="mt-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                {option.wordCount}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 