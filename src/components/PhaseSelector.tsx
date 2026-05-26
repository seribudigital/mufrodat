import React from 'react';
import type { PhaseType, KitabType } from '../types';

interface PhaseSelectorProps {
  level: number;
  kitab: KitabType;
  jilid: number;
  onSelect: (phase: PhaseType) => void;
  onBack: () => void;
}

const PhaseSelector: React.FC<PhaseSelectorProps> = ({ level, kitab, jilid, onSelect, onBack }) => {
  const themeColor = kitab === 'dl' ? 'var(--success-color)' : 'var(--primary-color)';

  return (
    <main className="fade-in islamic-bg" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
      justifyContent: 'center',
      flex: 1,
      maxWidth: '480px',
      margin: '0 auto',
      width: '100%',
      padding: '1rem 1rem 3rem'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          marginBottom: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.03em',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'rgba(255, 255, 255, 0.6)',
          padding: '0.25rem 0.75rem',
          borderRadius: '20px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <span>{kitab === 'dl' ? '📚 Durusul Lughah' : '💬 ABY'}</span>
          <span style={{ opacity: 0.5 }}>/</span>
          <span>Jilid {jilid}</span>
        </div>
        <h2 style={{ fontSize: '2.2rem', marginBottom: '0.25rem', color: themeColor, lineHeight: 1.1 }}>Level {level}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1rem' }}>Pilih fase pembelajaran</p>
      </div>

      <div className={`card moving-gradient-${kitab}`} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', padding: '1.25rem 1rem' }}>
        <button 
          className="btn" 
          onClick={() => onSelect('materi')}
          style={{ padding: '1rem 0.5rem', justifyContent: 'center', background: 'var(--bg-color)', border: '2px solid var(--primary-light)' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', width: '100%' }}>
            <span style={{ fontSize: '1.5rem' }}>📖</span>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-hover)' }}>Pelajari Materi</span>
          </div>
        </button>

        <button 
          className="btn" 
          onClick={() => onSelect('flashcard')}
          style={{ padding: '1rem 0.5rem', justifyContent: 'center', background: 'var(--bg-color)', border: '2px dashed var(--border-color)' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', width: '100%' }}>
            <span style={{ fontSize: '1.5rem' }}>🃏</span>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-color)' }}>Mode Flashcard</span>
          </div>
        </button>

        <button 
          className="btn" 
          onClick={() => onSelect('latihan')}
          style={{ padding: '1rem 0.5rem', justifyContent: 'center', background: 'var(--bg-color)', border: '2px solid var(--primary-light)' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', width: '100%' }}>
            <span style={{ fontSize: '1.5rem' }}>⚡</span>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-hover)' }}>Mulai Latihan</span>
          </div>
        </button>

        <button 
          className="btn" 
          onClick={() => onSelect('ujian')}
          style={{ padding: '1rem 0.5rem', justifyContent: 'center', background: 'linear-gradient(to bottom right, #ffffff, var(--primary-light))', border: '2px solid var(--primary-color)' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', width: '100%' }}>
            <span style={{ fontSize: '1.5rem' }}>🎯</span>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-hover)' }}>Ikuti Ujian</span>
          </div>
        </button>
      </div>

      <button 
        onClick={onBack}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          fontSize: '1rem',
          fontWeight: 600,
          cursor: 'pointer',
          marginTop: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}
      >
        ← Kembali ke Pilihan Level
      </button>
    </main>
  );
};

export default PhaseSelector;
