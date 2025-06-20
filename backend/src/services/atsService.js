import { analyzeResume as analyzeResumeCore } from './resumeService.js';

export const analyzeResume = async (resumeText) => {
  try {
    if (!resumeText || typeof resumeText !== 'string') {
      throw new Error('Invalid resume text');
    }
    const result = await analyzeResumeCore(resumeText);
    console.log('atsAnalyzer result:', result); // Debug log

    // Validate result structure
    if (!result || !result.score || typeof result.score.overallScore !== 'number') {
      throw new Error('Invalid analysis result from core analyzer');
    }

    return result;
  } catch (error) {
    console.error('ATS Analyzer error:', error);
    throw new Error(`Resume analysis failed: ${error.message}`);
  }
};
