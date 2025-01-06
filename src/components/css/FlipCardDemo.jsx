import React from 'react';

export default function FlipCardDemo() {
  return (
    <div style={{ 
      perspective: '1000px',
      width: '300px',
      height: '200px',
      margin: '20px 0'
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.6s',
        cursor: 'pointer',
      }}
      className="flip-card-inner"
      >
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          background: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px'
        }}>
          正面
        </div>
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          background: '#ddd',
          transform: 'rotateY(180deg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px'
        }}>
          背面
        </div>
      </div>
      <style>{`
        .flip-card-inner:hover {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
} 