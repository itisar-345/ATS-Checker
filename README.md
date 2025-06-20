<h1 align="center">ATS-Checker</h1>

<p align="center">
  <a href="https://example.com/build-status">
    <img src="https://img.shields.io/badge/build-passing-brightgreen" alt="Build Status" />
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/license-ISC-blue" alt="License" />
  </a>
  <br>
  <!-- Backend Badges -->
  <a href="https://www.npmjs.com/package/express">
    <img src="https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white" />
  </a>
  <a href="https://www.npmjs.com/package/cors">
    <img src="https://img.shields.io/badge/CORS-00599C?style=flat&logo=apachespark&logoColor=white" />
  </a>
  <a href="https://www.npmjs.com/package/dotenv">
    <img src="https://img.shields.io/badge/dotenv-8DD6F9?style=flat&logo=envato&logoColor=black" />
  </a>
  <a href="https://www.npmjs.com/package/groq-sdk">
    <img src="https://img.shields.io/badge/groq--sdk-FF6B00?style=flat&logo=data&logoColor=white" />
  </a>
  <a href="https://www.npmjs.com/package/mammoth">
    <img src="https://img.shields.io/badge/mammoth-5C2D91?style=flat&logo=python&logoColor=white" />
  </a>
  <a href="https://www.npmjs.com/package/@google/generative-ai">
    <img src="https://img.shields.io/badge/@google/generative--ai-34A853?style=flat&logo=google&logoColor=white" />
  </a>
  <br>
  <!-- Frontend Badges -->
  <a href="https://www.npmjs.com/package/react">
    <img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black" />
  </a>
  <a href="https://www.npmjs.com/package/react-router-dom">
    <img src="https://img.shields.io/badge/React_Router_DOM-CA4245?style=flat&logo=reactrouter&logoColor=white" />
  </a>
  <a href="https://www.npmjs.com/package/vite">
    <img src="https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white" />
  </a>
  <a href="https://www.npmjs.com/package/lucide-react">
    <img src="https://img.shields.io/badge/Lucide_React-4C4CFF?style=flat&logo=feather&logoColor=white" />
  </a>
  <a href="https://www.npmjs.com/package/sonner">
    <img src="https://img.shields.io/badge/Sonner-FFB900?style=flat&logo=soundcloud&logoColor=black" />
  </a>
  <a href="https://www.npmjs.com/package/react-dropzone">
    <img src="https://img.shields.io/badge/React_Dropzone-00C7B7?style=flat&logo=dropbox&logoColor=white" />
  </a>
  <a href="https://www.npmjs.com/package/pdfjs-dist">
    <img src="https://img.shields.io/badge/pdfjs--dist-FF5252?style=flat&logo=adobeacrobatreader&logoColor=white" />
  </a>
  <a href="https://www.npmjs.com/package/date-fns">
    <img src="https://img.shields.io/badge/date--fns-007ACC?style=flat&logo=clockify&logoColor=white" />
  </a>
  <a href="https://www.npmjs.com/package/@google/generative-ai">
    <img src="https://img.shields.io/badge/@google/generative--ai-34A853?style=flat&logo=google&logoColor=white" />
  </a>
</p>

---

## Project Overview

ATS-Checker is an AI-powered resume analysis tool designed to help job seekers optimize their resumes for Applicant Tracking Systems (ATS). The system analyzes uploaded resumes, provides a compatibility score, and offers actionable improvement suggestions to increase the chances of passing ATS filters.

The project consists of two main parts:

- **Backend:** A Node.js Express API server that processes resume text, interacts with AI services, and returns analysis results.
- **Frontend:** A React application that provides a user-friendly interface for uploading resumes, viewing analysis results, and managing analysis history.

---

## Project Structure

```
ATS-Checker/
├── backend/               # Backend API server
│   ├── src/
│   │   ├── index.js       # Main server entry point
│   │   ├── services/      # Business logic for resume analysis and suggestions
│   │   └── utils/         # Utility functions
│   ├── package.json       # Backend dependencies and scripts
│   └── .env               # Environment variables (not committed)
├── frontend/              # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components (Index, NotFound)
│   │   ├── services/      # API service calls
│   │   └── utils/         # Utility functions (localStorage, file parsing)
│   ├── package.json       # Frontend dependencies and scripts
│   └── vite.config.js     # Vite configuration
├── README.md              # This documentation file
└── .gitignore             # Git ignore rules
```

---

## Backend Setup and Usage

### Prerequisites

- Node.js (version 16 or higher recommended)
- npm (comes with Node.js)

### Step 1: Navigate to Backend Directory

Open your terminal and change directory to the backend folder:

```bash
cd backend
```

### Step 2: Install Dependencies

Install the required Node.js packages:

```bash
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the `backend` directory to set environment variables. For example:

```
PORT=4000
```

You can add other environment variables as needed for API keys or configurations.

### Step 4: Start the Backend Server

Run the backend server with:

```bash
npm start
```

The server will start and listen on the port specified in `.env` or default to 4000.

### Backend API Endpoints

- **POST /api/analyze-resume**

  Analyze resume text for ATS compatibility.

  - Request Body:

    ```json
    {
      "resumeText": "Your resume text here"
    }
    ```

  - Response:

    ```json
    {
      "score": {
        "overallScore": 85,
        "categories": {
          "formatting": 90,
          "keywords": 80,
          "experience": 85
        }
      }
    }
    ```

- **POST /api/resume-suggestions**

  Get improvement suggestions for the resume.

  - Request Body:

    ```json
    {
      "resumeText": "Your resume text here"
    }
    ```

  - Response:

    ```json
    {
      "suggestions": [
        "Add more relevant keywords",
        "Improve formatting for better readability"
      ]
    }
    ```

- **POST /api/parse-file**

  Currently not implemented.

---

## Frontend Setup and Usage

### Prerequisites

- Node.js (version 16 or higher recommended)
- npm (comes with Node.js)

### Step 1: Navigate to Frontend Directory

Open your terminal and change directory to the frontend folder:

```bash
cd frontend
```

### Step 2: Install Dependencies

Install the required Node.js packages:

```bash
npm install
```

### Step 3: Start the Development Server

Run the frontend development server with:

```bash
npm run dev
```

This will start the React app and open it in your default browser at `http://localhost:3000` (or another port if 3000 is in use).

### Using the Frontend Application

- **Upload Resume:** Use the "Upload Resume" tab to upload your resume file or paste resume text.
- **View Analysis:** After uploading, switch to the "Analysis Results" tab to see your ATS compatibility score and detailed category breakdown.
- **Improvement Suggestions:** View AI-generated suggestions to improve your resume.
- **History Sidebar:** Access your past resume analyses, reload them, or delete entries.
- **Responsive UI:** The app is designed to work well on various screen sizes.

---

## Available Scripts

### Backend Scripts

- `npm start`  
  Starts the backend Express server.

- `npm test`  
  Placeholder for running backend tests (not implemented).

### Frontend Scripts

- `npm run dev`  
  Starts the frontend development server with hot module replacement.

- `npm run build`  
  Builds the frontend for production deployment.

- `npm run preview`  
  Previews the production build locally.

- `npm run lint`  
  Runs ESLint to check code quality and style.

---

## License

This project is licensed under the ISC License.
