/**
 * @file convert-exports.js
 * @description 将默认导出转换为命名导出并生成索引文件的工具脚本
 * 
 * ====================================
 * 使用手册
 * ====================================
 * 
 * ## 概述
 * 
 * 这个脚本用于将 TypeScript/JavaScript 文件中的默认导出转换为命名导出，
 * 并可以为指定目录生成索引文件，以便于集中导入组件。
 * 
 * ## 安装依赖
 * 
 * 在运行脚本前，请确保已安装必要的依赖：
 * 
 * ```
 * npm install glob
 * ```
 * 
 * ## 配置选项
 * 
 * 脚本顶部的 `config` 对象包含以下可配置选项：
 * 
 * - `rootDir`: 要搜索的根目录，默认为 './frontend'
 * - `includeDirs`: 要搜索的具体目录（相对于rootDir）
 * - `excludePatterns`: 要排除的目录和文件模式
 * - `createBackups`: 是否创建备份文件，默认为 true
 * - `showPreview`: 是否在转换前显示预览，默认为 true
 * - `writeFiles`: 是否实际写入文件（设为 false 可以进行干运行），默认为 true
 * - `generateIndexFiles`: 是否生成索引文件，默认为 true
 * - `indexDirectories`: 要为哪些目录生成索引文件，默认包括 'components', 'hooks', 'utils', 'lib', 'contexts'
 * - `backupDir`: 备份文件目录（相对于当前工作目录）
 * - `useTypeScriptCheck`: 是否使用 TypeScript 类型检查
 * - `tsConfigPath`: TypeScript 配置文件路径
 * 
 * ## 运行脚本
 * 
 * ```
 * node scripts/convert-exports.js
 * ```
 * 
 * ## 功能说明
 * 
 * 1. 转换默认导出为命名导出
 *    - 将 `export default ComponentName` 转换为 `export const ComponentName`
 *    - 将 `const ComponentName = ...; export default ComponentName` 转换为 `export const ComponentName = ...`
 * 
 * 2. 更新导入语句
 *    - 将 `import Button from './Button'` 转换为 `import { Button } from './Button'`
 *    - 将 `import MyButton from './Button'` 转换为 `import { Button as MyButton } from './Button'`
 * 
 * 3. 生成索引文件
 *    - 为指定目录生成 index.ts 文件，集中导出该目录下的所有组件
 *    - 例如：`export { Button } from './Button'; export { Card } from './Card';`
 * 
 * ## 安全措施
 * 
 * - 在修改文件前会创建备份文件（.bak 扩展名）
 * - 可以通过设置 `writeFiles: false` 进行干运行，查看将要进行的更改而不实际修改文件
 * - 在执行转换前会显示预览并等待确认
 * 
 * ## 注意事项
 * 
 * - 脚本可能无法处理所有复杂的导出情况，对于这些情况会发出警告
 * - 建议在运行脚本前提交或备份代码
 * - 如果遇到问题，可以使用备份文件恢复
 * 
 * ## 示例
 * 
 * 默认导出转换示例：
 * 
 * 转换前：
 * ```typescript
 * const Button = ({ children }) => <button>{children}</button>;
 * export default Button;
 * ```
 * 
 * 转换后：
 * ```typescript
 * export const Button = ({ children }) => <button>{children}</button>;
 * ```
 * 
 * 导入语句转换示例：
 * 
 * 转换前：
 * ```typescript
 * import Button from './Button';
 * ```
 * 
 * 转换后：
 * ```typescript
 * import { Button } from './Button';
 * ```
 * 
 * 索引文件示例：
 * ```typescript
 * // 此文件由转换脚本自动生成
 * // 集中导出目录中的所有组件
 * 
 * export { Button } from './Button';
 * export { Card } from './Card';
 * export { Input } from './Input';
 * ```
 */
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const { execSync } = require('child_process');
const ts = require('typescript');

