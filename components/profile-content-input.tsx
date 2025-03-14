"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ProfileData } from "@/services/api";

interface ProfileContentInputProps {
  onProfileDataExtracted: (profileData: ProfileData) => void;
}

export default function ProfileContentInput({ onProfileDataExtracted }: ProfileContentInputProps) {
  const [profileContent, setProfileContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleExtractProfile = async () => {
    if (!profileContent.trim()) {
      setError("Please paste LinkedIn profile content");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Call the API to extract profile data from the pasted content
      const response = await fetch("/api/extract-profile-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profileContent }),
      });

      if (!response.ok) {
        throw new Error("Failed to extract profile data");
      }

      const data = await response.json();
      
      // Ensure all required fields are present with default values if missing
      const completeData: ProfileData = {
        name: data.name || "",
        headline: data.headline || "",
        currentPosition: data.currentPosition || "",
        company: data.company || "",
        experience: data.experience || [],
        education: data.education || [],
        skills: data.skills || [],
        recentPosts: data.recentPosts || [],
        profileUrl: data.profileUrl || "",
      };
      
      onProfileDataExtracted(completeData);
      
      // Scroll to the message configuration section
      const messageConfigSection = document.getElementById('message-config-section');
      if (messageConfigSection) {
        messageConfigSection.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      console.error("Error extracting profile data:", err);
      setError("Failed to extract profile data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
      <div>
        <h3 className="text-lg font-medium mb-2">LinkedIn Profile Content</h3>
        <p className="text-sm text-gray-500 mb-4">
          Paste the LinkedIn profile content below to extract information for message generation
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Copy and paste the entire LinkedIn profile content here..."
            className="min-h-[200px] resize-y"
            value={profileContent}
            onChange={(e) => setProfileContent(e.target.value)}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="text-xs text-gray-500">
            <p>Tips for best results:</p>
            <ul className="list-disc pl-4 mt-1">
              <li>Include the person&apos;s name, headline, and current position</li>
              <li>Copy their experience, education, and skills sections</li>
              <li>The more information you provide, the better the generated message</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="pt-4 flex flex-col items-center">
        <Button 
          onClick={handleExtractProfile} 
          disabled={isLoading || !profileContent.trim()}
          className="px-8 py-3 text-base font-medium shadow-md hover:shadow-lg transition-all bg-primary-600 hover:bg-primary-700 text-white"
        >
          {isLoading ? "Extracting..." : "Extract Profile & Continue"}
        </Button>
        
        <p className="text-xs text-gray-500 text-center mt-4">
          After clicking, scroll down to configure and generate your message
        </p>
      </div>
    </div>
  );
} 