import { useState, useEffect } from 'react';
import Header from '../components/Header';
import ResumeUploader from '../components/ResumeUploader';
import ResumeScoreCard from '../components/ResumeScoreCard';
import ImprovementSuggestions from '../components/ImprovementSuggestions';
import HistorySidebar from '../components/HistorySidebar';
import MotionBackground from '../components/MotionBackground';
import {
  FileText, BarChart2, Zap, Award, TrendingUp, Shield, CheckCircle, Upload, Menu
} from 'lucide-react';
import { toast } from 'sonner';
import {
  saveAnalysisToHistory,
  getAnalysisHistory,
  clearAnalysisHistory
} from '../utils/localStorage';
import { analyzeResume } from '../services/resumeService';
import { getResumeSuggestions } from '../services/apiService';

const Index = () => {
  const [resumeText, setResumeText] = useState(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [currentAnalysisId, setCurrentAnalysisId] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const history = getAnalysisHistory();
    setAnalysisHistory(history);
  }, []);

  const handleResumeUpload = async (data, fileName) => {
    console.log('handleResumeUpload received:', { data, fileName }); // Debug log
    if (typeof data === 'string') {
      // Initial text upload
      setResumeText(data);
      setUploadedFileName(fileName || 'Untitled Resume');
      setIsAnalyzing(true);

      try {
        const result = await analyzeResume(data);
        console.log('Analysis result:', result); // Debug log

        // Validate result structure
        if (!result || !result.score || typeof result.score.overallScore !== 'number') {
          throw new Error('Invalid analysis result structure');
        }

        // Fetch suggestions from gemini service
        let suggestions = [];
        try {
          suggestions = await getResumeSuggestions(data);
          console.log('Suggestions result:', suggestions);
        } catch (suggestionError) {
          console.error('Error fetching suggestions:', suggestionError);
          toast.error('Failed to fetch improvement suggestions.');
        }

        setAnalysisResult({ score: result, suggestions });

        const analysisId = saveAnalysisToHistory(fileName || 'Untitled Resume', { score: result, suggestions });
        setCurrentAnalysisId(analysisId);

        const updatedHistory = getAnalysisHistory();
        setAnalysisHistory(updatedHistory);

        setActiveTab('analysis');
        toast.success('Resume analyzed successfully! 🚀', {
          description: `Your resume scored ${result.score.overallScore}% on ATS compatibility`
        });
      } catch (error) {
        console.error('Error analyzing resume:', error);
        toast.error('Analysis failed', {
          description: error.message || 'Please try again with a different resume file'
        });
        setIsAnalyzing(false);
        return;
      }
    } else {
      // Analysis result from ResumeUploader
      console.log('Analysis from ResumeUploader:', data); // Debug log

      // Validate data structure
      if (!data || !data.score || typeof data.score.overallScore !== 'number') {
        console.error('Invalid analysis data:', data);
        toast.error('Analysis failed', {
          description: 'Received invalid analysis data. Please try again.'
        });
        setIsAnalyzing(false);
        return;
      }

      setAnalysisResult(data);
      const analysisId = saveAnalysisToHistory(fileName || 'Untitled Resume', data);
      setCurrentAnalysisId(analysisId);
      setUploadedFileName(fileName || 'Untitled Resume');

      const updatedHistory = getAnalysisHistory();
      setAnalysisHistory(updatedHistory);

      setActiveTab('analysis');
      toast.success('Resume analyzed successfully! 🚀', {
        description: `Your resume scored ${data.score.overallScore}% on ATS compatibility`
      });
    }
    setIsAnalyzing(false);
  };

  const handleSelectHistory = (historyItem) => {
    setAnalysisResult(historyItem.fullAnalysis);
    setCurrentAnalysisId(historyItem.id);
    setUploadedFileName(historyItem.fileName);
    setActiveTab('analysis');
    toast.info(`Loaded analysis for ${historyItem.fileName} ✨`);
  };

  const handleClearHistory = () => {
    clearAnalysisHistory();
    setAnalysisHistory([]);
    toast.success('Analysis history cleared 🗑️');
  };

  const handleDeleteAnalysis = (id) => {
    const updatedHistory = analysisHistory.filter(item => item.id !== id);
    setAnalysisHistory(updatedHistory);
    localStorage.setItem('ats_analysis_history', JSON.stringify(updatedHistory));

    if (currentAnalysisId === id) {
      setAnalysisResult(null);
      setCurrentAnalysisId(null);
      setActiveTab('upload');
    }

    toast.success('Analysis deleted 💥');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', width: '100vw', overflow: 'hidden' }}>
      <MotionBackground />

      {isSidebarOpen && (
        <div
          style={{
            width: '300px',
            backgroundColor: 'rgba(168,85,247,0.3)',
            boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
            zIndex: 1000,
            overflowY: 'auto',
            flexShrink: 0,
          }}
        >
          <HistorySidebar
            history={analysisHistory}
            onSelectHistory={handleSelectHistory}
            currentAnalysisId={currentAnalysisId}
            onClearHistory={handleClearHistory}
            onDeleteAnalysis={handleDeleteAnalysis}
          />
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 10, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px', borderBottom: '1px solid rgba(168,85,247,0.3)', backgroundColor: 'rgba(15,23,42,0.9)', backdropFilter: 'blur(12px)' }}>
          <button
            onClick={() => setIsSidebarOpen(prev => !prev)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#c084fc',
              padding: '8px'
            }}
          >
            <Menu size={28} />
          </button>
          <Header />
        </div>

        <style>{`
          .analysis-container {
            display: flex;
            flex-direction: column;
            gap: 3rem;
          }
          @media (min-width: 1024px) {
            .analysis-container {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 2rem;
              align-items: start;
            }
          }
        `}</style>

        <main style={{ flex: 1, position: 'relative', zIndex: 10, padding: '24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%) translateY(-1rem)', width: '8rem', height: '8rem', background: 'linear-gradient(to right, rgba(147,51,234,0.3), rgba(107,33,168,0.2))', borderRadius: '9999px', filter: 'blur(48px)', opacity: 0.3, animation: 'pulse 2s infinite' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', marginBottom: '2rem', position: 'relative' }}>
              <Shield size={48} color="#c084fc" />
              <h1 style={{ fontSize: '3rem', fontWeight: 'bold', background: 'linear-gradient(to right, #a855f7, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: '1.2' }}>ATS Resume Scanner</h1>
              <Award size={48} color="#a78bfa" />
            </div>
            <div style={{ border: '2px solid transparent', borderImage: 'linear-gradient(to right, #a855f7, #8b5cf6) 1', marginBottom: '2rem', maxWidth: '32rem', margin: 'auto' }}>
              <div style={{ padding: '1rem 2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                  <CheckCircle size={24} color="#4ade80" />
                  <span style={{ color: '#e9d5ff', fontWeight: '600', fontSize: '1.25rem' }}>Trusted by Professionals</span>
                  <Shield size={24} color="#4ade80" />
                </div>
              </div>
            </div>
            <p style={{ fontSize: '1.25rem', color: '#e9d5ff', maxWidth: '64rem', margin: 'auto', lineHeight: '1.75', marginBottom: '3rem', fontWeight: 500 }}>
              Professional-grade resume analysis powered by advanced AI technology. Get comprehensive insights to optimize your resume.
            </p>
            <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', marginBottom: '3rem' }}>
              <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', boxShadow: '0 0 1rem rgba(168,85,247,0.2)' }}>
                <TrendingUp size={40} color="#4ade80" style={{ margin: 'auto', marginBottom: '1rem' }} />
                <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#e9d5ff', marginBottom: '0.5rem' }}>98%</div>
                <p style={{ fontSize: '0.875rem', color: '#ddd6fe', fontWeight: 500 }}>Accuracy Rate</p>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', boxShadow: '0 0 1rem rgba(168,85,247,0.2)' }}>
                <Zap size={40} color="#4ade80" style={{ margin: 'auto', marginBottom: '1rem' }} />
                <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#e9d5ff', marginBottom: '0.5rem' }}>Instant</div>
                <p style={{ fontSize: '0.875rem', color: '#ddd6fe', fontWeight: 500 }}>Analysis</p>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', boxShadow: '0 0 1rem rgba(168,85,247,0.2)' }}>
                <Shield size={40} color="#4ade80" style={{ margin: 'auto', marginBottom: '1rem' }} />
                <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#e9d5ff', marginBottom: '0.5rem' }}>Secure</div>
                <p style={{ fontSize: '0.875rem', color: '#ddd6fe', fontWeight: 500 }}>& Private</p>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '3rem' }}>
            <div style={{ border: '2px solid transparent', borderImage: 'linear-gradient(to right, #a855f7, #8b5cf6) 1', maxWidth: '32rem', margin: 'auto' }}>
              <div style={{ padding: '0.5rem' }}>
                <div style={{ display: 'flex', borderRadius: '0.5rem', overflow: 'hidden' }}>
                  <button 
                    style={{ flex: 1, padding: '1.5rem 2rem', fontWeight: 600, fontSize: '1.125rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', backgroundColor: activeTab === 'upload' ? '#9333ea' : 'transparent', color: activeTab === 'upload' ? 'white' : '#d8b4fe', cursor: 'pointer' }}
                    onClick={() => setActiveTab('upload')}
                  >
                    <FileText size={24} />
                    Upload Resume
                  </button>
                  <button 
                    style={{ flex: 1, padding: '1.5rem 2rem', fontWeight: 600, fontSize: '1.125rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', backgroundColor: activeTab === 'analysis' ? '#9333ea' : 'transparent', color: (!resumeText && !analysisResult) ? '#a78bfa' : activeTab === 'analysis' ? 'white' : '#d8b4fe', cursor: (!resumeText && !analysisResult) ? 'not-allowed' : 'pointer' }}
                    onClick={() => (resumeText || analysisResult) && setActiveTab('analysis')}
                    disabled={!resumeText && !analysisResult}
                  >
                    <BarChart2 size={24} />
                    Analysis Results
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {activeTab === 'upload' && (
              <div style={{ padding: '3rem', maxWidth: '64rem', margin: 'auto', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '1rem', boxShadow: '0 0 1rem rgba(168,85,247,0.1)' }}>
                <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                  <Upload size={32} color="rgb(200, 150, 255)" />
                  <span style={{ background: 'linear-gradient(to right, #a855f7, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Upload Your Professional Resume</span>
                  <CheckCircle size={32} color="#4ade80" />
                </h2>
                <ResumeUploader onUpload={handleResumeUpload} isAnalyzing={isAnalyzing} />
                {isAnalyzing && (
                  <div style={{ marginTop: '3rem', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div style={{ width: '3rem', height: '3rem', border: '4px solid #c4b5fd', borderTop: '4px solid #9333ea', borderRadius: '9999px', animation: 'spin 1s linear infinite' }}></div>
                      <p style={{ fontSize: '1.5rem', fontWeight: 600, color: '#e9d5ff' }}>Analyzing your resume...</p>
                    </div>
                    <p style={{ color: '#ddd6fe', fontSize: '1.125rem' }}>Our AI is providing comprehensive analysis and recommendations.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'analysis' && analysisResult && analysisResult.score && (
              <div className="analysis-container">
                <div style={{ textAlign: 'center', marginBottom: '3rem', gridColumn: '1 / -1' }}>
                  <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', background: 'linear-gradient(to right, #a855f7, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1rem' }}>
                    Professional Analysis Complete
                  </h2>
                  <p style={{ color: '#ddd6fe', fontSize: '1.25rem' }}>File: {uploadedFileName}</p>
                </div>
                <ResumeScoreCard 
                  overallScore={analysisResult.score.overallScore} 
                  categories={analysisResult.score.categories} 
                />
                <ImprovementSuggestions suggestions={analysisResult.suggestions} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;