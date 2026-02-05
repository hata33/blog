/**
 * Remark 插件：自动为 00-AI 目录下的文件添加 noMDX: true frontmatter
 * 这样该目录下的文件将使用普通 Markdown 解析，而不是 MDX
 */

module.exports = function attacher() {
  return function transformer(_tree: any, file: any) {
    // 检查文件路径是否包含 00-AI
    if (file.path && file.path.includes('00-AI')) {
      // 设置 noMDX 标志
      file.data = file.data || {};
      file.data.frontmatter = file.data.frontmatter || {};
      file.data.frontmatter.noMDX = true;
    }
  };
};
