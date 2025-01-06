import React from 'react';

export default function GridDemo() {
  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '20px 0' }}>
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px',
        marginBottom: '20px'
      }}>
        <div style={{ padding: '20px', background: '#f0f0f0' }}>1</div>
        <div style={{ padding: '20px', background: '#f0f0f0' }}>2</div>
        <div style={{ padding: '20px', background: '#f0f0f0' }}>3</div>
        <div style={{ padding: '20px', background: '#f0f0f0' }}>4</div>
        <div style={{ padding: '20px', background: '#f0f0f0' }}>5</div>
        <div style={{ padding: '20px', background: '#f0f0f0' }}>6</div>
      </div>
    </div>
  );
} 