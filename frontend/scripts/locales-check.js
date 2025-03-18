#!/usr/bin/env node
/*
使用方法：
1. 检查单个文件：
   node scripts/locales-check.js common.json

2. 检查所有文件：
   node scripts/locales-check.js --all

3. 检查多个文件：
   node scripts/locales-check.js common.json index.json
*/

const fs = require('fs');
const path = require('path');
const chalk = require('chalk'); // 用于彩色输出，需要先安装：npm install chalk

// 定义本地化文件的目录
const localesDir = path.join(__dirname, '../public/locales');

// 获取所有语言目录
const languages = fs.readdirSync(localesDir).filter(file => 
  fs.statSync(path.join(localesDir, file)).isDirectory()
);

// 处理命令行参数
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error(chalk.red('错误：请提供要检查的文件名，或使用 --all 检查所有文件'));
  console.info(chalk.yellow('示例：'));
  console.info('  node scripts/locales-check.js common.json');
  console.info('  node scripts/locales-check.js --all');
  process.exit(1);
}

// 检查指定文件名的所有语言版本
function checkTranslationFiles(fileName) {
  console.log(chalk.blue(`\n检查文件: ${fileName}\n`));
  
  // 收集所有语言版本的文件
  const files = {};
  const allKeys = new Set();
  
  // 读取所有语言版本的文件
  for (const lang of languages) {
    const filePath = path.join(localesDir, lang, fileName);
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        files[lang] = JSON.parse(content);
        
        // 收集所有键
        collectKeys('', files[lang], allKeys);
      } catch (error) {
        console.error(chalk.red(`无法解析 ${lang}/${fileName}: ${error.message}`));
      }
    } else {
      console.warn(chalk.yellow(`警告: ${lang}/${fileName} 不存在`));
    }
  }
  
  // 如果没有找到任何文件，则退出
  if (Object.keys(files).length === 0) {
    console.error(chalk.red(`没有找到任何 ${fileName} 文件`));
    return;
  }
  
  // 选择一个基准语言（通常是英语或简体中文）
  const baseLanguage = 'zh-CN' in files ? 'zh-CN' : Object.keys(files)[0];
  console.log(chalk.green(`使用 ${baseLanguage} 作为基准语言`));
  
  // 检查每种语言与基准语言的差异
  for (const lang of Object.keys(files)) {
    if (lang === baseLanguage) continue;
    
    console.log(chalk.cyan(`\n比较 ${baseLanguage} 和 ${lang}:`));
    
    // 检查缺失的键
    const missingKeys = [];
    const extraKeys = [];
    const structureDiffs = [];
    
    // 检查所有键
    for (const key of allKeys) {
      const baseValue = getNestedValue(files[baseLanguage], key);
      const langValue = getNestedValue(files[lang], key);
      
      if (baseValue === undefined && langValue !== undefined) {
        extraKeys.push(key);
      } else if (langValue === undefined && baseValue !== undefined) {
        missingKeys.push(key);
      } else if (typeof baseValue !== typeof langValue) {
        structureDiffs.push({
          key,
          baseType: typeof baseValue,
          langType: typeof langValue
        });
      } else if (
        typeof baseValue === 'object' && 
        baseValue !== null && 
        langValue !== null &&
        !Array.isArray(baseValue) && 
        !Array.isArray(langValue)
      ) {
        // 对于对象，我们已经通过收集所有键来检查其结构
      }
    }
    
    // 输出结果
    if (missingKeys.length === 0 && extraKeys.length === 0 && structureDiffs.length === 0) {
      console.log(chalk.green('  ✓ 结构完全一致'));
    } else {
      if (missingKeys.length > 0) {
        console.log(chalk.red(`  ✗ ${lang} 缺少以下键:`));
        missingKeys.forEach(key => console.log(chalk.red(`    - ${key}`)));
      }
      
      if (extraKeys.length > 0) {
        console.log(chalk.yellow(`  ! ${lang} 包含额外的键:`));
        extraKeys.forEach(key => console.log(chalk.yellow(`    + ${key}`)));
      }
      
      if (structureDiffs.length > 0) {
        console.log(chalk.red(`  ✗ ${lang} 有以下结构差异:`));
        structureDiffs.forEach(diff => {
          console.log(chalk.red(`    - ${diff.key}: ${baseLanguage} 是 ${diff.baseType}, ${lang} 是 ${diff.langType}`));
        });
      }
    }
  }
}

// 递归收集所有键
function collectKeys(prefix, obj, keySet) {
  if (obj === null || typeof obj !== 'object') return;
  
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    keySet.add(fullKey);
    
    if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      collectKeys(fullKey, obj[key], keySet);
    }
  }
}

// 根据点分隔的路径获取嵌套值
function getNestedValue(obj, path) {
  const parts = path.split('.');
  let current = obj;
  
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    current = current[part];
  }
  
  return current;
}

// 检查所有语言文件
function checkAllTranslationFiles() {
  // 获取第一个语言目录中的所有文件
  const firstLang = languages[0];
  const files = fs.readdirSync(path.join(localesDir, firstLang))
    .filter(file => file.endsWith('.json'));
  
  for (const file of files) {
    checkTranslationFiles(file);
  }
}

// 执行检查
console.log(chalk.bold('开始检查翻译文件的一致性...\n'));
console.log(chalk.bold(`发现以下语言: ${languages.join(', ')}`));

if (args.includes('--all')) {
  checkAllTranslationFiles();
} else {
  args.forEach(file => {
    if (!file.endsWith('.json')) {
      console.warn(chalk.yellow(`警告: 跳过非JSON文件 ${file}`));
      return;
    }
    checkTranslationFiles(file);
  });
}
