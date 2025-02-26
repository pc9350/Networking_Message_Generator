"use client";

import { motion } from "framer-motion";
import { ProfileData, ExperienceItem, EducationItem } from "@/services/api";

interface ProfileCardProps {
  profile: ProfileData | null;
  isLoading: boolean;
}

// Define an interface for the post object format
interface PostItem {
  content?: string;
  date?: string;
  [key: string]: any; // Allow for other potential properties
}

export function ProfileCard({ profile, isLoading }: ProfileCardProps) {
  // Helper function to format experience items
  const formatExperience = (exp: string | ExperienceItem) => {
    if (typeof exp === 'string') {
      return exp;
    }
    // Format the experience object into a readable string
    return `${exp.title || ''} at ${exp.company || ''}${exp.duration ? ` (${exp.duration})` : ''}`;
  };

  // Helper function to format education items
  const formatEducation = (edu: string | EducationItem) => {
    if (typeof edu === 'string') {
      return edu;
    }
    // Format the education object into a readable string
    return `${edu.degree || ''} in ${edu.field || ''} at ${edu.school || ''}${edu.dates ? ` (${edu.dates})` : ''}`;
  };

  // Helper function to format post items
  const formatPost = (post: string | PostItem) => {
    if (typeof post === 'string') {
      return post;
    }
    // Format the post object into a readable string
    return post.content || 'No content available';
  };

  if (isLoading) {
    return (
      <div className="w-full rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex animate-pulse space-x-4">
          <div className="h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 w-3/4 rounded bg-gray-300 dark:bg-gray-700"></div>
            <div className="space-y-2">
              <div className="h-4 rounded bg-gray-300 dark:bg-gray-700"></div>
              <div className="h-4 w-5/6 rounded bg-gray-300 dark:bg-gray-700"></div>
            </div>
          </div>
        </div>
        <div className="mt-6 space-y-3">
          <div className="h-4 rounded bg-gray-300 dark:bg-gray-700"></div>
          <div className="h-4 rounded bg-gray-300 dark:bg-gray-700"></div>
          <div className="h-4 w-4/6 rounded bg-gray-300 dark:bg-gray-700"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-soft"
    >
      <div className="flex items-start space-x-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linkedin-blue text-white">
          {profile.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </div>
        <div>
          <h3 className="font-medium">{profile.name}</h3>
          <p className="text-sm text-gray-500">{profile.headline}</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <h4 className="text-sm font-medium">Current Position</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {profile.currentPosition} at {profile.company}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium">Experience</h4>
          <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-gray-600 dark:text-gray-400">
            {profile.experience.map((exp, index) => (
              <li key={index}>{formatExperience(exp)}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium">Education</h4>
          <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-gray-600 dark:text-gray-400">
            {profile.education.map((edu, index) => (
              <li key={index}>{formatEducation(edu)}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium">Skills</h4>
          <div className="mt-2 flex flex-wrap gap-2">
            {profile.skills.map((skill, index) => (
              <span
                key={index}
                className="rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs text-gray-700 dark:text-gray-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {profile.recentPosts && profile.recentPosts.length > 0 && (
          <div>
            <h4 className="text-sm font-medium">Recent Posts</h4>
            <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-gray-600 dark:text-gray-400">
              {profile.recentPosts.map((post, index) => (
                <li key={index}>{formatPost(post)}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
} 