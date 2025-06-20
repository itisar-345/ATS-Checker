const STORAGE_KEY = 'ats_analysis_history';
const MAX_HISTORY_ITEMS = 50;

export const saveAnalysisToHistory = (fileName, analysis) => {
  try {
    console.log('Saving analysis to history:', { fileName, analysis }); // Debug log
    if (!analysis || !analysis.score || !Number.isFinite(analysis.score.overallScore)) {
      throw new Error('Invalid analysis data: Missing or invalid scores');
    }

    // Initialize history as empty array if none exists
    const history = getAnalysisHistory() || [];
    
    const getScoreRange = (score) => {
      if (!Number.isFinite(score)) return 'Warning';
      if (score <= 60) return 'Warning';
      if (score <= 80) return 'Good';
      return 'Excellent';
    };

    // Calculate bestScore
    const bestScore = history.length > 0
      ? Math.max(analysis.score.overallScore, ...history.map(item => item.score?.overallScore || 0))
      : analysis.score.overallScore;

    // Update existing history entries with new bestScore
    const updatedHistory = history.map(item => ({
      ...item,
      score: {
        ...item.score,
        bestScore
      }
    }));

    const newAnalysis = {
      id: Date.now().toString(),
      fileName: fileName || 'Untitled Resume',
      timestamp: new Date().toISOString(),
      isFavorite: false,
      score: {
        overallScore: analysis.score.overallScore,
        overallScoreRange: getScoreRange(analysis.score.overallScore),
        bestScore,
        bestScoreRange: getScoreRange(bestScore)
      },
      fullAnalysis: analysis
    };

    const newHistory = [newAnalysis, ...updatedHistory].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    console.log('Saved analysis ID:', newAnalysis.id, 'Best score:', bestScore); // Debug log
    return newAnalysis.id;
  } catch (error) {
    console.error('Error saving analysis to history:', error.message);
    return null;
  }
};

export const getAnalysisHistory = () => {
  try {
    const history = localStorage.getItem(STORAGE_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error retrieving analysis history:', error.message);
    return [];
  }
};

export const toggleFavorite = (id) => {
  try {
    const history = getAnalysisHistory();
    const updatedHistory = history.map(item =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    console.log('Toggled favorite for ID:', id); // Debug log
  } catch (error) {
    console.error('Error toggling favorite:', error.message);
  }
};

export const clearAnalysisHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('Cleared analysis history'); // Debug log
  } catch (error) {
    console.error('Error clearing analysis history:', error.message);
  }
};

export const exportHistory = () => {
  try {
    const history = getAnalysisHistory();
    const dataStr = JSON.stringify(history, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `resume_analysis_history_${new Date().toISOString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    console.log('Exported history'); // Debug log
  } catch (error) {
    console.error('Error exporting history:', error.message);
  }
};