// 单词库模块功能

class LibraryModule {
    constructor() {
        this.libraryTbody = document.getElementById('library-tbody');
    }

    // 初始化模块
    init() {
        this.render();
    }

    // 渲染单词库列表
    render() {
        const allWords = storageManager.getAllWords();
        
        // 按录入时间倒序排列（最新录入在前）
        const sortedWords = allWords.sort((a, b) => {
            return new Date(b.firstEntryDate) - new Date(a.firstEntryDate);
        });
        
        this.libraryTbody.innerHTML = '';
        
        if (sortedWords.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="6" style="text-align: center;">还没有录入任何单词</td>';
            this.libraryTbody.appendChild(row);
            return;
        }
        
        sortedWords.forEach((word, index) => {
            const row = this.createWordRow(word, index);
            this.libraryTbody.appendChild(row);
        });
    }

    // 创建单词行元素
    createWordRow(word, index) {
        const row = document.createElement('tr');
        row.dataset.word = word.word;
        
        row.innerHTML = `
            <td>${word.word}</td>
            <td>${word.translation}</td>
            <td>${word.phonetic || ''}</td>
            <td>${word.knownCount}</td>
            <td>${word.unknownCount}</td>
            <td>
                <button class="edit-btn" data-word="${word.word}">编辑</button>
                <button class="delete-btn" data-word="${word.word}">删除</button>
            </td>
        `;
        
        // 添加删除按钮事件
        const deleteBtn = row.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.deleteWord(word);
        });
        
        // 添加编辑按钮事件
        const editBtn = row.querySelector('.edit-btn');
        editBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.editWord(word);
        });
        
        return row;
    }

    // 删除单词
    deleteWord(word) {
        if (confirm(`确定要删除单词 "${word.word}" 吗？`)) {
            storageManager.deleteWord(word);
            this.render(); // 重新渲染列表
            
            // 如果在今日复习页面，可能需要更新统计
            if (typeof reviewModule !== 'undefined') {
                reviewModule.updateStats();
            }
        }
    }

    // 编辑单词
    editWord(word) {
        const newTranslation = prompt('请输入新的翻译:', word.translation);
        if (newTranslation !== null && newTranslation.trim() !== '') {
            word.translation = newTranslation.trim();
            
            const newPhonetic = prompt('请输入新的音标 (可选):', word.phonetic || '');
            if (newPhonetic !== null) {
                word.phonetic = newPhonetic.trim() || null;
            }
            
            storageManager.updateWord(word);
            this.render(); // 重新渲染列表
        }
    }
}

// 全局单词库模块实例
const libraryModule = new LibraryModule();