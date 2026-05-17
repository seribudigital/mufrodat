// LevelSelector.tsx
import React from 'react';

interface LevelSelectorProps {
  onSelect: (level: number) => void;
  onViewHistory: () => void;
  userName?: string;
  onChangeProfile: () => void;
  currentJilid: number;
  setCurrentJilid: (jilid: number) => void;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({ onSelect, onViewHistory, userName, onChangeProfile, currentJilid, setCurrentJilid }) => {
  return (
    <div className="fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '2.5rem',
      justifyContent: 'center',
      flex: 1,
      maxWidth: '480px',
      margin: '0 auto',
      width: '100%',
      padding: '2rem 1rem'
    }}>
      <div style={{ textAlign: 'center' }}>
        {userName && (
          <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: 'var(--bg-color)',
              border: '1px solid var(--border-color)',
              padding: '0.4rem 0.5rem 0.4rem 1.25rem',
              borderRadius: '30px',
              gap: '1rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}>
              <span style={{ fontSize: '0.95rem', color: 'var(--text-color)', fontWeight: 600 }}>
                👋 Ahlan wa Sahlan, <span style={{ color: 'var(--primary-color)' }}>{userName}</span>
              </span>
              <button 
                onClick={onChangeProfile}
                style={{
                  background: 'var(--primary-light)',
                  border: 'none',
                  color: 'var(--primary-hover)',
                  padding: '0.35rem 0.8rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#dbeafe'}
                onMouseOut={(e) => e.currentTarget.style.background = 'var(--primary-light)'}
              >
                Ganti
              </button>
            </div>
          </div>
        )}
        <img src="/logo.png" alt="Logo Mufrodat" style={{ width: '80px', height: '80px', marginBottom: '0.5rem', objectFit: 'contain' }} />
        <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', color: 'var(--primary-color)', letterSpacing: '-0.02em' }}>Mufrodat</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '1rem' }}>Pilih Level Pembelajaran</p>

        {/* Jilid Selector */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {[1, 2, 3, 4].map(jilid => {
            const isAvailable = jilid === 1;
            const isActive = currentJilid === jilid;
            
            return (
              <button
                key={jilid}
                onClick={() => isAvailable && setCurrentJilid(jilid)}
                disabled={!isAvailable}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '20px',
                  border: isActive ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                  background: isActive ? 'var(--primary-light)' : 'var(--bg-color)',
                  color: isActive ? 'var(--primary-hover)' : 'var(--text-muted)',
                  fontWeight: isActive ? 700 : 500,
                  cursor: isAvailable ? 'pointer' : 'not-allowed',
                  opacity: isAvailable ? 1 : 0.6,
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  fontSize: '0.9rem'
                }}
              >
                Jilid {jilid}
                {!isAvailable && (
                  <span style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-12px',
                    background: '#f97316',
                    color: 'white',
                    fontSize: '0.65rem',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    Soon
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <button 
          onClick={onViewHistory}
          style={{
            background: 'none',
            border: '1px solid var(--primary-light)',
            color: 'var(--primary-hover)',
            padding: '0.4rem 1rem',
            borderRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Lihat Riwayat Belajar
        </button>
      </div>

      <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
        <button className="btn" onClick={() => onSelect(1)}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.2rem' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>Level 1</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Kosakata 1 - 110 (Part 1-2)</span>
          </div>
        </button>
        
        <button className="btn" onClick={() => onSelect(2)}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.2rem' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>Level 2</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Kosakata 1 - 219 (Part 1-4)</span>
          </div>
        </button>
        
        <button className="btn" onClick={() => onSelect(3)}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.2rem' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>Level 3</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Kosakata 1 - 327 (Part 1-6)</span>
          </div>
        </button>
        
        <button className="btn" style={{ borderColor: 'var(--primary-light)', background: 'linear-gradient(to bottom right, #ffffff, var(--primary-light))' }} onClick={() => onSelect(4)}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.2rem' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-hover)' }}>Level 4 (Final)</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Kosakata 1 - 467 (Semua)</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default LevelSelector;
