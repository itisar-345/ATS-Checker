import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import mammoth from 'mammoth';
import fs from 'fs';

import { analyzeResume } from './services/atsService.js';
import { getResumeSuggestions } from './services/apiService.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

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

app.post('/api/parse-file', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'file is required' });
    }

    let text = '';
    const ext = req.file.originalname.split('.').pop().toLowerCase();

    if (ext === 'docx') {
      const result = await mammoth.extractRawText({ path: req.file.path });
      text = result.value;
    } else if (ext === 'txt') {
      text = fs.readFileSync(req.file.path, 'utf8');
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    fs.unlinkSync(req.file.path);
    res.json({ text });
  } catch (error) {
    console.error('Error in /api/parse-file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
