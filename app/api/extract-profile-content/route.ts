import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { profileContent } = await request.json();

    if (!profileContent || profileContent.trim() === "") {
      return NextResponse.json(
        { error: "Profile content is required" },
        { status: 400 }
      );
    }

    // Use OpenAI to extract structured data from the profile content
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a LinkedIn profile analyzer. Extract structured information from the provided LinkedIn profile content. 
          Return ONLY a JSON object with the following fields:
          - name: The person's full name
          - headline: Their professional headline
          - currentPosition: Their current job title
          - company: Their current company
          - experience: Array of their work experiences (company, title, duration, description)
          - education: Array of their education details (school, degree, field, dates)
          - skills: Array of their skills
          - projects: Array of their projects (if available)
          - recentPosts: Array of their recent posts or activities (if available)
          
          Do not include any explanations or additional text outside the JSON structure.`,
        },
        {
          role: "user",
          content: profileContent,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 1500, // Increased token limit for complete responses
    });

    // Parse the response
    const responseContent = completion.choices[0].message.content;

    if (!responseContent) {
      console.error("Empty response from OpenAI");
      return NextResponse.json(createDefaultProfileData(), { status: 200 });
    }

    console.log("Raw OpenAI response length:", responseContent.length);
    
    try {
      // First attempt: direct parsing
      const profileData = JSON.parse(responseContent);
      console.log("Direct parsing successful");
      return NextResponse.json(profileData);
    } catch (parseError) {
      console.error("Direct parsing failed:", parseError);
      
      try {
        // Second attempt: clean the string and try again
        const cleanedJson = responseContent
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Remove control characters
          .trim();
        
        const profileData = JSON.parse(cleanedJson);
        console.log("Cleaned parsing successful");
        return NextResponse.json(profileData);
      } catch (cleanError) {
        console.error("Cleaned parsing failed:", cleanError);
        
        try {
          // Third attempt: regex extraction
          const jsonMatch = responseContent.match(/(\{[\s\S]*\})/);
          if (jsonMatch && jsonMatch[1]) {
            const extractedJson = jsonMatch[1];
            console.log("Extracted JSON length:", extractedJson.length);
            
            // Try to fix common JSON issues
            const fixedJson = extractedJson
              .replace(/,\s*}/g, '}') // Remove trailing commas
              .replace(/,\s*]/g, ']'); // Remove trailing commas in arrays
            
            const profileData = JSON.parse(fixedJson);
            console.log("Regex extraction successful");
            return NextResponse.json(profileData);
          }
        } catch (regexError) {
          console.error("Regex extraction failed:", regexError);
        }
        
        // If all parsing attempts fail, extract data manually
        console.log("All parsing methods failed, using fallback extraction");
        const extractedData = extractDataManually(responseContent);
        return NextResponse.json(extractedData);
      }
    }
  } catch (error) {
    console.error("Error extracting profile data:", error);
    return NextResponse.json(
      createDefaultProfileData(),
      { status: 200 } // Return 200 with default data instead of 500 for better UX
    );
  }
}

// Helper function to create default profile data structure
function createDefaultProfileData() {
  return {
    name: "",
    headline: "",
    currentPosition: "",
    company: "",
    experience: [] as string[],
    education: [] as string[],
    skills: [] as string[],
    projects: [] as string[],
    recentPosts: [] as string[]
  };
}

// Fallback function to extract data manually using regex
function extractDataManually(text: string) {
  const data = createDefaultProfileData();
  
  // Try to extract name (looking for "name": "value" pattern)
  const nameMatch = text.match(/"name"\s*:\s*"([^"]+)"/);
  if (nameMatch && nameMatch[1]) {
    data.name = nameMatch[1];
  }
  
  // Try to extract headline
  const headlineMatch = text.match(/"headline"\s*:\s*"([^"]+)"/);
  if (headlineMatch && headlineMatch[1]) {
    data.headline = headlineMatch[1];
  }
  
  // Try to extract current position
  const positionMatch = text.match(/"currentPosition"\s*:\s*"([^"]+)"/);
  if (positionMatch && positionMatch[1]) {
    data.currentPosition = positionMatch[1];
  }
  
  // Try to extract company
  const companyMatch = text.match(/"company"\s*:\s*"([^"]+)"/);
  if (companyMatch && companyMatch[1]) {
    data.company = companyMatch[1];
  }
  
  // Try to extract skills (this is simplified and might not catch all skills)
  const skillsMatch = text.match(/"skills"\s*:\s*\[(.*?)\]/);
  if (skillsMatch && skillsMatch[1]) {
    const skillsText = skillsMatch[1];
    const skills = skillsText.match(/"([^"]+)"/g);
    if (skills) {
      data.skills = skills.map(s => s.replace(/"/g, '')) as string[];
    }
  }
  
  return data;
}
