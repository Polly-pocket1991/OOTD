// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 获取所有季节标签
    const seasonTabs = document.querySelectorAll('.season-tab');
    const seasonContents = document.querySelectorAll('.season-content');
    
    // 为每个标签添加点击事件监听器
    seasonTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 获取目标季节
            const targetSeason = this.getAttribute('data-season');
            
            // 移除所有活动状态
            seasonTabs.forEach(t => t.classList.remove('active'));
            seasonContents.forEach(content => content.classList.remove('active'));
            
            // 添加活动状态到当前标签和对应内容
            this.classList.add('active');
            document.getElementById(targetSeason).classList.add('active');
            
            // 添加点击动画效果
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    // 图片懒加载功能
    const lazyImages = document.querySelectorAll('.outfit-image');
    
    // 创建Intersection Observer
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.01
    });
    
    // 观察所有图片
    lazyImages.forEach(img => {
        img.classList.add('lazy-image');
        imageObserver.observe(img);
    });
    
    // 穿搭卡片点击效果
    const outfitCards = document.querySelectorAll('.outfit-card');
    
    outfitCards.forEach(card => {
        card.addEventListener('click', function() {
            // 添加点击波纹效果
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
            
            // 可以在这里添加更多功能，比如打开详情页面
            console.log('点击了穿搭卡片:', this.querySelector('h3').textContent);
        });
        
        // 鼠标悬停效果增强
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // 平滑滚动到顶部功能
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // 添加滚动到顶部按钮（当页面滚动时显示）
    let scrollTopBtn = null;
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            if (!scrollTopBtn) {
                scrollTopBtn = document.createElement('button');
                scrollTopBtn.innerHTML = '↑';
                scrollTopBtn.style.cssText = `
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    cursor: pointer;
                    font-size: 20px;
                    font-weight: bold;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    z-index: 1000;
                    transition: all 0.3s ease;
                `;
                
                scrollTopBtn.addEventListener('click', scrollToTop);
                scrollTopBtn.addEventListener('mouseenter', function() {
                    this.style.transform = 'scale(1.1)';
                });
                scrollTopBtn.addEventListener('mouseleave', function() {
                    this.style.transform = 'scale(1)';
                });
                
                document.body.appendChild(scrollTopBtn);
            }
        } else {
            if (scrollTopBtn) {
                document.body.removeChild(scrollTopBtn);
                scrollTopBtn = null;
            }
        }
    });
    
    // 键盘导航支持
    document.addEventListener('keydown', function(e) {
        const activeTab = document.querySelector('.season-tab.active');
        const tabs = Array.from(seasonTabs);
        const currentIndex = tabs.indexOf(activeTab);
        
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
            tabs[currentIndex - 1].click();
        } else if (e.key === 'ArrowRight' && currentIndex < tabs.length - 1) {
            tabs[currentIndex + 1].click();
        }
    });
    
    // 触摸滑动支持（移动端）
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const activeTab = document.querySelector('.season-tab.active');
        const tabs = Array.from(seasonTabs);
        const currentIndex = tabs.indexOf(activeTab);
        
        if (touchEndX < touchStartX - swipeThreshold && currentIndex < tabs.length - 1) {
            // 向左滑动，切换到下一个季节
            tabs[currentIndex + 1].click();
        } else if (touchEndX > touchStartX + swipeThreshold && currentIndex > 0) {
            // 向右滑动，切换到上一个季节
            tabs[currentIndex - 1].click();
        }
    }
    
    // 页面加载动画
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease-in-out';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });
    
    // 错误处理：图片加载失败时显示占位图
    lazyImages.forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDQwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjZjBmMGYwIi8+CjxwYXRoIGQ9Ik0yMDAgMzAwTDE3NSAzNTBIMjI1TDIwMCAzMDBaIiBmaWxsPSIjY2NjIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMzgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LXNpemU9IjE0Ij7lm77niYfkuabmnLo8L3RleHQ+Cjwvc3ZnPgo=';
            this.alt = '图片加载失败';
        });
    });
    
    console.log('四季穿搭网站已加载完成！');
});

// 工具函数：防抖
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 工具函数：节流
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}