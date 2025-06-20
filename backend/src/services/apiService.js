import { getResumeSuggestions as getSuggestions } from '../utils/gorqapi.js';

export const getResumeSuggestions = async (resumeText) => {
  try {
    console.log('getResumeSuggestions called with resumeText:', resumeText.substring(0, 100));
    const suggestions = await getSuggestions(resumeText);
    console.log('getResumeSuggestions received suggestions:', suggestions);
    return suggestions.map((s, index) => ({
      id: `suggestion_${index}_${Date.now()}`,
      ...s
    }));
  } catch (error) {
    console.error('Groq Service error:', error);
    // Return a structured error instead of empty array
    return [{
      id: 'api_error_suggestion',
      category: 'API Error',
      title: 'Suggestion Service Unavailable',
      description: `Unable to fetch improvement suggestions: ${error.message}`,
      rationale: 'Please ensure the backend server is running and API keys are configured correctly.',
      before: '',
      after: ''
    }];
  }
};
