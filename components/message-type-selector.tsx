"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessagePlatform } from "./platform-selector";

export type MessageType = 
  | "casual-networking"
  | "referral-request"
  | "alumni-connection"
  | "cold-outreach"
  | "cold-email"
  | "job-application"
  | "job-post-response";

interface MessageTypeOption {
  id: MessageType;
  title: string;
  description: string;
  icon: React.ReactNode;
  platforms: MessagePlatform[]; // Which platforms this message type is available for
}

interface MessageTypeSelectorProps {
  onSelect: (type: MessageType) => void;
  platform: MessagePlatform; // Add platform prop
  currentTab: "profile" | "job" | "feed"; // Add currentTab prop
}

export function MessageTypeSelector({ onSelect, platform, currentTab }: MessageTypeSelectorProps) {
  const [selectedType, setSelectedType] = useState<MessageType | null>(null);

  // Define all message type options with platform availability
  const allMessageTypeOptions: MessageTypeOption[] = [
    {
      id: "casual-networking",
      title: "Casual Networking",
      description: "Connect with professionals in your industry",
      platforms: ["linkedin", "email"],
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
            d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
          />
        </svg>
      ),
    },
    {
      id: "referral-request",
      title: "Referral Request",
      description: "Ask for a job referral",
      platforms: ["linkedin", "email"],
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
            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
          />
        </svg>
      ),
    },
    {
      id: "alumni-connection",
      title: "Alumni Connection",
      description: "Connect with fellow alumni",
      platforms: ["linkedin", "email"],
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
            d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
          />
        </svg>
      ),
    },
    {
      id: "cold-outreach",
      title: "Cold Outreach",
      description: "Reach out for collaboration",
      platforms: ["linkedin"], // Only for LinkedIn
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
            d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
          />
        </svg>
      ),
    },
    {
      id: "cold-email",
      title: "Cold Email",
      description: "Email someone you don't know",
      platforms: ["email"], // Only for Email
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
            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
          />
        </svg>
      ),
    },
    {
      id: "job-application",
      title: "Job Application",
      description: "Reach out about a job posting",
      platforms: ["linkedin", "email"],
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
            d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
          />
        </svg>
      ),
    },
    {
      id: "job-post-response",
      title: "Job Post Response",
      description: "Respond to a job mentioned in a LinkedIn post",
      platforms: ["linkedin", "email"],
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
            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
          />
        </svg>
      ),
    },
  ];

  // Filter message types based on the selected platform and current tab
  const messageTypeOptions = allMessageTypeOptions.filter(option => {
    // Filter by platform first
    const platformMatch = option.platforms.includes(platform);
    
    // Then filter by tab
    if (currentTab === "profile") {
      // Hide job-related types on profile tab
      return platformMatch && option.id !== "job-application" && option.id !== "job-post-response";
    } else if (currentTab === "job") {
      // On job tab, show all types but prioritize job application in UI
      return platformMatch;
    } else if (currentTab === "feed") {
      // On feed tab, show all types but prioritize job post response in UI
      return platformMatch;
    }
    
    return platformMatch;
  });

  // Reset selected type when platform changes
  useEffect(() => {
    setSelectedType(null);
  }, [platform]);

  const handleSelect = (type: MessageType) => {
    setSelectedType(type);
    onSelect(type);
  };

  return (
    <div className="w-full">
      <h3 className="mb-4 text-sm font-medium">Select Message Type</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {messageTypeOptions.map((option) => (
          <motion.div
            key={option.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(option.id)}
            className={`cursor-pointer rounded-lg border p-4 transition-colors ${
              selectedType === option.id
                ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20"
                : "border-gray-200 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-800"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`rounded-full p-2 ${
                  selectedType === option.id
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