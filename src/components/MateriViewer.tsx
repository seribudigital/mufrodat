import React from 'react';
import type { MufrodatItem } from '../types';

interface MateriViewerProps {
  dataset: MufrodatItem[];
  onBack: () => void;
  level: number;
}

const MateriViewer: React.FC<MateriViewerProps> = ({ dataset, onBack, level }) => {
  return (
    <div className="fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      flex: 1,
      maxWidth: '600px',
      margin: '0 auto',
      width: '100%',
      padding: '1.5rem 1rem'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '0.5rem',
      }}>
        <button 
          onClick={onBack}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--text-muted)', 
            cursor: 'pointer', 
            fontSize: '1rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.25rem',
            fontWeight: 600
          }}
        >
          ← Kembali
        </button>
      </div>

      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>Materi Level {level}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Daftar {dataset.length} kosakata</p>
      </div>

      <div className="islamic-divider"><div className="islamic-divider-icon"></div></div>


      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ 
          maxHeight: '60vh', 
          overflowY: 'auto',
          padding: '0.5rem'
        }}>
          {dataset.map((item, index) => (
            <div 
              key={index} 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '1rem',
                borderBottom: index < dataset.length - 1 ? '1px solid var(--border-color)' : 'none',
                background: index % 2 === 0 ? 'var(--bg-color)' : 'transparent'
              }}
            >
              <div style={{ flex: 1, paddingRight: '1rem', fontSize: '1.1rem', fontWeight: 500 }}>
                {item.indonesia}
              </div>
              <div className="arab-text" style={{ flex: 1, textAlign: 'right', fontSize: '1.5rem', minWidth: '150px' }}>
                {item.arab}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MateriViewer;
