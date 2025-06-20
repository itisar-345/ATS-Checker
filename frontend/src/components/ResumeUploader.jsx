import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Shield, CheckCircle } from 'lucide-react';
import { parseFile } from '../utils/fileParser';
import { Progress } from './Progress';
import { toast } from 'sonner';
import { analyzeResume } from '../services/atsService';
import { getResumeSuggestions } from '../services/apiService';

const ResumeUploader = ({ onUpload, isAnalyzing }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    setUploadProgress(10);
    setIsUploading(true);
    if (!file) {
      toast.error('No file selected');
      setIsUploading(false);
      return;
    }

    try {
      const resumeText = await parseFile(file);
      console.log('Parsed resume text:', resumeText.substring(0, 100)); // Debug log
      setUploadProgress(40);

      const analysis = await analyzeResume(resumeText).catch(err => {
        throw new Error(`Failed to analyze resume content: ${err.message}`);
      });
      console.log('Analysis from atsAnalyzer:', analysis); // Debug log
      setUploadProgress(70);

      // Always try to get suggestions from backend API
      const suggestions = await getResumeSuggestions(resumeText);
      console.log('Gemini suggestions:', suggestions); // Debug log
      analysis.suggestions = suggestions;
      setUploadProgress(100);

      onUpload(analysis, file.name);
      toast.success('Resume analyzed successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to analyze resume');
      setUploadProgress(0);
      setIsUploading(false);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    multiple: false
  });

  return (
    <div style={{ width: '100%', maxWidth: '64rem', margin: '0 auto' }}>
      <div
        {...getRootProps()}
        style={{
          border: '2px dashed',
          borderRadius: '1rem',
          padding: '3rem',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          backgroundColor: isDragActive ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
          borderColor: isDragActive ? '#3B82F6' : '#E5E7EB',
          transform: isDragActive ? 'scale(1.05)' : 'scale(1)',
          opacity: isAnalyzing ? 0.7 : 1,
          pointerEvents: isAnalyzing ? 'none' : 'auto',
        }}
      >
        <input {...getInputProps()} />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <div>
            <div style={{ padding: '1.5rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.75rem' }}>
              <Upload 
                style={{ height: '3rem', width: '3rem', color: '#3B82F6', transform: isDragActive ? 'scale(1.1)' : 'scale(1)', transition: 'all 0.5s ease' }}
              />
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem', color: '#e9d5ff' }}>
              {isDragActive ? 'Drop your resume here' : 'Upload Professional Resume'}
            </h3>
            <p style={{ color: '#e9d5ff', marginBottom: '1.5rem' }}>
              Drag and drop your resume file, or click to browse
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(255, 255, 255, 0.6)', borderRadius: '0.5rem', boxShadow: '0 0 1rem rgba(169, 85, 247, 0.5)' }}>
                <FileText style={{ height: '1rem', width: '1rem', color: '#EF4444' }} />
                <span style={{ color: '#111827' }}>PDF</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(255, 255, 255, 0.6)', borderRadius: '0.5rem', boxShadow: '0 0 1rem rgba(169, 85, 247, 0.5)' }}>
                <FileText style={{ height: '1rem', width: '1rem', color: '#3B82F6' }} />
                <span style={{ color: '#111827' }}>DOCX</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(255, 255, 255, 0.6)', borderRadius: '0.5rem', boxShadow: '0 0 1rem rgba(169, 85, 247, 0.5)' }}>
                <FileText style={{ height: '1rem', width: '1rem', color: '#10B981' }} />
                <span style={{ color: '#111827' }}>TXT</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isUploading && (
        <div style={{ marginTop: '1rem' }}>
          <Progress value={uploadProgress} />
        </div>
      )}

      {isAnalyzing && (
        <div style={{ 
          marginTop: '2rem',
          padding: '1.5rem',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderRadius: '0.75rem',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              width: '3rem', 
              height: '3rem', 
              border: '4px solid rgba(59, 130, 246, 0.2)',
              borderTopColor: '#3B82F6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ color: '#e9d5ff', fontWeight: 500 }}>Analyzing your resume...</p>
            <p style={{ color: '#a78bfa', fontSize: '0.875rem' }}>
              Parsing content, extracting skills, and evaluating ATS compatibility
            </p>
          </div>
        </div>
      )}

      <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'rgba(100, 50, 150, 0.4)', borderRadius: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
          <Shield style={{ height: '1.5rem', width: '1.5rem', color: '#3B82F6', marginTop: '0.25rem' }} />
          <div>
            <h4 style={{ fontWeight: '600', color: '#e9d5ff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Enterprise-Grade Security
              <CheckCircle style={{ height: '1rem', width: '1rem', color: '#10B981' }} />
            </h4>
            <p style={{ color: '#e9d5ff', fontSize: '0.875rem', lineHeight: '1.5' }}>
              Your resume is processed with bank-level encryption and never stored on our servers. 
              All analysis happens in real-time with complete privacy protection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeUploader;