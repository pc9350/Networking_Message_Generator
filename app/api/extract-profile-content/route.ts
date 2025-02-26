import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = 'edge';

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
      temperature: 0.3, // Lower temperature for more consistent results
      max_tokens: 1000,
    });

    // Parse the response
    const responseContent = completion.choices[0].message.content;
    let profileData;

    try {
      profileData = JSON.parse(responseContent || "{}");
    } catch (error) {
      console.error("Error parsing OpenAI response:", error);
      return NextResponse.json(
        { error: "Failed to parse profile data" },
        { status: 500 }
      );
    }

    return NextResponse.json(profileData);
  } catch (error) {
    console.error("Error extracting profile data:", error);
    return NextResponse.json(
      { error: "Failed to extract profile data" },
      { status: 500 }
    );
  }
}
