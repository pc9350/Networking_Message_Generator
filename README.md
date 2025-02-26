# LinkedIn Profile Scraper & AI-Powered Message Generator

A modern web application that helps users craft highly personalized LinkedIn messages for networking, built with Next.js, React, and TailwindCSS.

![LinkedIn Message Generator](https://via.placeholder.com/1200x630/0077B5/FFFFFF?text=LinkedIn+Message+Generator)

## ✨ Features

- **LinkedIn Profile URL Input**: Enter any LinkedIn profile URL to analyze
- **Resume Upload**: Upload your resume (PDF/DOCX) to enhance message personalization
- **Profile & Resume Data Extraction**: Extract relevant data from LinkedIn profiles and resumes
- **AI-Powered Message Generation**: Generate personalized messages based on profile and resume data
- **Multiple Message Types**:
  - Casual Networking
  - Referral Request
  - Alumni Connection
  - Cold Outreach for Collaboration
- **Copy & Send Feature**: Easily copy generated messages to clipboard
- **Modern UI/UX**: Sleek, responsive design with dark mode support
- **Framer Motion Animations**: Smooth transitions and animations

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **UI Components**: Framer Motion, Headless UI
- **File Handling**: React Dropzone
- **HTTP Client**: Axios
- **Dark Mode**: next-themes
- **AI Integration**: OpenAI API (GPT-4o)

## 📋 Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/linkedin-message-generator.git
   cd linkedin-message-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Add your OpenAI API key to `.env.local`
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🔧 API Integration

### OpenAI API
This project uses OpenAI's GPT-4o model for:
- Generating personalized LinkedIn messages
- Analyzing resume content (optional)

To set up the OpenAI API:
1. Create an account at [OpenAI](https://platform.openai.com/)
2. Generate an API key in your dashboard
3. Add the key to your `.env.local` file

### LinkedIn Data
For LinkedIn profile data, the application uses:
- A mock implementation for demo purposes
- In production, consider:
  - LinkedIn's official API (limited access)
  - Third-party scraping services
  - Browser extension approach

### Resume Parsing
For resume parsing, the application uses:
- A mock implementation for demo purposes
- In production, consider:
  - OpenAI's document analysis capabilities
  - Dedicated resume parsing services
  - PDF/DOCX parsing libraries

## 🌟 Future Enhancements

- **LinkedIn OAuth Login**: Auto-fetch user's LinkedIn profile data
- **AI-Based Profile Insights**: Summarize work history & suggest conversation starters
- **Automated Messaging**: Chrome Extension for direct message sending
- **Resume-Based Smart Networking**: AI suggests who to connect with based on resume

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Headless UI](https://headlessui.dev/)
- [React Dropzone](https://react-dropzone.js.org/)
- [Heroicons](https://heroicons.com/)
- [OpenAI](https://openai.com/)
