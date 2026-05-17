import { useState } from 'react';
import LevelSelector from './components/LevelSelector';
import Quiz from './components/Quiz';
import ProgressBar from './components/ProgressBar';
import HistoryViewer from './components/HistoryViewer';
import Welcome from './components/Welcome';
import { loadLevelDataset, generateQuestions } from './utils/dataFetcher';
import type { QuizQuestion, HistoryEntry, UserIdentity } from './types';

function App() {
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [currentJilid, setCurrentJilid] = useState<number>(1);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [score, setScore] = useState({ correct: 0, wrong: 0, timesUp: 0 });
  const [pulseStreak, setPulseStreak] = useState(false);

  const [identity, setIdentity] = useState<UserIdentity | null>(() => {
    const saved = localStorage.getItem('mufrodat_identity');
    return saved ? JSON.parse(saved) : null;
  });

  const [view, setView] = useState<'welcome' | 'selector' | 'loading' | 'quiz' | 'summary' | 'history'>(
    identity ? 'selector' : 'welcome'
  );

  const handleStart = (name: string, studentClass: string) => {
    const newIdentity = { name, studentClass };
    setIdentity(newIdentity);
    localStorage.setItem('mufrodat_identity', JSON.stringify(newIdentity));
    setView('selector');
  };

  const handleSelectLevel = async (level: number) => {
    setView('loading');
    setCurrentLevel(level);
    const data = await loadLevelDataset(currentJilid, level);
    
    let questionLimit = 20;
    if (level === 2) questionLimit = 25;
    else if (level === 3) questionLimit = 40;
    else if (level >= 4) questionLimit = 50;

    // Generate questions and slice to the specific level limit
    const q = generateQuestions(data).slice(0, questionLimit);
    setQuestions(q);
    setCurrentIdx(0);
    setStreak(0);
    setScore({ correct: 0, wrong: 0, timesUp: 0 });
    setView('quiz');
  };

  const handleAnswer = (isCorrect: boolean, isTimeUp: boolean = false) => {
    let newScoreObj = { ...score };
    if (isTimeUp) {
      setStreak(0);
      newScoreObj.timesUp += 1;
    } else if (isCorrect) {
      setStreak(s => {
        const newStreak = s + 1;
        setMaxStreak(m => Math.max(m, newStreak));
        return newStreak;
      });
      newScoreObj.correct += 1;
      
      setPulseStreak(true);
      setTimeout(() => setPulseStreak(false), 300);
    } else {
      setStreak(0);
      newScoreObj.wrong += 1;
    }
    
    setScore(newScoreObj);

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(i => i + 1);
    } else {
      const finalScore = Math.round((newScoreObj.correct / questions.length) * 100);
      const entry: HistoryEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        jilid: currentJilid,
        level: currentLevel,
        score: finalScore,
        correct: newScoreObj.correct,
        wrong: newScoreObj.wrong + newScoreObj.timesUp,
      };
      const historyKey = `mufrodat_history_jilid${currentJilid}`;
      const raw = localStorage.getItem(historyKey);
      let history: HistoryEntry[] = [];
      if (raw) {
        try {
          history = JSON.parse(raw);
        } catch (e) {}
      }
      history.push(entry);
      localStorage.setItem(historyKey, JSON.stringify(history));

      setView('summary');
    }
  };

  if (view === 'loading') {
    return <div className="fade-in" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>Memuat kosakata...</div>;
  }

  if (view === 'welcome') {
    return <Welcome onStart={handleStart} />;
  }

  if (view === 'history') {
    return <HistoryViewer currentJilid={currentJilid} identity={identity} onBack={() => setView('selector')} />;
  }

  if (view === 'selector') {
    return (
      <LevelSelector 
        onSelect={handleSelectLevel} 
        onViewHistory={() => setView('history')} 
        userName={identity?.name}
        onChangeProfile={() => setView('welcome')}
        currentJilid={currentJilid}
        setCurrentJilid={setCurrentJilid}
      />
    );
  }

  if (view === 'summary') {
    const totalQuestions = questions.length;
    // Base score solely on correct answers
    const finalScore = Math.round((score.correct / totalQuestions) * 100);
    
    let feedbackText = "";
    if (finalScore >= 90) feedbackText = "Mumtaz! (Luar Biasa)";
    else if (finalScore >= 70) feedbackText = "Jayyid Jiddan (Sangat Baik)";
    else feedbackText = "Barakallahu Fiik, ayo coba lagi!";

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
          <h1 style={{ fontSize: '4rem', color: 'var(--primary-color)', marginBottom: '0.5rem', lineHeight: 1 }}>{finalScore}</h1>
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
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', marginTop: '1rem' }}>
          <button className="btn" onClick={() => handleSelectLevel(currentLevel)} style={{ background: 'var(--primary-color)', color: '#fff', borderColor: 'var(--primary-color)', justifyContent: 'center' }}>
            Ulangi Sesi (Level {currentLevel})
          </button>
          <button className="btn" onClick={() => setView('selector')} style={{ justifyContent: 'center' }}>
            Kembali ke Menu
          </button>
          <button className="btn" onClick={() => setView('history')} style={{ background: 'none', borderColor: 'transparent', color: 'var(--text-muted)', justifyContent: 'center' }}>
            Lihat Riwayat Belajar
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIdx];

  let timeLimit = 10;
  if (currentLevel === 2) timeLimit = 8;
  else if (currentLevel === 3) timeLimit = 6;
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
          onClick={() => setView('selector')}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
        >
          ← Kembali
        </button>
        
        <div className={pulseStreak ? 'animate-pulse-quick' : ''} style={{ 
          fontWeight: 700, 
          fontSize: '1.1rem',
          color: streak > 2 ? '#f97316' : 'var(--primary-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          transition: 'color 0.3s ease'
        }}>
          {streak > 0 && `🔥 x${streak}`}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>
        Progress: {currentIdx + 1} / {questions.length}
      </div>

      <Quiz question={currentQ} timeLimit={timeLimit} onAnswer={handleAnswer} />
    </div>
  );
}

export default App;
