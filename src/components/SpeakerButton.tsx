import React, { useState, useEffect, useRef } from 'react';

interface SpeakerButtonProps {
  text: string;
  size?: 'sm' | 'md';
}

const SpeakerButton: React.FC<SpeakerButtonProps> = ({ text, size = 'md' }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(() => 'speechSynthesis' in window);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!isSupported) return;

    // Subscribe to voiceschanged for dynamic voice loading
    const onVoicesChanged = () => {
      // Voices loaded — no action needed, we check at speak time
    };

    speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);
    return () => {
      speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
      speechSynthesis.cancel();
    };
  }, [isSupported]);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isSupported || isSpeaking) return;

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.8;
    utterance.pitch = 1;

    // Try to find an Arabic voice
    const voices = speechSynthesis.getVoices();
    const arabicVoice = voices.find(v => v.lang.startsWith('ar'));
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      setIsSpeaking(false);
      // If it errors out, the button just stops animating — no intrusive error
      if (event.error === 'not-allowed' || event.error === 'synthesis-unavailable') {
        setIsSupported(false);
      }
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  // Don't render if TTS is not supported at all
  if (!isSupported) return null;

  const isSm = size === 'sm';

  return (
    <button
      onClick={handleSpeak}
      aria-label={`Dengarkan pelafalan: ${text}`}
      title="Dengarkan pelafalan"
      className={isSpeaking ? 'speaker-btn speaking' : 'speaker-btn'}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: isSm ? '1rem' : '1.4rem',
        padding: isSm ? '0.2rem' : '0.4rem 0.6rem',
        borderRadius: '8px',
        transition: 'all 0.2s ease',
        opacity: isSpeaking ? 1 : 0.6,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      🔊
    </button>
  );
};

export default SpeakerButton;
