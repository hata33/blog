import React from 'react';

export default function CenterDemo() {
  return (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      {/* Flex方式 */}
      <div style={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '200px',
        height: '200px',
        border: '1px solid #ccc'
      }}>
        <div style={{ padding: '20px', background: '#f0f0f0' }}>
          Flex居中
        </div>
      </div>

      {/* Position方式 */}
      <div style={{ 
        position: 'relative',
        width: '200px',
        height: '200px',
        border: '1px solid #ccc'
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: '20px',
          background: '#f0f0f0'
        }}>
          Position居中
        </div>
      </div>
    </div>
  );
} 