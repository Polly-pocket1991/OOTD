// 艾宾浩斯遗忘曲线复习逻辑

class EbbinghausScheduler {
    constructor() {
        // 艾宾浩斯复习间隔（天数）：0天 -> 1天 -> 3天 -> 7天 -> 15天 -> 30天 -> 永久
        this.reviewIntervals = [0, 1, 3, 7, 15, 30];
    }

    // 计算下一个复习日期
    calculateNextReviewDate(lastReviewDate, currentIntervalIndex) {
        if (currentIntervalIndex >= this.reviewIntervals.length) {
            // 如果已经超过了预设的最大间隔，返回null表示永久记住
            return null;
        }
        
        const intervalDays = this.reviewIntervals[currentIntervalIndex];
        const lastReview = new Date(lastReviewDate);
        const nextReview = new Date(lastReview);
        nextReview.setDate(lastReview.getDate() + intervalDays);
        
        return nextReview.toISOString().split('T')[0]; // 返回YYYY-MM-DD格式
    }

    // 根据用户反馈更新词汇复习状态
    updateWordWithFeedback(word, isKnown) {
        const today = new Date().toISOString().split('T')[0];
        word.lastReviewDate = today;
        
        if (isKnown) {
            // 用户认识该单词
            word.knownCount += 1;
            
            // 如果当前间隔索引小于最大值，推进到下一个间隔
            const currentIntervalIndex = this.getIntervalIndex(word.ebbinghausInterval);
            if (currentIntervalIndex < this.reviewIntervals.length - 1) {
                word.ebbinghausInterval = this.reviewIntervals[currentIntervalIndex + 1];
            } else {
                // 已经在最后一个间隔，保持不变
                word.ebbinghausInterval = this.reviewIntervals[this.reviewIntervals.length - 1];
            }
        } else {
            // 用户不认识该单词
            word.unknownCount += 1;
            
            // 重置为第一个复习周期
            word.ebbinghausInterval = this.reviewIntervals[0];
        }
        
        return word;
    }

    // 获取当前间隔在预设间隔数组中的索引
    getIntervalIndex(intervalDays) {
        return this.reviewIntervals.indexOf(intervalDays);
    }

    // 检查词汇是否需要在今天复习
    isReviewDue(word) {
        const today = new Date().toISOString().split('T')[0];
        const nextReviewDate = this.calculateNextReviewDate(word.lastReviewDate, this.getIntervalIndex(word.ebbinghausInterval));
        
        if (nextReviewDate === null) {
            // 如果计算出的复习日期为null，表示已经永久记住，不需要再复习
            return false;
        }
        
        // 如果下一个复习日期小于等于今天，则需要复习
        return nextReviewDate <= today;
    }

    // 获取今天需要复习的词汇列表
    getTodaysReviewWords(allWords) {
        return allWords.filter(word => this.isReviewDue(word));
    }

    // 获取统计信息
    getStats(allWords) {
        const today = new Date().toISOString().split('T')[0];
        const todaysReviewWords = this.getTodaysReviewWords(allWords);
        
        let totalKnown = 0;
        let totalUnknown = 0;
        
        allWords.forEach(word => {
            totalKnown += word.knownCount;
            totalUnknown += word.unknownCount;
        });
        
        return {
            todayCount: todaysReviewWords.length,
            totalCount: allWords.length,
            totalKnown: totalKnown,
            totalUnknown: totalUnknown
        };
    }
}

// 全局艾宾浩斯调度器实例
const ebbinghausScheduler = new EbbinghausScheduler();