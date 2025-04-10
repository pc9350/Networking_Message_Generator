import axios from 'axios';
import { MessageType } from '@/components/message-type-selector';

// Define interfaces for complex objects
export interface ExperienceItem {
  company?: string;
  title?: string;
  duration?: string;
  description?: string;
}

export interface EducationItem {
  school?: string;
  degree?: string;
  field?: string;
  dates?: string;
}

export interface PostItem {
  content?: string;
  date?: string;
  [key: string]: any; // Allow for other potential properties
}

export interface JobPostData {
  title: string;
  company: string;
  description: string;
  requirements?: string[];
  location?: string;
  postUrl?: string;
  postDate?: string;
  posterInfo?: {
    name: string;
    title: string;
    company: string;
  };
}

export interface ProfileData {
  name: string;
  headline: string;
  currentPosition: string;
  company: string;
  education: string[] | EducationItem[];
  experience: string[] | ExperienceItem[];
  skills: string[];
  recentPosts: (string | PostItem)[];
  profileUrl?: string; // Optional URL field for the LinkedIn profile
}

export interface ResumeData {
  skills: string[];
  experience: string[];
  projects: string[];
  education: string[];
  achievements: string[];
}

export interface MessageRequest {
  linkedinUrl: string;
  messageType: MessageType;
  messageLength: 'very-short' | 'short' | 'medium' | 'long'; // Updated message length options
  platform: 'linkedin' | 'email';
  profileData: ProfileData;
  resumeData?: ResumeData;
  jobPostData?: JobPostData;
  includeResume?: boolean;
  economyMode?: boolean; // Whether to use the cheaper model
}

// For demo purposes, we'll simulate API calls
export const api = {
  // Fetch LinkedIn profile data
  fetchProfileData: async (linkedinUrl: string): Promise<ProfileData> => {
    try {
      const response = await axios.get(`/api/linkedin-profile?url=${encodeURIComponent(linkedinUrl)}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching profile data:", error);
      throw error;
    }
  },

  // Upload and parse resume
  uploadResume: async (file: File): Promise<ResumeData> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post('/api/parse-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error("Error uploading resume:", error);
      throw error;
    }
  },

  // Generate personalized message
  generateMessage: async (request: MessageRequest): Promise<string> => {
    try {
      const response = await axios.post('/api/generate-message', request);
      return response.data.message;
    } catch (error) {
      console.error("Error generating message:", error);
      throw error;
    }
  }
}; 