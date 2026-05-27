import React, { useEffect, useState } from 'react';
import type { KitabType } from '../types';
import { getStreak, getMasteryStats, hasStudiedToday } from '../utils/streakManager';

interface StatsWidgetProps {
  kitab: KitabType;
  jilid: number;
}

const StatsWidget: React.FC<StatsWidgetProps> = ({ kitab, jilid }) => {
  const [streakCount, setStreakCount] = useState(0);
  const [mastered, setMastered] = useState(0);
  const [total, setTotal] = useState(0);
  const [studiedToday, setStudiedToday] = useState(false);
  const [animatedWidth, setAnimatedWidth] = useState(0);

  useEffect(() => {
    const streak = getStreak();
    setStreakCount(streak.count);
    setStudiedToday(hasStudiedToday());

    const stats = getMasteryStats(kitab, jilid);
    setMastered(stats.mastered);
    setTotal(stats.total);

    // Animate progress bar after mount
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setAnimatedWidth(stats.total > 0 ? (stats.mastered / stats.total) * 100 : 0);
      });
    });
  }, [kitab, jilid]);

  const themeColor = kitab === 'dl' ? 'var(--success-color)' : 'var(--primary-color)';
  const themeGradient = kitab === 'dl'
    ? 'linear-gradient(90deg, #10b981, #34d399)'
    : 'linear-gradient(90deg, #2563eb, #60a5fa)';
  const kitabLabel = kitab === 'quran' ? 'Al-Qur\'an Kelompok' : kitab === 'dl' ? 'Durusul Lughah Jilid' : 'ABY Jilid';
  const percentage = total > 0 ? Math.round((mastered / total) * 100) : 0;

  return (
    <div className={`stats-widget moving-gradient-${kitab}`} style={{
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.35)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.1rem',
    }}>
      {/* Row 1: Streak + Studied Today */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        {/* Streak */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <span className={streakCount >= 3 ? 'streak-fire-pulse' : ''} style={{
            fontSize: '1.4rem',
            lineHeight: 1,
          }}>
            {streakCount > 0 ? '🔥' : '💤'}
          </span>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{
              fontWeight: 700,
              fontSize: '1rem',
              color: streakCount > 0 ? '#f97316' : 'var(--text-muted)',
              lineHeight: 1.2,
            }}>
              {streakCount > 0 ? `${streakCount} Hari` : 'Belum ada streak'}
            </span>
            <span style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              fontWeight: 500,
            }}>
              {streakCount > 0 ? 'Berturut-turut! 🎯' : 'Mulai belajar hari ini!'}
            </span>
          </div>
        </div>

        {/* Studied Today Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
          padding: '0.3rem 0.65rem',
          borderRadius: '20px',
          background: studiedToday ? 'rgba(16, 185, 129, 0.1)' : 'rgba(100, 116, 139, 0.08)',
          border: `1px solid ${studiedToday ? 'rgba(16, 185, 129, 0.25)' : 'rgba(100, 116, 139, 0.15)'}`,
        }}>
          <span style={{ fontSize: '0.85rem' }}>
            {studiedToday ? '✅' : '⏳'}
          </span>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 600,
            color: studiedToday ? 'var(--success-color)' : 'var(--text-muted)',
          }}>
            {studiedToday ? 'Sudah Belajar' : 'Belum Hari Ini'}
          </span>
        </div>
      </div>

      {/* Row 2: Mastery Progress */}
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: '0.5rem',
        }}>
          <span style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--text-color)',
          }}>
            📊 Kosakata {kitabLabel} {jilid}
          </span>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: themeColor,
          }}>
            {percentage}%
          </span>
        </div>

        {/* Progress bar */}
        <div style={{
          width: '100%',
          height: '10px',
          background: '#e2e8f0',
          borderRadius: '99px',
          overflow: 'hidden',
          position: 'relative',
        }}>
          <div className="mastery-progress-fill" style={{
            height: '100%',
            width: `${animatedWidth}%`,
            background: themeGradient,
            borderRadius: '99px',
            transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: mastered > 0 ? `0 0 8px ${kitab === 'dl' ? 'rgba(16,185,129,0.3)' : 'rgba(37,99,235,0.3)'}` : 'none',
          }} />
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '0.4rem',
        }}>
          <span style={{
            fontSize: '0.82rem',
            color: 'var(--text-color)',
            fontWeight: 600,
          }}>
            {mastered} / {total} Kosakata Dikuasai
          </span>
          {mastered > 0 && percentage < 100 && (
            <span style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              fontStyle: 'italic',
            }}>
              Sisa {total - mastered} kata lagi!
            </span>
          )}
          {percentage >= 100 && (
            <span style={{
              fontSize: '0.72rem',
              color: 'var(--success-color)',
              fontWeight: 700,
            }}>
              🏆 Mumtaz!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsWidget;
