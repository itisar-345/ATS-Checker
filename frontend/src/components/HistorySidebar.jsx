import { useState } from 'react';
import { FileText, Clock, TrendingUp, Trash2, Download, Star, Search, Filter, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const HistorySidebar = ({
  history,
  onSelectHistory,
  currentAnalysisId,
  onClearHistory,
  onDeleteAnalysis
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [favorites, setFavorites] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  
  const toggleSortDropdown = () => {
    setIsSortDropdownOpen((prev) => !prev);
  };
  
  const dropdownItemStyle = {
    padding: '0.5rem 0.75rem',
    cursor: 'pointer',
    color: 'white',
    fontSize: '0.875rem',
    transition: 'background-color 0.2s ease',
    borderRadius: '0.375rem',
    '&:hover': {
      backgroundColor: 'rgba(229, 231, 235, 0.1)'
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreBadge = (score) => {
    if (score >= 80) {
      return {
        backgroundColor: 'rgba(16, 185, 129, 0.2)',  // emerald-500/20
        color: '#34d399',                            // emerald-400
        borderColor: 'rgba(16, 185, 129, 0.3)'       // emerald-500/30
      };
    }
    if (score >= 60) {
      return {
        backgroundColor: 'rgba(234, 179, 8, 0.2)',   // yellow-500/20
        color: '#facc15',                            // yellow-400
        borderColor: 'rgba(234, 179, 8, 0.3)'        // yellow-500/30
      };
    }
    return {
      backgroundColor: 'rgba(239, 68, 68, 0.2)',     // red-500/20
      color: '#f87171',                              // red-400
      borderColor: 'rgba(239, 68, 68, 0.3)'          // red-500/30
    };
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const exportAnalysis = (analysis) => {
    // Generate a detailed report of improvement suggestions
    let report = `Improvement Suggestions Report for ${analysis.fileName}\n`;
    report += `Generated on: ${new Date().toISOString()}\n`;
    report += `Overall ATS Score: ${analysis.score.overallScore}%\n\n`;

    const suggestions = analysis.fullAnalysis?.suggestions || [];
    
    if (suggestions.length === 0) {
      report += 'No improvement suggestions provided. Your resume is already optimized!\n';
    } else {
      // Group suggestions by category
      const groupedSuggestions = {};
      suggestions.forEach(suggestion => {
        if (!groupedSuggestions[suggestion.category]) {
          groupedSuggestions[suggestion.category] = [];
        }
        groupedSuggestions[suggestion.category].push(suggestion);
      });

      Object.entries(groupedSuggestions).forEach(([category, categorySuggestions]) => {
        report += `=== ${category.toUpperCase()} ===\n`;
        report += `Total Suggestions: ${categorySuggestions.length}\n\n`;

        categorySuggestions.forEach((suggestion, index) => {
          report += `${index + 1}. ${suggestion.title}\n`;
          report += `Description: ${suggestion.description}\n`;
          if (suggestion.rationale) {
            report += `Why This Matters: ${suggestion.rationale}\n`;
          }
          if (suggestion.before) {
            report += `Before:\n${suggestion.before}\n`;
          }
          if (suggestion.after) {
            report += `After:\n${suggestion.after}\n`;
          }
          report += '\n';
        });
      });
    }

    const dataBlob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${analysis.fileName.replace(/\.[^/.]+$/, '')}_Improvement_Suggestions.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredAndSortedHistory = history
    .filter(
      (item) =>
        item.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.preview && item.preview.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.score.overallScore - a.score.overallScore;
        case 'name':
          return a.fileName.localeCompare(b.fileName);
        case 'date':
        default:
          return b.timestamp - a.timestamp;
      }
    });

  const averageScore =
    history.length > 0
      ? Math.round(history.reduce((acc, item) => acc + item.score.overallScore, 0) / history.length)
      : 0;

  const highestScore =
    history.length > 0 ? Math.max(...history.map((item) => item.score.overallScore)) : 0;

  return (
    <div style={{
      borderRight: '1px solid rgba(229,231,235,0.3)', 
      backgroundColor: 'rgba(255,255,255,0.03)', 
      backdropFilter: 'blur(24px)',
      minHeight: '100vh',
    }}>
      <div style={{
        padding: '0.5rem 2rem', 
        borderBottom: '1px solid rgba(229,231,235,0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e5e7eb' }}>
            <Clock style={{ height: '1.25rem', width: '1.25rem', color: '#34d399' }} />
            Analysis History
          </h2>

          {history.length > 0 && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={toggleDropdown}
                style={{
                  height: '2rem',
                  width: '2rem',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <MoreHorizontal size={24} style={{ marginTop: '1rem', color: '#34d399' }} />
              </button>

              {isDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  marginTop: '0.5rem',
                  backgroundColor: 'rgba(0, 30, 100, 0.4)',
                  border: '1px solid rgba(229,231,235,0.3)',
                  borderRadius: '0.5rem',
                  padding: '0.25rem',
                  zIndex: 10
                }}>
                  <div
                    onClick={onClearHistory}
                    style={{
                      color: '#f87171',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.5rem 0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={32} style={{ marginRight: '0.5rem' }} />
                    Clear All History
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {history.length > 0 && (
          <>
            <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
              <Search
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  height: '1rem',
                  width: '1rem',
                  color: '#e5e7eb' 
                }}
              />
              <input
                type="text"
                placeholder="Search analyses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  paddingLeft: '2.5rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)', // bg-background/50
                  border: '1px solid rgba(229, 231, 235, 0.3)', // border-border
                  borderRadius: '0.375rem',
                  width: '80%',
                  height: '2.5rem',
                  color: '#e5e7eb'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <button
                  onClick={toggleSortDropdown}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.25rem 0.5rem',
                    border: '1px solid rgba(229,231,235,0.3)',
                    backgroundColor: 'transparent',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    width: '100%',
                    cursor: 'pointer',
                    color: '#e5e7eb'
                  }}
                >
                  <Filter style={{ height: '0.75rem', width: '0.75rem', marginRight: '0.25rem' }} />
                  Sort: {sortBy === 'date' ? 'Date' : sortBy === 'score' ? 'Score' : 'Name'}
                </button>

                {isSortDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    backgroundColor: '#1f2937',
                    border: '1px solid rgba(229,231,235,0.2)',
                    borderRadius: '0.5rem',
                    padding: '0.25rem 0',
                    zIndex: 10,
                    minWidth: '100%'
                  }}>
                    <div
                      onClick={() => setSortBy('date')}
                      style={dropdownItemStyle}
                    >
                      Date
                    </div>
                    <div
                      onClick={() => setSortBy('score')}
                      style={dropdownItemStyle}
                    >
                      Score
                    </div>
                    <div
                      onClick={() => setSortBy('name')}
                      style={dropdownItemStyle}
                    >
                      Name
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <div style={{ padding: '0.5rem' }}>
        <div>
          {filteredAndSortedHistory.length === 0 ? (
            <div style={{ padding: '1rem', textAlign: 'center', color: '#9ca3af' }}>
              <FileText style={{ height: '2rem', width: '2rem', margin: '0 auto 0.5rem', opacity: 0.5 }} />
              <p style={{ fontSize: '0.875rem' }}>
                {searchTerm ? 'No matching analyses' : 'No analyses yet'}
              </p>
            </div>
          ) : (
            filteredAndSortedHistory.map((item) => (
              <div key={item.id}>
                <div
                  style={{
                    position: 'relative',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid',
                    transition: 'all 0.2s ease',
                    color: '#e5e7eb',
                    borderColor:
                      currentAnalysisId === item.id ? '#10b981' : 'rgba(229,231,235,0.3)',
                    backgroundColor:
                      currentAnalysisId === item.id ? 'rgba(16,185,129,0.1)' : 'transparent'
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.querySelector('.hover-actions').style.opacity = 1)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.querySelector('.hover-actions').style.opacity = 0)
                  }
                >
                  <div
                    onClick={() => onSelectHistory(item)}
                    style={{
                      width: '100%',
                      padding: 0,
                      height: 'auto',
                      backgroundColor: 'transparent',
                      display: 'block',
                      border: 'none',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '0.75rem', minWidth: 0, width: '100%' }}>
                      <FileText style={{  marginTop: '0.5rem', flexShrink: 0, color: '#10b981' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.1rem' }}>
                          <p style={{ fontWeight: 500, fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '0.5rem' }}>
                            {item.fileName}
                          </p>
                          <div
                            style={{
                              fontSize: '0.75rem',
                              padding: '0.75rem 0.5rem',
                              borderRadius: '9999px',
                              fontWeight: 'bold',
                              border: '1px solid',
                              ...getScoreBadge(item.score.overallScore)
                            }}
                          >
                            {item.score.overallScore}%
                          </div>
                        </div>
                        <p
                          style={{
                            fontSize: '0.75rem',
                            color: 'rgb(225, 225, 225)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            marginBottom: '0rem',
                          }}
                        >
                          {item.preview}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <p style={{ fontSize: '0.75rem', color: 'rgb(223, 223, 223)' }}>
                            {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                          </p>
                          <div
                            className="hover-actions"
                            style={{ display: 'flex', gap: '0.25rem', opacity: 0, transition: 'opacity 0.2s ease' }}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(item.id);
                              }}
                              style={{ height: '1.5rem', width: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                              <Star size={18}
                                style={{
                                  fill: favorites.includes(item.id) ? '#facc15' : 'none',
                                  color: favorites.includes(item.id) ? '#facc15' : '#e5e7eb'
                                }}
                              />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                exportAnalysis(item);
                              }}
                              style={{ height: '1.5rem', width: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                              <Download size={18} style={{ color: '#e5e7eb' }} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteAnalysis(item.id);
                              }}
                              style={{
                                height: '1.5rem',
                                width: '1.5rem',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#f87171'
                              }}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {history.length > 0 && (
        <div style={{ position:'fixed', width: '100%', marginTop: '1rem', borderTop: '1px solid #ccc', padding: '0.5rem 1rem' }}>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e5e7eb' }}>
            <TrendingUp size={18} style={{color: '#10b981'}}/>
            Average Score:{' '}
            <strong style={{ color: getScoreColor(averageScore) }}>{averageScore}%</strong>
          </p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e5e7eb' }}>
            <Star size={18} style={{color: '#10b981'}} />
            Best Score:{' '}
            <strong style={{ color: getScoreColor(highestScore) }}>{highestScore}%</strong>
          </p>
          <p style={{ padding: '0 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e5e7eb'}}>Total Analyses: <strong>{history.length}</strong></p>
        </div>
      )}
    </div>
  );
};

export default HistorySidebar;