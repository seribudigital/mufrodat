import React, { useEffect, useState } from 'react';
import type { QuizQuestion, PhaseType } from '../types';

interface QuizProps {
  question: QuizQuestion;
  timeLimit: number;
  phase?: PhaseType;
  onAnswer: (isCorrect: boolean, isTimeUp?: boolean) => void;
}

const Quiz: React.FC<QuizProps> = ({ question, timeLimit, phase, onAnswer }) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animationKey, setAnimationKey] = useState(0); 
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  useEffect(() => {
    setSelectedIdx(null);
    setIsTransitioning(false);
    setTimeLeft(timeLimit);
    setAnimationKey(prev => prev + 1); 
  }, [question, timeLimit]);

  useEffect(() => {
    if (isTransitioning) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTransitioning(true);
          // Visual feedback for time's up
          document.body.classList.add('bg-flash-wrong');
          
          const delay = phase === 'latihan' ? 1000 : 400;
          
          setTimeout(() => {
            document.body.classList.remove('bg-flash-wrong');
            onAnswer(false, true); // Auto-fail
          }, delay);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [question, isTransitioning, onAnswer, phase]);

  const handleSelect = (idx: number) => {
    if (isTransitioning) return;

    setSelectedIdx(idx);
    setIsTransitioning(true);
    
    const isCorrect = question.options[idx] === question.item.indonesia;

    if (isCorrect) {
      document.body.classList.add('bg-flash-correct');
    } else {
      document.body.classList.add('bg-flash-wrong');
    }
    
    const delay = (!isCorrect && phase === 'latihan') ? 1000 : 350;
    
    setTimeout(() => {
      document.body.classList.remove('bg-flash-correct', 'bg-flash-wrong');
      onAnswer(isCorrect, false);
    }, delay);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = parseInt(e.key);
      if (key >= 1 && key <= 4) {
        handleSelect(key - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [question, isTransitioning]);

  return (
    <div key={animationKey} className="fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      justifyContent: 'center',
      gap: '1rem'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '-1rem',
        zIndex: 10
      }}>
        <div style={{
          background: timeLeft <= 2 ? 'var(--error-color)' : 'var(--primary-color)',
          color: '#fff',
          padding: '0.5rem 1.5rem',
          borderRadius: '20px',
          fontWeight: 700,
          fontSize: '1.2rem',
          boxShadow: 'var(--shadow-sm)',
          transition: 'background 0.3s ease'
        }}>
          00:{timeLeft.toString().padStart(2, '0')}
        </div>
      </div>

      <div className="arab-card" style={{ marginTop: '0.5rem' }}>
        <div className="arab-text">
          {question.item.arab}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '0.85rem'
      }}>
        {question.options.map((opt, idx) => {
          let btnClass = 'btn';
          
          if (isTransitioning) {
            if (opt === question.item.indonesia) {
              btnClass += ' correct';
            } else if (selectedIdx === idx) {
              btnClass += ' wrong';
            }
          }

          return (
            <button
              key={idx}
              className={btnClass}
              onClick={() => handleSelect(idx)}
              disabled={isTransitioning}
            >
              <span style={{ fontSize: '1.15rem' }}>{opt}</span>
              <span className="btn-key">{idx + 1}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Quiz;
