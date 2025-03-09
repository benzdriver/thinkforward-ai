const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// 获取当前工作目录(已经是backend目录)
const backendDir = process.cwd();

// 读取package.json获取当前依赖
let packageJson;
try {
  packageJson = require(path.join(backendDir, 'package.json'));
} catch (error) {
  console.error('无法找到或解析package.json文件:', error.message);
  process.exit(1);
}

const installedDependencies = new Set([
  ...Object.keys(packageJson.dependencies || {}),
  ...Object.keys(packageJson.devDependencies || {})
]);

// 要排除的内部模块/文件
const internalModules = new Set([
  // Node.js 内置模块
  'fs', 'path', 'http', 'https', 'crypto', 'util', 'stream', 'events', 'os', 
  'child_process', 'url', 'querystring', 'cluster', 'dgram', 'dns', 'net', 
  'readline', 'repl', 'tls', 'zlib', 'assert', 'buffer', 'console', 'constants',
  'domain', 'punycode', 'string_decoder', 'timers', 'tty', 'v8', 'vm',
  // 相对路径导入
  './', '../', '/'
]);

// 存储发现的外部依赖
const externalDependencies = new Set();
// 存储缺失的依赖
const missingDependencies = new Set();

// 提取包名，正确处理带作用域的包
function extractPackageName(importName) {
  if (importName.startsWith('@')) {
    // 处理带作用域的包，如 @clerk/clerk-sdk-node
    const parts = importName.split('/');
    // 返回作用域+包名（@organization/package-name）
    return parts.length > 1 ? `${parts[0]}/${parts[1]}` : importName;
  } else {
    // 处理普通包，如 express
    return importName.split('/')[0];
  }
}

// 递归扫描目录
function scanDir(dirPath) {
  try {
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && file !== 'node_modules' && !file.startsWith('.')) {
        // 递归扫描子目录，除了node_modules和隐藏目录
        scanDir(filePath);
      } else if (stat.isFile() && (file.endsWith('.js') || file.endsWith('.ts'))) {
        // 扫描JavaScript和TypeScript文件
        scanFile(filePath);
      }
    }
  } catch (error) {
    console.error(`扫描目录 ${dirPath} 时出错:`, error.message);
  }
}

// 扫描单个文件
function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 扫描require语句
    const requireRegex = /require\(['"]([^'"./][^'"]*)['"]\)/g;
    let match;
    while ((match = requireRegex.exec(content)) !== null) {
      const dependency = extractPackageName(match[1]);
      if (!internalModules.has(dependency)) {
        externalDependencies.add(dependency);
      }
    }
    
    // 扫描import语句
    const importRegex = /from ['"]([^'"./][^'"]*)['"]/g;
    while ((match = importRegex.exec(content)) !== null) {
      const dependency = extractPackageName(match[1]);
      if (!internalModules.has(dependency)) {
        externalDependencies.add(dependency);
      }
    }
  } catch (error) {
    console.error(`扫描文件 ${filePath} 时出错:`, error.message);
  }
}

// 检查缺失的依赖
function checkMissingDependencies() {
  for (const dependency of externalDependencies) {
    if (!installedDependencies.has(dependency)) {
      missingDependencies.add(dependency);
    }
  }
}

// 手动检查特定依赖项
function checkSpecificPackages() {
  // 检查是否有 @clerk/ 开头的依赖
  const clerkDependencies = Array.from(externalDependencies)
    .filter(dep => dep.startsWith('@clerk/'));
  
  if (clerkDependencies.length > 0) {
    // 已经正确识别了 @clerk 相关包
    console.log(`发现 Clerk 相关依赖: ${clerkDependencies.join(', ')}`);
  } else if (externalDependencies.has('@clerk')) {
    // 错误识别了 @clerk，替换为实际使用的包
    externalDependencies.delete('@clerk');
    externalDependencies.add('@clerk/clerk-sdk-node');
    console.log('将 @clerk 替换为 @clerk/clerk-sdk-node');
  }
}

