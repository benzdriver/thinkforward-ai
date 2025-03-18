#!/usr/bin/env node
/**
 * 翻译文件管理工具
 * 
 * 此脚本集成了检查、同步、提取、翻译和合并翻译文件的所有功能。
 * 
 * 使用方法:
 * 1. 安装依赖: npm install chalk axios dotenv
 * 2. 设置环境变量: OPENAI_API_KEY=your_api_key (用于自动翻译)
 * 
 * 命令:
 *   check    - 检查翻译文件的结构一致性
 *   sync     - 同步翻译文件结构
 *   extract  - 提取需要翻译的内容
 *   translate - 自动翻译缺失的内容
 *   merge    - 合并翻译内容到目标文件
 *   auto     - 自动执行整个工作流程 (检查->同步->提取->翻译->合并)
 * 
 * 示例:
 *   node locales-manager.js check common.json
 *   node locales-manager.js sync common.json
 *   node locales-manager.js extract common.json fr
 *   node locales-manager.js translate temp/common_fr_missing.json fr
 *   node locales-manager.js merge temp/common_fr_translated.json fr
 *   node locales-manager.js auto common.json fr,ja,ko
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
let axios;

try {
  axios = require('axios');
} catch (error) {
  // axios 是可选的，仅在翻译功能中使用
}

// 定义本地化文件的目录
const localesDir = path.join(__dirname, '../public/locales');
const tempDir = path.join(__dirname, '../temp');

// 确保临时目录存在
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// 获取所有语言目录
const languages = fs.readdirSync(localesDir).filter(file => 
  fs.statSync(path.join(localesDir, file)).isDirectory()
);

// 语言代码到语言名称的映射
const languageNames = {
  'zh-CN': '简体中文',
  'en': '英语',
  'fr': '法语',
  'ja': '日语',
  'ko': '韩语',
  'ar': '阿拉伯语',
  'zh-TW': '繁体中文',
  'es': '西班牙语',
  'de': '德语',
  'it': '意大利语',
  'ru': '俄语',
  'pt': '葡萄牙语',
  'nl': '荷兰语',
  'tr': '土耳其语',
  'pl': '波兰语',
  'uk': '乌克兰语',
  'vi': '越南语',
  'th': '泰语',
  'id': '印度尼西亚语',
  'ms': '马来语',
  'hi': '印地语'
};

// 解析命令行参数
const args = process.argv.slice(2);

if (args.length === 0) {
  printUsage();
  process.exit(1);
}

const command = args[0];
const commandArgs = args.slice(1);

// 尝试加载多个可能的环境变量文件
const dotenvFiles = [
  path.join(__dirname, '../.env.local'),
  path.join(__dirname, '../.env'),
  path.join(__dirname, '../../.env.local'),
  path.join(__dirname, '../../.env')
];

for (const envFile of dotenvFiles) {
  if (fs.existsSync(envFile)) {
    require('dotenv').config({ path: envFile });
    console.log(chalk.green(`已加载环境变量文件: ${envFile}`));
    break;
  }
}

// 主函数
async function main() {
  console.log(chalk.bold(`翻译文件管理工具 - ${command} 命令`));
  console.log(chalk.bold(`发现以下语言: ${languages.join(', ')}`));
  
  switch (command) {
    case 'check':
      checkCommand(commandArgs);
      break;
    case 'sync':
      syncCommand(commandArgs);
      break;
    case 'extract':
      extractCommand(commandArgs);
      break;
    case 'translate':
      await translateCommand(commandArgs);
      break;
    case 'merge':
      mergeCommand(commandArgs);
      break;
    case 'auto':
      await autoCommand(commandArgs);
      break;
    case 'help':
      printUsage();
      break;
    default:
      console.error(chalk.red(`未知命令: ${command}`));
      printUsage();
      process.exit(1);
  }
}

// 检查命令
function checkCommand(args) {
  if (args.length === 0) {
    console.error(chalk.red('错误：请提供要检查的文件名，或使用 --all 检查所有文件'));
    console.log(chalk.yellow('示例: node locales-manager.js check common.json'));
    process.exit(1);
  }
  
  if (args[0] === '--all') {
    checkAllTranslationFiles();
  } else {
    for (const file of args) {
      if (!file.endsWith('.json')) {
        console.warn(chalk.yellow(`警告: 跳过非JSON文件 ${file}`));
        continue;
      }
      checkTranslationFiles(file);
    }
  }
}

// 同步命令
function syncCommand(args) {
  if (args.length === 0) {
    console.error(chalk.red('错误：请提供要同步的文件名，或使用 --all 同步所有文件'));
    console.log(chalk.yellow('示例: node locales-manager.js sync common.json'));
    process.exit(1);
  }
  
  let baseLanguage = 'zh-CN';
  let files = [];
  let allFiles = false;
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--all') {
      allFiles = true;
    } else if (args[i] === '--base' && i + 1 < args.length) {
      baseLanguage = args[i + 1];
      i++;
    } else if (args[i].endsWith('.json')) {
      files.push(args[i]);
    }
  }
  
  if (allFiles) {
    syncAllTranslationFiles(baseLanguage);
  } else if (files.length > 0) {
    for (const file of files) {
      syncTranslationFiles(file, baseLanguage);
    }
  } else {
    console.error(chalk.red('错误：必须提供至少一个文件名或使用 --all 参数'));
    process.exit(1);
  }
}

// 提取命令
function extractCommand(args) {
  if (args.length < 2) {
    console.error(chalk.red('错误：请提供要提取的文件名和目标语言'));
    console.log(chalk.yellow('示例: node locales-manager.js extract common.json fr'));
    process.exit(1);
  }
  
  const fileName = args[0];
  if (!fileName.endsWith('.json')) {
    console.error(chalk.red('错误：文件名必须以 .json 结尾'));
    process.exit(1);
  }
  
  let targetLanguages = [];
  let baseLanguage = 'zh-CN';
  let allLanguages = false;
  
  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--all') {
      allLanguages = true;
    } else if (args[i] === '--base' && i + 1 < args.length) {
      baseLanguage = args[i + 1];
      i++;
    } else if (args[i].includes(',')) {
      // 支持逗号分隔的语言列表
      targetLanguages = targetLanguages.concat(args[i].split(','));
    } else {
      targetLanguages.push(args[i]);
    }
  }
  
  if (allLanguages) {
    targetLanguages = languages.filter(lang => lang !== baseLanguage);
  }
  
  if (targetLanguages.length === 0 && !allLanguages) {
    console.error(chalk.red('错误：必须指定至少一个目标语言或使用 --all 参数'));
    process.exit(1);
  }
  
  extractMissingTranslations(fileName, targetLanguages, baseLanguage);
}

// 翻译命令
async function translateCommand(args) {
  if (args.length < 2) {
    console.error(chalk.red('错误：请提供缺失翻译文件路径和目标语言'));
    console.log(chalk.yellow('示例: node locales-manager.js translate temp/common_fr_missing.json fr'));
    process.exit(1);
  }
  
  const missingFilePath = args[0];
  const targetLanguage = args[1];
  
  // 检查 OpenAI API 密钥
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    console.error(chalk.red('错误：未设置 OPENAI_API_KEY 环境变量'));
    console.log(chalk.yellow('请设置环境变量或创建 .env 文件，包含 OPENAI_API_KEY=your_api_key'));
    process.exit(1);
  }
  
  await translateMissingTranslations(missingFilePath, targetLanguage, OPENAI_API_KEY);
}

// 合并命令
function mergeCommand(args) {
  if (args.length < 2) {
    console.error(chalk.red('错误：请提供翻译文件路径和目标语言'));
    console.log(chalk.yellow('示例: node locales-manager.js merge temp/common_fr_translated.json fr'));
    process.exit(1);
  }
  
  const translationFilePath = args[0];
  const targetLanguage = args[1];
  let fileName = args[2];
  
  // 如果没有提供文件名，则从翻译文件名中提取
  if (!fileName) {
    const translationFileName = path.basename(translationFilePath);
    const match = translationFileName.match(/^(.+)_[a-z-]+_(?:missing|translated)\.json$/);
    if (match) {
      fileName = `${match[1]}.json`;
    } else {
      console.error(chalk.red('错误：无法从翻译文件名中提取目标文件名，请手动指定'));
      process.exit(1);
    }
  }
  
  mergeTranslations(translationFilePath, targetLanguage, fileName);
}

// 自动命令 - 执行整个工作流程
async function autoCommand(args) {
  if (args.length < 2) {
    console.error(chalk.red('错误：请提供要处理的文件名和目标语言'));
    console.log(chalk.yellow('示例: node locales-manager.js auto common.json fr,ja,ko'));
    process.exit(1);
  }
  
  const fileName = args[0];
  if (!fileName.endsWith('.json')) {
    console.error(chalk.red('错误：文件名必须以 .json 结尾'));
    process.exit(1);
  }
  
  let targetLanguages = [];
  let baseLanguage = 'zh-CN';
  
  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--all') {
      targetLanguages = languages.filter(lang => lang !== baseLanguage);
    } else if (args[i] === '--base' && i + 1 < args.length) {
      baseLanguage = args[i + 1];
      i++;
    } else if (args[i].includes(',')) {
      // 支持逗号分隔的语言列表
      targetLanguages = targetLanguages.concat(args[i].split(','));
    } else {
      targetLanguages.push(args[i]);
    }
  }
  
  if (targetLanguages.length === 0) {
    console.error(chalk.red('错误：必须指定至少一个目标语言或使用 --all 参数'));
    process.exit(1);
  }
  
  // 检查 OpenAI API 密钥
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    console.error(chalk.red('错误：未设置 OPENAI_API_KEY 环境变量'));
    console.log(chalk.yellow('请设置环境变量或创建 .env 文件，包含 OPENAI_API_KEY=your_api_key'));
    process.exit(1);
  }
  
  if (!axios) {
    console.error(chalk.red('错误：自动工作流程需要 axios 包，请运行 npm install axios'));
    process.exit(1);
  }
  
  console.log(chalk.blue(`开始自动工作流程，处理文件 ${fileName} 的以下语言: ${targetLanguages.join(', ')}`));
  
  // 步骤 1: 检查
  console.log(chalk.cyan('\n步骤 1: 检查翻译文件结构'));
  checkTranslationFiles(fileName);
  
  // 步骤 2: 同步
  console.log(chalk.cyan('\n步骤 2: 同步翻译文件结构'));
  syncTranslationFiles(fileName, baseLanguage);
  
  // 对每种目标语言执行提取、翻译和合并
  for (const lang of targetLanguages) {
    console.log(chalk.blue(`\n处理语言: ${lang}`));
    
    // 步骤 3: 提取
    console.log(chalk.cyan(`步骤 3: 提取 ${lang} 的缺失翻译`));
    const missingFilePath = extractMissingTranslations(fileName, [lang], baseLanguage);
    
    if (!missingFilePath) {
      console.log(chalk.green(`${lang} 没有缺失的翻译，跳过`));
      continue;
    }
    
    // 步骤 4: 翻译
    console.log(chalk.cyan(`步骤 4: 翻译 ${lang} 的缺失内容`));
    const translatedFilePath = await translateMissingTranslations(missingFilePath, lang, OPENAI_API_KEY);
    
    if (!translatedFilePath) {
      console.log(chalk.yellow(`${lang} 的翻译失败，跳过合并步骤`));
      continue;
    }
    
    // 步骤 5: 合并
    console.log(chalk.cyan(`步骤 5: 合并 ${lang} 的翻译`));
    mergeTranslations(translatedFilePath, lang, fileName);
  }
  
  console.log(chalk.green('\n自动工作流程完成!'));
}

// 检查翻译文件
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
      return false;
    }
    
    // 选择一个基准语言（通常是简体中文）
    const baseLanguage = 'zh-CN' in files ? 'zh-CN' : Object.keys(files)[0];
    console.log(chalk.green(`使用 ${baseLanguage} 作为基准语言`));
    
    // 检查每种语言与基准语言的差异
    let hasStructuralDifferences = false;
    
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
        }
      }
      
      // 输出结果
      if (missingKeys.length === 0 && extraKeys.length === 0 && structureDiffs.length === 0) {
        console.log(chalk.green('  ✓ 结构完全一致'));
      } else {
        hasStructuralDifferences = true;
        
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
    
    return !hasStructuralDifferences;
  }
  
  // 检查所有翻译文件
  function checkAllTranslationFiles() {
    // 获取第一个语言目录中的所有文件
    const firstLang = languages[0];
    const files = fs.readdirSync(path.join(localesDir, firstLang))
      .filter(file => file.endsWith('.json'));
    
    let allConsistent = true;
    
    for (const file of files) {
      const isConsistent = checkTranslationFiles(file);
      if (!isConsistent) {
        allConsistent = false;
      }
    }
    
    return allConsistent;
  }
  
  // 同步翻译文件
  function syncTranslationFiles(fileName, baseLanguage = 'zh-CN') {
    console.log(chalk.blue(`\n同步文件: ${fileName}\n`));
    
    // 检查基准语言文件是否存在
    const baseFilePath = path.join(localesDir, baseLanguage, fileName);
    if (!fs.existsSync(baseFilePath)) {
      console.error(chalk.red(`错误: 基准语言 ${baseLanguage} 的文件 ${fileName} 不存在`));
      return false;
    }
    
    // 读取基准语言文件
    let baseFile;
    try {
      const content = fs.readFileSync(baseFilePath, 'utf8');
      baseFile = JSON.parse(content);
    } catch (error) {
      console.error(chalk.red(`错误: 无法解析基准语言文件 ${baseFilePath}: ${error.message}`));
      return false;
    }
    
    // 同步每种语言的文件
    let allSuccess = true;
    
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
          console.warn(chalk.yellow(`警告: 无法解析 ${langFilePath}: ${error.message}`));
          console.log(chalk.yellow(`将创建新文件`));
        }
      }
      
      // 同步文件结构
      const syncedFile = syncObjectStructure(baseFile, langFile);
      
      // 写入同步后的文件
      try {
        // 确保目标目录存在
        const langDir = path.join(localesDir, lang);
        if (!fs.existsSync(langDir)) {
          fs.mkdirSync(langDir, { recursive: true });
        }
        
        fs.writeFileSync(langFilePath, JSON.stringify(syncedFile, null, 2), 'utf8');
        console.log(chalk.green(`  ✓ 已同步 ${lang}/${fileName}`));
      } catch (error) {
        console.error(chalk.red(`  ✗ 无法写入 ${langFilePath}: ${error.message}`));
        allSuccess = false;
      }
    }
    
    return allSuccess;
  }
  
  // 同步对象结构
  function syncObjectStructure(baseObj, targetObj) {
    if (baseObj === null || typeof baseObj !== 'object' || Array.isArray(baseObj)) {
      return targetObj !== undefined ? targetObj : baseObj;
    }
    
    const result = {};
    
    // 添加基准对象中的所有键
    for (const key of Object.keys(baseObj)) {
      if (key in targetObj) {
        // 如果目标对象中存在该键，则递归同步
        result[key] = syncObjectStructure(baseObj[key], targetObj[key]);
      } else {
        // 如果目标对象中不存在该键，则使用基准对象的值
        result[key] = baseObj[key];
      }
    }
    
    return result;
  }
  
  // 提取缺失的翻译
  function extractMissingTranslations(fileName, targetLanguages, baseLanguage = 'zh-CN') {
    console.log(chalk.blue(`\n提取文件 ${fileName} 中需要翻译的内容\n`));
    
    // 检查基准语言文件是否存在
    const baseFilePath = path.join(localesDir, baseLanguage, fileName);
    if (!fs.existsSync(baseFilePath)) {
      console.error(chalk.red(`错误: 基准语言 ${baseLanguage} 的文件 ${fileName} 不存在`));
      return null;
    }
    
    // 读取基准语言文件
    let baseFile;
    try {
      const content = fs.readFileSync(baseFilePath, 'utf8');
      baseFile = JSON.parse(content);
    } catch (error) {
      console.error(chalk.red(`错误: 无法解析基准语言文件 ${baseFilePath}: ${error.message}`));
      return null;
    }
    
    // 处理 --all 参数
    if (targetLanguages.includes('--all')) {
      targetLanguages = languages.filter(lang => lang !== baseLanguage);
    }
    
    console.log(chalk.cyan(`基准语言: ${baseLanguage}`));
    console.log(chalk.cyan(`目标语言: ${targetLanguages.join(', ')}`));
    
    const results = {};
    
    // 对每种目标语言提取缺失的翻译
    for (const lang of targetLanguages) {
      if (lang === baseLanguage) continue;
      
      console.log(chalk.cyan(`\n提取 ${lang} 的缺失翻译...`));
      
      const langFilePath = path.join(localesDir, lang, fileName);
      if (!fs.existsSync(langFilePath)) {
        console.error(chalk.red(`错误: 目标语言 ${lang} 的文件 ${fileName} 不存在`));
        continue;
      }
      
      // 读取目标语言文件
      let langFile;
      try {
        const content = fs.readFileSync(langFilePath, 'utf8');
        langFile = JSON.parse(content);
      } catch (error) {
        console.error(chalk.red(`错误: 无法解析目标语言文件 ${langFilePath}: ${error.message}`));
        continue;
      }
      
      // 提取需要翻译的内容
      const missingTranslations = {};
      extractMissingKeys('', baseFile, langFile, missingTranslations);
      
      const missingCount = Object.keys(missingTranslations).length;
      
      if (missingCount === 0) {
        console.log(chalk.green(`  ✓ ${lang} 没有缺失的翻译`));
        continue;
      }
      
      console.log(chalk.yellow(`  ! 发现 ${missingCount} 个需要翻译的条目`));
      
      // 写入缺失的翻译到临时文件
      const outputFileName = `${path.basename(fileName, '.json')}_${lang}_missing.json`;
      const outputFilePath = path.join(tempDir, outputFileName);
      
      try {
        fs.writeFileSync(outputFilePath, JSON.stringify(missingTranslations, null, 2), 'utf8');
        console.log(chalk.green(`  ✓ 已将缺失的翻译写入 ${outputFilePath}`));
        results[lang] = outputFilePath;
      } catch (error) {
        console.error(chalk.red(`  ✗ 无法写入缺失的翻译: ${error.message}`));
      }
    }
    
    // 如果只有一种目标语言，则返回其文件路径
    if (targetLanguages.length === 1 && results[targetLanguages[0]]) {
      return results[targetLanguages[0]];
    }
    
    // 否则返回所有结果
    return Object.keys(results).length > 0 ? results : null;
  }
  
  // 提取缺失的键
  function extractMissingKeys(prefix, baseObj, targetObj, result) {
    if (baseObj === null || typeof baseObj !== 'object' || Array.isArray(baseObj)) {
      const fullKey = prefix;
      
      // 如果目标值与基准值相同，则认为需要翻译
      if (targetObj === baseObj && typeof baseObj === 'string') {
        result[fullKey] = baseObj;
      }
      
      return;
    }
    
    for (const key of Object.keys(baseObj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (!(key in targetObj)) {
        // 如果目标对象中不存在该键，则需要翻译
        flattenObject(fullKey, baseObj[key], result);
      } else {
        // 递归检查嵌套对象
        extractMissingKeys(fullKey, baseObj[key], targetObj[key], result);
      }
    }
  }
  
  // 将嵌套对象扁平化为点分隔的键
  function flattenObject(prefix, obj, result) {
    if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
      result[prefix] = obj;
      return;
    }
    
    for (const key of Object.keys(obj)) {
      const fullKey = `${prefix}.${key}`;
      flattenObject(fullKey, obj[key], result);
    }
  }
  
  // 翻译缺失的内容
  async function translateMissingTranslations(missingFilePath, targetLanguage, apiKey) {
    console.log(chalk.blue(`\n翻译缺失的内容到 ${targetLanguage}\n`));
    
    // 读取缺失翻译文件
    let missingTranslations;
    try {
      const content = fs.readFileSync(missingFilePath, 'utf8');
      missingTranslations = JSON.parse(content);
    } catch (error) {
      console.error(chalk.red(`错误：无法读取缺失翻译文件 ${missingFilePath}: ${error.message}`));
      return null;
    }
    
    // 准备翻译
    const keys = Object.keys(missingTranslations);
    if (keys.length === 0) {
      console.log(chalk.green('没有需要翻译的内容'));
      return null;
    }
    
    const languageName = languageNames[targetLanguage] || targetLanguage;
    console.log(chalk.blue(`开始翻译 ${keys.length} 个条目到${languageName}...`));
    
    // 将键值对转换为更易于翻译的格式
    const translationItems = keys.map(key => ({
      key,
      value: missingTranslations[key]
    }));
    
    // 将翻译项分批处理，每批最多50个
    const batchSize = 50;
    const batches = [];
    
    for (let i = 0; i < translationItems.length; i += batchSize) {
      batches.push(translationItems.slice(i, i + batchSize));
    }
    
    console.log(chalk.blue(`将分 ${batches.length} 批进行翻译，每批最多 ${batchSize} 个条目`));
    
    // 翻译所有批次
    const translations = {};
    let batchNumber = 0;
    
    for (const batch of batches) {
      batchNumber++;
      console.log(chalk.blue(`翻译批次 ${batchNumber}/${batches.length}...`));
      
      try {
        const batchTranslations = await translateBatch(batch, targetLanguage, apiKey);
        Object.assign(translations, batchTranslations);
        console.log(chalk.green(`  ✓ 批次 ${batchNumber} 翻译完成`));
      } catch (error) {
        console.error(chalk.red(`  ✗ 批次 ${batchNumber} 翻译失败: ${error.message}`));
        if (error.response) {
          console.error(chalk.red(`    状态码: ${error.response.status}`));
          console.error(chalk.red(`    响应: ${JSON.stringify(error.response.data)}`));
        }
      }
      
      // 如果不是最后一个批次，等待一秒以避免API限制
      if (batchNumber < batches.length) {
        console.log(chalk.blue('  等待1秒...'));
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // 写入翻译结果
    const translatedFilePath = missingFilePath.replace('_missing.json', '_translated.json');
    
    try {
      fs.writeFileSync(translatedFilePath, JSON.stringify(translations, null, 2), 'utf8');
      console.log(chalk.green(`\n✓ 翻译完成，已保存到 ${translatedFilePath}`));
      return translatedFilePath;
    } catch (error) {
      console.error(chalk.red(`\n✗ 无法保存翻译结果: ${error.message}`));
      return null;
    }
  }
  
  // 翻译一个批次
  async function translateBatch(items, targetLang, apiKey) {
    const languageName = languageNames[targetLang] || targetLang;
    
    // 准备提示
    const prompt = `
请将以下JSON键值对从源语言翻译成${languageName}。保持JSON格式不变，只翻译值。
不要翻译品牌名称、技术术语或占位符（如 {{year}}）。

源语言键值对:
${items.map(item => `"${item.key}": "${item.value}"`).join('\n')}

${languageName}翻译（仅返回JSON格式）:
`;

    // 调用 OpenAI API
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: `你是一个专业的翻译助手，精通多种语言。请将内容从源语言翻译成${languageName}，保持格式不变。` },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // 解析响应
    const content = response.data.choices[0].message.content.trim();
    
    // 尝试从响应中提取JSON
    let jsonContent = content;
    
    // 如果响应包含```json和```，则提取其中的内容
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      jsonContent = jsonMatch[1];
    }
    
    // 尝试解析JSON - 修复这里的问题
    try {
      // 检查是否已经是一个完整的JSON对象
      if (jsonContent.trim().startsWith('{') && jsonContent.trim().endsWith('}')) {
        // 直接解析完整的JSON对象
        const translatedItems = JSON.parse(jsonContent);
        
        // 创建结果对象
        const result = {};
        for (const item of items) {
          const key = item.key;
          if (translatedItems[key]) {
            result[key] = translatedItems[key];
          } else {
            console.warn(chalk.yellow(`警告：键 "${key}" 未在翻译响应中找到，使用原始值`));
            result[key] = item.value;
          }
        }
        
        return result;
      } else {
        // 尝试将键值对格式转换为完整的JSON对象
        const jsonStr = `{${jsonContent}}`;
        const translatedItems = JSON.parse(jsonStr);
        
        // 验证所有键都已翻译
        const result = {};
        for (const item of items) {
          if (translatedItems[item.key]) {
            result[item.key] = translatedItems[item.key];
          } else {
            console.warn(chalk.yellow(`警告：键 "${item.key}" 未在翻译响应中找到，使用原始值`));
            result[item.key] = item.value;
          }
        }
        
        return result;
      }
    } catch (error) {
      console.error(chalk.red(`解析翻译响应时出错: ${error.message}`));
      console.log(chalk.yellow('API 响应内容:'));
      console.log(content);
      
      // 尝试手动解析响应
      try {
        const result = {};
        // 从日志看，API返回的是一个完整的JSON对象，我们可以直接使用它
        console.log(chalk.blue('尝试直接使用API返回的JSON...'));
        
        // 直接使用API返回的JSON
        for (const item of items) {
          const key = item.key;
          // 从内容中提取键值对
          const regex = new RegExp(`"${key}"\\s*:\\s*"([^"]*)"`, 'i');
          const match = content.match(regex);
          if (match) {
            result[key] = match[1];
          } else {
            console.warn(chalk.yellow(`警告：无法从响应中提取键 "${key}" 的值，使用原始值`));
            result[key] = item.value;
          }
        }
        
        return result;
      } catch (parseError) {
        console.error(chalk.red(`手动解析也失败: ${parseError.message}`));
        throw new Error('无法解析翻译响应');
      }
    }
  }

  // 合并翻译
  function mergeTranslations(translationFilePath, targetLanguage, fileName) {
    console.log(chalk.blue(`\n合并翻译到 ${targetLanguage}/${fileName}\n`));
    
    // 检查目标语言目录是否存在
    const targetDir = path.join(localesDir, targetLanguage);
    if (!fs.existsSync(targetDir)) {
      console.error(chalk.red(`错误：目标语言目录 ${targetLanguage} 不存在`));
      return false;
    }
    
    // 检查目标文件是否存在
    const targetFilePath = path.join(targetDir, fileName);
    if (!fs.existsSync(targetFilePath)) {
      console.warn(chalk.yellow(`警告：目标文件 ${targetLanguage}/${fileName} 不存在，将创建新文件`));
    }
    
    // 读取翻译文件
    let translations;
    try {
      const content = fs.readFileSync(translationFilePath, 'utf8');
      translations = JSON.parse(content);
    } catch (error) {
      console.error(chalk.red(`错误：无法读取翻译文件 ${translationFilePath}: ${error.message}`));
      return false;
    }
    
    // 读取目标文件
    let targetFile = {};
    if (fs.existsSync(targetFilePath)) {
      try {
        const content = fs.readFileSync(targetFilePath, 'utf8');
        targetFile = JSON.parse(content);
      } catch (error) {
        console.error(chalk.red(`错误：无法读取目标文件 ${targetFilePath}: ${error.message}`));
        return false;
      }
    }
    
    // 合并翻译
    let mergeCount = 0;
    for (const [key, value] of Object.entries(translations)) {
      setNestedValue(targetFile, key, value);
      mergeCount++;
    }
    
    // 写入更新后的目标文件
    try {
      fs.writeFileSync(targetFilePath, JSON.stringify(targetFile, null, 2), 'utf8');
      console.log(chalk.green(`✓ 已成功将 ${mergeCount} 个翻译合并到 ${targetLanguage}/${fileName}`));
      return true;
    } catch (error) {
      console.error(chalk.red(`错误：无法写入目标文件 ${targetFilePath}: ${error.message}`));
      return false;
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

  // 根据点分隔的路径设置嵌套值
  function setNestedValue(obj, path, value) {
    const parts = path.split('.');
    let current = obj;
    
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!(part in current) || current[part] === null || typeof current[part] !== 'object') {
        current[part] = {};
      }
      current = current[part];
    }
    
    current[parts[parts.length - 1]] = value;
  }

  // 打印使用说明
  function printUsage() {
    console.log(`
翻译文件管理工具

使用方法:
  node locales-manager.js <命令> [参数]

命令:
  check      检查翻译文件的结构一致性
    参数:    <文件名> | --all
    示例:    node locales-manager.js check common.json
             node locales-manager.js check --all

  sync       同步翻译文件结构
    参数:    <文件名> [基准语言]
    示例:    node locales-manager.js sync common.json
             node locales-manager.js sync common.json en

  extract    提取需要翻译的内容
    参数:    <文件名> <目标语言> [--base <基准语言>]
    示例:    node locales-manager.js extract common.json fr
             node locales-manager.js extract common.json fr,ja,ko
             node locales-manager.js extract common.json --all

  translate  自动翻译缺失的内容
    参数:    <缺失翻译文件> <目标语言>
    示例:    node locales-manager.js translate temp/common_fr_missing.json fr

  merge      合并翻译内容到目标文件
    参数:    <翻译文件> <目标语言> [文件名]
    示例:    node locales-manager.js merge temp/common_fr_translated.json fr

  auto       自动执行整个工作流程 (检查->同步->提取->翻译->合并)
    参数:    <文件名> <目标语言> [--base <基准语言>]
    示例:    node locales-manager.js auto common.json fr
             node locales-manager.js auto common.json fr,ja,ko
             node locales-manager.js auto common.json --all

  help       显示此帮助信息
  `);
  }

  // 执行主函数
  main().catch(error => {
    console.error(chalk.red(`执行过程中发生错误: ${error.message}`));
    process.exit(1);
  });