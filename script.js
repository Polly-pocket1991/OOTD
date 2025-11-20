// 完整的Walking Dictionary应用

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有模块
    initApp();
    
    // 添加一些示例数据用于测试
    addSampleDataIfNeeded();
});

// 初始化应用
function initApp() {
    // 初始化各模块
    if (typeof reviewModule !== 'undefined') {
        reviewModule.init();
    }
    
    if (typeof createModule !== 'undefined') {
        createModule.init();
    }
    
    if (typeof libraryModule !== 'undefined') {
        libraryModule.init();
    }
    
    if (typeof navManager !== 'undefined') {
        navManager.init();
    }
    
    // 如果有词典API密钥，更新创建模块的查询方法
    if (typeof DictionaryAPI !== 'undefined') {
        // 替换创建模块中的fetchWordData方法
        createModule.fetchWordData = DictionaryAPI.fetchWordData;
    }
}

// 添加示例数据（仅用于首次访问时的演示）
function addSampleDataIfNeeded() {
    const words = storageManager.getAllWords();
    if (words.length === 0) {
        // 添加一些示例单词
        const sampleWords = [
            new Word('hello', '你好', '/həˈləʊ/'),
            new Word('world', '世界', '/wɜːld/'),
            new Word('computer', '计算机', '/kəmˈpjuːtər/'),
            new Word('programming', '编程', '/ˈprəʊɡræmɪŋ/')
        ];
        
        // 设置一些复习数据
        sampleWords[0].knownCount = 2;
        sampleWords[0].unknownCount = 1;
        sampleWords[0].ebbinghausInterval = 1; // 1天间隔
        
        sampleWords[1].knownCount = 1;
        sampleWords[1].unknownCount = 0;
        sampleWords[1].ebbinghausInterval = 0; // 0天间隔
        
        sampleWords[2].knownCount = 3;
        sampleWords[2].unknownCount = 2;
        sampleWords[2].ebbinghausInterval = 3; // 7天间隔
        
        // 设置最后复习日期为前几天以确保它们出现在今日复习中
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 2);
        sampleWords[0].lastReviewDate = pastDate.toISOString().split('T')[0];
        sampleWords[1].lastReviewDate = pastDate.toISOString().split('T')[0];
        sampleWords[2].lastReviewDate = pastDate.toISOString().split('T')[0];
        
        // 保存示例数据
        sampleWords.forEach(word => {
            storageManager.addWord(word);
        });
    }
}

// 词典API类（使用免费的词汇API）
class DictionaryAPI {
    // 使用Free Dictionary API
    static async fetchWordData(word) {
        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Word not found');
                }
                throw new Error(`API request failed with status ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data || data.length === 0) {
                throw new Error('No definitions found');
            }
            
            // 提取音标和定义
            let phonetic = '';
            let translation = '';
            
            // 查找音标
            if (data[0].phonetic) {
                phonetic = data[0].phonetic;
            } else if (data[0].phonetics && data[0].phonetics.length > 0) {
                // 使用第一个有效的音标
                for (const phoneticObj of data[0].phonetics) {
                    if (phoneticObj.text) {
                        phonetic = phoneticObj.text;
                        break;
                    }
                }
            }
            
            // 提取翻译（定义）
            if (data[0].meanings && data[0].meanings.length > 0) {
                const meanings = data[0].meanings;
                const definitions = [];
                
                for (const meaning of meanings) {
                    if (meaning.definitions && meaning.definitions.length > 0) {
                        // 获取每个词性的第一个定义
                        const firstDefinition = meaning.definitions[0];
                        definitions.push(firstDefinition.definition);
                    }
                }
                
                translation = definitions.join('; ');
            }
            
            return {
                word: word,
                translation: translation || `[${word}] definition not found`,
                phonetic: phonetic || `[${word}] phonetic not found`
            };
        } catch (error) {
            console.error('Dictionary API error:', error);
            // 如果API调用失败，返回null让应用使用备用方案
            return null;
        }
    }
}