// 配置选项
const config = {
  // 要搜索的根目录
  rootDir: '..', // 从scripts目录向上一级到frontend目录
  
  // 要搜索的具体目录（相对于rootDir）
  includeDirs: [
    'components',
    'hooks',
    'utils',
    'lib',
    'contexts',
    'pages'
  ],
  
  // 要排除的目录和文件模式
  excludePatterns: [
    '**/node_modules/**',
    '**/.next/**',
    '**/dist/**',
    '**/build/**',
    '**/.cache/**',
    '**/public/**',
    '**/index.ts',
    '**/index.tsx',
    '**/*.d.ts',
    '**/*.test.ts',
    '**/*.test.tsx',
    '**/*.spec.ts',
    '**/*.spec.tsx',
    '**/*.min.js',
    '**/*.bundle.js'
  ],
  
  // 备份文件目录（相对于当前工作目录）
  backupDir: '../backups/frontend',
  
  // 是否创建备份文件
  createBackups: true,
  
  // 是否在转换前显示预览
  showPreview: true,
  
  // 是否实际写入文件（设为false可以进行干运行）
  writeFiles: true,
  
  // 是否生成索引文件
  generateIndexFiles: true,
  
  // 要为哪些目录生成索引文件
  indexDirectories: [
    'components',
    'hooks',
    'utils',
    'lib',
    'contexts'
  ],
  
  // 是否使用 TypeScript 类型检查
  useTypeScriptCheck: true,
  
  // TypeScript 配置文件路径
  tsConfigPath: '../tsconfig.json'
};

// 查找所有 .ts 和 .tsx 文件
const findTsFiles = () => {
  console.log(`当前工作目录: ${process.cwd()}`);
  const absoluteRootDir = path.resolve(config.rootDir);
  console.log(`搜索目录(绝对路径): ${absoluteRootDir}`);
  
  // 检查目录是否存在
  if (!fs.existsSync(absoluteRootDir)) {
    console.error(`错误: 目录 ${absoluteRootDir} 不存在!`);
    return [];
  }
  
  // 只搜索指定的目录
  const files = [];
  
  for (const dir of config.includeDirs) {
    const dirPath = path.join(config.rootDir, dir);
    console.log(`检查目录: ${dirPath}`);
    
    if (fs.existsSync(dirPath)) {
      const pattern = path.join(dirPath, '**/*.{ts,tsx}');
      console.log(`搜索模式: ${pattern}`);
      
      try {
        const dirFiles = glob.sync(pattern, { 
          ignore: config.excludePatterns,
          follow: false // 不跟踪符号链接
        });
        
        // 额外过滤，确保不包含node_modules
        const filteredFiles = dirFiles.filter(file => !file.includes('node_modules'));
        
        if (dirFiles.length !== filteredFiles.length) {
          console.log(`警告: 在 ${dir} 目录中找到了 ${dirFiles.length - filteredFiles.length} 个node_modules文件，已过滤`);
          dirFiles.forEach(file => {
            if (file.includes('node_modules')) {
              console.log(`  - 已过滤: ${file}`);
            }
          });
        }
        
        console.log(`在 ${dir} 目录中找到 ${filteredFiles.length} 个文件`);
        files.push(...filteredFiles);
      } catch (error) {
        console.error(`搜索目录 ${dirPath} 时出错:`, error.message);
      }
    } else {
      console.log(`目录不存在: ${dirPath}`);
    }
  }
  
  console.log(`总共找到 ${files.length} 个文件`);
  
  return files;
};

// 检查文件是否包含默认导出
const hasDefaultExport = (content) => {
  return /export\s+default\s+/.test(content);
};

