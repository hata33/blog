import React, { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

// 初始化 Mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
});

export default function MermaidWrapper(props) {
  const [svg, setSvg] = useState(null);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    async function renderMermaid() {
      try {
        // Docusaurus 传递的 props 可能包含 value 或 children
        const code = props.value || props.children || '';

        console.log('Mermaid props:', props);
        console.log('Mermaid code:', code);

        if (!code || typeof code !== 'string') {
          console.warn('Mermaid: 无效的代码', props);
          return;
        }

        const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`;
        console.log('Mermaid id:', id);

        const { svg: renderedSvg } = await mermaid.render(id, code);

        console.log('Mermaid rendered successfully, SVG length:', renderedSvg?.length);

        // 直接使用渲染的 SVG，不做任何修改
        setSvg(renderedSvg);
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        setError(err.message || err.toString());
      }
    }

    renderMermaid();
  }, [props.value, props.children]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.mozRequestFullScreen) {
        containerRef.current.mozRequestFullScreen();
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // 监听全屏变化事件
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  if (error) {
    return (
      <div style={{
        border: '1px solid var(--ifm-color-danger)',
        borderRadius: '8px',
        margin: '1.5rem 0',
        padding: '1rem',
        background: 'var(--ifm-color-danger-contrast-background)',
        color: 'var(--ifm-color-danger)',
      }}>
        <p>Mermaid 渲染错误：</p>
        <pre>{error}</pre>
        <details style={{ marginTop: '1rem' }}>
          <summary>原始代码</summary>
          <pre style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
            {JSON.stringify(props, null, 2)}
          </pre>
        </details>
      </div>
    );
  }

  if (!svg) {
    return (
      <div style={{
        border: '1px solid var(--ifm-color-emphasis-300)',
        borderRadius: '8px',
        margin: '1.5rem 0',
        padding: '2rem',
        textAlign: 'center',
        color: 'var(--ifm-color-emphasis-500)',
      }}>
        加载中...
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{
      border: isFullscreen ? 'none' : '1px solid var(--ifm-color-emphasis-300)',
      borderRadius: isFullscreen ? '0' : '8px',
      margin: isFullscreen ? '0' : '1.5rem 0',
      background: isFullscreen ? '#ffffff' : 'var(--ifm-background-color-secondary)',
      position: 'relative',
      overflow: 'hidden',
      minHeight: isFullscreen ? '100vh' : '400px',
      height: isFullscreen ? '100vh' : 'auto'
    }}>
      <style>{`
        .mermaid-controls:hover {
          opacity: 1 !important;
        }
        .mermaid-svg-container svg {
          max-width: 100% !important;
          height: auto !important;
        }
      `}</style>
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={5}
        centerOnInit={true}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            {/* 右上角悬浮工具栏 */}
            <div style={{
              position: 'absolute',
              right: '8px',
              top: '8px',
              zIndex: 10,
              display: 'flex',
              gap: '4px',
              opacity: 0.6
            }} className="mermaid-controls">
              <button onClick={(e) => { e.stopPropagation(); zoomIn(); }} className="button button--secondary button--sm" style={{ padding: '4px 8px' }} title="放大">＋</button>
              <button onClick={(e) => { e.stopPropagation(); zoomOut(); }} className="button button--secondary button--sm" style={{ padding: '4px 8px' }} title="缩小">－</button>
              <button onClick={(e) => { e.stopPropagation(); resetTransform(); }} className="button button--secondary button--sm" style={{ padding: '4px 8px' }} title="重置">⟲</button>
              <button onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }} className="button button--secondary button--sm" style={{ padding: '4px 8px' }} title={isFullscreen ? "退出全屏" : "全屏"}>{isFullscreen ? '⛶' : '⛶'}</button>
            </div>

            {/* 渲染区域 */}
            <TransformComponent
              wrapperStyle={{
                width: "100%",
                height: isFullscreen ? '100vh' : '100%',
                cursor: 'move',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isFullscreen ? '#ffffff' : 'transparent'
              }}
              contentStyle={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%'
              }}
            >
              <div
                dangerouslySetInnerHTML={{ __html: svg }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  minHeight: '400px'
                }}
                className="mermaid-svg-container"
              />
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}

