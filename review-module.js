// 今日复习模块功能

class ReviewModule {
    constructor() {
        this.reviewList = document.getElementById('review-list');
        this.noReviewToday = document.getElementById('no-review-today');
        this.todayReviewed = document.getElementById('today-reviewed');
        this.totalReviewed = document.getElementById('total-reviewed');
        this.totalKnown = document.getElementById('total-known');
        this.totalUnknown = document.getElementById('total-unknown');
        
        this.currentWords = [];
        this.currentWordIndex = 0;
    }

    // 初始化模块
    init() {
        this.render();
        this.updateStats();
    }

    // 渲染今日复习列表
    render() {
        this.currentWords = ebbinghausScheduler.getTodaysReviewWords(storageManager.getAllWords());
        
        if (this.currentWords.length === 0) {
            this.reviewList.innerHTML = '';
            this.noReviewToday.classList.remove('hidden');
            return;
        }
        
        this.noReviewToday.classList.add('hidden');
        this.reviewList.innerHTML = '';
        
        this.currentWords.forEach((word, index) => {
            const reviewItem = this.createReviewItem(word, index);
            this.reviewList.appendChild(reviewItem);
        });
    }

    // 创建复习项目元素
    createReviewItem(word, index) {
        const item = document.createElement('div');
        item.className = 'review-item';
        item.dataset.index = index;
        
        item.innerHTML = `
            <h3>${word.word}</h3>
            <p class="phonetic">${word.phonetic || ''}</p>
            <p class="translation">${word.translation}</p>
            <div class="review-buttons">
                <button class="review-btn known-btn" data-word="${word.word}" data-action="known">认识</button>
                <button class="review-btn unknown-btn" data-word="${word.word}" data-action="unknown">不认识</button>
            </div>
        `;
        
        // 添加事件监听器
        const knownBtn = item.querySelector('.known-btn');
        const unknownBtn = item.querySelector('.unknown-btn');
        const translationEl = item.querySelector('.translation');
        
        knownBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleKnown(word, true, item);
        });
        
        unknownBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleKnown(word, false, item);
        });
        
        return item;
    }

    // 处理用户点击"认识"或"不认识"
    handleKnown(word, isKnown, itemElement) {
        // 更新词汇状态
        const updatedWord = ebbinghausScheduler.updateWordWithFeedback(word, isKnown);
        storageManager.updateWord(updatedWord);
        
        if (isKnown) {
            // 如果用户认识，直接从列表中移除
            itemElement.remove();
            
            // 检查是否还有其他需要复习的单词
            const remainingWords = this.reviewList.querySelectorAll('.review-item');
            if (remainingWords.length === 0) {
                this.noReviewToday.classList.remove('hidden');
            }
        } else {
            // 如果用户不认识，显示翻译和音标，隐藏按钮
            const buttons = itemElement.querySelector('.review-buttons');
            const translation = itemElement.querySelector('.translation');
            const phonetic = itemElement.querySelector('.phonetic');
            
            buttons.style.display = 'none';
            translation.style.display = 'block';
            phonetic.style.display = 'block';
        }
        
        // 更新统计数据
        this.updateStats();
    }

    // 更新统计数据
    updateStats() {
        const allWords = storageManager.getAllWords();
        const stats = ebbinghausScheduler.getStats(allWords);
        
        this.todayReviewed.textContent = stats.todayCount;
        this.totalReviewed.textContent = stats.totalCount;
        this.totalKnown.textContent = stats.totalKnown;
        this.totalUnknown.textContent = stats.totalUnknown;
    }
}

// 全局今日复习模块实例
const reviewModule = new ReviewModule();