import { CircleCheck, CircleX, AlertCircle, Trophy, Target, Zap, TrendingUp } from 'lucide-react';

const ResumeScoreCard = ({ overallScore, categories }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return '#34D399'; // emerald-400
    if (score >= 60) return '#FACC15'; // yellow-400
    return '#F87171'; // red-400
  };

  const getScoreIcon = (status) => {
    const iconStyle = { width: 20, height: 20 };
    switch (status) {
      case 'good':
        return <CircleCheck style={{ ...iconStyle, color: '#34D399' }} />;
      case 'warning':
        return <AlertCircle style={{ ...iconStyle, color: '#FACC15' }} />;
      case 'poor':
        return <CircleX style={{ ...iconStyle, color: '#F87171' }} />;
      default:
        return null;
    }
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Needs Work';
    return 'Critical';
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  return (
    <div style={{ border: '1px solid rgba(229, 231, 235, 0.5)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
      <div style={{ background: 'linear-gradient(to bottom right, rgba(52, 211, 153, 0.3), rgba(34, 197, 94, 0.3))', padding: 32, textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.05), transparent)', animation: 'pulse 2s infinite' }}></div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginBottom: 24, position: 'relative', zIndex: 10 }}>
          <Trophy style={{ width: 32, height: 32, color: '#34D399', animation: 'bounce 1s infinite' }} />
          <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#e9d5ff' }}>ATS Compatibility Score</h2>
          <Zap style={{ width: 32, height: 32, color: '#22D3EE', animation: 'pulse 2s infinite' }} />
        </div>

        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 24 }}>
          <svg style={{ width: 128, height: 128, transform: 'rotate(-90deg)' }} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke="#E5E7EB" strokeWidth="8" fill="none" />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke={getScoreColor(overallScore)}
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s ease-out' }}
            />
          </svg>
          <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 'bold', color: getScoreColor(overallScore) }}>{overallScore}%</div>
            <div style={{ fontSize: 12, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Score</div>
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 9999, backgroundColor: '#FFFFFF30', color: getScoreColor(overallScore), fontWeight: 'bold' }}>
            <Target style={{ width: 16, height: 16 }} />
            <span>
              {overallScore >= 80
                ? 'Excellent - ATS Ready!'
                : overallScore >= 60
                ? 'Good - Needs Minor Improvements'
                : 'Needs Significant Improvements'}
            </span>
          </div>
        </div>
      </div>

      <div style={{ padding: 24 }}>
        <h3 style={{ fontSize: 20, fontWeight: 'bold', color: '#e9d5ff', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
          <TrendingUp style={{ width: 24, height: 24, color: '#22D3EE' }} />
          Detailed Breakdown
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {categories.map((category, index) => (
            <div
              key={index}
              style={{ border: '1px solid rgba(229, 231, 235, 0.5)', borderRadius: 8, padding: '1rem 2rem', transition: 'background 0.3s' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {getScoreIcon(category.status)}
                  <h4 style={{ fontWeight: '600', fontSize: 18, color:'#e9d5ff' }}>{category.name}</h4>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span style={{ fontSize: 20, fontWeight: 'bold', color: getScoreColor(category.score) }}>{category.score}%</span>
                  <div style={{ width: 64, height: 8, backgroundColor: '#E5E7EB', borderRadius: 9999, overflow: 'hidden', marginTop: 4 }}>
                    <div
                      style={{ width: `${category.score}%`, height: '100%', backgroundColor: getScoreColor(category.score), transition: 'width 1s ease-out' }}
                    ></div>
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '1rem', color:'#e9d5ff', margin: '0 0 14px 0' }}>{category.feedback}</p>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                  <div
                    style={{
                      padding: '4px 8px',
                      borderRadius: 9999,
                      fontSize: 12,
                      fontWeight: '500',
                      backgroundColor:
                        category.score >= 80
                          ? 'rgba(52, 211, 153, 0.2)'
                          : category.score >= 60
                          ? 'rgba(250, 204, 21, 0.2)'
                          : 'rgba(248, 113, 113, 0.2)',
                      color:
                        category.score >= 80
                          ? '#34D399'
                          : category.score >= 60
                          ? '#FACC15'
                          : '#F87171',
                    }}
                  >
                    {getScoreLabel(category.score)}
                  </div>
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResumeScoreCard;
