// 词汇录入模块功能（不包含词典API，将在后续实现）

class CreateModule {
    constructor() {
        this.wordInput = document.getElementById('word-input');
        this.queryBtn = document.getElementById('query-btn');
        this.queryResult = document.getElementById('query-result');
        this.wordDisplay = document.getElementById('word-display');
        this.phoneticDisplay = document.getElementById('phonetic-display');
        this.translationDisplay = document.getElementById('translation-display');
        this.saveBtn = document.getElementById('save-btn');
        
        this.currentWordData = null;
    }

    // 初始化模块
    init() {
        this.bindEvents();
    }

    // 绑定事件
    bindEvents() {
        this.queryBtn.addEventListener('click', () => {
            this.queryWord();
        });
        
        this.wordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.queryWord();
            }
        });
        
        this.saveBtn.addEventListener('click', () => {
            this.saveWord();
        });
    }

    // 查询单词（模拟功能，实际项目中需要集成真实词典API）
    async queryWord() {
        const word = this.wordInput.value.trim();
        
        if (!word) {
            alert('请输入单词');
            return;
        }
        
        // 模拟API调用延迟
        this.queryBtn.textContent = '查询中...';
        this.queryBtn.disabled = true;
        
        try {
            // 这里应该是真实的词典API调用，现在用模拟数据
            const wordData = await this.fetchWordData(word);
            
            if (wordData) {
                this.currentWordData = wordData;
                this.displayWordData(wordData);
                this.queryResult.classList.remove('hidden');
            } else {
                alert('未找到该单词，请检查拼写');
                this.queryResult.classList.add('hidden');
            }
        } catch (error) {
            console.error('查询单词失败:', error);
            alert('查询失败，请稍后重试');
            this.queryResult.classList.add('hidden');
        } finally {
            this.queryBtn.textContent = '查询';
            this.queryBtn.disabled = false;
        }
    }

    // 获取单词数据（使用词典API）
    async fetchWordData(word) {
        // 如果存在DictionaryAPI类，使用真实的API，否则使用模拟数据
        if (typeof DictionaryAPI !== 'undefined') {
            return await DictionaryAPI.fetchWordData(word);
        } else {
            // 如果没有API类，使用模拟数据
            return this.getMockWordData(word);
        }
    }

    // 获取单词数据（模拟函数，作为备用方案）
    getMockWordData(word) {
        // 模拟API请求，作为备用方案
        return new Promise((resolve) => {
            setTimeout(() => {
                // 模拟返回单词数据，实际项目中应该从API获取
                const mockData = {
                    word: word,
                    translation: this.getMockTranslation(word),
                    phonetic: this.getMockPhonetic(word)
                };
                
                resolve(mockData);
            }, 500); // 模拟网络延迟
        });
    }

    // 获取模拟翻译（备用方案）
    getMockTranslation(word) {
        // 为演示目的，返回简单的模拟翻译
        const translations = {
            'hello': '你好',
            'world': '世界',
            'computer': '计算机',
            'programming': '编程',
            'javascript': 'JavaScript',
            'algorithm': '算法',
            'data': '数据',
            'structure': '结构',
            'function': '函数',
            'variable': '变量'
        };
        
        const lowerWord = word.toLowerCase();
        return translations[lowerWord] || `[${word}]的翻译`;
    }

    // 获取模拟音标（备用方案）
    getMockPhonetic(word) {
        // 为演示目的，返回简单的模拟音标
        const phonetics = {
            'hello': '/həˈləʊ/',
            'world': '/wɜːld/',
            'computer': '/kəmˈpjuːtər/',
            'programming': '/ˈprəʊɡræmɪŋ/',
            'javascript': '/ˈdʒɑːvəskrɪpt/',
            'algorithm': '/ˈælɡərɪðəm/',
            'data': '/ˈdeɪtə/',
            'structure': '/ˈstrʌktʃər/',
            'function': '/ˈfʌŋkʃn/',
            'variable': '/ˈveəriəbl/'
        };
        
        const lowerWord = word.toLowerCase();
        return phonetics[lowerWord] || `[${word}]的音标`;
    }

    // 显示单词数据
    displayWordData(wordData) {
        this.wordDisplay.textContent = wordData.word;
        this.phoneticDisplay.textContent = wordData.phonetic || '';
        this.translationDisplay.textContent = wordData.translation;
    }

    // 保存单词到本地存储
    saveWord() {
        if (!this.currentWordData) {
            alert('请先查询单词');
            return;
        }
        
        const word = new Word(
            this.currentWordData.word,
            this.currentWordData.translation,
            this.currentWordData.phonetic
        );
        
        // 初始化词汇复习数据
        word.knownCount = 0;
        word.unknownCount = 0;
        word.ebbinghausInterval = 0; // 从第一个间隔开始
        
        storageManager.addWord(word);
        
        // 重置表单
        this.wordInput.value = '';
        this.queryResult.classList.add('hidden');
        this.currentWordData = null;
        
        alert('单词录入成功！');
        
        // 如果在单词库页面，需要刷新显示
        if (typeof libraryModule !== 'undefined') {
            libraryModule.render();
        }
        
        // 如果在今日复习页面，可能需要更新统计
        if (typeof reviewModule !== 'undefined') {
            reviewModule.updateStats();
        }
    }
}

// 全局创建模块实例
const createModule = new CreateModule();