// 安装缺失的依赖
function installDependencies(dev = false) {
  if (missingDependencies.size === 0) {
    console.log('没有发现缺失的依赖项。');
    return;
  }
  
  // 分批安装依赖，避免一次性安装太多出错
  const dependencies = Array.from(missingDependencies);
  const batches = [];
  
  // 每批最多安装5个依赖
  for (let i = 0; i < dependencies.length; i += 5) {
    batches.push(dependencies.slice(i, i + 5));
  }
  
  console.log(`将分${batches.length}批安装${dependencies.length}个依赖`);
  
  // 逐批安装
  let currentBatch = 0;
  
  function installBatch() {
    if (currentBatch >= batches.length) {
      console.log('所有依赖安装完成！');
      return;
    }
    
    const batch = batches[currentBatch];
    const batchDeps = batch.join(' ');
    // 直接执行npm install，无需切换目录
    const command = `npm install ${dev ? '--save-dev' : '--save'} ${batchDeps}`;
    
    console.log(`\n正在安装第${currentBatch + 1}批依赖: ${batchDeps}`);
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`安装依赖时出错: ${error.message}`);
        console.log('尝试单独安装这批依赖...');
        
        // 如果批量安装失败，尝试逐个安装
        installPackagesOneByOne(batch, dev, () => {
          currentBatch++;
          installBatch();
        });
      } else {
        if (stderr) {
          console.error(`安装警告: ${stderr}`);
        }
        console.log(`第${currentBatch + 1}批依赖安装完成`);
        currentBatch++;
        installBatch();
      }
    });
  }
  
  // 开始安装第一批
  installBatch();
}

// 逐个安装包以处理错误
function installPackagesOneByOne(packages, dev, callback) {
  let index = 0;
  
  function installNext() {
    if (index >= packages.length) {
      callback();
      return;
    }
    
    const pkg = packages[index];
    // 直接执行npm install，无需切换目录
    const command = `npm install ${dev ? '--save-dev' : '--save'} ${pkg}`;
    
    console.log(`尝试安装: ${pkg}`);
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`无法安装 ${pkg}: ${error.message}`);
        
        // 如果是@clerk相关的错误，尝试安装clerk-sdk-node
        if (pkg === '@clerk') {
          console.log('尝试安装 @clerk/clerk-sdk-node 替代 @clerk...');
          exec(`npm install --save @clerk/clerk-sdk-node`, (err, out, stdErr) => {
            if (err) {
              console.error(`安装 @clerk/clerk-sdk-node 失败: ${err.message}`);
            } else {
              console.log('成功安装 @clerk/clerk-sdk-node');
            }
            index++;
            installNext();
          });
        } else {
          index++;
          installNext();
        }
      } else {
        console.log(`成功安装 ${pkg}`);
        index++;
        installNext();
      }
    });
  }
  
  installNext();
}

// 主流程
console.log('开始扫描项目依赖...');
console.log(`当前工作目录: ${backendDir}`);
scanDir(backendDir);
console.log(`发现 ${externalDependencies.size} 个外部依赖。`);

// 特殊处理某些依赖
checkSpecificPackages();

checkMissingDependencies();
console.log(`发现 ${missingDependencies.size} 个缺失的依赖:`);
if (missingDependencies.size > 0) {
  console.log(Array.from(missingDependencies).join(', '));
  
  // 询问是否自动安装
  const shouldInstall = process.argv.includes('--install');
  const shouldInstallDev = process.argv.includes('--dev');
  
  if (shouldInstall) {
    installDependencies(shouldInstallDev);
  } else {
    console.log('\n要安装这些依赖，请运行:');
    console.log(`npm install --save ${Array.from(missingDependencies).join(' ')}`);
    console.log('或运行此脚本并添加 --install 参数');
  }
} else {
  console.log('所有依赖都已安装，项目完整！');
}