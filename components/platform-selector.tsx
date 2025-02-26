"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export type MessagePlatform = "linkedin" | "email";

interface PlatformOption {
  id: MessagePlatform;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface PlatformSelectorProps {
  onSelect: (platform: MessagePlatform) => void;
}

export function PlatformSelector({ onSelect }: PlatformSelectorProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<MessagePlatform>("linkedin");

  const platformOptions: PlatformOption[] = [
    {
      id: "linkedin",
      title: "LinkedIn Message",
      description: "For direct LinkedIn messaging",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
    },
    {
      id: "email",
      title: "Email",
      description: "For email outreach",
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
            d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
          />
        </svg>
      ),
    },
  ];

  const handleSelect = (platform: MessagePlatform) => {
    setSelectedPlatform(platform);
    onSelect(platform);
  };

  return (
    <div className="w-full">
      <h3 className="mb-4 text-sm font-medium">Select Platform</h3>
      <div className="grid grid-cols-2 gap-4">
        {platformOptions.map((option) => (
          <motion.div
            key={option.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(option.id)}
            className={`cursor-pointer rounded-lg border p-4 transition-colors ${
              selectedPlatform === option.id
                ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20"
                : "border-gray-200 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-800"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`rounded-full p-2 ${
                  selectedPlatform === option.id
                    ? "bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                }`}
              >
                {option.icon}
              </div>
              <div>
                <h4 className="font-medium">{option.title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {option.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 