// 获取默认导出的组件名
const getDefaultExportName = (content, filePath) => {
  // 尝试从 "export default ComponentName" 或 "const ComponentName = ..." 中提取名称
  const exportMatch = content.match(/export\s+default\s+([A-Za-z0-9_]+)/);
  if (exportMatch && exportMatch[1]) {
    return exportMatch[1];
  }

  // 尝试从 "const ComponentName = () => {" 中提取名称
  const constMatch = content.match(/const\s+([A-Za-z0-9_]+)\s*=\s*(?:\(|function)/);
  if (constMatch && constMatch[1]) {
    return constMatch[1];
  }

  // 如果无法提取，使用文件名作为组件名
  const fileName = path.basename(filePath, path.extname(filePath));
  return fileName.charAt(0).toUpperCase() + fileName.slice(1); // 确保首字母大写
};

// 检查文件是否是API路由
const isApiRoute = (filePath) => {
  return filePath.includes('/pages/api/') || filePath.includes('\\pages\\api\\');
};

// 转换默认导出为命名导出
const convertToNamedExport = (content, componentName, filePath) => {
  // 检查是否是API路由
  const isApiFile = isApiRoute(filePath);
  
  // 如果是API路由，使用特殊处理
  if (isApiFile) {
    // 检查是否已经有命名导出的handler函数
    if (content.includes('export async function handler') || content.includes('export function handler')) {
      // 已经有命名导出的handler，只需要确保默认导出指向它
      if (!content.includes('export default handler')) {
        // 替换默认导出为指向handler的导出
        content = content.replace(/export\s+default\s+async\s+function\s+\w+/, 'export async function handler');
        content = content.replace(/export\s+default\s+function\s+\w+/, 'export function handler');
        
        // 添加默认导出指向handler
        if (!content.includes('export default handler')) {
          content += '\n\n// Next.js API路由需要默认导出\nexport default handler;\n';
        }
      }
      return content;
    }
    
    // 没有命名导出的handler，需要转换默认导出函数为命名导出
    if (content.includes('export default async function')) {
      // 替换 "export default async function handler" 为 "export async function handler"
      content = content.replace(/export\s+default\s+async\s+function(\s+\w+)?/, 'export async function handler');
      
      // 添加默认导出指向handler
      if (!content.includes('export default handler')) {
        content += '\n\n// Next.js API路由需要默认导出\nexport default handler;\n';
      }
    } else if (content.includes('export default function')) {
      // 替换 "export default function handler" 为 "export function handler"
      content = content.replace(/export\s+default\s+function(\s+\w+)?/, 'export function handler');
      
      // 添加默认导出指向handler
      if (!content.includes('export default handler')) {
        content += '\n\n// Next.js API路由需要默认导出\nexport default handler;\n';
      }
    } else {
      // 其他情况，可能是变量形式的默认导出
      const match = content.match(/const\s+(\w+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>/);
      if (match) {
        const funcName = match[1];
        
        // 替换 "const handler = async (req, res) => {" 为 "export async function handler(req, res) {"
        content = content.replace(
          new RegExp(`const\\s+${funcName}\\s*=\\s*(async\\s*)?\\(([^)]*)\\)\\s*=>\\s*\\{`), 
          `export $1function handler($2) {`
        );
        
        // 删除 "export default handler;"
        content = content.replace(/export\s+default\s+\w+\s*;?/, '');
        
        // 添加默认导出指向handler
        content += '\n\n// Next.js API路由需要默认导出\nexport default handler;\n';
      }
    }
    
    return content;
  }
  
  // 非API路由的正常处理逻辑
  // 检查是否有 "export default ComponentName;" 语句
  if (content.includes(`export default ${componentName};`)) {
    // 替换 "const ComponentName = ..." 为 "export const ComponentName = ..."
    content = content.replace(
      new RegExp(`const\\s+${componentName}\\s*=`), 
      `export const ${componentName} =`
    );
    
    // 删除 "export default ComponentName;"
    content = content.replace(
      new RegExp(`export\\s+default\\s+${componentName}\\s*;?`), 
      ''
    );
  } else {
    // 替换 "export default function ComponentName" 或 "export default class ComponentName"
    content = content.replace(
      new RegExp(`export\\s+default\\s+(function|class|interface|type)\\s+${componentName}`),
      `export $1 ${componentName}`
    );
    
    // 替换 "export default ComponentName" (没有分号的情况)
    content = content.replace(
      new RegExp(`export\\s+default\\s+${componentName}\\b`),
      `export const ${componentName}`
    );
  }
  
  return content;
};

// 更新导入语句
const updateImports = (content, componentName, filePath) => {
  const fileBaseName = path.basename(filePath, path.extname(filePath));
  
  // 创建一个正则表达式来匹配导入语句
  // 这个正则表达式会匹配各种导入路径格式，包括相对路径和别名路径
  const importRegex = new RegExp(
    `import\\s+([A-Za-z0-9_]+)\\s+from\\s+(['"])([^'"]*?(?:${fileBaseName}|${path.basename(filePath)}))\\2`,
    'g'
  );
  
  // 替换为命名导入
  return content.replace(importRegex, (match, importName, quote, importPath) => {
    // 如果导入名与组件名相同，使用命名导入
    if (importName === componentName) {
      return `import { ${componentName} } from ${quote}${importPath}${quote}`;
    }
    // 如果导入名与组件名不同，使用命名导入并重命名
    return `import { ${componentName} as ${importName} } from ${quote}${importPath}${quote}`;
  });
};

// 创建备份文件
const createBackup = (filePath) => {
  if (!config.createBackups) return;
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 计算备份文件路径，保持相同的目录结构
    const relativePath = path.relative(path.resolve(config.rootDir), filePath);
    const backupPath = path.join(process.cwd(), config.backupDir, relativePath);
    
    // 确保备份目录存在
    const backupDir = path.dirname(backupPath);
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    // 写入备份文件
    fs.writeFileSync(backupPath, content, 'utf8');
    console.log(`已创建备份: ${backupPath}`);
  } catch (error) {
    console.error(`创建备份失败 ${filePath}:`, error.message);
  }
};

// 从文件内容中提取导出的组件名称
const extractExportedNames = (content, filePath) => {
  const names = [];
  
  // 检查是否是API路由
  const isApiFile = filePath.includes('/pages/api/') || filePath.includes('\\pages\\api\\');
  
  if (isApiFile) {
    // API路由通常导出handler函数
    names.push('handler');
    return names;
  }
  
  // 获取文件名（不带扩展名）
  const fileName = path.basename(filePath, path.extname(filePath));
  
  // 首先尝试从文件名推断组件名称
  // 确保首字母大写（组件命名约定）
  const componentName = fileName.charAt(0).toUpperCase() + fileName.slice(1);
  
  // 检查文件内容中是否有这个组件名的导出
  const hasNamedExport = new RegExp(`export\\s+(const|function|class|interface|type|enum)\\s+${componentName}\\b`).test(content);
  const hasDefaultExport = new RegExp(`export\\s+default\\s+(const|function|class|${componentName})`).test(content);
  
  if (hasNamedExport || hasDefaultExport) {
    names.push(componentName);
    return names;
  }
  
  // 如果没有找到基于文件名的导出，尝试解析实际的导出
  
  // 匹配命名导出: export const ComponentName
  const constExports = Array.from(content.matchAll(/export\s+const\s+([A-Za-z0-9_]+)/g));
  for (const match of constExports) {
    if (match[1] && !names.includes(match[1]) && match[1] !== 'function') {
      names.push(match[1]);
    }
  }
  
  // 匹配函数导出: export function ComponentName
  const funcExports = Array.from(content.matchAll(/export\s+function\s+([A-Za-z0-9_]+)/g));
  for (const match of funcExports) {
    if (match[1] && !names.includes(match[1]) && match[1] !== 'function') {
      names.push(match[1]);
    }
  }
  
  // 匹配类导出: export class ComponentName
  const classExports = Array.from(content.matchAll(/export\s+class\s+([A-Za-z0-9_]+)/g));
  for (const match of classExports) {
    if (match[1] && !names.includes(match[1]) && match[1] !== 'function') {
      names.push(match[1]);
    }
  }
  
  // 匹配类型导出: export type ComponentName 或 export interface ComponentName
  const typeExports = Array.from(content.matchAll(/export\s+(type|interface|enum)\s+([A-Za-z0-9_]+)/g));
  for (const match of typeExports) {
    if (match[2] && !names.includes(match[2]) && match[2] !== 'function') {
      names.push(match[2]);
    }
  }
  
  // 如果仍然没有找到任何导出，使用文件名作为组件名
  if (names.length === 0) {
    names.push(componentName);
  }
  
  return names;
};

// 生成索引文件
const generateIndexFiles = (files, filesToConvert) => {
  if (!config.generateIndexFiles) return;
  
  console.log('\n开始生成索引文件...');
  
  // 按目录分组文件
  const filesByDir = {};
  const exportsByFile = {};
  
  // 收集已转换文件的导出名称
  filesToConvert.forEach(({ file, componentName }) => {
    const dir = path.dirname(file);
    
    if (!filesByDir[dir]) {
      filesByDir[dir] = [];
    }
    
    if (!filesByDir[dir].includes(file)) {
      filesByDir[dir].push(file);
    }
    
    exportsByFile[file] = [componentName];
  });
  
  // 收集所有文件（包括未转换的）
  files.forEach(file => {
    const dir = path.dirname(file);
    
    if (!filesByDir[dir]) {
      filesByDir[dir] = [];
    }
    
    if (!filesByDir[dir].includes(file)) {
      filesByDir[dir].push(file);
    }
  });
  
  // 为每个目录生成索引文件
  let indexFilesCount = 0;
  
  Object.keys(filesByDir).forEach(dir => {
    // 检查是否应该为此目录生成索引文件
    const shouldGenerateIndex = config.indexDirectories.some(indexDir => {
      const fullIndexDir = path.join(config.rootDir, indexDir);
      return dir === fullIndexDir || dir.startsWith(fullIndexDir + path.sep);
    });
    
    if (!shouldGenerateIndex) return;
    
    const dirFiles = filesByDir[dir];
    const indexPath = path.join(dir, 'index.ts');
    
    // 收集目录中所有文件的导出
    const exports = [];
    
    dirFiles.forEach(file => {
      // 跳过索引文件本身
      if (file === indexPath) return;
      
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        // 提取文件中的导出名称
        let exportedNames;
        
        // 如果这个文件是我们转换的文件之一，使用已知的组件名
        if (exportsByFile[file]) {
          exportedNames = exportsByFile[file];
        } else {
          // 否则，从文件内容中提取导出名称
          exportedNames = extractExportedNames(content, file);
        }
        
        // 过滤掉可能导致问题的导出名称
        exportedNames = exportedNames.filter(name => 
          name !== 'function' && 
          name !== 'default' && 
          name !== 'interface' && 
          name !== 'type' && 
          name !== 'class'
        );
        
        if (exportedNames.length > 0) {
          const relativePath = './' + path.basename(file, path.extname(file));
          exports.push({ path: relativePath, exports: exportedNames });
        }
      } catch (error) {
        console.error(`读取文件 ${file} 时出错:`, error.message);
      }
    });
    
    if (exports.length > 0) {
      // 生成索引文件内容
      let indexContent = '// 此文件由转换脚本自动生成\n// 集中导出目录中的所有组件\n\n';
      
      exports.forEach(({ path, exports }) => {
        indexContent += `export { ${exports.join(', ')} } from '${path}';\n`;
      });
      
      // 写入索引文件
      if (config.writeFiles) {
        try {
          // 如果已存在索引文件，创建备份
          if (fs.existsSync(indexPath)) {
            createBackup(indexPath);
          }
          
          fs.writeFileSync(indexPath, indexContent, 'utf8');
          console.log(`已生成索引文件: ${indexPath}`);
          indexFilesCount++;
        } catch (error) {
          console.error(`写入索引文件 ${indexPath} 时出错:`, error.message);
        }
      } else {
        console.log(`将生成索引文件: ${indexPath} (干运行模式)`);
        indexFilesCount++;
      }
    }
  });
  
  console.log(`已生成 ${indexFilesCount} 个索引文件`);
};

