import React from 'react';

export default function ClearfixDemo() {
  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '20px 0' }}>
      <div className="clearfix">
        <div style={{ float: 'left', width: '100px', height: '100px', background: '#f00', marginRight: '10px' }}>
          浮动元素1
        </div>
        <div style={{ float: 'left', width: '100px', height: '100px', background: '#0f0' }}>
          浮动元素2
        </div>
        <div style={{ clear: 'both' }}></div>
      </div>
    </div>
  );
} 