const fs = require('fs');
const path = require('path');
const glob = require('glob'); // 需要安装：npm install glob

// 要忽略的目录
const IGNORED_DIRS = ['node_modules', '.next', 'out', 'public'];
// 目标文件扩展名
const TARGET_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx'];

// 查找不同类型的console调用的正则表达式
const CONSOLE_REGEX = /console\.(log|info|warn|error)\(\s*(["'`])(.*?)\2\s*(,\s*.*?)?\)/g;

// 替换函数
function replaceConsoleWithLogger(content) {
  return content.replace(CONSOLE_REGEX, (match, method, quote, message, args) => {
    const loggerMethod = method === 'log' ? 'debug' : method;
    const logArguments = args ? `, ${args.slice(1)}` : '';
    return `logger.${loggerMethod}(${quote}${message}${quote}${logArguments})`;
  });
}

// 在文件开头添加logger导入
function addLoggerImport(content, filePath) {
  // 如果已经导入了logger，则不再添加
  if (content.includes('import logger') || content.includes('require') && content.includes('logger')) {
    return content;
  }
  
  // 获取到utils/logger的相对路径
  const relativePath = path.relative(path.dirname(filePath), path.join('frontend', 'utils')).replace(/\\/g, '/');
  const importPath = relativePath.startsWith('.') ? `${relativePath}/logger` : `../${relativePath}/logger`;
  
  // 判断是否是TypeScript文件
  const isTS = filePath.endsWith('.ts') || filePath.endsWith('.tsx');
  
  if (isTS) {
    return `import logger from '${importPath}';\n\n${content}`;
  } else {
    return `const logger = require('${importPath}').default;\n\n${content}`;
  }
}

// 处理单个文件
function processFile(filePath) {
  try {
    console.log(`Processing: ${filePath}`);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 检查文件中是否有console调用
    if (CONSOLE_REGEX.test(content)) {
      // 重置正则表达式的lastIndex
      CONSOLE_REGEX.lastIndex = 0;
      
      // 替换控制台调用
      const newContent = replaceConsoleWithLogger(content);
      
      // 添加logger导入
      const finalContent = addLoggerImport(newContent, filePath);
      
      // 写回文件
      fs.writeFileSync(filePath, finalContent, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

// 主函数
function main() {
  const frontendDir = path.resolve(__dirname, '..');
  
  // 使用glob获取所有目标文件
  const ignorePattern = IGNORED_DIRS.map(dir => `**/${dir}/**`).join('|');
  const pattern = `${frontendDir}/**/*+(${TARGET_EXTENSIONS.join('|')})`;
  
  glob(pattern, { ignore: ignorePattern }, (err, files) => {
    if (err) {
      console.error('Error finding files:', err);
      return;
    }
    
    console.log(`Found ${files.length} files to process`);
    files.forEach(processFile);
    console.log('Replacement complete!');
  });
}

main(); 