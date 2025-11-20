// 底部导航栏和页面切换功能

class NavigationManager {
    constructor() {
        this.reviewPage = document.getElementById('review-page');
        this.createPage = document.getElementById('create-page');
        this.libraryPage = document.getElementById('library-page');
        
        this.reviewNavBtn = document.getElementById('review-nav-btn');
        this.createNavBtn = document.getElementById('create-nav-btn');
        this.libraryNavBtn = document.getElementById('library-nav-btn');
        
        this.currentPage = 'review-page';
    }

    // 初始化导航
    init() {
        this.bindEvents();
        this.showPage(this.currentPage);
    }

    // 绑定导航事件
    bindEvents() {
        this.reviewNavBtn.addEventListener('click', () => {
            this.switchToPage('review-page');
        });
        
        this.createNavBtn.addEventListener('click', () => {
            this.switchToPage('create-page');
        });
        
        this.libraryNavBtn.addEventListener('click', () => {
            this.switchToPage('library-page');
        });
    }

    // 切换到指定页面
    switchToPage(pageId) {
        this.showPage(pageId);
        this.currentPage = pageId;
        
        // 更新导航按钮的活动状态
        this.updateActiveNavButton(pageId);
        
        // 根据页面类型执行特定操作
        this.handlePageActivation(pageId);
    }

    // 显示指定页面
    showPage(pageId) {
        // 隐藏所有页面
        this.reviewPage.classList.remove('active');
        this.createPage.classList.remove('active');
        this.libraryPage.classList.remove('active');
        
        // 隐藏所有页面并添加hidden类
        this.reviewPage.classList.add('hidden');
        this.createPage.classList.add('hidden');
        this.libraryPage.classList.add('hidden');
        
        // 显示目标页面
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.remove('hidden');
            targetPage.classList.add('active');
        }
    }

    // 更新活动导航按钮
    updateActiveNavButton(pageId) {
        // 移除所有活动状态
        this.reviewNavBtn.classList.remove('active');
        this.createNavBtn.classList.remove('active');
        this.libraryNavBtn.classList.remove('active');
        
        // 添加当前页面的活动状态
        const activeBtn = document.querySelector(`[data-page="${pageId}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    // 处理页面激活时的特定操作
    handlePageActivation(pageId) {
        switch (pageId) {
            case 'review-page':
                // 当切换到复习页面时，重新渲染复习列表
                if (typeof reviewModule !== 'undefined') {
                    reviewModule.render();
                    reviewModule.updateStats();
                }
                break;
                
            case 'create-page':
                // 当切换到创建页面时，聚焦输入框
                const wordInput = document.getElementById('word-input');
                if (wordInput) {
                    setTimeout(() => {
                        wordInput.focus();
                    }, 100);
                }
                break;
                
            case 'library-page':
                // 当切换到单词库页面时，重新渲染列表
                if (typeof libraryModule !== 'undefined') {
                    libraryModule.render();
                }
                break;
                
            default:
                break;
        }
    }
}

// 全局导航管理器实例
const navManager = new NavigationManager();