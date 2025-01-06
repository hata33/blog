import React from 'react';

export default function FlexDemo() {
  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '20px 0' }}>
      <div style={{ 
        display: 'flex',
        gap: '10px',
        marginBottom: '10px'
      }}>
        <div style={{ flex: 1, padding: '10px', background: '#f0f0f0' }}>Flex: 1</div>
        <div style={{ flex: 2, padding: '10px', background: '#f0f0f0' }}>Flex: 2</div>
        <div style={{ flex: 1, padding: '10px', background: '#f0f0f0' }}>Flex: 1</div>
      </div>

      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px'
      }}>
        <div style={{ padding: '10px', background: '#f0f0f0' }}>Space</div>
        <div style={{ padding: '10px', background: '#f0f0f0' }}>Between</div>
        <div style={{ padding: '10px', background: '#f0f0f0' }}>Items</div>
      </div>
    </div>
  );
} 