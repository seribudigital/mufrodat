import React, { useState, useMemo, useCallback } from 'react';
import type { MufrodatItem, KitabType } from '../types';
import SpeakerButton from './SpeakerButton';
import { getUnmemorized, markUnmemorized, markMemorized } from '../utils/flashcardStorage';

interface FlashcardModeProps {
  dataset: MufrodatItem[];
  level: number;
  kitab: KitabType;
  jilid: number;
  onBack: () => void;
}

/** Shuffle array (Fisher-Yates) */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const FlashcardMode: React.FC<FlashcardModeProps> = ({ dataset, level, kitab, jilid, onBack }) => {
  const themeColor = kitab === 'quran' ? '#d97706' : kitab === 'dl' ? 'var(--success-color)' : 'var(--primary-color)';

  // Order cards: "Belum Hafal" words first (shuffled), then the rest (shuffled)
  const orderedCards = useMemo(() => {
    const unmemorizedWords = getUnmemorized(kitab, jilid, level);
    const unmemorizedSet = new Set(unmemorizedWords);

    const priority = dataset.filter(item => unmemorizedSet.has(item.arab));
    const rest = dataset.filter(item => !unmemorizedSet.has(item.arab));

    return [...shuffle(priority), ...shuffle(rest)];
  }, [dataset, kitab, jilid, level]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewed, setReviewed] = useState<Set<number>>(new Set());
  const [memorizedCount, setMemorizedCount] = useState(0);
  const [unmemorizedCount, setUnmemorizedCount] = useState(0);
  const [sessionDone, setSessionDone] = useState(false);

  const currentCard = orderedCards[currentIdx];
  const totalCards = orderedCards.length;

  const handleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  const handleMark = useCallback((memorized: boolean) => {
    if (!currentCard) return;

    if (memorized) {
      markMemorized(kitab, jilid, level, currentCard.arab);
      setMemorizedCount(prev => prev + 1);
    } else {
      markUnmemorized(kitab, jilid, level, currentCard.arab);
      setUnmemorizedCount(prev => prev + 1);
    }

    setReviewed(prev => new Set(prev).add(currentIdx));

    // Advance to next card or finish
    if (currentIdx + 1 < totalCards) {
      setCurrentIdx(prev => prev + 1);
      setIsFlipped(false);
    } else {
      setSessionDone(true);
    }
  }, [currentCard, currentIdx, totalCards, kitab, jilid, level]);

  const handlePrev = useCallback(() => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
      setIsFlipped(false);
    }
  }, [currentIdx]);

  const handleNext = useCallback(() => {
    if (currentIdx + 1 < totalCards) {
      setCurrentIdx(prev => prev + 1);
      setIsFlipped(false);
    }
  }, [currentIdx, totalCards]);

  const handleRestart = useCallback(() => {
    setCurrentIdx(0);
    setIsFlipped(false);
    setReviewed(new Set());
    setMemorizedCount(0);
    setUnmemorizedCount(0);
    setSessionDone(false);
  }, []);

  // ── Session Complete Screen ──
  if (sessionDone) {
    return (
      <div className="fade-in" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
        flex: 1,
        maxWidth: '480px',
        margin: '0 auto',
        width: '100%',
        padding: '2rem 1rem',
        textAlign: 'center'
      }}>
        <div className="card" style={{ width: '100%', padding: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎉</div>
          <h2 style={{ fontSize: '1.5rem', color: themeColor, marginBottom: '1rem' }}>Sesi Flashcard Selesai!</h2>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              padding: '1rem 1.5rem',
              background: 'rgba(16, 185, 129, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success-color)' }}>{memorizedCount}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Sudah Hafal</div>
            </div>
            <div style={{
              padding: '1rem 1.5rem',
              background: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--error-color)' }}>{unmemorizedCount}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Belum Hafal</div>
            </div>
          </div>

          {unmemorizedCount > 0 && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Kata yang belum hafal akan muncul lebih dulu di sesi berikutnya 💪
            </p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button className="btn" onClick={handleRestart} style={{
              background: themeColor,
              color: '#fff',
              borderColor: themeColor,
              justifyContent: 'center'
            }}>
              Ulangi Sesi
            </button>
            <button className="btn" onClick={onBack} style={{ justifyContent: 'center' }}>
              Kembali ke Fase
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main Flashcard UI ──
  return (
    <div className="fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      maxWidth: '480px',
      margin: '0 auto',
      width: '100%',
      padding: '1rem'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
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
        <div style={{
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          fontWeight: 600,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          background: 'rgba(255, 255, 255, 0.6)',
          padding: '0.25rem 0.75rem',
          borderRadius: '20px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <span>🃏</span>
          <span>Flashcard</span>
        </div>
      </div>

      {/* Kitab / Jilid / Level Badge */}
      <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
        <div style={{
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          fontWeight: 600,
          letterSpacing: '0.03em',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          background: 'rgba(255, 255, 255, 0.6)',
          padding: '0.2rem 0.6rem',
          borderRadius: '20px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <span>{kitab === 'quran' ? '📖 Al-Qur\'an' : kitab === 'dl' ? '📚 Durusul Lughah' : '💬 ABY'}</span>
          <span style={{ opacity: 0.5 }}>/</span>
          <span>{kitab === 'quran' ? `Kelompok ${jilid}` : `Jilid ${jilid}`}</span>
          <span style={{ opacity: 0.5 }}>/</span>
          <span style={{ color: themeColor }}>{kitab === 'quran' ? `Juz ${(jilid - 1) * 10 + level}` : `Level ${level}`}</span>
        </div>
      </div>

      {/* Progress counter */}
      <div style={{
        textAlign: 'center',
        marginBottom: '1rem',
        color: 'var(--text-muted)',
        fontSize: '0.9rem',
        fontWeight: 500
      }}>
        Kartu {currentIdx + 1} / {totalCards}
      </div>

      {/* Progress bar */}
      <div style={{
        width: '100%',
        height: '6px',
        background: 'var(--border-color)',
        borderRadius: '99px',
        overflow: 'hidden',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          height: '100%',
          width: `${((reviewed.size) / totalCards) * 100}%`,
          background: `linear-gradient(90deg, ${themeColor}, ${kitab === 'dl' ? '#34d399' : '#60a5fa'})`,
          borderRadius: '99px',
          transition: 'width 0.4s ease'
        }} />
      </div>

      {/* 3D Flip Card */}
      <div className="flashcard-container" style={{ marginBottom: '1.5rem' }}>
        <div
          className={`flashcard ${isFlipped ? 'flipped' : ''}`}
          onClick={handleFlip}
          role="button"
          tabIndex={0}
          aria-label={isFlipped ? 'Tampilkan kata Arab' : 'Tampilkan arti'}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleFlip(); }}
        >
          {/* Front — Arabic */}
          <div className="flashcard-front">
            <div style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              background: 'var(--bg-color)',
              padding: '0.2rem 0.5rem',
              borderRadius: '8px',
              fontWeight: 600
            }}>
              Ketuk untuk membalik
            </div>
            <div style={{
              fontFamily: "'Amiri', serif",
              direction: 'rtl',
              fontSize: 'clamp(2.5rem, 10vw, 4.5rem)',
              lineHeight: 1.7,
              textAlign: 'center',
              fontWeight: 700,
              color: 'var(--primary-color)',
              textShadow: '1px 1px 2px rgba(0,0,0,0.05)',
              marginBottom: '0.5rem'
            }}>
              {currentCard.arab}
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <SpeakerButton text={currentCard.arab} size="md" />
            </div>
          </div>

          {/* Back — Indonesian */}
          <div className="flashcard-back">
            <div style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              background: 'rgba(255,255,255,0.7)',
              padding: '0.2rem 0.5rem',
              borderRadius: '8px',
              fontWeight: 600
            }}>
              Ketuk untuk kembali
            </div>
            <div style={{
              fontSize: 'clamp(1.5rem, 6vw, 2.5rem)',
              fontWeight: 700,
              color: 'var(--text-color)',
              textAlign: 'center',
              marginBottom: '1rem'
            }}>
              {currentCard.indonesia}
            </div>
            <div style={{
              fontFamily: "'Amiri', serif",
              direction: 'rtl',
              fontSize: '1.3rem',
              color: 'var(--text-muted)',
              textAlign: 'center'
            }}>
              {currentCard.arab}
            </div>
            <div onClick={(e) => e.stopPropagation()} style={{ marginTop: '0.5rem' }}>
              <SpeakerButton text={currentCard.arab} size="md" />
            </div>
          </div>
        </div>
      </div>

      {/* Mark Buttons */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0.75rem',
        marginBottom: '1rem'
      }}>
        <button
          className="btn flashcard-btn-unmemorized"
          onClick={() => handleMark(false)}
          style={{
            justifyContent: 'center',
            padding: '0.85rem',
            background: 'rgba(239, 68, 68, 0.08)',
            borderColor: 'rgba(239, 68, 68, 0.3)',
            color: 'var(--error-color)',
            fontWeight: 700,
            fontSize: '0.95rem'
          }}
        >
          ❌ Belum Hafal
        </button>
        <button
          className="btn flashcard-btn-memorized"
          onClick={() => handleMark(true)}
          style={{
            justifyContent: 'center',
            padding: '0.85rem',
            background: 'rgba(16, 185, 129, 0.08)',
            borderColor: 'rgba(16, 185, 129, 0.3)',
            color: 'var(--success-color)',
            fontWeight: 700,
            fontSize: '0.95rem'
          }}
        >
          ✅ Sudah Hafal
        </button>
      </div>

      {/* Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <button
          onClick={handlePrev}
          disabled={currentIdx === 0}
          style={{
            background: 'none',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            padding: '0.6rem 1.2rem',
            cursor: currentIdx === 0 ? 'not-allowed' : 'pointer',
            opacity: currentIdx === 0 ? 0.4 : 1,
            color: 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '0.9rem',
            transition: 'all 0.2s ease'
          }}
        >
          ← Sebelumnya
        </button>
        <button
          onClick={handleNext}
          disabled={currentIdx + 1 >= totalCards}
          style={{
            background: 'none',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            padding: '0.6rem 1.2rem',
            cursor: currentIdx + 1 >= totalCards ? 'not-allowed' : 'pointer',
            opacity: currentIdx + 1 >= totalCards ? 0.4 : 1,
            color: 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '0.9rem',
            transition: 'all 0.2s ease'
          }}
        >
          Selanjutnya →
        </button>
      </div>
    </div>
  );
};

export default FlashcardMode;
