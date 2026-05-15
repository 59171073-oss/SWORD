
(function () {
    var currentFilter = 'all';

    window.renderGalleryPage = function () {
        var grid = document.getElementById('gallery-grid');
        if (!grid) return;

        var tabBtns = document.querySelectorAll('.gallery-tab');
        for (var i = 0; i < tabBtns.length; i++) {
            tabBtns[i].onclick = function () {
                for (var j = 0; j < tabBtns.length; j++) {
                    tabBtns[j].classList.remove('active');
                }
                this.classList.add('active');
                currentFilter = this.getAttribute('data-gallery-filter');
                renderGalleryGrid();
            };
        }

        renderGalleryGrid();
    };

    function renderGalleryGrid() {
        var grid = document.getElementById('gallery-grid');
        if (!grid) return;

        var items = [];

        if (currentFilter === 'all' || currentFilter === 'protagonist') {
            var pStar = GameState.state.protagonist.star || 1;
            for (var s = 1; s <= 6; s++) {
                var imgUrl = PROTAGONIST.starImageUrls && PROTAGONIST.starImageUrls[s - 1] ? PROTAGONIST.starImageUrls[s - 1] : PROTAGONIST.imageUrl;
                items.push({
                    name: PROTAGONIST.name,
                    star: s,
                    imageUrl: imgUrl,
                    unlocked: s <= pStar,
                    type: 'protagonist'
                });
            }
        }

        if (currentFilter === 'all' || currentFilter === 'hero') {
            var heroes = GameState.getCollectionByType('hero');
            for (var i = 0; i < heroes.length; i++) {
                var hero = heroes[i];
                var cardData = CHARACTER_CARDS.find(function (c) { return c.id === hero.id; });
                if (!cardData || !cardData.starImageUrls) continue;
                var hStar = hero.star || 1;
                for (var s = 1; s <= 6; s++) {
                    var imgUrl = cardData.starImageUrls[s - 1] || cardData.imageUrl;
                    items.push({
                        name: cardData.name,
                        star: s,
                        imageUrl: imgUrl,
                        unlocked: s <= hStar,
                        type: 'hero'
                    });
                }
            }
        }

        if (items.length === 0) {
            grid.innerHTML = '<div style="text-align:center;color:#8b9dab;padding:40px;">暂无角色立绘</div>';
            return;
        }

        var html = '';
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            html += '<div class="gallery-item" data-index="' + i + '" style="background:linear-gradient(180deg,#2a1a10,#1a0a05);border:2px solid ' + (item.unlocked ? '#d4a017' : '#444') + ';border-radius:12px;padding:8px;cursor:pointer;position:relative;overflow:hidden;">';
            html += '<div style="width:100%;height:180px;background:rgba(0,0,0,0.3);border-radius:8px;overflow:hidden;position:relative;">';
            if (item.unlocked) {
                html += '<img src="' + item.imageUrl + '" alt="' + item.name + '" style="width:100%;height:100%;object-fit:cover;display:block;">';
            } else {
                html += '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#1a0a05;">';
                html += '<div style="font-size:48px;color:#444;">🔒</div>';
                html += '</div>';
            }
            html += '</div>';
            html += '<div style="padding:8px 4px 4px;">';
            html += '<div style="color:#f5e6c8;font-size:13px;font-weight:bold;text-align:center;">' + item.name + '</div>';
            html += '<div style="color:' + (item.unlocked ? '#f1c40f' : '#666') + ';font-size:12px;text-align:center;">⭐' + item.star + (item.unlocked ? '' : ' (未解锁)') + '</div>';
            html += '</div>';
            html += '</div>';
        }

        grid.innerHTML = html;

        var galleryItems = grid.querySelectorAll('.gallery-item');
        for (var i = 0; i < galleryItems.length; i++) {
            (function (idx) {
                galleryItems[i].onclick = function () {
                    var item = items[idx];
                    if (item.unlocked) {
                        showGalleryViewer(items, idx);
                    } else {
                        window.showToast('该立绘尚未解锁，升星后可欣赏');
                    }
                };
            })(i);
        }
    }

    function showGalleryViewer(items, startIndex) {
        var overlay = document.createElement('div');
        overlay.id = 'gallery-viewer-overlay';
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.95);display:flex;align-items:center;justify-content:center;z-index:3000;padding:20px;overflow:hidden;';

        var currentIndex = startIndex;

        function buildHtml() {
            var item = items[currentIndex];
            var html = '';
            html += '<div style="position:relative;max-width:100%;max-height:100%;display:flex;flex-direction:column;align-items:center;">';
            html += '<div style="position:absolute;top:-40px;left:0;right:0;text-align:center;color:#f5e6c8;font-size:18px;font-weight:bold;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + item.name + ' · ⭐' + item.star + '</div>';
            html += '<img src="' + item.imageUrl + '" style="max-width:90vw;max-height:75vh;object-fit:contain;border-radius:8px;box-shadow:0 0 40px rgba(0,0,0,0.8);" onerror="this.style.display=\'none\'">';
            html += '<div style="margin-top:16px;display:flex;gap:16px;align-items:center;">';
            html += '<button id="gallery-prev" style="padding:8px 16px;border-radius:6px;background:rgba(255,255,255,0.1);border:1px solid #8b9dab;color:#f5e6c8;cursor:pointer;font-size:14px;">◀ 上一张</button>';
            html += '<span style="color:#8b9dab;font-size:14px;">' + (currentIndex + 1) + ' / ' + items.length + '</span>';
            html += '<button id="gallery-next" style="padding:8px 16px;border-radius:6px;background:rgba(255,255,255,0.1);border:1px solid #8b9dab;color:#f5e6c8;cursor:pointer;font-size:14px;">下一张 ▶</button>';
            html += '</div>';
            html += '</div>';
            html += '<button id="gallery-close" style="position:absolute;top:16px;right:16px;width:44px;height:44px;border-radius:50%;background:rgba(0,0,0,0.5);border:2px solid #8b9dab;color:#8b9dab;font-size:20px;cursor:pointer;z-index:10;">✕</button>';
            return html;
        }

        overlay.innerHTML = buildHtml();
        document.body.appendChild(overlay);

        function refresh() {
            overlay.innerHTML = buildHtml();
            bindEvents();
        }

        function bindEvents() {
            var closeBtn = document.getElementById('gallery-close');
            if (closeBtn) {
                closeBtn.onclick = function () {
                    overlay.remove();
                };
            }

            var prevBtn = document.getElementById('gallery-prev');
            if (prevBtn) {
                prevBtn.onclick = function () {
                    do {
                        currentIndex = (currentIndex - 1 + items.length) % items.length;
                    } while (!items[currentIndex].unlocked && currentIndex !== startIndex);
                    if (!items[currentIndex].unlocked) {
                        window.showToast('没有更多已解锁的立绘');
                        return;
                    }
                    refresh();
                };
            }

            var nextBtn = document.getElementById('gallery-next');
            if (nextBtn) {
                nextBtn.onclick = function () {
                    do {
                        currentIndex = (currentIndex + 1) % items.length;
                    } while (!items[currentIndex].unlocked && currentIndex !== startIndex);
                    if (!items[currentIndex].unlocked) {
                        window.showToast('没有更多已解锁的立绘');
                        return;
                    }
                    refresh();
                };
            }
        }

        bindEvents();

        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) overlay.remove();
        });
    }
})();
