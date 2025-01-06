import React, { useState } from 'react';

export default function HideDemo() {
  const [hideMethod, setHideMethod] = useState('none');
  
  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '20px 0' }}>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => setHideMethod('none')}>display: none</button>
        <button onClick={() => setHideMethod('hidden')}>visibility: hidden</button>
        <button onClick={() => setHideMethod('opacity')}>opacity: 0</button>
      </div>
      <div style={{ 
        display: hideMethod === 'none' ? 'none' : 'block',
        visibility: hideMethod === 'hidden' ? 'hidden' : 'visible',
        opacity: hideMethod === 'opacity' ? 0 : 1,
        transition: 'opacity 0.3s',
        background: '#f0f0f0',
        padding: '20px'
      }}>
        隐藏效果演示元素
      </div>
    </div>
  );
} 