import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Lightbulb, Check, ChevronDown, ChevronUp, AlertCircle,
  Zap, Target, TrendingUp, Star
} from 'lucide-react';

const ImprovementSuggestions = ({ suggestions }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredSuggestions = suggestions || [];

  const groupedSuggestions = {};
  filteredSuggestions.forEach(suggestion => {
    if (!groupedSuggestions[suggestion.category]) {
      groupedSuggestions[suggestion.category] = [];
    }
    groupedSuggestions[suggestion.category].push(suggestion);
  });

  const getCategoryIcon = (category) => {
    const firstChar = category.charCodeAt(0) % 4;
    const iconSize = windowWidth < 768 ? 16 : 20;
    const iconMap = {
      0: <AlertCircle style={{ width: iconSize, height: iconSize, color: '#f87171' }} />,
      1: <Target style={{ width: iconSize, height: iconSize, color: '#60a5fa' }} />,
      2: <Star style={{ width: iconSize, height: iconSize, color: '#facc15' }} />,
      3: <Zap style={{ width: iconSize, height: iconSize, color: '#34d399' }} />
    };
    return iconMap[firstChar] || <Zap style={{ width: iconSize, height: iconSize, color: '#34d399' }} />;
  };

  const getCategoryColor = (category) => {
    const firstChar = category.charCodeAt(0) % 4;
    const colorMap = {
      0: {
        border: '1px solid rgba(248, 113, 113, 0.3)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
      },
      1: {
        border: '1px solid rgba(96, 165, 250, 0.3)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
      },
      2: {
        border: '1px solid rgba(250, 204, 21, 0.3)',
        backgroundColor: 'rgba(234, 179, 8, 0.1)',
      },
      3: {
        border: '1px solid rgba(52, 211, 153, 0.3)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
      }
    };
    return colorMap[firstChar] || {
      border: '1px solid rgba(52, 211, 153, 0.3)',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
    };
  };

  const renderCodeWithLineHighlight = (text, isBefore = false) => {
    if (!text || typeof text !== 'string') return <div>No code available</div>;
    const baseStyle = {
      padding: windowWidth < 768 ? '12px' : '16px',
      borderRadius: '8px',
      fontFamily: 'monospace',
      fontSize: windowWidth < 768 ? '12px' : '14px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      marginBottom: '12px',
      border: '1px solid',
      wordBreak: 'break-word',
      overflowWrap: 'break-word'
    };
    const beforeStyle = {
      ...baseStyle,
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderColor: 'rgba(239, 68, 68, 0.3)',
      color: '#f87171',
    };
    const afterStyle = {
      ...baseStyle,
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      borderColor: 'rgba(16, 185, 129, 0.3)',
      color: '#6ee7b7',
    };

    return (
      <div style={isBefore ? beforeStyle : afterStyle}>
        {text}
      </div>
    );
  };

  return (
    <div
      style={{
        border: '1px solid rgba(113, 113, 122, 0.5)',
        borderRadius: '0.75rem',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(8px)'
      }}
    >
      <div
        style={{
          background: 'linear-gradient(to right, rgba(59,130,246,0.1), rgba(168,85,247,0.1))',
          padding: windowWidth < 768 ? '1rem' : '1.5rem',
          borderBottom: '1px solid rgba(113, 113, 122, 0.5)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: windowWidth < 768 ? '0.5rem' : '1rem', alignItems: 'flex-start', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: windowWidth < 768 ? '0.5rem' : '0.75rem', minWidth: 0, flex: 1 }}>
            <Lightbulb style={{ height: windowWidth < 768 ? '1.25rem' : '1.75rem', width: windowWidth < 768 ? '1.25rem' : '1.75rem', color: '#facc15', flexShrink: 0 }} />
            <h2 style={{ fontSize: windowWidth < 768 ? '1.125rem' : '1.5rem', fontWeight: 'bold', color: '#e9d5ff', wordBreak: 'break-word' }}>
              AI Improvement Suggestions
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <span style={{ background: 'rgba(16,185,129,0.2)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)', padding: '0.25rem 0.5rem', borderRadius: '0.375rem', fontSize: windowWidth < 768 ? '0.75rem' : '0.875rem', whiteSpace: 'nowrap' }}>
              {filteredSuggestions.length} Total
            </span>
          </div>
        </div>

        {filteredSuggestions.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: windowWidth < 768 ? '0.5rem' : '1rem', fontSize: windowWidth < 768 ? '0.75rem' : '0.875rem', color: '#e9d5ff', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp style={{ height: windowWidth < 768 ? '0.75rem' : '1rem', width: windowWidth < 768 ? '0.75rem' : '1rem', color: '#facc15' }} />
              <span>Priority-ranked suggestions</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target style={{ height: windowWidth < 768 ? '0.75rem' : '1rem', width: windowWidth < 768 ? '0.75rem' : '1rem', color: '#facc15' }} />
              <span>AI-powered recommendations</span>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: windowWidth < 768 ? '1rem' : '1.5rem' }}>
        {filteredSuggestions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: windowWidth < 768 ? '2rem 0' : '3rem 0' }}>
            <div style={{ width: windowWidth < 768 ? '3rem' : '4rem', height: windowWidth < 768 ? '3rem' : '4rem', margin: '0 auto 1rem', borderRadius: '9999px', backgroundColor: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Check style={{ height: windowWidth < 768 ? '1.5rem' : '2rem', width: windowWidth < 768 ? '1.5rem' : '2rem', color: '#34d399' }} />
            </div>
            <h3 style={{ fontSize: windowWidth < 768 ? '1rem' : '1.25rem', fontWeight: '600', color: 'white', marginBottom: '0.5rem' }}>Perfect Score!</h3>
            <p style={{ color: '#a1a1aa', fontSize: windowWidth < 768 ? '0.875rem' : '1rem' }}>Your resume is already optimized for ATS systems.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: windowWidth < 768 ? '1rem' : '1.5rem' }}>
            {Object.entries(groupedSuggestions).map(([category, categorySuggestions]) => (
              <div key={category} style={{ borderRadius: '1rem', padding: windowWidth < 768 ? '1rem' : '1.25rem', ...getCategoryColor(category) }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: windowWidth < 768 ? '0.5rem' : '0.75rem', marginBottom: windowWidth < 768 ? '0.75rem' : '1rem', flexWrap: 'wrap' }}>
                  {getCategoryIcon(category)}
                  <h3 style={{ fontSize: windowWidth < 768 ? '0.875rem' : '1.125rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'white', flex: 1, minWidth: 0, wordBreak: 'break-word' }}>{category}</h3>
                  <span style={{ color: 'white', fontSize: windowWidth < 768 ? '0.75rem' : '0.875rem', flexShrink: 0 }}>{categorySuggestions.length} {categorySuggestions.length === 1 ? 'item' : 'items'}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: windowWidth < 768 ? '0.5rem' : '0.75rem' }}>
                  {categorySuggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      style={{
                        borderRadius: '0.75rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        border: '1px solid rgba(52,211,153,0.3)',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        padding: windowWidth < 768 ? '0.75rem' : '1rem'
                      }}
                      onClick={() => toggleExpand(suggestion.id)}
                      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleExpand(suggestion.id)}
                      tabIndex={0}
                      role="button"
                      aria-label={`Toggle details for ${suggestion.title}`}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: windowWidth < 768 ? '0.5rem' : '0.75rem', minWidth: 0, flex: 1 }}>
                          <Zap style={{ width: windowWidth < 768 ? 16 : 20, height: windowWidth < 768 ? 16 : 20, color: '#34d399', flexShrink: 0 }} />
                          <h4 style={{ fontWeight: '600', color: 'white', fontSize: windowWidth < 768 ? '0.875rem' : '1rem', wordBreak: 'break-word' }}>{suggestion.title}</h4>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                          {expandedId === suggestion.id ? (
                            <ChevronUp style={{ height: windowWidth < 768 ? '1rem' : '1.25rem', width: windowWidth < 768 ? '1rem' : '1.25rem', color: '#a1a1aa' }} />
                          ) : (
                            <ChevronDown style={{ height: windowWidth < 768 ? '1rem' : '1.25rem', width: windowWidth < 768 ? '1rem' : '1.25rem', color: '#a1a1aa' }} />
                          )}
                        </div>
                      </div>

                      <p style={{ color: 'white', fontSize: windowWidth < 768 ? '0.75rem' : '0.875rem', lineHeight: '1.5', wordBreak: 'break-word' }}>{suggestion.description}</p>

                      {expandedId === suggestion.id && (
                        <div style={{ marginTop: windowWidth < 768 ? '1rem' : '1.5rem', display: 'flex', flexDirection: 'column', gap: windowWidth < 768 ? '0.75rem' : '1rem' }}>
                          {suggestion.before && renderCodeWithLineHighlight(suggestion.before, true)}
                          {suggestion.after && renderCodeWithLineHighlight(suggestion.after, false)}
                          <div style={{ backgroundColor: 'rgba(59,130,246,0.1)', border: '1px solid rgba(96,165,250,0.3)', padding: windowWidth < 768 ? '0.75rem' : '1rem', borderRadius: '0.5rem', display: 'flex', gap: windowWidth < 768 ? '0.5rem' : '0.75rem', alignItems: 'flex-start' }}>
                            <Lightbulb style={{ height: windowWidth < 768 ? '0.875rem' : '1rem', width: windowWidth < 768 ? '0.875rem' : '1rem', color: '#34d399', marginTop: '0.25rem', flexShrink: 0 }} />
                            <div>
                              <div style={{ color: 'white', fontWeight: '600', fontSize: windowWidth < 768 ? '0.875rem' : '1rem', marginBottom: '0.25rem' }}>Why This Matters</div>
                              <div style={{ color: 'white', fontSize: windowWidth < 768 ? '0.75rem' : '0.875rem', lineHeight: '1.5', wordBreak: 'break-word' }}>
                                {suggestion.rationale || "This improvement will enhance your resume's ATS compatibility and make it more appealing to recruiters and hiring managers."}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

ImprovementSuggestions.propTypes = {
  suggestions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      rationale: PropTypes.string,
      before: PropTypes.string,
      after: PropTypes.string,
      isError: PropTypes.bool
    })
  ).isRequired
};

export default ImprovementSuggestions;