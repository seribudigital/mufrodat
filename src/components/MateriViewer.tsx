import React from 'react';
import type { MufrodatItem } from '../types';

interface MateriViewerProps {
  dataset: MufrodatItem[];
  onBack: () => void;
  level: number;
}

const MateriViewer: React.FC<MateriViewerProps> = ({ dataset, onBack, level }) => {
  interface UnitGroup {
    unitName: string;
    description: string;
    items: MufrodatItem[];
  }

  const hasUnits = dataset.length > 0 && !!dataset[0].unit;
  
  const unitGroups: UnitGroup[] = [];
  if (hasUnits) {
    dataset.forEach(item => {
      const uName = item.unit || 'Lainnya';
      const uDesc = item.unitDescription || '';
      let group = unitGroups.find(g => g.unitName === uName);
      if (!group) {
        group = { unitName: uName, description: uDesc, items: [] };
        unitGroups.push(group);
      }
      group.items.push(item);
    });
  }

  return (
    <div className="fade-in islamic-bg" style={{
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

      {hasUnits ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {unitGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ 
                color: 'var(--primary-color)', 
                fontSize: '1.3rem', 
                marginBottom: '0.5rem', 
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                📖 {group.unitName}
              </h3>
              
              {group.description && (
                <div style={{
                  padding: '0.75rem 1rem',
                  background: 'var(--primary-light)',
                  borderLeft: '4px solid var(--primary-color)',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  color: 'var(--text-color)',
                  marginBottom: '1.25rem',
                  lineHeight: '1.5',
                  textAlign: 'left'
                }}>
                  {group.description}
                </div>
              )}
              
              <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
                {group.items.map((item, index) => (
                  <div 
                    key={index} 
                    className="materi-item-row"
                    style={{ 
                      borderBottom: index < group.items.length - 1 ? '1px solid var(--border-color)' : 'none',
                      background: index % 2 === 0 ? 'var(--bg-color)' : 'transparent'
                    }}
                  >
                    <div className="materi-item-indonesia">
                      {item.indonesia}
                    </div>
                    <div className="materi-item-arab">
                      {item.arab}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ 
            maxHeight: '60vh', 
            overflowY: 'auto',
            padding: '0.5rem'
          }}>
            {dataset.map((item, index) => (
              <div 
                key={index} 
                className="materi-item-row"
                style={{ 
                  borderBottom: index < dataset.length - 1 ? '1px solid var(--border-color)' : 'none',
                  background: index % 2 === 0 ? 'var(--bg-color)' : 'transparent'
                }}
              >
                <div className="materi-item-indonesia">
                  {item.indonesia}
                </div>
                <div className="materi-item-arab">
                  {item.arab}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MateriViewer;
