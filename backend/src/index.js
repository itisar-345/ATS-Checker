import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { analyzeResume } from './services/atsService.js';
import { getResumeSuggestions } from './services/apiService.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Endpoint to analyze resume text
app.post('/api/analyze-resume', async (req, res) => {
  try {
    const { resumeText } = req.body;
    if (!resumeText) {
      return res.status(400).json({ error: 'resumeText is required' });
    }
    const result = await analyzeResume(resumeText);
    res.json(result);
  } catch (error) {
    console.error('Error in /api/analyze-resume:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to get resume improvement suggestions
app.post('/api/resume-suggestions', async (req, res) => {
  try {
    const { resumeText } = req.body;
    if (!resumeText) {
      return res.status(400).json({ error: 'resumeText is required' });
    }
    const suggestions = await getResumeSuggestions(resumeText);
    res.json(suggestions);
  } catch (error) {
    console.error('Error in /api/resume-suggestions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to parse uploaded file (assuming file is sent as base64 or similar)
app.post('/api/parse-file', async (req, res) => {
  try {
    // For simplicity, this example expects file info in request body
    const { file } = req.body;
    if (!file) {
      return res.status(400).json({ error: 'file is required' });
    }
    // parseFile expects a File object, so this may need adjustment for backend usage
    // Here, just returning an error placeholder
    res.status(501).json({ error: 'File parsing API not implemented for backend yet' });
  } catch (error) {
    console.error('Error in /api/parse-file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
