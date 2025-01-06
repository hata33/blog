import React from 'react';

export default function BFCDemo() {
  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '20px 0' }}>
      <div style={{ overflow: 'hidden' }}> {/* 创建BFC */}
        <div style={{ float: 'left', width: '100px', height: '100px', background: '#f00' }}>
          浮动元素
        </div>
        <div style={{ marginLeft: '20px' }}>
          这是一段文本内容,演示BFC可以阻止文字环绕浮动元素。
        </div>
      </div>
    </div>
  );
} 