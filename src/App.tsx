import { useState, useEffect } from 'react';
import LevelSelector from './components/LevelSelector';
import PhaseSelector from './components/PhaseSelector';
import MateriViewer from './components/MateriViewer';
import Quiz from './components/Quiz';
import ProgressBar from './components/ProgressBar';
import HistoryViewer from './components/HistoryViewer';
import Welcome from './components/Welcome';
import { loadLevelDataset, generateQuestions } from './utils/dataFetcher';
import type { QuizQuestion, HistoryEntry, UserIdentity, PhaseType, MufrodatItem, KitabType } from './types';

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
    pushView('quiz');
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
      
      if (currentPhase === 'ujian') {
        const entry: HistoryEntry = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          kitab: currentKitab,
          jilid: currentJilid,
          level: currentLevel,
          score: finalScore,
          correct: newScoreObj.correct,
          wrong: newScoreObj.wrong + newScoreObj.timesUp,
        };
        const historyKey = `mufrodat_history_${currentKitab}_jilid${currentJilid}`;
        const raw = localStorage.getItem(historyKey);
        let history: HistoryEntry[] = [];
        if (raw) {
          try {
            history = JSON.parse(raw);
          } catch (e) {}
        }
        history.push(entry);
        localStorage.setItem(historyKey, JSON.stringify(history));
      }

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
        onBack={() => window.history.back()} 
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

      <Quiz question={currentQ} timeLimit={timeLimit} phase={currentPhase} onAnswer={handleAnswer} />
    </div>
  );
}

export default App;
