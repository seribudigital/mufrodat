import React, { useState } from 'react';

interface LessonSelectorProps {
  availableDars: number[];
  onSelect: (jilid: number, dars: number | 'all') => void;
}

const LessonSelector: React.FC<LessonSelectorProps> = ({ availableDars, onSelect }) => {
  const [jilid, setJilid] = useState(1);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      justifyContent: 'center',
      flex: 1,
      maxWidth: '400px',
      margin: '0 auto',
      width: '100%'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Mufrodat</h1>
        <p style={{ color: 'var(--text-muted)' }}>Pilih pelajaran untuk mulai berlatih</p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        {[1, 2, 3, 4].map(j => (
          <button
            key={j}
            onClick={() => setJilid(j)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: `2px solid ${jilid === j ? 'var(--primary-color)' : 'var(--border-color)'}`,
              background: jilid === j ? 'var(--primary-color)' : 'transparent',
              color: jilid === j ? '#fff' : 'var(--text-color)',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Jilid {j}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
        <button className="btn" onClick={() => onSelect(jilid, 'all')}>
          <span>Semua Pelajaran</span>
        </button>
        {jilid === 1 ? availableDars.map(dars => (
          <button key={dars} className="btn" onClick={() => onSelect(jilid, dars)}>
            <span>Pelajaran {dars}</span>
          </button>
        )) : (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem' }}>
            Data Jilid {jilid} belum tersedia.
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonSelector;
