const fs = require('fs');
const path = require('path');

// Subject ordering for each grade
const subjectOrders = {
  // Kindergarten
  'preschool/xiaoban': ['language', 'math', 'science', 'art', 'health', 'society'],
  'preschool/zhongban': ['language', 'math', 'science', 'art', 'health', 'society'],
  'preschool/daban': ['language', 'math', 'science', 'art', 'health', 'society'],
  // Primary 1-2
  'primary/grade1': ['chinese', 'math', 'english', 'science', 'morality', 'music', 'art', 'pe'],
  'primary/grade2': ['chinese', 'math', 'english', 'science', 'morality', 'music', 'art', 'pe'],
  // Primary 3-6
  'primary/grade3': ['chinese', 'math', 'english', 'science', 'morality', 'music', 'art', 'pe', 'it'],
  'primary/grade4': ['chinese', 'math', 'english', 'science', 'morality', 'music', 'art', 'pe', 'it'],
  'primary/grade5': ['chinese', 'math', 'english', 'science', 'morality', 'music', 'art', 'pe', 'it'],
  'primary/grade6': ['chinese', 'math', 'english', 'science', 'morality', 'music', 'art', 'pe', 'it'],
  // Junior 7
  'junior/grade7': ['chinese', 'math', 'english', 'biology', 'history', 'geography', 'morality', 'music', 'art', 'pe'],
  // Junior 8
  'junior/grade8': ['chinese', 'math', 'english', 'physics', 'biology', 'history', 'geography', 'morality', 'music', 'art', 'pe'],
  // Junior 9
  'junior/grade9': ['chinese', 'math', 'english', 'physics', 'chemistry', 'history', 'morality', 'music', 'art', 'pe'],
  // Senior 10-12
  'senior/grade10': ['chinese', 'math', 'english', 'physics', 'chemistry', 'biology', 'history', 'geography', 'politics', 'it', 'music', 'art', 'pe'],
  'senior/grade11': ['chinese', 'math', 'english', 'physics', 'chemistry', 'biology', 'history', 'geography', 'politics', 'it', 'music', 'art', 'pe'],
  'senior/grade12': ['chinese', 'math', 'english', 'physics', 'chemistry', 'biology', 'history', 'geography', 'politics', 'it', 'music', 'art', 'pe'],
};

const subjectNames = {
  'language': '语言', 'math': '数学', 'chinese': '语文', 'english': '英语',
  'science': '科学', 'morality': '道德与法治', 'music': '音乐', 'art': '美术',
  'pe': '体育', 'it': '信息技术', 'physics': '物理', 'chemistry': '化学',
  'biology': '生物', 'history': '历史', 'geography': '地理',
  'politics': '政治', 'society': '社会', 'health': '健康',
};

const docsDir = path.join(__dirname, '..', 'docs');

function buildSidebar() {
  const lines = ['export const sidebar = {'];

  for (const [gradePath, subjects] of Object.entries(subjectOrders)) {
    const [stage, gradeKey] = gradePath.split('/');
    const gradeDir = path.join(docsDir, stage, gradeKey);
    const sidebarKey = `/${stage}/${gradeKey}/`;

    lines.push(`  '${sidebarKey}': [`);

    for (const subjectKey of subjects) {
      const subjectDir = path.join(gradeDir, subjectKey);
      const subjectName = subjectNames[subjectKey] || subjectKey;

      if (!fs.existsSync(subjectDir)) {
        // Math already exists, skip it
        if (subjectKey === 'math' && fs.existsSync(path.join(gradeDir, 'math', '知识结构.md'))) {
          // get existing math KPs
          const mathDir = path.join(gradeDir, 'math');
          const files = fs.readdirSync(mathDir).filter(f => f.endsWith('.md') && f !== '知识结构.md');
          lines.push('    {');
          lines.push(`      text: '${subjectName}',`);
          lines.push('      collapsed: true,');
          lines.push('      items: [');
          lines.push(`        { text: '知识结构', link: '${sidebarKey}math/知识结构' },`);
          for (const f of files) {
            const name = f.replace('.md', '');
            lines.push(`        { text: '${name}', link: '${sidebarKey}math/${name}' },`);
          }
          lines.push('      ]');
          lines.push('    },');
        }
        continue;
      }

      const files = fs.readdirSync(subjectDir).filter(f => f.endsWith('.md') && f !== '知识结构.md');

      lines.push('    {');
      lines.push(`      text: '${subjectName}',`);
      lines.push('      collapsed: true,');
      lines.push('      items: [');
      lines.push(`        { text: '知识结构', link: '${sidebarKey}${subjectKey}/知识结构' },`);
      for (const f of files) {
        const name = f.replace('.md', '');
        lines.push(`        { text: '${name}', link: '${sidebarKey}${subjectKey}/${name}' },`);
      }
      lines.push('      ]');
      lines.push('    },');
    }

    lines.push('  ],');
  }

  lines.push('};');
  return lines.join('\n');
}

const output = buildSidebar();
const outPath = path.join(__dirname, '..', '.vitepress', 'sidebar.mjs');
fs.writeFileSync(outPath, output, 'utf-8');
console.log(`Sidebar config written to ${outPath}`);
console.log(`Content length: ${output.length} chars`);