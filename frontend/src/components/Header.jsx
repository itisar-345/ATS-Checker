import { useState, useEffect } from 'react';
import { Bell, User, Building2 } from 'lucide-react';

const Header = () => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header
      style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: windowWidth < 768 ? '0 8px' : '0 16px',
        width: '100%',
        minWidth: 0
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: windowWidth < 768 ? '6px' : '12px', minWidth: 0, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: windowWidth < 768 ? '6px' : '12px', minWidth: 0 }}>
          <Building2 style={{ height: windowWidth < 768 ? '20px' : '24px', width: windowWidth < 768 ? '20px' : '24px', color: '#c084fc', flexShrink: 0 }} />
          <h1
            style={{
              fontSize: windowWidth < 480 ? '14px' : windowWidth < 768 ? '16px' : '20px',
              fontWeight: 'bold',
              color: '#c084fc',
              display: windowWidth >= 480 ? 'block' : 'none',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {windowWidth < 640 ? 'ATS Pro' : 'ATS Professional'}
          </h1>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: windowWidth < 768 ? '6px' : '12px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: windowWidth < 768 ? '4px' : '8px' }}>
          <button
            style={{
              color: '#4ade80',
              backgroundColor: 'transparent',
              border: 'none',
              padding: windowWidth < 768 ? '6px' : '8px',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            <User style={{ height: windowWidth < 768 ? '16px' : '20px', width: windowWidth < 768 ? '16px' : '20px' }} />
          </button>
          <span
            style={{
              color: '#4ade80',
              display: windowWidth >= 640 ? 'inline' : 'none',
              fontSize: windowWidth < 768 ? '14px' : '16px',
              whiteSpace: 'nowrap'
            }}
          >
            Professional
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;