
(function () {
    var currentFilter = 'all';

    window.renderCollectionPage = function () {
        var grid = document.getElementById('collection-grid');
        if (!grid) return;

        var filterBtns = document.querySelectorAll('.collection-filters .filter-btn');
        for (var i = 0; i < filterBtns.length; i++) {
            filterBtns[i].onclick = function () {
                for (var j = 0; j < filterBtns.length; j++) {
                    filterBtns[j].classList.remove('active');
                }
                this.classList.add('active');
                currentFilter = this.getAttribute('data-filter');
                renderCollectionGrid();
            };
        }

        renderCollectionGrid();
    };

    function renderCollectionGrid() {
        var grid = document.getElementById('collection-grid');
        if (!grid) return;

        var collection = GameState.state.collection;
        var cards = [];

        for (var id in collection) {
            var entry = collection[id];
            if (currentFilter === 'all') {
                cards.push(entry);
            } else if (currentFilter === 'hero' && entry.type === 'hero') {
                cards.push(entry);
            } else if (currentFilter === 'equip' && (entry.type === 'weapon' || entry.type === 'armor' || entry.type === 'accessory')) {
                cards.push(entry);
            } else if (currentFilter === 'skill' && entry.type === 'skill') {
                cards.push(entry);
            }
        }

        if (cards.length === 0) {
            grid.innerHTML = '<div style="text-align:center;color:#8b9dab;padding:40px;">暂无卡牌，去酒馆抽卡吧！</div>';
            return;
        }

        var html = '';
        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            var cardData = null;
            var displayName = card.id;
            var displayType = '';
            var description = '';
            var imageUrl = null;

            if (card.type === 'hero') {
                cardData = CHARACTER_CARDS.find(function (c) { return c.id === card.id; });
                displayType = '侠客';
                if (cardData) {
                    displayName = cardData.name;
                    description = cardData.description;
                    imageUrl = cardData.imageUrl;
                }
            } else if (card.type === 'skill') {
                cardData = SKILL_CARDS.find(function (c) { return c.id === card.id; });
                displayType = '武学';
                if (cardData) {
                    displayName = cardData.name;
                    description = cardData.description || cardData.effect || '';
                }
            } else {
                cardData = EQUIPMENT_CARDS.find(function (c) { return c.id === card.id; });
                displayType = card.type === 'weapon' ? '武器' : (card.type === 'armor' ? '护甲' : '饰品');
                if (cardData) {
                    displayName = cardData.name;
                    description = cardData.description;
                }
            }

            var rarityData = RARITY[card.rarity];
            var isEquipped = GameState.isCardEquipped(card.id);
            var maxLevel = GameState.getCardMaxLevel(card.type);
            var canUpgrade = card.count > 1 && card.level < maxLevel;
            var canSell = card.count > 0 && !isEquipped;

            html += '<div class="collection-card" style="background:linear-gradient(180deg,#2a1a10,#1a0a05);border:2px solid ' + (rarityData ? rarityData.color : '#8b9dab') + ';border-radius:12px;padding:12px;text-align:center;' + (isEquipped ? 'opacity:0.7;' : '') + '">';

            if (imageUrl) {
                html += '<img src="' + imageUrl + '" alt="' + displayName + '" style="width:100%;height:120px;object-fit:cover;border-radius:8px;margin-bottom:8px;" onerror="this.style.display=\'none\'">';
            }

            html += '<div style="color:' + (rarityData ? rarityData.color : '#8b9dab') + ';font-size:12px;font-weight:bold;margin-bottom:4px;">' + (rarityData ? rarityData.name : '') + '</div>';
            html += '<div style="color:#f5e6c8;font-size:14px;font-weight:bold;margin-bottom:4px;">' + displayName + '</div>';
            html += '<div style="color:#8b9dab;font-size:11px;margin-bottom:4px;">' + displayType + ' · Lv.' + card.level + '</div>';
            html += '<div style="color:#d4a017;font-size:11px;margin-bottom:8px;">x' + card.count + (isEquipped ? ' (已装备)' : '') + '</div>';

            if (description) {
                html += '<div style="color:#8b9dab;font-size:10px;line-height:1.4;margin-bottom:8px;">' + description + '</div>';
            }

            html += '<div style="display:flex;gap:6px;justify-content:center;">';
            if (canUpgrade) {
                html += '<button class="btn-ancient coll-upgrade-btn" data-card-id="' + card.id + '" style="padding:4px 10px;font-size:11px;">升级</button>';
            }
            if (canSell) {
                html += '<button class="btn-ancient coll-sell-btn" data-card-id="' + card.id + '" style="padding:4px 10px;font-size:11px;background:linear-gradient(180deg,#3d1a1a,#2a1010);">卖出</button>';
            }
            html += '</div>';

            html += '</div>';
        }

        grid.innerHTML = html;

        var upgradeBtns = grid.querySelectorAll('.coll-upgrade-btn');
        for (var i = 0; i < upgradeBtns.length; i++) {
            upgradeBtns[i].onclick = function () {
                var cardId = this.getAttribute('data-card-id');
                if (GameState.upgradeCard(cardId)) {
                    window.showToast('升级成功！');
                    renderCollectionGrid();
                } else {
                    window.showToast('升级失败');
                }
            };
        }

        var sellBtns = grid.querySelectorAll('.coll-sell-btn');
        for (var i = 0; i < sellBtns.length; i++) {
            sellBtns[i].onclick = function () {
                var cardId = this.getAttribute('data-card-id');
                var price = GameState.getCardSellPrice(cardId);
                if (price > 0) {
                    GameState.sellCard(cardId);
                    window.showToast('卖出获得 ' + price + ' 金币');
                    renderCollectionGrid();
                    window.updateStatusBar();
                }
            };
        }
    }
})();
