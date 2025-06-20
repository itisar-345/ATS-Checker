import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Lightbulb, Check, ChevronDown, ChevronUp, AlertCircle,
  Zap, Target, TrendingUp, Star
} from 'lucide-react';

const ImprovementSuggestions = ({ suggestions }) => {
  const [expandedId, setExpandedId] = useState(null);

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
    const iconMap = {
      0: <AlertCircle style={{ width: 20, height: 20, color: '#f87171' }} />,
      1: <Target style={{ width: 20, height: 20, color: '#60a5fa' }} />,
      2: <Star style={{ width: 20, height: 20, color: '#facc15' }} />,
      3: <Zap style={{ width: 20, height: 20, color: '#34d399' }} />
    };
    return iconMap[firstChar] || <Zap style={{ width: 20, height: 20, color: '#34d399' }} />;
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
      padding: '16px',
      borderRadius: '8px',
      fontFamily: 'monospace',
      fontSize: '14px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      marginBottom: '12px',
      border: '1px solid',
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
    const hoverStyle = {
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
      transform: 'translateY(-2px)',
    };

    return (
      <div
        style={{
          ...baseStyle,
          ...(isBefore ? beforeStyle : afterStyle),
          '&:hover': hoverStyle,
          wordBreak: 'break-word',
        }}
      >
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
          padding: '1.5rem',
          borderBottom: '1px solid rgba(113, 113, 122, 0.5)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Lightbulb style={{ height: '1.75rem', width: '1.75rem', color: '#facc15' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#e9d5ff' }}>
              AI Improvement Suggestions
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ background: 'rgba(16,185,129,0.2)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)', padding: '0.25rem 0.5rem', borderRadius: '0.375rem' }}>
              {filteredSuggestions.length} Total
            </span>
          </div>
        </div>

        {filteredSuggestions.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: '#e9d5ff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp style={{ height: '1rem', width: '1rem', color: '#facc15' }} />
              <span>Priority-ranked suggestions</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target style={{ height: '1rem', width: '1rem', color: '#facc15' }} />
              <span>AI-powered recommendations</span>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '1.5rem' }}>
        {filteredSuggestions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <div style={{ width: '4rem', height: '4rem', margin: '0 auto 1rem', borderRadius: '9999px', backgroundColor: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Check style={{ height: '2rem', width: '2rem', color: '#34d399' }} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '0.5rem' }}>Perfect Score!</h3>
            <p style={{ color: '#a1a1aa' }}>Your resume is already optimized for ATS systems.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {Object.entries(groupedSuggestions).map(([category, categorySuggestions]) => (
              <div key={category} style={{ borderRadius: '1rem', padding: '1.25rem', ...getCategoryColor(category) }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  {getCategoryIcon(category)}
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'white' }}>{category}</h3>
                  <span style={{ marginLeft: 'auto', color: 'white' }}>{categorySuggestions.length} {categorySuggestions.length === 1 ? 'item' : 'items'}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {categorySuggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      style={{
                        borderRadius: '0.75rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        border: '1px solid rgba(52,211,153,0.3)',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        padding: '1rem'
                      }}
                      onClick={() => toggleExpand(suggestion.id)}
                      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleExpand(suggestion.id)}
                      tabIndex={0}
                      role="button"
                      aria-label={`Toggle details for ${suggestion.title}`}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <Zap style={{ width: 20, height: 20, color: '#34d399' }} />
                          <h4 style={{ fontWeight: '600', color: 'white' }}>{suggestion.title}</h4>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {expandedId === suggestion.id ? (
                            <ChevronUp style={{ height: '1.25rem', width: '1.25rem', color: '#a1a1aa' }} />
                          ) : (
                            <ChevronDown style={{ height: '1.25rem', width: '1.25rem', color: '#a1a1aa' }} />
                          )}
                        </div>
                      </div>

                      <p style={{ color: 'white', fontSize: '0.875rem', lineHeight: '1.5' }}>{suggestion.description}</p>

                      {expandedId === suggestion.id && (
                        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {suggestion.before && renderCodeWithLineHighlight(suggestion.before, true)}
                          {suggestion.after && renderCodeWithLineHighlight(suggestion.after, false)}
                          <div style={{ backgroundColor: 'rgba(59,130,246,0.1)', border: '1px solid rgba(96,165,250,0.3)', padding: '1rem', borderRadius: '0.5rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                            <Lightbulb style={{ height: '1rem', width: '1rem', color: '#34d399', marginTop: '0.25rem' }} />
                            <div>
                              <div style={{ color: 'white', fontWeight: '600', fontSize: '1rem', marginBottom: '0.25rem' }}>Why This Matters</div>
                              <div style={{ color: 'white', fontSize: '0.875rem', lineHeight: '1.5' }}>
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