export const analyzeResume = async (resumeText) => {
  try {
    const response = await fetch('http://localhost:4000/api/analyze-resume', {
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
    console.log('Analysis result:', result);
    return result;
  } catch (error) {
    console.error('Resume analysis error:', error);
    throw new Error(`Failed to analyze resume: ${error.message}`);
  }
};
