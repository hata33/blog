/**
 * Remark 插件：不再自动禁用 MDX
 * 因为禁用 MDX 会导致 Mermaid 图表无法渲染
 * 如果需要使用特殊字符（如 < >），请使用 HTML 实体或正确的 JSX 语法
 */

module.exports = function attacher() {
  return function transformer(_tree: any, file: any) {
    // 插件已禁用，保留空实现
    // 00-AI 目录下的文件现在支持 MDX 和 Mermaid
    // 如果遇到 < > 等特殊字符，请使用 &lt; &gt; 或 <br/> 等 JSX 兼容语法
  };
};
