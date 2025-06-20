const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const analyzeResume = async (resumeText) => {
  try {
    const response = await fetch(`${API_URL}/api/analyze-resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ resumeText })
    });
    if (!response.ok) {
      throw new Error('Failed to analyze resume');
    }
    const result = await response.json();
    console.log('atsAnalyzer result:', result); // Debug log
    return result;
  } catch (error) {
    console.error('ATS Analyzer error:', error);
    throw new Error(`Resume analysis failed: ${error.message}`);
  }
};