// 使用 TypeScript 编译器 API 检查文件
const checkTypeScriptErrors = (filePaths) => {
  if (!config.useTypeScriptCheck) {
    return [];
  }
  
  console.log('正在使用 TypeScript 检查文件...');
  
  try {
    // 读取 tsconfig.json
    const tsConfigPath = path.resolve(process.cwd(), config.tsConfigPath);
    
    if (!fs.existsSync(tsConfigPath)) {
      console.error(`找不到 TypeScript 配置文件: ${tsConfigPath}`);
      return [];
    }
    
    // 解析 tsconfig.json
    const tsConfigFile = ts.readConfigFile(tsConfigPath, ts.sys.readFile);
    
    if (tsConfigFile.error) {
      console.error(`解析 TypeScript 配置文件时出错:`, tsConfigFile.error.messageText);
      return [];
    }
    
    const parsedConfig = ts.parseJsonConfigFileContent(
      tsConfigFile.config,
      ts.sys,
      path.dirname(tsConfigPath)
    );
    
    if (parsedConfig.errors && parsedConfig.errors.length > 0) {
      console.error(`解析 TypeScript 配置内容时出错:`, parsedConfig.errors[0].messageText);
      return [];
    }
    
    // 创建程序
    const program = ts.createProgram(filePaths, parsedConfig.options);
    
    // 获取诊断信息
    const diagnostics = [
      ...program.getSemanticDiagnostics(),
      ...program.getSyntacticDiagnostics()
    ];
    
    // 过滤并格式化诊断信息
    const errors = diagnostics
      .filter(diagnostic => diagnostic.category === ts.DiagnosticCategory.Error)
      .map(diagnostic => {
        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        let filePath = '';
        let line = 0;
        let character = 0;
        
        if (diagnostic.file) {
          filePath = diagnostic.file.fileName;
          const { line: lineNum, character: charNum } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
          line = lineNum + 1; // 行号从 1 开始
          character = charNum + 1; // 列号从 1 开始
        }
        
        return {
          filePath,
          line,
          character,
          message,
          code: diagnostic.code
        };
      });
    
    console.log(`TypeScript 检查完成，发现 ${errors.length} 个错误`);
    return errors;
  } catch (error) {
    console.error('TypeScript 检查时出错:', error.message);
    return [];
  }
};

