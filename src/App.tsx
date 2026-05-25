import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import LevelSelector from './components/LevelSelector';
import PhaseSelector from './components/PhaseSelector';
import MateriViewer from './components/MateriViewer';
import Quiz from './components/Quiz';
import ProgressBar from './components/ProgressBar';
import HistoryViewer from './components/HistoryViewer';
import Welcome from './components/Welcome';
import SpeakerButton from './components/SpeakerButton';
import { loadLevelDataset, generateQuestions } from './utils/dataFetcher';
import type { QuizQuestion, HistoryEntry, UserIdentity, PhaseType, MufrodatItem, KitabType, WrongAnswer } from './types';

function App() {
  const [currentKitab, setCurrentKitab] = useState<KitabType>('dl');
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [currentJilid, setCurrentJilid] = useState<number>(1);
  const [currentPhase, setCurrentPhase] = useState<PhaseType>(null);
  
  const [rawDataset, setRawDataset] = useState<MufrodatItem[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [score, setScore] = useState({ correct: 0, wrong: 0, timesUp: 0 });
  const [pulseStreak, setPulseStreak] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  const [displayedScore, setDisplayedScore] = useState(0);
  const confettiFired = useRef(false);
  const historySaved = useRef(false);

  const [identity, setIdentity] = useState<UserIdentity | null>(() => {
    const saved = localStorage.getItem('mufrodat_identity');
    return saved ? JSON.parse(saved) : null;
  });

  const [view, setView] = useState<'welcome' | 'selector' | 'phaseSelector' | 'materi' | 'loading' | 'quiz' | 'summary' | 'history'>(
    identity ? 'selector' : 'welcome'
  );

  const pushView = (newView: typeof view, replace: boolean = false) => {
    setView(newView);
    if (replace) {
      window.history.replaceState({ view: newView }, '', '');
    } else {
      window.history.pushState({ view: newView }, '', '');
    }
  };

  useEffect(() => {
    // Set the initial state in history
    const initialView = identity ? 'selector' : 'welcome';
    window.history.replaceState({ view: initialView }, '', '');

    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.view) {
        setView(event.state.view);
      } else {
        setView(identity ? 'selector' : 'welcome');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [identity]);

  // Confetti effect — fires when summary is shown with high score
  useEffect(() => {
    if (view !== 'summary') return;
    const totalQ = questions.length;
    if (totalQ === 0) return;
    const fs = Math.round((score.correct / totalQ) * 100);
    if (fs >= 80 && !confettiFired.current) {
      confettiFired.current = true;
      const fireConfetti = () => {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6, x: 0.3 } });
        setTimeout(() => {
          confetti({ particleCount: 60, spread: 80, origin: { y: 0.5, x: 0.7 } });
        }, 300);
        setTimeout(() => {
          confetti({ particleCount: 100, spread: 100, origin: { y: 0.7, x: 0.5 } });
        }, 600);
      };
      setTimeout(fireConfetti, 400);
    }
  }, [view, score.correct, questions.length]);

  // Animated score counting effect
  useEffect(() => {
    if (view !== 'summary') return;
    const totalQ = questions.length;
    if (totalQ === 0) return;
    const fs = Math.round((score.correct / totalQ) * 100);
    if (displayedScore < fs) {
      const step = Math.max(1, Math.ceil(fs / 40));
      const timer = setTimeout(() => {
        setDisplayedScore(prev => Math.min(prev + step, fs));
      }, 25);
      return () => clearTimeout(timer);
    }
  }, [view, displayedScore, score.correct, questions.length]);

  // Save history when summary is shown (uses flushed state for accurate scores)
  useEffect(() => {
    if (view !== 'summary' || currentPhase !== 'ujian' || historySaved.current) return;
    if (questions.length === 0) return;
    historySaved.current = true;

    const finalScore = Math.round((score.correct / questions.length) * 100);
    const entry: HistoryEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      kitab: currentKitab,
      jilid: currentJilid,
      level: currentLevel,
      score: finalScore,
      correct: score.correct,
      wrong: score.wrong + score.timesUp,
    };
    const historyKey = `mufrodat_history_${currentKitab}_jilid${currentJilid}`;
    const raw = localStorage.getItem(historyKey);
    let history: HistoryEntry[] = [];
    if (raw) {
      try {
        history = JSON.parse(raw);
      } catch (e) { console.error('Failed to parse history:', e); }
    }
    history.push(entry);
    localStorage.setItem(historyKey, JSON.stringify(history));
  }, [view, currentPhase, score, questions.length, currentKitab, currentJilid, currentLevel]);

  const handleStart = (name: string, studentClass: string) => {
    const newIdentity = { name, studentClass };
    setIdentity(newIdentity);
    localStorage.setItem('mufrodat_identity', JSON.stringify(newIdentity));
    pushView('selector', true); // replace welcome view in history
  };

  const handleSelectLevel = (level: number) => {
    setCurrentLevel(level);
    pushView('phaseSelector');
  };

  const handleSelectPhase = async (phase: PhaseType) => {
    setCurrentPhase(phase);
    setView('loading');
    
    const data = await loadLevelDataset(currentKitab, currentJilid, currentLevel);
    setRawDataset(data);
    
    if (phase === 'materi') {
      pushView('materi');
      return;
    }
    
    let questionLimit = 20;
    if (currentLevel === 2) questionLimit = 25;
    else if (currentLevel === 3) questionLimit = 40;
    else if (currentLevel >= 4) questionLimit = 50;

    const optionsCount = phase === 'latihan' ? 2 : 4;

    // Generate questions and slice to the specific level limit
    const q = generateQuestions(data, optionsCount).slice(0, questionLimit);
    setQuestions(q);
    setCurrentIdx(0);
    setStreak(0);
    setScore({ correct: 0, wrong: 0, timesUp: 0 });
    setWrongAnswers([]);
    setDisplayedScore(0);
    confettiFired.current = false;
    historySaved.current = false;
    pushView('quiz');
  };

  const handleAnswer = (isCorrect: boolean, isTimeUp: boolean = false, userAnswer: string = '') => {
    const currentQuestion = questions[currentIdx];

    if (isTimeUp) {
      setStreak(0);
      setScore(prev => ({ ...prev, timesUp: prev.timesUp + 1 }));
      setWrongAnswers(prev => [...prev, {
        arab: currentQuestion.item.arab,
        indonesia: currentQuestion.item.indonesia,
        userAnswer: '(Waktu Habis)',
      }]);
    } else if (isCorrect) {
      setStreak(s => {
        const newStreak = s + 1;
        setMaxStreak(m => Math.max(m, newStreak));
        return newStreak;
      });
      setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
      
      setPulseStreak(true);
      setTimeout(() => setPulseStreak(false), 300);
    } else {
      setStreak(0);
      setScore(prev => ({ ...prev, wrong: prev.wrong + 1 }));
      setWrongAnswers(prev => [...prev, {
        arab: currentQuestion.item.arab,
        indonesia: currentQuestion.item.indonesia,
        userAnswer: userAnswer,
      }]);
    }

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(i => i + 1);
    } else {
      // History saving is handled by the useEffect above
      pushView('summary', true);
    }
  };

  if (view === 'loading') {
    return <div className="fade-in" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>Memuat...</div>;
  }

  if (view === 'welcome') {
    return <Welcome onStart={handleStart} />;
  }

  if (view === 'history') {
    return <HistoryViewer currentKitab={currentKitab} currentJilid={currentJilid} identity={identity} onBack={() => window.history.back()} />;
  }

  if (view === 'selector') {
    return (
      <LevelSelector 
        onSelect={handleSelectLevel} 
        onViewHistory={() => pushView('history')} 
        userName={identity?.name}
        onChangeProfile={() => pushView('welcome')}
        currentKitab={currentKitab}
        setCurrentKitab={setCurrentKitab}
        currentJilid={currentJilid}
        setCurrentJilid={setCurrentJilid}
      />
    );
  }

  if (view === 'phaseSelector') {
    return (
      <PhaseSelector 
        level={currentLevel} 
        kitab={currentKitab}
        jilid={currentJilid}
        onSelect={handleSelectPhase} 
        onBack={() => window.history.back()} 
      />
    );
  }

  if (view === 'materi') {
    return (
      <MateriViewer 
        dataset={rawDataset} 
        level={currentLevel}
        kitab={currentKitab}
        jilid={currentJilid}
        onBack={() => window.history.back()} 
      />
    );
  }

  if (view === 'summary') {
    const totalQuestions = questions.length;
    // Base score solely on correct answers
    const finalScore = Math.round((score.correct / totalQuestions) * 100);
    
    const getFeedback = (s: number) => {
      if (s >= 95) return { emoji: "🏆", text: "Mumtaz! Luar Biasa!" };
      if (s >= 80) return { emoji: "🌟", text: "Jayyid Jiddan!" };
      if (s >= 70) return { emoji: "💪", text: "Jayyid, Terus Berlatih!" };
      return { emoji: "📖", text: "Barakallahu Fiik, ayo coba lagi!" };
    };
    const { emoji: feedbackEmoji, text: feedbackText } = getFeedback(finalScore);

    return (
      <div className="card fade-in" style={{ 
        margin: 'auto',
        maxWidth: '450px',
        width: '100%',
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: '1.5rem', 
        textAlign: 'center' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            fontWeight: 600,
            letterSpacing: '0.03em',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'var(--bg-color)',
            padding: '0.2rem 0.6rem',
            borderRadius: '20px',
            border: '1px solid var(--border-color)',
            marginBottom: '0.75rem'
          }}>
            <span>{currentKitab === 'dl' ? '📚 Durusul Lughah' : '💬 ABY'}</span>
            <span style={{ opacity: 0.5 }}>/</span>
            <span>Jilid {currentJilid}</span>
            <span style={{ opacity: 0.5 }}>/</span>
            <span style={{ color: currentKitab === 'dl' ? 'var(--success-color)' : 'var(--primary-color)' }}>Level {currentLevel}</span>
          </div>
          {identity && (
            <div style={{ 
              marginBottom: '1rem', 
              padding: '0.5rem 1rem', 
              background: 'var(--bg-color)', 
              borderRadius: '20px',
              display: 'inline-block',
              border: '1px solid var(--border-color)',
              color: 'var(--text-color)',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}>
              👤 {identity.name} - Kelas {identity.studentClass}
            </div>
          )}
          <div style={{ fontSize: '3rem', marginBottom: '0.25rem' }}>{feedbackEmoji}</div>
          <h1 className="score-count-up" style={{ fontSize: '4rem', color: currentKitab === 'dl' ? 'var(--success-color)' : 'var(--primary-color)', marginBottom: '0.5rem', lineHeight: 1 }}>{displayedScore}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', fontWeight: 600 }}>{feedbackText}</p>
        </div>
        
        <div style={{ fontSize: '1.1rem', width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-color)', borderRadius: '12px' }}>
            <span>Benar</span>
            <span style={{ color: 'var(--success-color)', fontWeight: 700 }}>{score.correct}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-color)', borderRadius: '12px' }}>
            <span>Salah</span>
            <span style={{ color: 'var(--error-color)', fontWeight: 700 }}>{score.wrong}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-color)', borderRadius: '12px' }}>
            <span>Waktu Habis (0 dtk)</span>
            <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>{score.timesUp}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'linear-gradient(to right, var(--primary-light), #ffffff)', borderRadius: '12px', border: '1px solid var(--primary-color)' }}>
            <span style={{ color: 'var(--primary-hover)' }}>Combo Tertinggi</span>
            <span style={{ color: '#f97316', fontWeight: 700 }}>🔥 {maxStreak}</span>
          </div>
        </div>

        {/* Wrong Answers Review */}
        {wrongAnswers.length > 0 ? (
          <div style={{ width: '100%' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--error-color)', marginBottom: '0.75rem', textAlign: 'left' }}>
              📝 Kata yang Perlu Dipelajari Ulang ({wrongAnswers.length})
            </h3>
            <div className="wrong-answers-section">
              {wrongAnswers.map((wa, idx) => (
                <div key={idx} className="wrong-answer-item">
                  <div className="wrong-answer-left">
                    <span className="wrong-answer-correct">✓ {wa.indonesia}</span>
                    <span className="wrong-answer-user">✗ {wa.userAnswer}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span className="wrong-answer-arab">{wa.arab}</span>
                    <SpeakerButton text={wa.arab} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="perfect-badge">
            🌟 Sempurna! Semua Jawaban Benar
          </div>
        )}
        
        {currentPhase === 'latihan' && (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '-0.5rem' }}>
            Sesi Latihan tidak disimpan ke Riwayat.
          </div>
        )}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', marginTop: '1rem' }}>
          <button className="btn" onClick={() => handleSelectPhase(currentPhase)} style={{ background: 'var(--primary-color)', color: '#fff', borderColor: 'var(--primary-color)', justifyContent: 'center' }}>
            Ulangi Sesi
          </button>
          <button className="btn" onClick={() => window.history.back()} style={{ justifyContent: 'center' }}>
            Kembali ke Fase
          </button>
          {currentPhase === 'ujian' && (
            <button className="btn" onClick={() => pushView('history')} style={{ background: 'none', borderColor: 'transparent', color: 'var(--text-muted)', justifyContent: 'center' }}>
              Lihat Riwayat Belajar
            </button>
          )}
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIdx];

  let timeLimit = 10;
  if (currentLevel === 2) timeLimit = 8;
  else if (currentLevel === 3) timeLimit = 7;
  else if (currentLevel >= 4) timeLimit = 5;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <ProgressBar current={currentIdx} total={questions.length} />
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '0.5rem 0',
        marginBottom: '1rem',
      }}>
        <button 
          onClick={() => window.history.back()}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
        >
          ← Kembali
        </button>
        
        <div className={pulseStreak ? 'animate-pulse-quick' : ''} style={{ 
          fontWeight: 700, 
          fontSize: '1.1rem',
          color: streak > 2 ? '#f97316' : (currentKitab === 'dl' ? 'var(--success-color)' : 'var(--primary-color)'),
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          transition: 'color 0.3s ease'
        }}>
          {streak > 0 && `🔥 x${streak}`}
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        marginBottom: '1rem',
      }}>
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
          <span>{currentKitab === 'dl' ? '📚 Durusul Lughah' : '💬 ABY'}</span>
          <span style={{ opacity: 0.5 }}>/</span>
          <span>Jilid {currentJilid}</span>
          <span style={{ opacity: 0.5 }}>/</span>
          <span style={{ color: currentKitab === 'dl' ? 'var(--success-color)' : 'var(--primary-color)' }}>Level {currentLevel}</span>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>
        Progress: {currentIdx + 1} / {questions.length}
      </div>

      <Quiz question={currentQ} timeLimit={timeLimit} phase={currentPhase} onAnswer={handleAnswer} />
    </div>
  );
}

export default App;
