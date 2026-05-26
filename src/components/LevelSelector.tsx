// LevelSelector.tsx
import React from 'react';
import type { KitabType } from '../types';
import StatsWidget from './StatsWidget';

interface LevelSelectorProps {
  onSelect: (level: number) => void;
  onViewHistory: () => void;
  userName?: string;
  onChangeProfile: () => void;
  currentKitab: KitabType;
  setCurrentKitab: (kitab: KitabType) => void;
  currentJilid: number;
  setCurrentJilid: (jilid: number) => void;
}

interface LevelOption {
  level: number;
  title: string;
  description: string;
  isAvailable: boolean;
  isFinal?: boolean;
}

const getLevels = (kitab: KitabType, jilid: number): LevelOption[] => {
  if (kitab === 'dl') {
    if (jilid === 1) {
      return [
        { level: 1, title: 'Level 1', description: 'Kosakata 1 - 110 (Part 1-2)', isAvailable: true },
        { level: 2, title: 'Level 2', description: 'Kosakata 111 - 219 (Part 3-4)', isAvailable: true },
        { level: 3, title: 'Level 3', description: 'Kosakata 220 - 327 (Part 5-6)', isAvailable: true },
        { level: 4, title: 'Level 4 (Final)', description: 'Kosakata 328 - 467 (Part 7-8)', isAvailable: true, isFinal: true },
      ];
    } else if (jilid === 2) {
      return [
        { level: 1, title: 'Level 1', description: 'Kosakata 1 - 301 (Part 1-2)', isAvailable: true },
        { level: 2, title: 'Level 2', description: 'Kosakata 302 - 592 (Part 3-4)', isAvailable: true },
        { level: 3, title: 'Level 3', description: 'Kosakata 593 - 898 (Part 5-6)', isAvailable: true },
        { level: 4, title: 'Level 4 (Final)', description: 'Kosakata 899 - 1208 (Part 7-8)', isAvailable: true, isFinal: true },
      ];
    }
  } else if (kitab === 'aby') {
    if (jilid === 1) {
      return [
        { level: 1, title: 'Level 1', description: 'Kosakata Unit 1 - 2 (92 kata)', isAvailable: true },
        { level: 2, title: 'Level 2', description: 'Kosakata Unit 3 - 4 (89 kata)', isAvailable: true },
        { level: 3, title: 'Level 3', description: 'Kosakata Unit 5 - 6 (67 kata)', isAvailable: true },
        { level: 4, title: 'Level 4 (Final)', description: 'Kosakata Unit 7 - 8 (57 kata)', isAvailable: true, isFinal: true },
      ];
    } else if (jilid === 2) {
      return [
        { level: 1, title: 'Level 1', description: 'Kosakata Unit 1 - 2 (129 kata)', isAvailable: true },
        { level: 2, title: 'Level 2', description: 'Kosakata Unit 3 - 4 (124 kata)', isAvailable: true },
        { level: 3, title: 'Level 3', description: 'Kosakata Unit 5 - 6 (124 kata)', isAvailable: true },
        { level: 4, title: 'Level 4 (Final)', description: 'Kosakata Unit 7 - 8 (106 kata)', isAvailable: true, isFinal: true },
      ];
    } else if (jilid === 3) {
      return [
        { level: 1, title: 'Level 1', description: 'Kosakata Unit 1 - 2 (81 kata)', isAvailable: true },
        { level: 2, title: 'Level 2', description: 'Kosakata Unit 3 - 4 (98 kata)', isAvailable: true },
        { level: 3, title: 'Level 3', description: 'Kosakata Unit 5 - 6 (90 kata)', isAvailable: true },
        { level: 4, title: 'Level 4 (Final)', description: 'Kosakata Unit 7 - 8 (102 kata)', isAvailable: true, isFinal: true },
      ];
    } else if (jilid === 4) {
      return [
        { level: 1, title: 'Level 1', description: 'Kosakata Unit 1 - 2 (134 kata)', isAvailable: true },
        { level: 2, title: 'Level 2', description: 'Kosakata Unit 3 - 4 (125 kata)', isAvailable: true },
        { level: 3, title: 'Level 3', description: 'Kosakata Unit 5 - 6 (84 kata)', isAvailable: true },
        { level: 4, title: 'Level 4 (Final)', description: 'Kosakata Unit 7 - 8 (85 kata)', isAvailable: true, isFinal: true },
      ];
    }
  }

  // Fallback for unavailable volumes
  return [
    { level: 1, title: 'Level 1', description: 'Segera Hadir', isAvailable: false },
    { level: 2, title: 'Level 2', description: 'Segera Hadir', isAvailable: false },
    { level: 3, title: 'Level 3', description: 'Segera Hadir', isAvailable: false },
    { level: 4, title: 'Level 4 (Final)', description: 'Segera Hadir', isAvailable: false, isFinal: true },
  ];
};

