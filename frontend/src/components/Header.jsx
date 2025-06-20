import { Bell, User, Building2 } from 'lucide-react';

const Header = () => {
  return (
    <header
      style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 16px',
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Building2 style={{ height: '24px', width: '24px', color: '#c084fc' }} />
          <h1
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#c084fc',
              display: window.innerWidth >= 640 ? 'block' : 'none',
            }}
          >
            ATS Professional
          </h1>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            variant="ghost"
            size="icon"
            style={{
              color: '#4ade80',
              backgroundColor: 'transparent',
              border: 'none',
              padding: '8px',
              cursor: 'pointer',
            }}
          >
            <User style={{ height: '20px', width: '20px' }} />
          </button>
          <span
            style={{
              color: '#4ade80',
              display: window.innerWidth >= 640 ? 'inline' : 'none',
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
