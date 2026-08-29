# VedaAI

VedaAI is an intelligent assessment mapping application built to easily extract questions and answers from PDFs or images, align them intuitively in a unified interface, and automatically cross-reference content using cutting-edge Generative AI models.

## Architecture

This project is built as a **Monorepo** using npm workspaces. 
This structure allows us to cleanly separate our application logic from shared generic packages, preventing circular dependencies and allowing the codebase to scale seamlessly.

- **`apps/web`**: The core Next.js web application containing the user interface, PDF rendering (`react-pdf`), mapping UI components, and the backend extraction logic API Routes.
- **`packages/types`**: Shared TypeScript definitions across the workspace (e.g. Assessment Types, Question/Answer interfaces).

### Technology Stack
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **AI Integration**: `@google/genai` (Official Google Gen AI SDK) 
- **AI Models Used**: `gemini-3.5-flash` for high-speed multimodal OCR extraction and semantic mapping.
- **PDF Rendering**: `react-pdf` for robust frontend document rendering.
- **Package Manager**: npm workspaces

---

## Important Architectural Flows

1. **Extraction Pipeline (`/api/extract-*`)**: 
   When a user uploads a Question Paper and an Answer Sheet, the files are passed to `gemini-3.5-flash` via the Next.js API route. The AI model extracts the text, physical bounding box locations on the page (normalized coordinates), and semantic meaning.
2. **Mapping Pipeline (`/api/map-answers`)**:
   Answers and questions are cross-referenced in a two-stage process:
   - **Explicit Matching**: Normalizes question labels (e.g. "Q. 11(a)" vs "11a") and maps exact matches directly.
   - **Semantic Matching**: For any remaining unanswered/unmapped questions, a prompt is sent back to `gemini-3.5-flash` to map them based purely on their textual similarity and context.
3. **Frontend Rendering (`AnswerViewer.tsx`)**:
   The frontend translates the normalized bounding boxes returned by the AI into absolute DOM coordinates based on standard A4 scaling (800x1131), and overlays interactive highlight components on top of the `react-pdf` canvas.

---

## Prerequisites

- **Node.js**: >= 20.0.0
- **npm**: >= 10.0.0 (Supports Workspaces natively)
- **API Key**: You will need a valid Google Gemini API Key that has access to the `gemini-3.5-flash` model. 

---

## Getting Started Locally

1. **Clone and Install dependencies**
   Run the following from the root of the repository:
   ```bash
   npm install
   ```
   *(Note: Do not install dependencies from inside `apps/web`. NPM workspaces will link the dependencies automatically from the root).*

2. **Configure your Environment Variables**
   Create an `.env.local` file inside the Next.js application directory (`apps/web/.env.local`) and add your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

3. **Run the Development Server**
   Start the Next.js application in development mode from the root directory:
   ```bash
   npm run dev
   ```
   The application will be available at [http://localhost:3000](http://localhost:3000).

---

## Building for Production

To build the application for production, run from the root:
```bash
npm run build
```
*(This command is configured to correctly run the Webpack-based build inside `apps/web`, circumventing any Windows native SWC binding issues).*

To start the production server locally:
```bash
npm run start
```

---

## Deployment (Vercel)

This repository is optimized for deployment on Vercel out of the box. 

1. Push your codebase to a GitHub repository.
2. In the Vercel dashboard, click **Add New... > Project** and import the repository.
3. Vercel automatically detects Monorepos. 
   - You can leave the **Root Directory** as the default repository root (`./`).
   - The root `package.json` correctly aliases Vercel's standard `build` and `start` commands to the `web` workspace automatically.
4. **Environment Variables**: Add your `GEMINI_API_KEY` to Vercel's Environment Variables in the project settings.
5. Click **Deploy**. Vercel will handle the rest!

## Additional Commands

You can run commands specifically for individual workspaces by using the `-w` flag:
- `npm run dev -w web` (Start dev server just for web)
- `npm run lint -w web` (Run Next.js linter)
