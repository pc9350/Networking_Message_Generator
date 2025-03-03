import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ExperienceItem, EducationItem } from "@/services/api";
import { createHash } from 'crypto';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Simple in-memory cache for message responses
// In production, consider using Redis or another persistent cache
const messageCache = new Map();

// Cache TTL in milliseconds (24 hours)
const CACHE_TTL = 24 * 60 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const {
      linkedinUrl,
      messageType,
      messageLength,
      platform,
      profileData,
      resumeData,
      jobPostData,
      includeResume,
      economyMode = true, // Default to economy mode if not specified
    } = await request.json();

    if (!messageType) {
      return NextResponse.json(
        { error: 'Message type is required' },
        { status: 400 }
      );
    }

    // For job application messages, require job post data
    if (messageType === 'job-application' && !jobPostData) {
      return NextResponse.json(
        { error: 'Job post data is required for job application messages' },
        { status: 400 }
      );
    }

    // For other message types, require LinkedIn profile data
    if (messageType !== 'job-application' && !linkedinUrl && !profileData) {
      return NextResponse.json(
        { error: 'LinkedIn URL or profile data is required for non-job application messages' },
        { status: 400 }
      );
    }

    // Define word count ranges and max tokens based on message length
    let wordCountRange;
    let maxTokens;
    // Use model selection based on economyMode and message length
    let model = economyMode ? "gpt-3.5-turbo" : "gpt-4o"; // Default based on economy mode

    // If not in economy mode, always use GPT-4
    // If in economy mode, use GPT-3.5 for shorter messages, GPT-4 for longer ones
    if (economyMode) {
      switch (messageLength) {
        case 'very-short':
          wordCountRange = '25-50 words';
          maxTokens = 100; // ~50 words
          model = "gpt-3.5-turbo"; // Use cheaper model for very short
          break;
        case 'short':
          wordCountRange = '50-100 words';
          maxTokens = 200; // ~100 words
          model = "gpt-3.5-turbo"; // Use cheaper model for short
          break;
        case 'medium':
          wordCountRange = '100-200 words';
          maxTokens = 400; // ~200 words
          model = "gpt-4o"; // Use more advanced model for medium length
          break;
        case 'long':
          wordCountRange = '200-300 words';
          maxTokens = 600; // ~300 words
          model = "gpt-4o"; // Use more advanced model for longer messages
          break;
        default:
          wordCountRange = '100-200 words';
          maxTokens = 400;
          model = "gpt-3.5-turbo";
      }
    } else {
      // Premium mode - always use GPT-4
      switch (messageLength) {
        case 'very-short':
          wordCountRange = '25-50 words';
          maxTokens = 100; // ~50 words
          break;
        case 'short':
          wordCountRange = '50-100 words';
          maxTokens = 200; // ~100 words
          break;
        case 'medium':
          wordCountRange = '100-200 words';
          maxTokens = 400; // ~200 words
          break;
        case 'long':
          wordCountRange = '200-300 words';
          maxTokens = 600; // ~300 words
          break;
        default:
          wordCountRange = '100-200 words';
          maxTokens = 400;
      }
    }

    // Format experience items for better readability
    const formatExperience = (exp: string | ExperienceItem) => {
      if (typeof exp === 'string') return exp;
      const title = exp.title || '';
      const company = exp.company || '';
      const duration = exp.duration || '';
      const description = exp.description ? ` - ${exp.description.substring(0, 100)}${exp.description.length > 100 ? '...' : ''}` : '';
      return `${title} at ${company}${duration ? ` (${duration})` : ''}${description}`;
    };

    // Format education items for better readability
    const formatEducation = (edu: string | EducationItem) => {
      if (typeof edu === 'string') return edu;
      const degree = edu.degree || '';
      const field = edu.field || '';
      const school = edu.school || '';
      const dates = edu.dates || '';
      return `${degree}${field ? ` in ${field}` : ''} at ${school}${dates ? ` (${dates})` : ''}`;
    };

    // Format profile data for the prompt if available
    let formattedExperience = 'Unknown';
    let formattedEducation = 'Unknown';
    let formattedSkills = 'Unknown';

    if (profileData) {
      formattedExperience = profileData.experience?.map(formatExperience).join('\n- ') || 'Unknown';
      formattedEducation = profileData.education?.map(formatEducation).join('\n- ') || 'Unknown';
      formattedSkills = profileData.skills?.join(', ') || 'Unknown';
    }

    // Create a detailed prompt based on the message type and available data
    let prompt = '';

    // Different prompt structure for job application vs. other message types
    if (messageType === 'job-application' && jobPostData) {
      prompt = `Generate a personalized ${platform === 'linkedin' ? 'LinkedIn message' : 'email'} for a job application. 
The message should be approximately ${wordCountRange} in length.

Job Post Information:
- Job Title: ${jobPostData.title}
- Company: ${jobPostData.company}
- Location: ${jobPostData.location || 'Not specified'}
- Job Description: ${jobPostData.description}
${jobPostData.requirements && jobPostData.requirements.length > 0 ? `- Key Requirements:\n  - ${jobPostData.requirements.join('\n  - ')}` : ''}
`;
    } else if (messageType === 'job-post-response' && jobPostData) {
      prompt = `Generate a personalized ${platform === 'linkedin' ? 'LinkedIn message' : 'email'} responding to a LinkedIn post about a job opportunity. 
The message should be approximately ${wordCountRange} in length.

LinkedIn Post Information:
- Job Title Mentioned: ${jobPostData.title}
- Company: ${jobPostData.company}
${jobPostData.posterInfo ? `- Posted by: ${jobPostData.posterInfo.name} (${jobPostData.posterInfo.title} at ${jobPostData.posterInfo.company})` : '- Posted by: Someone on LinkedIn (specific details not provided)'}
- Post Content: ${jobPostData.description}

When crafting the message:
1. If the post doesn't explicitly mention a job title or company, infer it from the content if possible
2. If poster information is not provided, keep the message more general but still enthusiastic
3. Focus on expressing interest in the opportunity mentioned in the post
4. Briefly highlight your relevant qualifications that match what seems to be needed
5. Analyze the post content to identify:
   - The type of role or position being discussed
   - Any specific skills or qualifications mentioned
   - The company or team culture if mentioned
   - Any urgency or timeline information
6. Tailor your response to the tone of the original post (casual, formal, enthusiastic, etc.)
`;
    } else {
      prompt = `Generate a personalized ${platform === 'linkedin' ? 'LinkedIn message' : 'email'} for networking purposes. 
The message should be in the style of a ${messageType} message and approximately ${wordCountRange} in length.

LinkedIn Profile Information:
- Name: ${profileData?.name || 'Unknown'}
- Headline: ${profileData?.headline || 'Unknown'}
- Current Position: ${profileData?.currentPosition || 'Unknown'} at ${profileData?.company || 'Unknown'}
- Skills: ${formattedSkills}
- Experience: 
  - ${formattedExperience}
- Education: 
  - ${formattedEducation}
`;
    }

    // Add resume data if available and should be included
    if (resumeData && (includeResume !== false)) {
      prompt += `\nMy Resume Information:
- Skills: ${resumeData.skills?.join(', ') || 'N/A'}
- Experience: 
  - ${resumeData.experience?.join('\n  - ') || 'N/A'}
- Projects: 
  - ${resumeData.projects?.join('\n  - ') || 'N/A'}
- Education: 
  - ${resumeData.education?.join('\n  - ') || 'N/A'}
- Achievements: 
  - ${resumeData.achievements?.join('\n  - ') || 'N/A'}

When crafting the message:
1. You can reference relevant skills or experience from my resume if it fits naturally
2. My name is Pranav Chhabra, add that to the end of the message
3. IMPORTANT: Include a professional mention that my resume is attached (e.g., "I've attached my resume for your review" or "My resume is attached for your reference")
`;
    } else {
      // If resume is not included, still add the name
      prompt += `\nMy name is Pranav Chhabra, please add that to the end of the message.`;
    }

    // Add platform-specific instructions
    if (platform === 'linkedin') {
      prompt += `\nThis is for a LinkedIn direct message, so keep it conversational and professional. LinkedIn messages should be concise and easy to read on mobile devices.`;
    } else {
      prompt += `\nThis is for an email, so include a clear subject line at the beginning of your response in the format "Subject: [Your Subject]". The email should be professional but attention-grabbing.`;
    }

    // Add specific instructions based on message type
    switch (messageType) {
      case 'casual-networking':
        prompt += `\nCreate a light, engaging message to build a connection. Be friendly but professional.
Focus on one specific shared interest or experience. Mention something specific from their profile.
End with a simple, low-pressure call to action.`;
        break;
      case 'referral-request':
        prompt += `\nCreate a concise, non-intrusive request for a referral. Be respectful of their time.
Briefly explain why you're interested in their company and mention one specific qualification.
End with a specific but low-pressure call to action.`;
        break;
      case 'alumni-connection':
        prompt += `\nCreate a brief message highlighting the shared educational background.
Mention one specific aspect of the school experience that might resonate with them.
End with a suggestion to connect over the shared alma mater.`;
        break;
      case 'cold-outreach':
        prompt += `\nCreate a professional message for business collaboration. Be concise and value-focused.
Clearly articulate why you're reaching out to them specifically and what unique value you can offer.
Reference one recent achievement to show you've done your research.
End with a clear, specific call to action.`;
        break;
      case 'cold-email':
        prompt += `\nCreate a concise, attention-grabbing email that stands out in a busy inbox.
Start with a compelling hook related to their work or industry.
Clearly state your purpose and the specific value you can provide.
End with a clear, low-friction call to action.`;
        break;
      case 'job-application':
        prompt += `\nCreate a personalized job application message that stands out from generic applications.
Highlight qualifications that directly match the job requirements.
Show enthusiasm for the role and company with specific reasons.
${includeResume ? 'Include a professional statement that my resume is attached for review.' : ''}
End with a clear call to action requesting an interview or conversation.`;
        break;
      case 'job-post-response':
        prompt += `\nCreate a message responding to someone who posted about a job opportunity in their LinkedIn feed (not a formal job listing).
Express interest in the opportunity they mentioned in their post.
Briefly highlight relevant qualifications that make me a good fit.
Mention that you'd like to learn more about the role before formally applying.
${includeResume ? 'Include a professional statement that my resume is attached for their consideration.' : ''}
End with a clear but low-pressure call to action (like offering to chat or asking about next steps).`;
        break;
      default:
        prompt += '\nCreate a professional networking message.';
    }

    prompt += `\nThe message should be approximately ${wordCountRange}, personalized, and end with a clear call to action.
Make it extremely conversational and human-like. Use casual language, contractions, and a friendly tone. Avoid overly formal language or complex sentences. Write as if you're quickly messaging a colleague.
Make it sound authentic and conversational, as if written by a real person who has carefully reviewed their profile${messageType === 'job-application' ? '/job post' : ''}.
Avoid generic language like "I came across your profile" or "I was impressed by your background."
Focus on quality over quantity - every sentence should add value.
Keep the tone warm and professional.
Be specific and concise - get to the point quickly.
${includeResume ? 'IMPORTANT: Include a professional statement that my resume is attached (avoid phrases like "happy to share" or "would love to share").' : ''}`;

    // Generate a cache key based on the request parameters
    const cacheKey = createHash('md5').update(JSON.stringify({
      prompt,
      model,
      messageLength,
      messageType,
      platform
    })).digest('hex');

    // Check if we have a cached response
    if (messageCache.has(cacheKey)) {
      const cachedData = messageCache.get(cacheKey);
      // Check if the cache is still valid
      if (Date.now() - cachedData.timestamp < CACHE_TTL) {
        console.log('Using cached response');
        return NextResponse.json({ message: cachedData.message });
      } else {
        // Cache expired, remove it
        messageCache.delete(cacheKey);
      }
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: `You create personalized ${platform === 'linkedin' ? 'LinkedIn messages' : 'emails'} that are concise and engaging. 
Write as a human would - casual, using contractions and simple sentences. 
Focus on quality over quantity. Be specific and authentic.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: messageLength === 'very-short' ? 0.9 : 0.7, // Higher temperature for very short messages
      max_tokens: maxTokens,
    });

    const generatedMessage = completion.choices[0].message.content;

    // Cache the response
    messageCache.set(cacheKey, {
      message: generatedMessage,
      timestamp: Date.now()
    });

    // Periodically clean up expired cache entries (simple implementation)
    if (Math.random() < 0.1) { // 10% chance to run cleanup on each request
      for (const [key, value] of messageCache.entries()) {
        if (Date.now() - value.timestamp > CACHE_TTL) {
          messageCache.delete(key);
        }
      }
    }

    return NextResponse.json({ message: generatedMessage });
  } catch (error) {
    console.error('Error generating message:', error);
    return NextResponse.json(
      { error: 'Failed to generate message' },
      { status: 500 }
    );
  }
} 