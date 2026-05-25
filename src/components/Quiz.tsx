import React, { useEffect, useState, useCallback } from 'react';
import type { QuizQuestion, PhaseType } from '../types';
import SpeakerButton from './SpeakerButton';

interface QuizProps {
  question: QuizQuestion;
  timeLimit: number;
  phase?: PhaseType;
  onAnswer: (isCorrect: boolean, isTimeUp: boolean, userAnswer: string) => void;
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
            onAnswer(false, true, ''); // Auto-fail, empty userAnswer
          }, delay);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [question, isTransitioning, onAnswer, phase]);

  const handleSelect = useCallback((idx: number) => {
    if (isTransitioning) return;

    setSelectedIdx(idx);
    setIsTransitioning(true);
    
    const selectedAnswer = question.options[idx];
    const isCorrect = selectedAnswer === question.item.indonesia;

    if (isCorrect) {
      document.body.classList.add('bg-flash-correct');
    } else {
      document.body.classList.add('bg-flash-wrong');
    }
    
    const delay = (!isCorrect && phase === 'latihan') ? 1000 : 350;
    
    setTimeout(() => {
      document.body.classList.remove('bg-flash-correct', 'bg-flash-wrong');
      onAnswer(isCorrect, false, selectedAnswer);
    }, delay);
  }, [isTransitioning, question, phase, onAnswer]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = parseInt(e.key);
      if (key >= 1 && key <= 4) {
        handleSelect(key - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSelect]);

  // Timer bar calculations
  const timerPercentage = (timeLeft / timeLimit) * 100;
  const timerColorClass = timerPercentage > 50 ? 'timer-safe' : timerPercentage > 25 ? 'timer-warn' : 'timer-danger';

  return (
    <div key={animationKey} className="fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      justifyContent: 'center',
      gap: '1rem'
    }}>
      {/* Visual Timer Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0 0.25rem',
      }}>
        <div className="quiz-timer-bar-container" style={{ flex: 1 }}>
          <div 
            className={`quiz-timer-bar-fill ${timerColorClass}`}
            style={{ width: `${timerPercentage}%` }}
          />
        </div>
        <div style={{
          fontWeight: 700,
          fontSize: '1rem',
          color: timerPercentage <= 25 ? 'var(--error-color)' : 'var(--text-muted)',
          minWidth: '2.5rem',
          textAlign: 'center',
          transition: 'color 0.3s ease',
          fontVariantNumeric: 'tabular-nums',
        }}
          role="timer"
          aria-live="assertive"
          aria-label={`Sisa waktu ${timeLeft} detik`}
        >
          {timeLeft}s
        </div>
      </div>

      {/* Arabic Word Card */}
      <div className="arab-card" style={{ marginTop: '0.25rem', position: 'relative' }}>
        <div className="arab-text">
          {question.item.arab}
        </div>
      </div>

      {/* Speaker Button */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '-1.5rem', marginBottom: '0.25rem' }}>
        <SpeakerButton text={question.item.arab} size="md" />
      </div>

      {/* Answer Options */}
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
