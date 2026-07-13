const fs = require('fs');
const path = require('path');

// Subject orders and names (same as sidebar script)
const subjectOrders = {
  'preschool/xiaoban': ['language', 'math', 'science', 'art', 'health', 'society'],
  'preschool/zhongban': ['language', 'math', 'science', 'art', 'health', 'society'],
  'preschool/daban': ['language', 'math', 'science', 'art', 'health', 'society'],
  'primary/grade1': ['chinese', 'math', 'english', 'science', 'morality', 'music', 'art', 'pe'],
  'primary/grade2': ['chinese', 'math', 'english', 'science', 'morality', 'music', 'art', 'pe'],
  'primary/grade3': ['chinese', 'math', 'english', 'science', 'morality', 'music', 'art', 'pe', 'it'],
  'primary/grade4': ['chinese', 'math', 'english', 'science', 'morality', 'music', 'art', 'pe', 'it'],
  'primary/grade5': ['chinese', 'math', 'english', 'science', 'morality', 'music', 'art', 'pe', 'it'],
  'primary/grade6': ['chinese', 'math', 'english', 'science', 'morality', 'music', 'art', 'pe', 'it'],
  'junior/grade7': ['chinese', 'math', 'english', 'biology', 'history', 'geography', 'morality', 'music', 'art', 'pe'],
  'junior/grade8': ['chinese', 'math', 'english', 'physics', 'biology', 'history', 'geography', 'morality', 'music', 'art', 'pe'],
  'junior/grade9': ['chinese', 'math', 'english', 'physics', 'chemistry', 'history', 'morality', 'music', 'art', 'pe'],
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

const gradeNames = {
  'xiaoban': '小班', 'zhongban': '中班', 'daban': '大班',
  'grade1': '一年级', 'grade2': '二年级', 'grade3': '三年级',
  'grade4': '四年级', 'grade5': '五年级', 'grade6': '六年级',
  'grade7': '初一', 'grade8': '初二', 'grade9': '初三',
  'grade10': '高一', 'grade11': '高二', 'grade12': '高三',
};

const gradeDescs = {
  'xiaoban': '小班是幼儿园的起点，重点在于培养生活自理能力、语言表达兴趣和初步的认知探索。',
  'zhongban': '中班是承上启下的关键阶段，重点在于发展语言表达、初步数学思维和社交能力。',
  'daban': '大班是幼小衔接的关键阶段，重点在于培养良好的学习习惯、基础认知能力和独立生活能力。',
  'grade1': '一年级是小学的起点，重点在于建立数的概念和培养基本的计算能力。',
  'grade2': '二年级在一年级基础上拓展知识面，乘法口诀是本阶段数学核心。',
  'grade3': '三年级是小学的关键转折点，作文起步、英语书写、分数初步，学习内容显著增加。',
  'grade4': '四年级学习内容进一步深化，阅读策略、大数运算和电路知识是本阶段重点。',
  'grade5': '五年级学习深度明显提升，说明文写作、小数分数运算、方程式是本阶段重点。',
  'grade6': '六年级是小学的收官阶段，综合阅读写作、分数百分数、简单机械是本阶段重点。',
  'grade7': '初中是知识体系大幅扩展的阶段，新增历史、地理、生物等学科，数学从算术转向代数。',
  'grade8': '初二是分化期，新增物理学科，几何证明和函数是数学核心，历史学习近现代史。',
  'grade9': '初三是中考冲刺阶段，新增化学学科，二次函数和圆是数学核心，物理学习电学基础。',
  'grade10': '高中是知识体系深度和广度大幅提升的阶段，数学从具体走向抽象，物理化学开始系统学习。',
  'grade11': '高二知识深度进一步增加，数学学习数列和导数，物理学万有引力和机械能，哲学入门。',
  'grade12': '高三是高考复习冲刺阶段，全面复习各学科知识，强化综合运用能力和应试技巧。',
};

const docsDir = path.join(__dirname, '..', 'docs');

function getKpFiles(subjectDir) {
  if (!fs.existsSync(subjectDir)) return [];
  return fs.readdirSync(subjectDir)
    .filter(f => f.endsWith('.md') && f !== '知识结构.md')
    .map(f => f.replace('.md', ''));
}

function getKpDesc(kpName) {
  return '掌握核心概念和基本方法';
}

function buildIndex(gradePath, gradeKey, subjects) {
  const [stage] = gradePath.split('/');
  const gradeName = gradeNames[gradeKey];
  const desc = gradeDescs[gradeKey];

  let md = `# ${gradeName}\n\n${desc}\n`;

  for (const subjectKey of subjects) {
    const subjectName = subjectNames[subjectKey];
    const subjectDir = path.join(docsDir, stage, gradeKey, subjectKey);
    const kps = getKpFiles(subjectDir);

    if (kps.length === 0) continue;

    md += `\n## ${subjectName}课程\n\n`;
    md += '| 知识点 | 说明 |\n';
    md += '|--------|------|\n';
    for (const kp of kps) {
      md += `| [${kp}](./${subjectKey}/${kp}) | ${getKpDesc(kp)} |\n`;
    }
    md += `\n> 查看完整的 [${subjectName}知识结构](./${subjectKey}/知识结构)\n`;
  }

  return md;
}

// Generate all index files
for (const [gradePath, subjects] of Object.entries(subjectOrders)) {
  const [stage, gradeKey] = gradePath.split('/');
  const indexPath = path.join(docsDir, stage, gradeKey, 'index.md');
  const content = buildIndex(gradePath, gradeKey, subjects);
  fs.writeFileSync(indexPath, content, 'utf-8');
  console.log(`Updated: ${indexPath}`);
}

console.log('All grade index.md files updated!');