
(function () {
    window.renderHeroes = function () {
        var container = document.getElementById('heroes-list');
        if (!container) return;

        container.innerHTML = renderHeroCards();
        bindCardEvents();
    };

    function renderHeroCards() {
        var heroes = GameState.getCollectionByType('hero');
        if (heroes.length === 0) {
            return '<div style="text-align:center;color:#8b9dab;padding:40px;">暂无侠客，去酒馆招募吧！</div>';
        }

        var html = '';
        html += '<div class="heroes-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:16px;padding:16px;">';
        
        for (var i = 0; i < heroes.length; i++) {
            var hero = heroes[i];
            var cardData = CHARACTER_CARDS.find(function (c) { return c.id === hero.id; });
            var rarityData = cardData ? RARITY[cardData.rarity] : null;
            var classData = cardData ? CLASSES[cardData.classId] : null;
            var rarityColor = rarityData ? rarityData.color : '#8b9dab';
            
            html += '<div class="hero-card" data-hero-id="' + hero.id + '" ';
            html += 'style="background:linear-gradient(180deg,#2a1a10,#1a0a05);border:2px solid ' + rarityColor + ';border-radius:12px;padding:12px;cursor:pointer;transition:transform 0.3s,box-shadow 0.3s;"';
            html += '>';
            
            html += '<div class="hero-image-container" style="width:100%;height:160px;background:rgba(0,0,0,0.3);border-radius:8px;overflow:hidden;margin-bottom:12px;">';
            if (cardData && cardData.imageUrl) {
                html += '<img src="' + cardData.imageUrl + '" alt="' + cardData.name + '" style="width:100%;height:100%;object-fit:cover;display:block;">';
            } else {
                html += '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#8b9dab;font-size:48px;">' + (classData ? classData.icon : '?') + '</div>';
            }
            html += '</div>';
            
            html += '<div class="card-rarity" style="color:' + rarityColor + ';font-size:12px;font-weight:bold;text-align:center;margin-bottom:4px;">' + (rarityData ? rarityData.name : '') + '</div>';
            html += '<div class="card-name" style="color:#f5e6c8;font-size:16px;font-weight:bold;text-align:center;margin-bottom:4px;">' + (cardData ? cardData.name : hero.id) + '</div>';
            html += '<div class="card-level" style="color:#8b9dab;font-size:12px;text-align:center;">Lv.' + hero.level + '</div>';
            html += '<div class="card-count" style="color:#d4a017;font-size:11px;text-align:center;margin-top:4px;">x' + hero.count + '</div>';
            
            html += '</div>';
        }
        
        html += '</div>';
        return html;
    }

    function bindCardEvents() {
        var cards = document.querySelectorAll('.hero-card');
        for (var i = 0; i < cards.length; i++) {
            cards[i].addEventListener('click', function () {
                var heroId = this.getAttribute('data-hero-id');
                showHeroDetail(heroId);
            });
        }
    }

    function showHeroDetail(heroId) {
        var heroEntry = GameState.state.collection[heroId];
        var cardData = CHARACTER_CARDS.find(function (c) { return c.id === heroId; });
        if (!cardData) return;

        var rarityData = RARITY[cardData.rarity];
        var classData = CLASSES[cardData.classId];
        var stats = GameState.getHeroStats(heroId, GameState.state.formation);

        var overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.95);display:flex;align-items:center;justify-content:center;z-index:2000;padding:20px;';

        var cgImageUrl = cardData.imageUrl || '';

        var html = '';
        html += '<div class="hero-detail-modal" style="background:linear-gradient(180deg,#2a1a10,#1a0a05);border:2px solid ' + rarityData.color + ';border-radius:16px;max-width:900px;width:100%;max-height:90vh;overflow:auto;padding:0;position:relative;">';
        
        html += '<button id="detail-close-btn" style="position:absolute;top:12px;right:12px;width:40px;height:40px;border-radius:50%;background:rgba(0,0,0,0.5);border:2px solid #8b9dab;color:#8b9dab;font-size:20px;cursor:pointer;z-index:10;">✕</button>';
        
        html += '<div style="width:100%;height:400px;background:linear-gradient(180deg,#1a0a05,#0a0503);position:relative;overflow:hidden;">';
        html += '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;">';
        if (cgImageUrl) {
            html += '<img src="' + cgImageUrl + '" alt="' + cardData.name + '" style="max-width:100%;max-height:100%;object-fit:contain;display:block;">';
        } else {
            html += '<div style="font-size:120px;color:' + rarityData.color + ';">' + (classData ? classData.icon : '?') + '</div>';
        }
        html += '</div>';
        html += '<div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,#0a0503);height:150px;pointer-events:none;"></div>';
        html += '</div>';

        html += '<div style="padding:24px;">';
        
        html += '<div style="display:flex;align-items:center;gap:16px;margin-bottom:24px;">';
        html += '<div style="width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,' + rarityData.color + ',' + rarityData.color + '60);display:flex;align-items:center;justify-content:center;font-size:32px;box-shadow:0 0 20px ' + rarityData.color + '60;">' + (classData ? classData.icon : '?') + '</div>';
        html += '<div>';
        html += '<div style="font-size:28px;font-weight:bold;color:#f5e6c8;margin-bottom:4px;">' + cardData.name + '</div>';
        html += '<div style="display:flex;gap:12px;color:#8b9dab;font-size:14px;">';
        html += '<span style="color:' + rarityData.color + ';">' + rarityData.name + '</span>';
        html += '<span>' + (classData ? classData.name : '未知') + '</span>';
        html += '<span>Lv.' + heroEntry.level + '</span>';
        html += '<span>' + cardData.element + '属性</span>';
        html += '</div>';
        html += '</div>';
        html += '</div>';

        html += '<div style="background:rgba(0,0,0,0.3);padding:16px;border-radius:8px;margin-bottom:24px;">';
        html += '<div style="color:#d4a017;font-size:14px;margin-bottom:8px;">📜 人物故事</div>';
        html += '<div style="color:#8b9dab;line-height:1.6;">' + cardData.description + '</div>';
        html += '</div>';

        html += '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-bottom:24px;">';
        html += '<div style="background:rgba(0,0,0,0.3);padding:16px;border-radius:8px;border-left:3px solid #e74c3c;">';
        html += '<div style="color:#8b9dab;font-size:12px;margin-bottom:4px;">❤️ 生命</div>';
        html += '<div style="color:#f5e6c8;font-size:24px;font-weight:bold;">' + stats.hp + '</div>';
        html += '</div>';
        html += '<div style="background:rgba(0,0,0,0.3);padding:16px;border-radius:8px;border-left:3px solid #3498db;">';
        html += '<div style="color:#8b9dab;font-size:12px;margin-bottom:4px;">⚔️ 攻击</div>';
        html += '<div style="color:#f5e6c8;font-size:24px;font-weight:bold;">' + stats.atk + '</div>';
        html += '</div>';
        html += '<div style="background:rgba(0,0,0,0.3);padding:16px;border-radius:8px;border-left:3px solid #2ecc71;">';
        html += '<div style="color:#8b9dab;font-size:12px;margin-bottom:4px;">🛡️ 防御</div>';
        html += '<div style="color:#f5e6c8;font-size:24px;font-weight:bold;">' + stats.def + '</div>';
        html += '</div>';
        html += '<div style="background:rgba(0,0,0,0.3);padding:16px;border-radius:8px;border-left:3px solid #9b59b6;">';
        html += '<div style="color:#8b9dab;font-size:12px;margin-bottom:4px;">💨 身法</div>';
        html += '<div style="color:#f5e6c8;font-size:24px;font-weight:bold;">' + stats.agi + '</div>';
        html += '</div>';
        html += '</div>';

        if (cardData.innateSkill) {
            html += '<div style="background:linear-gradient(135deg,rgba(155,89,182,0.2),rgba(155,89,182,0.05));padding:20px;border-radius:12px;border:1px solid rgba(155,89,182,0.3);">';
            html += '<div style="color:#9b59b6;font-size:14px;margin-bottom:12px;display:flex;align-items:center;gap:8px;">';
            html += '<span style="font-size:20px;">✨</span>';
            html += '<span style="font-weight:bold;">先天技能</span>';
            html += '</div>';
            html += '<div style="color:#f5e6c8;font-size:18px;font-weight:bold;margin-bottom:8px;">' + cardData.innateSkill.name + '</div>';
            html += '<div style="color:#8b9dab;line-height:1.6;">' + cardData.innateSkill.description + '</div>';
            html += '</div>';
        }

        html += '</div>';
        html += '</div>';

        overlay.innerHTML = html;
        document.body.appendChild(overlay);

        setTimeout(function () {
            var closeBtn = document.getElementById('detail-close-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', function () {
                    overlay.remove();
                });
            }
            overlay.addEventListener('click', function (e) {
                if (e.target === overlay) overlay.remove();
            });
        }, 50);
    }
})();
