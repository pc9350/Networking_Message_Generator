"use client";

import { useState } from "react";
import { JobPostData } from "@/services/api";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface FeedPostInputProps {
  onJobPostDataExtracted: (data: JobPostData) => void;
  onIncludeResumeChange: (include: boolean) => void;
}

export default function FeedPostInput({ onJobPostDataExtracted, onIncludeResumeChange }: FeedPostInputProps) {
  const [postContent, setPostContent] = useState("");
  const [includeResume, setIncludeResume] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = () => {
    setIsProcessing(true);
    
    try {
      // Create job post data with just the post content
      const jobPostData: JobPostData = {
        title: "Position mentioned in post",
        company: "Company mentioned in post",
        description: postContent,
        postDate: new Date().toISOString().split('T')[0], // Today's date
      };
      
      onJobPostDataExtracted(jobPostData);
      onIncludeResumeChange(includeResume);
      
      // Scroll to the message configuration section
      const messageConfigSection = document.getElementById('message-config-section');
      if (messageConfigSection) {
        messageConfigSection.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error("Error processing feed post data:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleIncludeResumeChange = (checked: boolean) => {
    setIncludeResume(checked);
    onIncludeResumeChange(checked);
  };

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
      <div className="space-y-2">
        <Label htmlFor="post-content">
          LinkedIn Post Content
          <span className="ml-1 text-xs text-gray-500">(Just paste the entire post)</span>
        </Label>
        <Textarea
          id="post-content"
          placeholder="Paste the LinkedIn post content here. For example: 'We're hiring! Looking for a talented software engineer to join our team...'"
          className="min-h-[200px]"
          value={postContent}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPostContent(e.target.value)}
        />
        <p className="text-xs text-gray-500 mt-1">
          Our AI will analyze the post content to identify job details and generate a relevant response.
        </p>
      </div>
      
      <div className="flex items-center space-x-2 pt-2">
        <Checkbox 
          id="include-resume" 
          checked={includeResume}
          onCheckedChange={handleIncludeResumeChange}
        />
        <Label htmlFor="include-resume" className="text-sm font-normal">
          Reference my resume in the message
        </Label>
      </div>
      
      <Button 
        onClick={handleSubmit}
        disabled={!postContent || isProcessing}
        className="w-full"
      >
        {isProcessing ? "Processing..." : "Continue to Message Options"}
      </Button>
      
      <p className="text-xs text-gray-500 text-center mt-2">
        After clicking, scroll down to configure and generate your message
      </p>
    </div>
  );
} 