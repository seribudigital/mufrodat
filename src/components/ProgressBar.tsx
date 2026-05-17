import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));

  return (
    <div style={{
      width: '100%',
      height: '4px',
      backgroundColor: 'var(--border-color)',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 50
    }}>
      <div style={{
        height: '100%',
        width: `${percentage}%`,
        backgroundColor: 'var(--primary-color)',
        transition: 'width 0.3s ease-in-out'
      }} />
    </div>
  );
};

export default ProgressBar;
