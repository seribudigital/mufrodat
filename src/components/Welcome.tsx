import React, { useState } from 'react';

interface WelcomeProps {
  onStart: (name: string, studentClass: string) => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
  const [name, setName] = useState('');
  const [studentClass, setStudentClass] = useState('');

  const isFormValid = name.trim().length > 0 && studentClass.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onStart(name.trim(), studentClass.trim());
    }
  };

  return (
    <div className="fade-in islamic-bg" style={{
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem 1rem',
      maxWidth: '600px',
      margin: '0 auto',
      width: '100%'
    }}>
      <div className="card" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ textAlign: 'center' }}>
          <img src="/logo.png" alt="Logo Mufrodat" fetchpriority="high" style={{ width: '80px', height: '80px', marginBottom: '1rem', objectFit: 'contain' }} />
          <h1 style={{ color: 'var(--primary-color)', marginBottom: '1rem', fontSize: '2rem' }}>Mufrodat Durusul Lughoh</h1>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Aplikasi Mufrodat Durusul Lughoh dirancang untuk membantu Anda menguasai kosakata bahasa Arab dengan cepat melalui sistem kuis akumulatif dan tantangan waktu.
          </p>
        </div>

        <div style={{
          background: 'var(--bg-color)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          textAlign: 'center'
        }}>
          <div className="arab-text" style={{ fontSize: '1.8rem', lineHeight: '2.5', marginBottom: '1rem', color: 'var(--primary-color)' }}>
            مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ
          </div>
          <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
            "Barangsiapa menempuh jalan untuk mencari ilmu, maka Allah akan memudahkan baginya jalan menuju surga." <br></br> Mari kuasai bahasa Al-Qur'an dimulai dari satu kata hari ini!
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="name" style={{ fontWeight: 600, color: 'var(--text-color)' }}>Nama Lengkap</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama lengkap Anda"
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-color)',
                color: 'var(--text-color)',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="studentClass" style={{ fontWeight: 600, color: 'var(--text-color)' }}>Kelas</label>
            <input
              id="studentClass"
              type="text"
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value)}
              placeholder="Contoh: 7A, 8B, dsb."
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-color)',
                color: 'var(--text-color)',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              required
            />
          </div>

          <button
            type="submit"
            className="btn"
            disabled={!isFormValid}
            style={{
              marginTop: '1rem',
              justifyContent: 'center',
              background: isFormValid ? 'var(--primary-color)' : 'var(--text-muted)',
              color: '#fff',
              borderColor: isFormValid ? 'var(--primary-color)' : 'var(--text-muted)',
              opacity: isFormValid ? 1 : 0.7,
              cursor: isFormValid ? 'pointer' : 'not-allowed'
            }}
          >
            Mulai Belajar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Welcome;
