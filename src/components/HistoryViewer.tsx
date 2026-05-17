import React, { useEffect, useState } from 'react';
import type { HistoryEntry, UserIdentity } from '../types';

interface HistoryViewerProps {
  currentJilid: number;
  identity?: UserIdentity | null;
  onBack: () => void;
}

const HistoryViewer: React.FC<HistoryViewerProps> = ({ currentJilid, identity, onBack }) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const historyKey = `mufrodat_history_jilid${currentJilid}`;

  useEffect(() => {
    const raw = localStorage.getItem(historyKey);
    if (raw) {
      try {
        const parsed: HistoryEntry[] = JSON.parse(raw);
        setHistory(parsed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      } catch (e) {
        console.error("Error parsing history:", e);
      }
    }
  }, [historyKey]);

  const handleClear = () => {
    if (window.confirm(`Yakin ingin menghapus semua riwayat tes untuk Jilid ${currentJilid}?`)) {
      localStorage.removeItem(historyKey);
      setHistory([]);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'var(--success-color)';
    if (score < 70) return 'var(--error-color)';
    return '#f97316'; // orange/yellow for in between
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '1rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button 
          onClick={onBack}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
        >
          ← Kembali
        </button>
        <h2 style={{ fontSize: '1.25rem', color: 'var(--primary-color)', margin: 0 }}>Riwayat Jilid {currentJilid}</h2>
        <div style={{ width: '70px', display: 'flex', justifyContent: 'flex-end' }}>
          <img src="/logo.png" alt="Logo Mufrodat" style={{ width: '35px', height: '35px', objectFit: 'contain' }} />
        </div>
      </div>

      {identity && (
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem',
          padding: '1.25rem',
          background: 'var(--bg-color)',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary-color)', fontSize: '1.2rem' }}>
            👤 {identity.name} - Kelas {identity.studentClass}
          </h3>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem', fontStyle: 'italic', fontWeight: 500 }}>
            "Barangsiapa yang bersungguh-sungguh, maka ia akan berhasil. Teruslah berlatih!"
          </p>
        </div>
      )}

      {history.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '3rem' }}>
          <p>Belum ada riwayat tes.</p>
          <p style={{ fontSize: '0.9rem' }}>Selesaikan 1 sesi untuk melihat hasilnya di sini!</p>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {history.map(item => {
              const dateObj = new Date(item.date);
              const dateStr = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
              const timeStr = dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

              return (
                <div key={item.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-color)' }}>Level {item.level}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{dateStr} • {timeStr}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      <span style={{ color: 'var(--success-color)' }}>{item.correct} Benar</span> • <span style={{ color: 'var(--error-color)' }}>{item.wrong} Salah</span>
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                    <div style={{
                      fontSize: '2rem',
                      fontWeight: 800,
                      color: getScoreColor(item.score),
                      lineHeight: '1'
                    }}>
                      {item.score}
                    </div>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      letterSpacing: '0.02em',
                      textTransform: 'uppercase',
                      color: item.score >= 90 ? 'var(--success-color)' : item.score >= 70 ? 'var(--primary-color)' : 'var(--error-color)'
                    }}>
                      {item.score >= 90 ? 'Sangat Baik' : item.score >= 70 ? 'Cukup Baik' : 'Perlu Mengulang'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <button 
              onClick={handleClear}
              style={{
                background: 'none',
                border: '1px solid var(--error-color)',
                color: 'var(--error-color)',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}
            >
              Hapus Riwayat
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default HistoryViewer;
