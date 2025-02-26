"use client";

import { motion } from "framer-motion";
import { ResumeData } from "@/services/api";

interface ResumeCardProps {
  resume: ResumeData | null;
  isLoading: boolean;
}

// Helper function to format experience items
const formatExperienceItem = (exp: string | Record<string, string>): string => {
  if (typeof exp === 'string') {
    return exp;
  }
  
  // Handle object format
  if (exp && typeof exp === 'object') {
    const company = exp.company || '';
    const position = exp.position || '';
    const duration = exp.duration || '';
    
    let result = '';
    if (position) result += position;
    if (company) result += result ? ` at ${company}` : company;
    if (duration) result += result ? ` (${duration})` : duration;
    
    // If we have responsibilities, add them
    if (exp.responsibilities && Array.isArray(exp.responsibilities)) {
      const respStr = exp.responsibilities.join(', ');
      if (respStr) result += result ? ` - ${respStr}` : respStr;
    }
    
    return result || 'Unknown experience';
  }
  
  return 'Unknown experience';
};

export function ResumeCard({ resume, isLoading }: ResumeCardProps) {
  if (isLoading) {
    return (
      <div className="w-full rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        <div className="space-y-4">
          <div className="h-4 w-1/4 rounded bg-gray-300 dark:bg-gray-700"></div>
          <div className="space-y-2">
            <div className="h-4 rounded bg-gray-300 dark:bg-gray-700"></div>
            <div className="h-4 w-5/6 rounded bg-gray-300 dark:bg-gray-700"></div>
          </div>
          <div className="h-4 w-1/3 rounded bg-gray-300 dark:bg-gray-700"></div>
          <div className="space-y-2">
            <div className="h-4 rounded bg-gray-300 dark:bg-gray-700"></div>
            <div className="h-4 w-5/6 rounded bg-gray-300 dark:bg-gray-700"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-6 text-center">
        <p className="text-sm text-gray-500">
          Upload your resume to enhance your message with your skills and experience
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-soft"
    >
      <h3 className="mb-4 font-medium">Resume Data</h3>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium">Skills</h4>
          <div className="mt-2 flex flex-wrap gap-2">
            {resume.skills.map((skill, index) => (
              <span
                key={index}
                className="rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs text-gray-700 dark:text-gray-300"
              >
                {typeof skill === 'string' ? skill : JSON.stringify(skill)}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium">Experience</h4>
          <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-gray-600 dark:text-gray-400">
            {resume.experience.map((exp, index) => (
              <li key={index}>{formatExperienceItem(exp)}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium">Projects</h4>
          <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-gray-600 dark:text-gray-400">
            {resume.projects.map((project, index) => (
              <li key={index}>{typeof project === 'string' ? project : JSON.stringify(project)}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium">Education</h4>
          <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-gray-600 dark:text-gray-400">
            {resume.education.map((edu, index) => (
              <li key={index}>{typeof edu === 'string' ? edu : JSON.stringify(edu)}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium">Achievements</h4>
          <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-gray-600 dark:text-gray-400">
            {resume.achievements.map((achievement, index) => (
              <li key={index}>{typeof achievement === 'string' ? achievement : JSON.stringify(achievement)}</li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
} 