"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export type MessageLength = "short" | "medium" | "long";

interface MessageLengthOption {
  id: MessageLength;
  title: string;
  description: string;
  wordCount: string;
}

interface MessageLengthSelectorProps {
  onSelect: (length: MessageLength) => void;
}

export function MessageLengthSelector({ onSelect }: MessageLengthSelectorProps) {
  const [selectedLength, setSelectedLength] = useState<MessageLength>("short");

  const lengthOptions: MessageLengthOption[] = [
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