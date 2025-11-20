// 词汇数据模型和本地存储功能实现

// 词汇数据模型
class Word {
    constructor(word, translation, phonetic) {
        this.word = word;
        this.translation = translation;
        this.phonetic = phonetic;
        this.firstEntryDate = new Date().toISOString().split('T')[0];
        this.knownCount = 0;
        this.unknownCount = 0;
        this.lastReviewDate = new Date().toISOString().split('T')[0];
        this.ebbinghausInterval = 0; // 当前艾宾浩斯复习间隔（天）
    }
}

// 本地存储管理器
class StorageManager {
    constructor() {
        this.storageKey = 'walkingDictionaryWords';
    }

    // 获取所有词汇
    getAllWords() {
        const wordsData = localStorage.getItem(this.storageKey);
        if (!wordsData) {
            return [];
        }
        try {
            const words = JSON.parse(wordsData);
            // 将数据转换为Word对象实例
            return words.map(data => {
                const word = new Word(data.word, data.translation, data.phonetic);
                word.firstEntryDate = data.firstEntryDate;
                word.knownCount = data.knownCount;
                word.unknownCount = data.unknownCount;
                word.lastReviewDate = data.lastReviewDate;
                word.ebbinghausInterval = data.ebbinghausInterval;
                return word;
            });
        } catch (e) {
            console.error('解析词汇数据失败:', e);
            return [];
        }
    }

    // 保存词汇列表
    saveWords(words) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(words));
        } catch (e) {
            console.error('保存词汇数据失败:', e);
        }
    }

    // 添加新词汇
    addWord(word) {
        const words = this.getAllWords();
        // 检查是否已存在相同单词
        const existingIndex = words.findIndex(w => w.word.toLowerCase() === word.word.toLowerCase());
        if (existingIndex !== -1) {
            // 如果已存在，更新信息而不是添加新的
            words[existingIndex] = word;
        } else {
            words.push(word);
        }
        this.saveWords(words);
    }

    // 更新词汇
    updateWord(updatedWord) {
        const words = this.getAllWords();
        const index = words.findIndex(w => w.word.toLowerCase() === updatedWord.word.toLowerCase());
        if (index !== -1) {
            words[index] = updatedWord;
            this.saveWords(words);
        }
    }

    // 删除词汇
    deleteWord(word) {
        const words = this.getAllWords();
        const filteredWords = words.filter(w => w.word.toLowerCase() !== word.word.toLowerCase());
        this.saveWords(filteredWords);
    }

    // 重置存储
    clearAll() {
        localStorage.removeItem(this.storageKey);
    }
}

// 全局存储管理器实例
const storageManager = new StorageManager();