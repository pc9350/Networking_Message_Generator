"use client";

import { useState } from "react";
import { JobPostData } from "@/services/api";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface JobPostInputProps {
  onJobPostDataExtracted: (data: JobPostData) => void;
  onIncludeResumeChange: (include: boolean) => void;
}

export default function JobPostInput({ onJobPostDataExtracted, onIncludeResumeChange }: JobPostInputProps) {
  // Quick input mode
  const [jobContent, setJobContent] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  
  // Common state
  const [includeResume, setIncludeResume] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = () => {
    setIsProcessing(true);
    
    try {
      // Create job post data with just the content
      const jobPostData: JobPostData = {
        title: jobTitle || "Position in job listing",
        company: company || "Company in job listing",
        description: jobContent,
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
      console.error("Error processing job post data:", error);
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
        <Label htmlFor="job-title">
          Job Title <span className="text-xs text-gray-500">(Optional)</span>
        </Label>
        <Input
          id="job-title"
          placeholder="Software Engineer, Product Manager, etc."
          value={jobTitle}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setJobTitle(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="company">
          Company <span className="text-xs text-gray-500">(Optional)</span>
        </Label>
        <Input
          id="company"
          placeholder="Company name"
          value={company}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompany(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="job-content">
          Job Listing Content
          <span className="ml-1 text-xs text-gray-500">(Just paste the entire job listing)</span>
        </Label>
        <Textarea
          id="job-content"
          placeholder="Paste the entire job listing here. Our AI will extract the relevant information."
          className="min-h-[200px]"
          value={jobContent}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJobContent(e.target.value)}
        />
        <p className="text-xs text-gray-500 mt-1">
          Our AI will analyze the job content to identify requirements and generate a relevant application.
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
        disabled={!jobContent || isProcessing}
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