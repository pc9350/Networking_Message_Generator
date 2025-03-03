"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ClipboardDocumentIcon, CheckIcon } from "@heroicons/react/24/outline";

interface MessageDisplayProps {
  message: string;
  isLoading: boolean;
}

export function MessageDisplay({ message, isLoading }: MessageDisplayProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex space-x-2">
          <div className="h-3 w-3 animate-bounce rounded-full bg-gray-400 [animation-delay:0.2s]"></div>
          <div className="h-3 w-3 animate-bounce rounded-full bg-gray-400 [animation-delay:0.4s]"></div>
          <div className="h-3 w-3 animate-bounce rounded-full bg-gray-400 [animation-delay:0.6s]"></div>
        </div>
        <p className="mt-4 text-sm text-gray-500">Generating your message...</p>
      </div>
    );
  }

  if (!message) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-6 text-center">
        <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6 text-gray-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-sm font-medium">No message generated yet</h3>
        <p className="mt-1 text-xs text-gray-500">
          Enter a LinkedIn URL and select a message type to generate a personalized message
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-soft"
    >
      <div className="absolute right-4 top-4">
        <button
          onClick={copyToClipboard}
          className="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
          aria-label="Copy to clipboard"
        >
          {copied ? (
            <CheckIcon className="h-5 w-5 text-green-500" />
          ) : (
            <ClipboardDocumentIcon className="h-5 w-5" />
          )}
        </button>
      </div>
      <h3 className="mb-4 text-lg font-medium">Your Personalized Message</h3>
      <div className="whitespace-pre-wrap text-sm">{message}</div>
      <div className="mt-6 flex justify-center">
        <button
          onClick={copyToClipboard}
          className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-6 py-2.5 text-base font-medium text-white shadow-md hover:bg-primary-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all"
        >
          {copied ? "Copied!" : "Copy to Clipboard"}
          {copied ? (
            <CheckIcon className="h-5 w-5" />
          ) : (
            <ClipboardDocumentIcon className="h-5 w-5" />
          )}
        </button>
      </div>
    </motion.div>
  );
} 