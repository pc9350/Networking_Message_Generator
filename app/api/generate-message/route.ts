import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ExperienceItem, EducationItem } from "@/services/api";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { linkedinUrl, messageType, messageLength, platform, profileData, resumeData } = await request.json();

    if (!linkedinUrl || !messageType) {
      return NextResponse.json(
        { error: 'LinkedIn URL and message type are required' },
        { status: 400 }
      );
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

    // Format profile data for the prompt
    const formattedExperience = profileData?.experience?.map(formatExperience).join('\n- ') || 'Unknown';
    const formattedEducation = profileData?.education?.map(formatEducation).join('\n- ') || 'Unknown';
    const formattedSkills = profileData?.skills?.join(', ') || 'Unknown';

    // Define word count limits based on message length
    let wordCountRange = '';
    let maxTokens = 0;
    
    switch (messageLength) {
      case 'short':
        wordCountRange = '50-100 words';
        maxTokens = 200; // ~100 words
        break;
      case 'medium':
        wordCountRange = '100-150 words';
        maxTokens = 300; // ~150 words
        break;
      case 'long':
        wordCountRange = '150-200 words';
        maxTokens = 400; // ~200 words
        break;
      default:
        wordCountRange = '50-100 words';
        maxTokens = 200;
    }

    // Create a detailed prompt based on the message type and available data
    let prompt = `Generate a personalized ${platform === 'linkedin' ? 'LinkedIn message' : 'email'} for networking purposes. 
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

    // Add resume data if available with more detailed instructions
    if (resumeData) {
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

When crafting the message, please:
1. Identify 1-2 specific common skills or experiences between my resume and their profile
2. Mention a relevant project from my resume if applicable
3. Reference any educational similarities if relevant
4. Highlight how my specific background could provide value
5. My name is Pranav Chhabra, add that to the last of the message.
`;
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
      default:
        prompt += '\nCreate a professional networking message.';
    }

    prompt += `\nThe message should be approximately ${wordCountRange}, personalized, and end with a clear call to action.
Make it sound authentic and conversational, as if written by a real person who has carefully reviewed their profile.
Avoid generic language like "I came across your profile" or "I was impressed by your background."
Focus on quality over quantity - every sentence should add value.
Keep the tone warm and professional.
Be specific and concise - get to the point quickly.`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a professional networking assistant that creates highly personalized ${platform === 'linkedin' ? 'LinkedIn messages' : 'emails'}. 
Your messages are concise, engaging, and tailored to the recipient's background.
You excel at finding meaningful connections between people's experiences and creating authentic outreach.
You never use generic templates or clichés. Each message sounds like it was written specifically for the recipient.
You focus on quality over quantity, ensuring every sentence adds value and demonstrates genuine interest.
You understand that busy professionals prefer shorter messages that get to the point quickly.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: maxTokens,
    });

    const generatedMessage = completion.choices[0].message.content;

    return NextResponse.json({ message: generatedMessage });
  } catch (error) {
    console.error('Error generating message:', error);
    return NextResponse.json(
      { error: 'Failed to generate message' },
      { status: 500 }
    );
  }
} 