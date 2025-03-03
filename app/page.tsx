"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FileUpload } from "@/components/file-upload";
import { MessageTypeSelector, type MessageType } from "@/components/message-type-selector";
import { MessageLengthSelector, type MessageLength } from "@/components/message-length-selector";
import { PlatformSelector, type MessagePlatform } from "@/components/platform-selector";
import { MessageDisplay } from "@/components/message-display";
import { ProfileCard } from "@/components/profile-card";
import { ResumeCard } from "@/components/resume-card";
import ProfileContentInput from "@/components/profile-content-input";
import JobPostInput from "@/components/job-post-input";
import FeedPostInput from "@/components/feed-post-input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api, type ProfileData, type ResumeData, type JobPostData } from "@/services/api";

export default function Home() {
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [messageType, setMessageType] = useState<MessageType | null>(null);
  const [messageLength, setMessageLength] = useState<MessageLength>("very-short");
  const [platform, setPlatform] = useState<MessagePlatform>("linkedin");
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [jobPostData, setJobPostData] = useState<JobPostData | null>(null);
  const [includeResume, setIncludeResume] = useState(true);
  const [generatedMessage, setGeneratedMessage] = useState("");
  
  // Since we're not using isLoadingProfile directly, we can comment it out or remove it
  // const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingResume, setIsLoadingResume] = useState(false);
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "job" | "feed">("profile");

  const handleProfileDataExtracted = (data: ProfileData) => {
    setProfileData(data);
    // If the data includes a LinkedIn URL, set it
    if (data.profileUrl) {
      setLinkedinUrl(data.profileUrl);
    }
  };

  const handleJobPostDataExtracted = (data: JobPostData) => {
    setJobPostData(data);
    // Auto-select job application message type
    setMessageType("job-application");
  };

  const handleFeedPostDataExtracted = (data: JobPostData) => {
    setJobPostData(data);
    // Auto-select job post response message type
    setMessageType("job-post-response");
  };

  const handleIncludeResumeChange = (include: boolean) => {
    setIncludeResume(include);
  };

  const handleFileUpload = async (file: File) => {
    setIsLoadingResume(true);
    
    try {
      const data = await api.uploadResume(file);
      setResumeData(data);
    } catch (error) {
      console.error("Error uploading resume:", error);
      // Handle error
    } finally {
      setIsLoadingResume(false);
    }
  };

  const handleMessageTypeSelect = (type: MessageType) => {
    setMessageType(type);
    
    // We're removing all automatic tab switching to prevent navigation issues
    // Users should stay on their current tab regardless of message type selection
  };

  const handleMessageLengthSelect = (length: MessageLength) => {
    setMessageLength(length);
  };

  const handlePlatformSelect = (selectedPlatform: MessagePlatform) => {
    setPlatform(selectedPlatform);
  };

  const generateMessage = async () => {
    if (!messageType) return;
    
    // For job application, require job post data
    if (messageType === "job-application" && !jobPostData) {
      setActiveTab("job");
      return;
    }
    
    // For job post response, require job post data
    if (messageType === "job-post-response" && !jobPostData) {
      setActiveTab("feed");
      return;
    }
    
    // For other message types, require profile data
    if (messageType !== "job-application" && messageType !== "job-post-response" && !profileData) {
      setActiveTab("profile");
      return;
    }
    
    setIsGeneratingMessage(true);
    
    try {
      const message = await api.generateMessage({
        linkedinUrl: linkedinUrl || "manual-input",
        messageType,
        messageLength,
        platform,
        profileData: profileData || {
          name: "",
          headline: "",
          currentPosition: "",
          company: "",
          education: [],
          experience: [],
          skills: [],
          recentPosts: []
        },
        resumeData: resumeData || undefined,
        jobPostData: jobPostData || undefined,
        includeResume: includeResume
      });
      
      setGeneratedMessage(message);
    } catch (error) {
      console.error("Error generating message:", error);
    } finally {
      setIsGeneratingMessage(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
              >
                Generate Personalized LinkedIn Messages
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-4 text-gray-600 dark:text-gray-400 md:text-lg"
              >
                Craft highly personalized LinkedIn messages for networking, referrals, and outreach
              </motion.p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-5xl space-y-12">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight">Step 1: Choose Your Approach</h2>
                
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "profile" | "job" | "feed")} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="profile">LinkedIn Profile</TabsTrigger>
                    <TabsTrigger value="job">Job Listing</TabsTrigger>
                    <TabsTrigger value="feed">LinkedIn Post</TabsTrigger>
                  </TabsList>
                  <TabsContent value="profile">
                    <div className="space-y-6">
                      <h3 className="text-xl font-medium">Provide LinkedIn Profile Information</h3>
                      <ProfileContentInput onProfileDataExtracted={handleProfileDataExtracted} />
                    </div>
                  </TabsContent>
                  <TabsContent value="job">
                    <div className="space-y-6">
                      <h3 className="text-xl font-medium">Enter Job Listing Details</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Just paste the job listing content and we&apos;ll generate a personalized application message. Job title and company are optional.
                      </p>
                      <JobPostInput 
                        onJobPostDataExtracted={handleJobPostDataExtracted}
                        onIncludeResumeChange={handleIncludeResumeChange}
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="feed">
                    <div className="space-y-6">
                      <h3 className="text-xl font-medium">Enter LinkedIn Feed Post Details</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Respond to someone who mentioned a job opportunity in their LinkedIn post. Just paste the post content and we&apos;ll generate a personalized response.
                      </p>
                      <FeedPostInput 
                        onJobPostDataExtracted={handleFeedPostDataExtracted}
                        onIncludeResumeChange={handleIncludeResumeChange}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight">Step 2: Upload Your Resume (Optional)</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Enhance your message with details from your resume
                </p>
                <FileUpload onFileUpload={handleFileUpload} />
              </div>

              {(profileData || jobPostData) && (
                <div id="message-config-section" className="space-y-6">
                  <h2 className="text-2xl font-bold tracking-tight">Step 3: Configure Your Message</h2>
                  
                  <div className="space-y-8">
                    <div className="space-y-6">
                      <PlatformSelector onSelect={handlePlatformSelect} />
                    </div>
                    
                    <div className="space-y-6">
                      <MessageTypeSelector 
                        onSelect={handleMessageTypeSelect} 
                        platform={platform}
                        currentTab={activeTab}
                      />
                    </div>
                    
                    <div className="space-y-6">
                      <MessageLengthSelector onSelect={handleMessageLengthSelect} />
                    </div>
                    
                    <div className="flex justify-center mt-6">
                      <button
                        onClick={generateMessage}
                        disabled={!messageType || isGeneratingMessage}
                        className="inline-flex items-center justify-center rounded-md bg-primary-600 px-8 py-3 text-base font-medium text-white shadow-md hover:bg-primary-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        {isGeneratingMessage ? "Generating..." : "Generate Message"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {(generatedMessage || isGeneratingMessage) && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold tracking-tight">Your Personalized Message</h2>
                  <MessageDisplay message={generatedMessage} isLoading={isGeneratingMessage} />
                </div>
              )}

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {(profileData || activeTab === "profile") && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold tracking-tight">LinkedIn Profile Data</h2>
                    {profileData ? (
                      <ProfileCard profile={profileData} isLoading={false} />
                    ) : (
                      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
                        <div className="text-center text-gray-500">
                          No profile data provided yet
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {(jobPostData || activeTab === "job" || activeTab === "feed") && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold tracking-tight">
                      {activeTab === "feed" ? "LinkedIn Post Data" : "Job Post Data"}
                    </h2>
                    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
                      {jobPostData ? (
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-medium">{jobPostData.title}</h3>
                            <p className="text-sm text-gray-500">
                              {jobPostData.company} 
                              {jobPostData.location ? ` • ${jobPostData.location}` : ''}
                              {jobPostData.posterInfo ? ` • Posted by ${jobPostData.posterInfo.name}` : ''}
                            </p>
                          </div>
                          
                          {jobPostData.posterInfo && (
                            <div>
                              <h4 className="text-sm font-medium">Poster Information</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {jobPostData.posterInfo.name}, {jobPostData.posterInfo.title} at {jobPostData.posterInfo.company}
                              </p>
                            </div>
                          )}
                          
                          {jobPostData.requirements && jobPostData.requirements.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium">Key Requirements</h4>
                              <ul className="mt-2 list-disc pl-5 text-sm">
                                {jobPostData.requirements.map((req, index) => (
                                  <li key={index} className="text-gray-600 dark:text-gray-400">{req}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          <div className="text-sm text-gray-500">
                            {includeResume ? 'Will reference resume in message' : 'Will not reference resume in message'}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-gray-500">
                          No {activeTab === "feed" ? "post" : "job"} data provided yet
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {(resumeData || isLoadingResume) && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold tracking-tight">Resume Data</h2>
                    <ResumeCard resume={resumeData} isLoading={isLoadingResume} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