const LevelSelector: React.FC<LevelSelectorProps> = ({ 
  onSelect, 
  onViewHistory, 
  userName, 
  onChangeProfile, 
  currentKitab, 
  setCurrentKitab, 
  currentJilid, 
  setCurrentJilid 
}) => {
  
  const levels = getLevels(currentKitab, currentJilid);
  const themeColor = currentKitab === 'dl' ? 'var(--success-color)' : 'var(--primary-color)';
  const themeLight = currentKitab === 'dl' ? 'rgba(16, 185, 129, 0.1)' : 'var(--primary-light)';
  const themeHover = currentKitab === 'dl' ? '#059669' : 'var(--primary-hover)';

  return (
    <div className="fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
      justifyContent: 'center',
      flex: 1,
      maxWidth: '480px',
      margin: '0 auto',
      width: '100%',
      padding: '1rem 1rem 5rem',  /* bottom padding clears mobile nav bar */
    }}>
      <div style={{ textAlign: 'center' }}>
        {userName && (
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: 'var(--bg-color)',
              border: '1px solid var(--border-color)',
              padding: '0.4rem 0.6rem 0.4rem 1rem',
              borderRadius: '20px',
              gap: '1rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', lineHeight: 1.25 }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  👋 Ahlan wa Sahlan,
                </span>
                <span style={{ fontSize: '0.95rem', color: themeColor, fontWeight: 700, wordBreak: 'break-all' }}>
                  {userName}
                </span>
              </div>
              <button 
                onClick={onChangeProfile}
                style={{
                  background: themeLight,
                  border: 'none',
                  color: themeHover,
                  padding: '0.25rem 0.6rem',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={(e) => e.currentTarget.style.background = currentKitab === 'dl' ? 'rgba(16, 185, 129, 0.2)' : '#dbeafe'}
                onMouseOut={(e) => e.currentTarget.style.background = themeLight}
              >
                Ganti
              </button>
            </div>
          </div>
        )}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '0.25rem'
        }}>
          <img src="/logo.png" alt="Logo Mufrodat" width="40" height="40" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
          <h1 style={{ fontSize: '2.2rem', margin: 0, color: themeColor, letterSpacing: '-0.02em', transition: 'color 0.3s ease', lineHeight: 1 }}>Mufrodat</h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0 0 1rem' }}>Pilih Kitab dan Level Pembelajaran</p>

        {/* Kitab Selector Segmented Control */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(5px)',
          padding: '0.35rem',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
        }}>
          <button
            onClick={() => {
              setCurrentKitab('dl');
              setCurrentJilid(1);
            }}
            style={{
              padding: '0.65rem 0.5rem',
              borderRadius: '12px',
              border: 'none',
              background: currentKitab === 'dl' ? 'linear-gradient(135deg, var(--success-color), #059669)' : 'transparent',
              color: currentKitab === 'dl' ? '#ffffff' : 'var(--text-muted)',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.15rem',
              boxShadow: currentKitab === 'dl' ? '0 4px 10px rgba(16, 185, 129, 0.15)' : 'none',
              transform: currentKitab === 'dl' ? 'scale(1.01)' : 'scale(1)'
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>📚</span>
            <span style={{ fontSize: '0.8rem' }}>Durusul Lughah</span>
          </button>
          
          <button
            onClick={() => {
              setCurrentKitab('aby');
              setCurrentJilid(1);
            }}
            style={{
              padding: '0.65rem 0.5rem',
              borderRadius: '12px',
              border: 'none',
              background: currentKitab === 'aby' ? 'linear-gradient(135deg, var(--primary-color), var(--primary-hover))' : 'transparent',
              color: currentKitab === 'aby' ? '#ffffff' : 'var(--text-muted)',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.15rem',
              boxShadow: currentKitab === 'aby' ? '0 4px 10px rgba(37, 99, 235, 0.15)' : 'none',
              transform: currentKitab === 'aby' ? 'scale(1.01)' : 'scale(1)'
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>💬</span>
            <span style={{ fontSize: '0.8rem' }}>Baina Yadaik (ABY)</span>
          </button>
        </div>

        {/* Jilid Selector — 2-column grid, same width as Kitab tab */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.5rem',
          marginBottom: '1.25rem',
        }}>
          {[1, 2, 3, 4].map(jilid => {
            const isAvailable = currentKitab === 'aby' || jilid === 1 || jilid === 2;
            const isActive = currentJilid === jilid;

            return (
              <button
                key={jilid}
                onClick={() => isAvailable && setCurrentJilid(jilid)}
                disabled={!isAvailable}
                style={{
                  padding: '0.5rem 0.5rem',
                  borderRadius: '12px',
                  border: isActive ? `2px solid ${themeColor}` : '1px solid var(--border-color)',
                  background: isActive ? themeLight : 'var(--bg-color)',
                  color: isActive ? themeHover : isAvailable ? 'var(--text-color)' : 'var(--text-muted)',
                  fontWeight: isActive ? 700 : 500,
                  cursor: isAvailable ? 'pointer' : 'not-allowed',
                  opacity: isAvailable ? 1 : 0.85,
                  transition: 'all 0.2s ease',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  boxShadow: isActive ? `0 0 0 3px ${themeColor}18` : 'none',
                }}
              >
                Jilid {jilid}
                {!isAvailable && (
                  <span style={{
                    display: 'inline-block',
                    background: '#c2410c',
                    color: 'white',
                    fontSize: '0.58rem',
                    padding: '1px 5px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    lineHeight: 1.5,
                    verticalAlign: 'middle',
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
            border: `1px solid ${themeLight}`,
            color: themeHover,
            padding: '0.35rem 0.85rem',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Lihat Riwayat Belajar
        </button>
      </div>

      <StatsWidget kitab={currentKitab} jilid={currentJilid} />

      <div className={`card moving-gradient-${currentKitab}`} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', padding: '1.25rem 1rem' }}>
        {levels.map((lvl) => {
          const isLvlAvailable = lvl.isAvailable;
          const isFinal = lvl.isFinal;
          
          return (
            <button 
              key={lvl.level}
              className="btn card-with-ornament" 
              disabled={!isLvlAvailable}
              style={{ 
                justifyContent: 'center', 
                padding: '1.25rem 0.75rem',
                opacity: isLvlAvailable ? 1 : 0.65,
                cursor: isLvlAvailable ? 'pointer' : 'not-allowed',
                ...(isFinal && isLvlAvailable ? {
                  borderColor: themeLight, 
                  background: `linear-gradient(to bottom right, #ffffff, ${themeLight})`
                } : {})
              }} 
              onClick={() => isLvlAvailable && onSelect(lvl.level)}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', width: '100%' }}>
                <span style={{ 
                  fontSize: '1.15rem', 
                  fontWeight: isFinal && isLvlAvailable ? 700 : 600,
                  color: isFinal && isLvlAvailable ? themeHover : 'inherit'
                }}>
                  {lvl.title}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {lvl.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LevelSelector;
