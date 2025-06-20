const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const getResumeSuggestions = async (resumeText) => {
  try {
    const response = await fetch(`${API_URL}/api/resume-suggestions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ resumeText })
    });
    if (!response.ok) {
      throw new Error('Failed to fetch resume suggestions');
    }
    const suggestions = await response.json();
    return suggestions.map((s, index) => ({
      id: `suggestion_${index}_${Date.now()}`,
      ...s
    }));
  } catch (error) {
    console.error('Frontend API Service error:', error);
    // Return a structured error instead of empty array
    return [{
      id: 'frontend_api_error',
      category: 'Connection Error',
      title: 'Backend Connection Failed',
      description: `Cannot connect to suggestion service: ${error.message}`,
      rationale: 'Please ensure the backend server is running on port 4000.',
      before: '',
      after: ''
    }];
  }
};
