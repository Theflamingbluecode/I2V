# Imago Verses

Imago Verses is a web application that transforms your visual moments into poetic text. Upload an image, and let our AI generate a unique poem inspired by it.

## Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/) (React framework)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **AI Integration:** [Genkit (Firebase Genkit)](https://firebase.google.com/docs/genkit)
*   **AI Model:** [Google Gemini](https://deepmind.google.com/technologies/gemini/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** [Shadcn UI](https://ui.shadcn.com/)

## Features

*   **Image Upload:** Upload images in common formats (JPG, PNG, GIF, WEBP).
*   **AI Poem Generation:** Generates a unique poem based on the content and mood of the uploaded image.
*   **Copy to Clipboard:** Easily copy the generated poem.
*   **Client-Side Validation:** Checks for file type and size before uploading.
*   **Responsive Design:** Works on various screen sizes.

## Getting Started / Running Locally

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or later recommended)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
*   A Google AI API Key with the Gemini API enabled. You can obtain one from the [Google AI Studio](https://aistudio.google.com/app/apikey).

### Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/imago-verses.git # Replace with your repo URL
    cd imago-verses
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of your project by copying the example file:
    ```bash
    cp .env.example .env
    ```
    Open the `.env` file and add your Google AI API Key:
    ```
    GOOGLE_API_KEY=YOUR_API_KEY_HERE
    ```
    *(If `.env.example` does not exist, create it with the content above).*

4.  **Initialize Genkit (if not already done for your environment):**
    Ensure you have Genkit installed and configured. If this is your first time using Genkit, you might need to log in:
    ```bash
    npm install -g genkit # or yarn global add genkit
    # genkit init # This project is already initialized.
    # You might need to login to Google Cloud if prompted by Genkit, e.g., gcloud auth application-default login
    ```
    *Note: The project already includes Genkit configuration in `src/ai/genkit.ts` and `src/ai/dev.ts` loads the flow.*

5.  **Start the Genkit Development Server:**
    Genkit tools run in a separate process to manage AI flows.
    In a new terminal window, navigate to the project root and run:
    ```bash
    genkit start
    ```
    This will start the Genkit development UI (usually at `http://localhost:4000`) and make your AI flows available. You should see the `generatePoemFromImageFlow` listed.

6.  **Run the Next.js development server:**
    In another terminal window, from the project root:
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    This will start the Next.js application, typically at `http://localhost:3000`.

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## How to Use

1.  **Visit the application** in your browser.
2.  **Upload an Image:**
    *   Click the "Click to upload" button or drag and drop an image file (JPG, PNG, GIF, WEBP, up to 10MB) onto the designated area.
3.  **Generate Poem:**
    *   Once the image is previewed, click the "✨ Generate Poem" button.
4.  **View and Copy:**
    *   The AI-generated poem will appear on the right side.
    *   Click the copy icon to copy the poem to your clipboard.
    *   You can click "✨ Regenerate Poem" to get a new version or "Start Over" (refresh icon) to upload a new image.

## Project Structure (Simplified)

```
.
├── src/
│   ├── ai/                 # Genkit AI flows and configuration
│   │   ├── flows/
│   │   │   └── generate-poem-from-image.ts # The core AI logic
│   │   ├── dev.ts          # Loads flows for Genkit dev server
│   │   └── genkit.ts       # Genkit plugin setup
│   ├── app/                # Next.js app router (pages, layouts, actions)
│   │   ├── actions.ts      # Server actions for Next.js
│   │   └── page.tsx        # Main page component
│   ├── components/         # React components
│   │   ├── ui/             # Shadcn UI components
│   │   └── poem-generator.tsx # Core UI for uploading and displaying poems
│   ├── hooks/              # Custom React hooks
│   └── lib/                # Utility functions
├── public/                 # Static assets
├── .env.example            # Example environment variables
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Future Enhancements

*   Selection of different poetic styles (e.g., Haiku, Sonnet).
*   User accounts to save generated poems.

---

Happy poem crafting!
