import React from 'react';

export default function TypewriterDemo() {
  return (
    <div style={{ margin: '20px 0' }}>
      <div className="typewriter">
        这是一个打字机效果的演示文本
      </div>
      <style>{`
        .typewriter {
          overflow: hidden;
          border-right: .15em solid black;
          white-space: nowrap;
          margin: 0 auto;
          letter-spacing: .15em;
          animation: 
            typing 3.5s steps(40, end),
            blink-caret .75s step-end infinite;
        }

        @keyframes typing {
          from { width: 0 }
          to { width: 100% }
        }

        @keyframes blink-caret {
          from, to { border-color: transparent }
          50% { border-color: black; }
        }
      `}</style>
    </div>
  );
} 