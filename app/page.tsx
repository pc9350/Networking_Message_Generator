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
  
  // Since we're not using isLoadingProfile directly, we can comment it out or remove it
  // const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingResume, setIsLoadingResume] = useState(false);
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);

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
                    <TabsTrigger value="url" disabled className="relative">
                      Enter LinkedIn URL
                      <span className="absolute -top-2 -right-2 rounded-full bg-primary-500 px-2 py-0.5 text-[10px] font-medium text-white">Soon</span>
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="paste">
                    <ProfileContentInput onProfileDataExtracted={handleProfileDataExtracted} />
                  </TabsContent>
                  <TabsContent value="url">
                    <div className="w-full space-y-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 text-center">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 text-gray-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium">Coming Soon</h3>
                      <p className="text-gray-500">
                        Direct LinkedIn URL integration is currently under development. Please use the &quot;Paste Profile Content&quot; option for now.
                      </p>
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

              {profileData && (
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

              {(profileData || resumeData || isLoadingResume) && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold tracking-tight">LinkedIn Profile Data</h2>
                    <ProfileCard profile={profileData} isLoading={false} />
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
