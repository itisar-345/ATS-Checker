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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        <>
          {/* Mobile overlay */}
          <div 
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 999,
              display: window.innerWidth < 768 ? 'block' : 'none'
            }}
            onClick={() => setIsSidebarOpen(false)}
          />
          <div
            style={{
              width: window.innerWidth < 768 ? '280px' : '300px',
              backgroundColor: 'rgba(168,85,247,0.3)',
              boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
              zIndex: 1000,
              overflowY: 'auto',
              flexShrink: 0,
              position: window.innerWidth < 768 ? 'fixed' : 'relative',
              height: window.innerWidth < 768 ? '100vh' : 'auto',
              left: window.innerWidth < 768 ? 0 : 'auto',
              top: window.innerWidth < 768 ? 0 : 'auto'
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
        </>
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 10, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: window.innerWidth < 768 ? '12px' : '16px', borderBottom: '1px solid rgba(168,85,247,0.3)', backgroundColor: 'rgba(15,23,42,0.9)', backdropFilter: 'blur(12px)' }}>
          <button
            onClick={() => setIsSidebarOpen(prev => !prev)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#c084fc',
              padding: window.innerWidth < 768 ? '6px' : '8px'
            }}
          >
            <Menu size={window.innerWidth < 768 ? 24 : 28} />
          </button>
          <Header />
        </div>

        <style>{`
          .analysis-container {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }
          @media (min-width: 768px) {
            .analysis-container {
              gap: 2rem;
            }
          }
          @media (min-width: 1024px) {
            .analysis-container {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 2rem;
              align-items: start;
            }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>

        <main style={{ flex: 1, position: 'relative', zIndex: 10, padding: window.innerWidth < 768 ? '16px' : '24px' }}>
          <div style={{ textAlign: 'center', marginBottom: window.innerWidth < 768 ? '2rem' : '4rem', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: window.innerWidth < 768 ? '4px' : '24px', marginBottom: window.innerWidth < 768 ? '0.5rem' : '2rem', position: 'relative', flexWrap: 'wrap' }}>
              <Shield size={window.innerWidth < 768 ? 14 : 48} color="#c084fc" />
              <h1 style={{ fontSize: window.innerWidth < 768 ? '0.8rem' : window.innerWidth < 1024 ? '1.5rem' : '2rem', fontWeight: 'bold', background: 'linear-gradient(to right, #a855f7, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: '1', textAlign: 'center' }}>ATS Resume Scanner</h1>
              <Award size={window.innerWidth < 768 ? 14 : 48} color="#a78bfa" />
            </div>
            <div style={{ border: '2px solid transparent', borderImage: 'linear-gradient(to right, #a855f7, #8b5cf6) 1', marginBottom: window.innerWidth < 768 ? '1rem' : '2rem', maxWidth: window.innerWidth < 768 ? '20rem' : '32rem', margin: 'auto' }}>
              <div style={{ padding: window.innerWidth < 768 ? '0.5rem 1rem' : '1rem 2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: window.innerWidth < 768 ? '6px' : '12px', flexWrap: 'wrap' }}>
                  <CheckCircle size={window.innerWidth < 768 ? 16 : 24} color="#4ade80" />
                  <span style={{ color: '#e9d5ff', fontWeight: '600', fontSize: window.innerWidth < 768 ? '0.875rem' : '1.25rem' }}>Trusted by Professionals</span>
                  <Shield size={window.innerWidth < 768 ? 16 : 24} color="#4ade80" />
                </div>
              </div>
            </div>
            <p style={{ fontSize: window.innerWidth < 768 ? '0.8rem' : '1rem', color: '#e9d5ff', maxWidth: window.innerWidth < 768 ? '100%' : '64rem', margin: 'auto', lineHeight: '1.75', marginBottom: window.innerWidth < 768 ? '1rem' : '2rem', fontWeight: 500, padding: window.innerWidth < 768 ? '0 1rem' : '0' }}>
              Professional-grade resume analysis powered by advanced AI technology. Get comprehensive insights to optimize your resume.
            </p>
            <div style={{ display: 'grid', gap: window.innerWidth < 768 ? '1rem' : '2rem', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(auto-fit, minmax(180px, 1fr))', marginBottom: window.innerWidth < 768 ? '1rem' : '2rem', padding: window.innerWidth < 768 ? '0 1rem' : '0' }}>
              <div style={{ textAlign: 'center', padding: window.innerWidth < 768 ? '0.75rem' : '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', boxShadow: '0 0 1rem rgba(168,85,247,0.2)' }}>
                <TrendingUp size={window.innerWidth < 768 ? 24 : 40} color="#4ade80" style={{ margin: 'auto', marginBottom: '0.5rem' }} />
                <div style={{ fontSize: window.innerWidth < 768 ? '1.25rem' : '1.875rem', fontWeight: 'bold', color: '#e9d5ff', marginBottom: '0.25rem' }}>98%</div>
                <p style={{ fontSize: window.innerWidth < 768 ? '0.75rem' : '0.875rem', color: '#ddd6fe', fontWeight: 500 }}>Accuracy Rate</p>
              </div>
              <div style={{ textAlign: 'center', padding: window.innerWidth < 768 ? '0.75rem' : '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', boxShadow: '0 0 1rem rgba(168,85,247,0.2)' }}>
                <Zap size={window.innerWidth < 768 ? 24 : 40} color="#4ade80" style={{ margin: 'auto', marginBottom: '0.5rem' }} />
                <div style={{ fontSize: window.innerWidth < 768 ? '1.25rem' : '1.875rem', fontWeight: 'bold', color: '#e9d5ff', marginBottom: '0.25rem' }}>Instant</div>
                <p style={{ fontSize: window.innerWidth < 768 ? '0.75rem' : '0.875rem', color: '#ddd6fe', fontWeight: 500 }}>Analysis</p>
              </div>
              <div style={{ textAlign: 'center', padding: window.innerWidth < 768 ? '0.75rem' : '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', boxShadow: '0 0 1rem rgba(168,85,247,0.2)' }}>
                <Shield size={window.innerWidth < 768 ? 24 : 40} color="#4ade80" style={{ margin: 'auto', marginBottom: '0.5rem' }} />
                <div style={{ fontSize: window.innerWidth < 768 ? '1.25rem' : '1.875rem', fontWeight: 'bold', color: '#e9d5ff', marginBottom: '0.25rem' }}>Secure</div>
                <p style={{ fontSize: window.innerWidth < 768 ? '0.75rem' : '0.875rem', color: '#ddd6fe', fontWeight: 500 }}>& Private</p>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: window.innerWidth < 768 ? '1rem' : '2rem', padding: window.innerWidth < 768 ? '0 1rem' : '0' }}>
            <div style={{ border: '2px solid transparent', borderImage: 'linear-gradient(to right, #a855f7, #8b5cf6) 1', maxWidth: window.innerWidth < 768 ? '100%' : '32rem', margin: 'auto' }}>
              <div style={{ padding: '0.5rem' }}>
                <div style={{ display: 'flex', borderRadius: '0.5rem', overflow: 'hidden', flexDirection: window.innerWidth < 480 ? 'column' : 'row' }}>
                  <button 
                    style={{ flex: 1, padding: window.innerWidth < 768 ? '1rem' : '1.5rem 2rem', fontWeight: 600, fontSize: window.innerWidth < 768 ? '0.875rem' : '1.125rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: window.innerWidth < 768 ? '0.5rem' : '0.75rem', backgroundColor: activeTab === 'upload' ? '#9333ea' : 'transparent', color: activeTab === 'upload' ? 'white' : '#d8b4fe', cursor: 'pointer', border: 'none' }}
                    onClick={() => setActiveTab('upload')}
                  >
                    <FileText size={window.innerWidth < 768 ? 18 : 24} />
                    <span style={{ display: window.innerWidth < 480 ? 'none' : 'inline' }}>Upload Resume</span>
                    <span style={{ display: window.innerWidth < 480 ? 'inline' : 'none' }}>Upload</span>
                  </button>
                  <button 
                    style={{ flex: 1, padding: window.innerWidth < 768 ? '1rem' : '1.5rem 2rem', fontWeight: 600, fontSize: window.innerWidth < 768 ? '0.875rem' : '1.125rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: window.innerWidth < 768 ? '0.5rem' : '0.75rem', backgroundColor: activeTab === 'analysis' ? '#9333ea' : 'transparent', color: (!resumeText && !analysisResult) ? '#a78bfa' : activeTab === 'analysis' ? 'white' : '#d8b4fe', cursor: (!resumeText && !analysisResult) ? 'not-allowed' : 'pointer', border: 'none' }}
                    onClick={() => (resumeText || analysisResult) && setActiveTab('analysis')}
                    disabled={!resumeText && !analysisResult}
                  >
                    <BarChart2 size={window.innerWidth < 768 ? 18 : 24} />
                    <span style={{ display: window.innerWidth < 480 ? 'none' : 'inline' }}>Analysis Results</span>
                    <span style={{ display: window.innerWidth < 480 ? 'inline' : 'none' }}>Results</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {activeTab === 'upload' && (
              <div style={{ padding: window.innerWidth < 768 ? '1.5rem' : '3rem', maxWidth: '64rem', margin: 'auto', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '1rem', boxShadow: '0 0 1rem rgba(168,85,247,0.1)' }}>
                <h2 style={{ fontSize: window.innerWidth < 768 ? '1.25rem' : '1.875rem', fontWeight: 'bold', textAlign: 'center', marginBottom: window.innerWidth < 768 ? '1.5rem' : '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: window.innerWidth < 768 ? '0.5rem' : '1rem', flexWrap: 'wrap' }}>
                  <Upload size={window.innerWidth < 768 ? 20 : 32} color="rgb(200, 150, 255)" />
                  <span style={{ background: 'linear-gradient(to right, #a855f7, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textAlign: 'center' }}>Upload Your Professional Resume</span>
                  <CheckCircle size={window.innerWidth < 768 ? 20 : 32} color="#4ade80" />
                </h2>
                <ResumeUploader onUpload={handleResumeUpload} isAnalyzing={isAnalyzing} />
                {isAnalyzing && (
                  <div style={{ marginTop: window.innerWidth < 768 ? '1.5rem' : '3rem', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.05)', padding: window.innerWidth < 768 ? '1rem' : '2rem', borderRadius: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: window.innerWidth < 768 ? '0.5rem' : '1rem', marginBottom: window.innerWidth < 768 ? '1rem' : '1.5rem', flexDirection: window.innerWidth < 480 ? 'column' : 'row' }}>
                      <div style={{ width: window.innerWidth < 768 ? '2rem' : '3rem', height: window.innerWidth < 768 ? '2rem' : '3rem', border: '4px solid #c4b5fd', borderTop: '4px solid #9333ea', borderRadius: '9999px', animation: 'spin 1s linear infinite' }}></div>
                      <p style={{ fontSize: window.innerWidth < 768 ? '1rem' : '1.5rem', fontWeight: 600, color: '#e9d5ff' }}>Analyzing your resume...</p>
                    </div>
                    <p style={{ color: '#ddd6fe', fontSize: window.innerWidth < 768 ? '0.875rem' : '1.125rem' }}>Our AI is providing comprehensive analysis and recommendations.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'analysis' && analysisResult && analysisResult.score && (
              <div className="analysis-container">
                <div style={{ textAlign: 'center', marginBottom: window.innerWidth < 768 ? '1.5rem' : '3rem', gridColumn: '1 / -1' }}>
                  <h2 style={{ fontSize: window.innerWidth < 768 ? '1.5rem' : '2.25rem', fontWeight: 'bold', background: 'linear-gradient(to right, #a855f7, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1rem' }}>
                    Professional Analysis Complete
                  </h2>
                  <p style={{ color: '#ddd6fe', fontSize: window.innerWidth < 768 ? '0.875rem' : '1.25rem', wordBreak: 'break-word', padding: window.innerWidth < 768 ? '0 1rem' : '0' }}>File: {uploadedFileName}</p>
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