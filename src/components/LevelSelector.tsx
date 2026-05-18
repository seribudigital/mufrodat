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
      gap: '1.5rem',
      justifyContent: 'center',
      flex: 1,
      maxWidth: '480px',
      margin: '0 auto',
      width: '100%',
      padding: '1rem'
    }}>
      <div style={{ textAlign: 'center' }}>
        {userName && (
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: 'var(--bg-color)',
              border: '1px solid var(--border-color)',
              padding: '0.3rem 0.5rem 0.3rem 1rem',
              borderRadius: '30px',
              gap: '0.75rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-color)', fontWeight: 600 }}>
                👋 Ahlan wa Sahlan, <span style={{ color: 'var(--primary-color)' }}>{userName}</span>
              </span>
              <button 
                onClick={onChangeProfile}
                style={{
                  background: 'var(--primary-light)',
                  border: 'none',
                  color: 'var(--primary-hover)',
                  padding: '0.25rem 0.6rem',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
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
        <img src="/logo.png" alt="Logo Mufrodat" style={{ width: '60px', height: '60px', marginBottom: '0.25rem', objectFit: 'contain' }} />
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.25rem', color: 'var(--primary-color)', letterSpacing: '-0.02em' }}>Mufrodat</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '0.75rem' }}>Pilih Level Pembelajaran</p>

        {/* Jilid Selector */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {[1, 2, 3, 4].map(jilid => {
            const isAvailable = jilid === 1;
            const isActive = currentJilid === jilid;
            
            return (
              <button
                key={jilid}
                onClick={() => isAvailable && setCurrentJilid(jilid)}
                disabled={!isAvailable}
                style={{
                  padding: '0.4rem 1rem',
                  borderRadius: '20px',
                  border: isActive ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                  background: isActive ? 'var(--primary-light)' : 'var(--bg-color)',
                  color: isActive ? 'var(--primary-hover)' : 'var(--text-muted)',
                  fontWeight: isActive ? 700 : 500,
                  cursor: isAvailable ? 'pointer' : 'not-allowed',
                  opacity: isAvailable ? 1 : 0.6,
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  fontSize: '0.85rem'
                }}
              >
                Jilid {jilid}
                {!isAvailable && (
                  <span style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-10px',
                    background: '#f97316',
                    color: 'white',
                    fontSize: '0.6rem',
                    padding: '2px 5px',
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
            padding: '0.35rem 0.85rem',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Lihat Riwayat Belajar
        </button>
      </div>

      <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem', padding: '1.25rem' }}>
        <button className="btn card-with-ornament" style={{ justifyContent: 'center', padding: '1rem' }} onClick={() => onSelect(1)}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', width: '100%' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>Level 1</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Kosakata 1 - 110 (Part 1-2)</span>
          </div>
        </button>
        
        <button className="btn card-with-ornament" style={{ justifyContent: 'center', padding: '1rem' }} onClick={() => onSelect(2)}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', width: '100%' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>Level 2</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Kosakata 1 - 219 (Part 1-4)</span>
          </div>
        </button>
        
        <button className="btn card-with-ornament" style={{ justifyContent: 'center', padding: '1rem' }} onClick={() => onSelect(3)}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', width: '100%' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>Level 3</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Kosakata 1 - 327 (Part 1-6)</span>
          </div>
        </button>
        
        <button className="btn card-with-ornament" style={{ justifyContent: 'center', padding: '1rem', borderColor: 'var(--primary-light)', background: 'linear-gradient(to bottom right, #ffffff, var(--primary-light))' }} onClick={() => onSelect(4)}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', width: '100%' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-hover)' }}>Level 4 (Final)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Kosakata 1 - 467 (Semua)</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default LevelSelector;
