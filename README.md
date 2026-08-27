# VedaAI 🎓

VedaAI is an intelligent, production-ready web application designed for educators. It automates the tedious process of cross-referencing a student's handwritten answer sheet against a printed question paper using advanced AI and Computer Vision via Google's Gemini 3.5 Flash model.

## ✨ Features

* **Intelligent Document Parsing**: Upload a Question Paper and an Answer Sheet (supports Images and PDFs).
* **AI-Powered OCR**: Automatically extracts questions, marks, handwritten student answers, and precise physical bounding box coordinates on the page.
* **Deterministic & Semantic Mapping**: 
  * Automatically maps student answers to their respective questions using explicit label matching (e.g., "11(a)").
  * Falls back to Gemini's semantic understanding to correctly map unlabeled or messy handwritten answers to the most logically appropriate question.
* **Interactive UI**: A sleek, modern two-pane interface where clicking a question automatically navigates to and draws a green highlight box precisely over the student's handwritten answer on the uploaded document.
* **Native PDF Rendering**: Integrated with `react-pdf` to flawlessly render multi-page PDF documents natively on the canvas for accurate physical highlighting.

## 🚀 Tech Stack

* **Frontend**: Next.js 16 (App Router), React, Tailwind CSS, Lucide React
* **Backend**: Next.js Serverless Route Handlers (`/api`)
* **AI Engine**: Google GenAI SDK (`@google/genai`) using `gemini-3.5-flash` for high-speed multimodal reasoning.
* **Document Viewer**: `react-pdf` for robust frontend PDF rendering.

## 🛠️ Local Development Setup

To run VedaAI locally on your machine, follow these steps:

### 1. Prerequisites
* Node.js 18+ installed.
* A valid Google Gemini API Key (You can get one from Google AI Studio).

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root of the project and add your Gemini API Key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Start the Server
Run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🌍 Deploying to Vercel

VedaAI is completely serverless and can be hosted for free on Vercel.

1. **Push your code to GitHub.**
2. Go to [Vercel](https://vercel.com/) and create a **New Project**.
3. Import your GitHub repository.
4. **Important**: Before clicking Deploy, expand the **Environment Variables** section and add:
   * **Name**: `GEMINI_API_KEY`
   * **Value**: Your actual Gemini API Key
5. Click **Deploy**. Vercel will automatically build the Next.js app and provide you with a live, production-ready URL!

## 📜 License
This project is licensed under the MIT License.