// 使用 tsc 命令行工具检查文件（备选方法）
const checkTypeScriptErrorsWithTsc = () => {
  if (!config.useTypeScriptCheck) {
    return [];
  }
  
  console.log('正在使用 tsc 检查文件...');
  
  try {
    // 执行 tsc --noEmit 命令
    const result = execSync('npx tsc --noEmit', { 
      cwd: path.resolve(process.cwd(), '..'),
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    console.log('TypeScript 检查完成，没有发现错误');
    return [];
  } catch (error) {
    // tsc 命令返回非零退出码时会抛出错误
    // 解析错误输出
    const output = error.stdout || '';
    const errors = [];
    
    // 解析 tsc 输出中的错误信息
    // 格式通常是: file.ts(line,col): error TS1234: Error message
    const errorRegex = /([^(]+)\((\d+),(\d+)\):\s+error\s+TS(\d+):\s+(.+)/g;
    let match;
    
    while ((match = errorRegex.exec(output)) !== null) {
      const [, filePath, line, character, code, message] = match;
      
      errors.push({
        filePath: path.resolve(process.cwd(), '..', filePath),
        line: parseInt(line, 10),
        character: parseInt(character, 10),
        message,
        code: `TS${code}`
      });
    }
    
    console.log(`TypeScript 检查完成，发现 ${errors.length} 个错误`);
    return errors;
  }
};

// 主函数
const main = async () => {
  // 创建备份根目录
  if (config.createBackups) {
    const backupDirPath = path.join(process.cwd(), config.backupDir);
    if (!fs.existsSync(backupDirPath)) {
      try {
        fs.mkdirSync(backupDirPath, { recursive: true });
        console.log(`已创建备份目录: ${backupDirPath}`);
      } catch (error) {
        console.error(`创建备份目录失败:`, error.message);
        process.exit(1);
      }
    }
  }
  
  console.log('开始查找和转换默认导出...');
  
  // 查找所有 TypeScript 文件
  const files = findTsFiles();
  console.log(`找到 ${files.length} 个 TypeScript 文件`);
  
  // 存储需要转换的文件及其组件名
  const filesToConvert = [];
  
  // 查找包含默认导出的文件
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      if (hasDefaultExport(content)) {
        const componentName = getDefaultExportName(content, file);
        filesToConvert.push({ file, componentName, content });
        console.log(`找到默认导出: ${file} (${componentName})`);
      }
    } catch (error) {
      console.error(`读取文件 ${file} 时出错:`, error.message);
    }
  }
  
  console.log(`找到 ${filesToConvert.length} 个包含默认导出的文件`);
  
  // 如果启用了预览，显示将要转换的文件
  if (config.showPreview && filesToConvert.length > 0) {
    console.log('\n将要转换以下文件:');
    filesToConvert.forEach(({ file, componentName }) => {
      console.log(`- ${file} (${componentName})`);
    });
    
    // 提示用户确认
    if (config.writeFiles) {
      console.log('\n按 Ctrl+C 取消操作，或按 Enter 继续...');
      await new Promise(resolve => process.stdin.once('data', resolve));
    }
  }
  
  // 获取所有 TypeScript 文件
  const tsFiles = files.filter(file => file.endsWith('.ts') || file.endsWith('.tsx'));
  
  // 使用 TypeScript 检查文件
  let tsErrors = [];
  
  if (config.useTypeScriptCheck) {
    try {
      // 尝试使用 TypeScript 编译器 API
      tsErrors = checkTypeScriptErrors(tsFiles);
    } catch (error) {
      console.error('使用 TypeScript 编译器 API 检查时出错:', error.message);
      console.log('尝试使用 tsc 命令行工具...');
      
      // 备选方法：使用 tsc 命令行工具
      tsErrors = checkTypeScriptErrorsWithTsc();
    }
  }
  
  // 转换默认导出为命名导出
  for (const { file, componentName, content } of filesToConvert) {
    try {
      // 创建备份
      if (config.writeFiles) {
        createBackup(file);
      }
      
      const newContent = convertToNamedExport(content, componentName, file);
      
      if (config.writeFiles) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log(`已转换: ${file}`);
      } else {
        console.log(`将转换: ${file} (干运行模式)`);
      }
    } catch (error) {
      console.error(`转换文件 ${file} 时出错:`, error.message);
    }
  }
  
  // 更新所有文件中的导入语句
  let updatedImportsCount = 0;
  
  for (const file of files) {
    try {
      let content = fs.readFileSync(file, 'utf8');
      let updated = false;
      
      for (const { file: convertedFile, componentName } of filesToConvert) {
        const newContent = updateImports(content, componentName, convertedFile);
        if (newContent !== content) {
          content = newContent;
          updated = true;
        }
      }
      
      if (updated) {
        updatedImportsCount++;
        
        if (config.writeFiles) {
          // 创建备份（如果尚未创建）
          if (!filesToConvert.some(f => f.file === file)) {
            createBackup(file);
          }
          
          fs.writeFileSync(file, content, 'utf8');
          console.log(`已更新导入: ${file}`);
        } else {
          console.log(`将更新导入: ${file} (干运行模式)`);
        }
      }
    } catch (error) {
      console.error(`更新文件 ${file} 中的导入时出错:`, error.message);
    }
  }
  
  console.log(`已更新 ${updatedImportsCount} 个文件中的导入语句`);
  
  // 生成索引文件
  generateIndexFiles(files, filesToConvert);
  
  // 报告 TypeScript 错误
  if (tsErrors.length > 0) {
    console.log('\nTypeScript 错误报告:');
    
    // 按文件分组错误
    const errorsByFile = {};
    tsErrors.forEach(error => {
      if (!errorsByFile[error.filePath]) {
        errorsByFile[error.filePath] = [];
      }
      
      errorsByFile[error.filePath].push(error);
    });
    
    // 显示错误报告
    Object.entries(errorsByFile).forEach(([filePath, errors]) => {
      console.log(`\n文件: ${filePath}`);
      
      errors.forEach(error => {
        console.log(`  行 ${error.line}, 列 ${error.character}: ${error.message} (${error.code})`);
      });
    });
    
    console.log('\n请修复这些 TypeScript 错误。');
  }
  
  console.log('转换完成!');
  
  if (config.createBackups) {
    console.log('注意: 已为修改的文件创建了 .bak 备份文件');
  }
};

// 运行主函数
main().catch(error => {
  console.error('发生错误:', error);
  process.exit(1);
});
