"use client";

import { useState } from "react";
import { LinkIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

interface LinkedInUrlInputProps {
  onUrlSubmit: (url: string) => void;
}

export function LinkedInUrlInput({ onUrlSubmit }: LinkedInUrlInputProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateUrl = (input: string) => {
    if (!input.trim()) {
      setError("LinkedIn URL is required");
      return false;
    }

    const linkedInRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[\w-]+\/?$/i;
    if (!linkedInRegex.test(input)) {
      setError("Please enter a valid LinkedIn profile URL");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateUrl(url)) {
      setIsLoading(true);
      onUrlSubmit(url);
    }
  };

  return (
    <div className="w-full space-y-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
      <div>
        <h3 className="text-lg font-medium mb-2">LinkedIn Profile URL</h3>
        <p className="text-sm text-gray-500 mb-4">
          Enter a LinkedIn profile URL to extract information for message generation
        </p>
      </div>
      
      <form id="linkedin-url-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <LinkIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="linkedin-url"
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) validateUrl(e.target.value);
              }}
              placeholder="https://linkedin.com/in/username"
              className={`w-full rounded-md border ${
                error ? "border-red-500" : "border-input"
              } bg-background px-10 py-2 text-sm ring-offset-background placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="text-xs text-gray-500">
            <p>Tips:</p>
            <ul className="list-disc pl-4 mt-1">
              <li>Make sure the profile is public or you're connected to the person</li>
              <li>Copy the URL directly from the browser address bar</li>
              <li>Format should be: linkedin.com/in/username</li>
            </ul>
          </div>
        </div>
      </form>
      
      <div className="pt-4">
        <Button 
          type="submit"
          form="linkedin-url-form"
          disabled={isLoading || !url.trim()}
          className="w-full"
        >
          {isLoading ? "Analyzing..." : "Analyze Profile"}
        </Button>
      </div>
    </div>
  );
} 