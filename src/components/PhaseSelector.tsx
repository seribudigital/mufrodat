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
    <div className="fade-in islamic-bg" style={{
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
        <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: themeColor }}>Level {level}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>Pilih fase pembelajaran</p>
      </div>

      <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.85rem', padding: '1.5rem' }}>
        <button 
          className="btn" 
          onClick={() => onSelect('materi')}
          style={{ padding: '1.1rem', justifyContent: 'center', background: 'var(--bg-color)', border: '2px solid var(--primary-light)' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', width: '100%' }}>
            <span style={{ fontSize: '1.75rem' }}>📖</span>
            <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-hover)' }}>Pelajari Materi</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Lihat daftar kosakata</span>
          </div>
        </button>

        <button 
          className="btn" 
          onClick={() => onSelect('latihan')}
          style={{ padding: '1.1rem', justifyContent: 'center', background: 'var(--bg-color)', border: '2px solid var(--primary-light)' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', width: '100%' }}>
            <span style={{ fontSize: '1.75rem' }}>⚡</span>
            <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-hover)' }}>Mulai Latihan</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Kuis cepat dengan 2 pilihan</span>
          </div>
        </button>

        <button 
          className="btn" 
          onClick={() => onSelect('ujian')}
          style={{ padding: '1.1rem', justifyContent: 'center', background: 'linear-gradient(to bottom right, #ffffff, var(--primary-light))', border: '2px solid var(--primary-color)' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', width: '100%' }}>
            <span style={{ fontSize: '1.75rem' }}>🎯</span>
            <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-hover)' }}>Ikuti Ujian</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Kuis penuh, simpan skor</span>
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
    </div>
  );
};

export default PhaseSelector;
