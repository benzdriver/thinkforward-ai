/**
 * 翻译文件结构同步工具
 * 
 * 此脚本用于同步不同语言翻译文件的结构，确保它们与基准语言文件具有相同的键和嵌套结构。
 * 它会删除目标语言文件中基准语言不存在的键，并添加基准语言中存在但目标语言中不存在的键。
 * 
 * 使用方法:
 * 1. 安装依赖: npm install chalk
 * 2. 基本用法: node locales-sync.js common.json
 * 3. 指定基准语言: node locales-sync.js common.json zh-CN
 * 4. 同步多个文件: node locales-sync.js common.json auth.json
 * 5. 同步所有文件: node locales-sync.js --all
 * 
 * 参数:
 * - 文件名: 要同步的翻译文件名，如 common.json
 * - 基准语言: 可选，默认为 zh-CN
 * - --all: 同步基准语言目录中的所有文件
 * 
 * 示例:
 * - node locales-sync.js common.json
 * - node locales-sync.js common.json en
 * - node locales-sync.js --all
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// 定义本地化文件的目录
const localesDir = path.join(__dirname, '../public/locales');

// 获取所有语言目录
const languages = fs.readdirSync(localesDir).filter(file => 
  fs.statSync(path.join(localesDir, file)).isDirectory()
);

// 同步指定文件名的所有语言版本
function syncTranslationFiles(fileName, baseLanguage = 'zh-CN') {
  console.log(chalk.blue(`\n同步文件: ${fileName}\n`));
  
  // 检查基准语言文件是否存在
  const baseFilePath = path.join(localesDir, baseLanguage, fileName);
  if (!fs.existsSync(baseFilePath)) {
    console.error(chalk.red(`基准语言文件 ${baseLanguage}/${fileName} 不存在`));
    return false;
  }
  
  // 读取基准语言文件
  let baseFile;
  try {
    const content = fs.readFileSync(baseFilePath, 'utf8');
    baseFile = JSON.parse(content);
  } catch (error) {
    console.error(chalk.red(`无法解析基准语言文件 ${baseLanguage}/${fileName}: ${error.message}`));
    return false;
  }
  
  let syncSuccess = true;
  
  // 同步每种语言
  for (const lang of languages) {
    if (lang === baseLanguage) continue;
    
    console.log(chalk.cyan(`同步 ${lang}/${fileName}...`));
    
    const langFilePath = path.join(localesDir, lang, fileName);
    let langFile = {};
    
    // 如果目标语言文件存在，则读取它
    if (fs.existsSync(langFilePath)) {
      try {
        const content = fs.readFileSync(langFilePath, 'utf8');
        langFile = JSON.parse(content);
      } catch (error) {
        console.warn(chalk.yellow(`无法解析 ${lang}/${fileName}: ${error.message}`));
        console.log(chalk.yellow(`将创建新文件`));
      }
    }
    
    // 同步结构
    const syncedFile = syncStructure(baseFile, langFile);
    
    // 写入同步后的文件
    try {
      fs.writeFileSync(langFilePath, JSON.stringify(syncedFile, null, 2), 'utf8');
      console.log(chalk.green(`  ✓ 已同步 ${lang}/${fileName}`));
    } catch (error) {
      console.error(chalk.red(`  ✗ 无法写入 ${lang}/${fileName}: ${error.message}`));
      syncSuccess = false;
    }
  }
  
  return syncSuccess;
}

// 递归同步对象结构
function syncStructure(baseObj, langObj) {
  if (baseObj === null || typeof baseObj !== 'object' || Array.isArray(baseObj)) {
    return langObj !== undefined ? langObj : baseObj;
  }
  
  const result = {};
  
  // 遍历基准对象的所有键
  for (const key of Object.keys(baseObj)) {
    if (key in langObj && typeof langObj[key] === typeof baseObj[key]) {
      // 如果语言对象中存在该键且类型相同，则递归同步
      result[key] = syncStructure(baseObj[key], langObj[key]);
    } else {
      // 如果语言对象中不存在该键或类型不同，则使用基准对象的值
      result[key] = baseObj[key];
    }
  }
  
  return result;
}

// 同步基准语言目录中的所有文件
function syncAllTranslationFiles(baseLanguage = 'zh-CN') {
  console.log(chalk.blue(`\n同步基准语言 ${baseLanguage} 中的所有文件\n`));
  
  const baseDir = path.join(localesDir, baseLanguage);
  if (!fs.existsSync(baseDir)) {
    console.error(chalk.red(`基准语言目录 ${baseLanguage} 不存在`));
    return false;
  }
  
  const files = fs.readdirSync(baseDir)
    .filter(file => file.endsWith('.json'));
  
  if (files.length === 0) {
    console.warn(chalk.yellow(`基准语言目录 ${baseLanguage} 中没有找到 JSON 文件`));
    return false;
  }
  
  let allSuccess = true;
  
  for (const file of files) {
    const success = syncTranslationFiles(file, baseLanguage);
    if (!success) {
      allSuccess = false;
    }
  }
  
  return allSuccess;
}

// 解析命令行参数
function parseArgs() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    printUsage();
    process.exit(1);
  }
  
  if (args[0] === '--help' || args[0] === '-h') {
    printUsage();
    process.exit(0);
  }
  
  if (args[0] === '--all') {
    const baseLanguage = args[1] || 'zh-CN';
    return { all: true, baseLanguage };
  }
  
  const files = args.filter(arg => arg.endsWith('.json'));
  const baseLanguage = args.find(arg => !arg.endsWith('.json')) || 'zh-CN';
  
  return { files, baseLanguage };
}

// 打印使用说明
function printUsage() {
  console.log(`
翻译文件结构同步工具

使用方法:
  node locales-sync.js <文件名> [基准语言]
  node locales-sync.js --all [基准语言]

参数:
  文件名      要同步的翻译文件名，如 common.json
  基准语言    可选，默认为 zh-CN
  --all       同步基准语言目录中的所有文件

示例:
  node locales-sync.js common.json
  node locales-sync.js common.json en
  node locales-sync.js common.json auth.json
  node locales-sync.js --all
  `);
}

// 主函数
function main() {
  console.log(chalk.bold('开始同步翻译文件结构...\n'));
  console.log(chalk.bold(`发现以下语言: ${languages.join(', ')}`));
  
  const args = parseArgs();
  
  if (args.all) {
    const success = syncAllTranslationFiles(args.baseLanguage);
    if (success) {
      console.log(chalk.green('\n所有文件同步成功!'));
    } else {
      console.log(chalk.yellow('\n部分文件同步失败，请检查上面的错误信息。'));
      process.exit(1);
    }
  } else {
    let allSuccess = true;
    
    for (const file of args.files) {
      const success = syncTranslationFiles(file, args.baseLanguage);
      if (!success) {
        allSuccess = false;
      }
    }
    
    if (allSuccess) {
      console.log(chalk.green('\n所有文件同步成功!'));
    } else {
      console.log(chalk.yellow('\n部分文件同步失败，请检查上面的错误信息。'));
      process.exit(1);
    }
  }
}

// 执行主函数
main(); 