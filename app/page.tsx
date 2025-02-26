"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { LinkedInUrlInput } from "@/components/linkedin-url-input";
import { FileUpload } from "@/components/file-upload";
import { MessageTypeSelector, type MessageType } from "@/components/message-type-selector";
import { MessageLengthSelector, type MessageLength } from "@/components/message-length-selector";
import { PlatformSelector, type MessagePlatform } from "@/components/platform-selector";
import { MessageDisplay } from "@/components/message-display";
import { ProfileCard } from "@/components/profile-card";
import { ResumeCard } from "@/components/resume-card";
import ProfileContentInput from "@/components/profile-content-input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api, type ProfileData, type ResumeData } from "@/services/api";

export default function Home() {
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [messageType, setMessageType] = useState<MessageType | null>(null);
  const [messageLength, setMessageLength] = useState<MessageLength>("short");
  const [platform, setPlatform] = useState<MessagePlatform>("linkedin");
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [generatedMessage, setGeneratedMessage] = useState("");
  
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingResume, setIsLoadingResume] = useState(false);
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);

  const handleUrlSubmit = async (url: string) => {
    setLinkedinUrl(url);
    setIsLoadingProfile(true);
    
    try {
      const data = await api.fetchProfileData(url);
      setProfileData(data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
      // Handle error
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleProfileDataExtracted = (data: ProfileData) => {
    setProfileData(data);
    // If the data includes a LinkedIn URL, set it
    if (data.profileUrl) {
      setLinkedinUrl(data.profileUrl);
    }
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
  };

  const handleMessageLengthSelect = (length: MessageLength) => {
    setMessageLength(length);
  };

  const handlePlatformSelect = (selectedPlatform: MessagePlatform) => {
    setPlatform(selectedPlatform);
  };

  const generateMessage = async () => {
    if (!messageType || !profileData) return;
    
    setIsGeneratingMessage(true);
    
    try {
      const message = await api.generateMessage({
        linkedinUrl: linkedinUrl || "manual-input",
        messageType,
        messageLength,
        platform,
        profileData,
        resumeData: resumeData || undefined,
      });
      
      setGeneratedMessage(message);
    } catch (error) {
      console.error("Error generating message:", error);
      // Handle error
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
                <h2 className="text-2xl font-bold tracking-tight">Step 1: Provide LinkedIn Profile Information</h2>
                
                <Tabs defaultValue="paste" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="paste">Paste Profile Content</TabsTrigger>
                    <TabsTrigger value="url">Enter LinkedIn URL</TabsTrigger>
                  </TabsList>
                  <TabsContent value="paste">
                    <ProfileContentInput onProfileDataExtracted={handleProfileDataExtracted} />
                  </TabsContent>
                  <TabsContent value="url">
                    <LinkedInUrlInput onUrlSubmit={handleUrlSubmit} />
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

              {(profileData || isLoadingProfile) && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold tracking-tight">Step 3: Configure Your Message</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <PlatformSelector onSelect={handlePlatformSelect} />
                    </div>
                    
                    <div>
                      <MessageTypeSelector onSelect={handleMessageTypeSelect} platform={platform} />
                    </div>
                    
                    <div>
                      <MessageLengthSelector onSelect={handleMessageLengthSelect} />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={generateMessage}
                      disabled={!messageType || isGeneratingMessage}
                      className="inline-flex items-center justify-center rounded-md bg-primary-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGeneratingMessage ? "Generating..." : "Generate Message"}
                    </button>
                  </div>
                </div>
              )}

              {(generatedMessage || isGeneratingMessage) && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold tracking-tight">Your Personalized Message</h2>
                  <MessageDisplay message={generatedMessage} isLoading={isGeneratingMessage} />
                </div>
              )}

              {(profileData || isLoadingProfile || resumeData || isLoadingResume) && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold tracking-tight">LinkedIn Profile Data</h2>
                    <ProfileCard profile={profileData} isLoading={isLoadingProfile} />
                  </div>
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold tracking-tight">Resume Data</h2>
                    <ResumeCard resume={resumeData} isLoading={isLoadingResume} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
