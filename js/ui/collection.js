const CollectionUI = {
    container: null,
    currentFilter: 'all',
    currentView: 'hero',

    init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        this.render();
    },

    render() {
        if (!this.container) return;

        const heroes = GameState.getCollectionByType('hero');
        const skills = GameState.getCollectionByType('skill');
        const equipment = GameState.getCollectionByType('weapon').concat(
            GameState.getCollectionByType('armor'),
            GameState.getCollectionByType('accessory')
        );

        this.container.innerHTML = `
            <div class="collection-container">
                <div class="collection-header">
                    <h2>我的收藏</h2>
                    <div class="collection-tabs">
                        <button class="tab-btn active" data-view="hero">英雄</button>
                        <button class="tab-btn" data-view="skill">武学</button>
                        <button class="tab-btn" data-view="equipment">装备</button>
                    </div>
                    <div class="collection-filter">
                        <select id="filter-rarity">
                            <option value="all">全部稀有度</option>
                            <option value="COMMON">普通</option>
                            <option value="FINE">精良</option>
                            <option value="RARE">稀有</option>
                            <option value="LEGEND">传说</option>
                        </select>
                    </div>
                </div>
                <div class="collection-grid" id="collection-grid"></div>
            </div>
        `;

        this.bindEvents();
        this.renderCards(heroes);
    },

    bindEvents() {
        const tabs = this.container.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.currentView = tab.dataset.view;
                this.renderCards(this.getFilteredCards());
            });
        });

        const filterSelect = document.getElementById('filter-rarity');
        filterSelect.addEventListener('change', () => {
            this.currentFilter = filterSelect.value;
            this.renderCards(this.getFilteredCards());
        });
    },

    getFilteredCards() {
        const heroes = GameState.getCollectionByType('hero');
        const skills = GameState.getCollectionByType('skill');
        const equipment = GameState.getCollectionByType('weapon').concat(
            GameState.getCollectionByType('armor'),
            GameState.getCollectionByType('accessory')
        );

        let cards = [];
        switch (this.currentView) {
            case 'hero': cards = heroes; break;
            case 'skill': cards = skills; break;
            case 'equipment': cards = equipment; break;
        }

        if (this.currentFilter !== 'all') {
            cards = cards.filter(c => c.rarity === this.currentFilter);
        }

        return cards;
    },

    renderCards(cards) {
        const grid = document.getElementById('collection-grid');
        if (!grid) return;

        if (cards.length === 0) {
            grid.innerHTML = '<div class="empty-collection">暂无卡牌</div>';
            return;
        }

        grid.innerHTML = cards.map(card => {
            let cardData, displayName;
            const rarityData = RARITY[card.rarity];

            switch (this.currentView) {
                case 'hero':
                    cardData = CHARACTER_CARDS.find(c => c.id === card.id);
                    displayName = cardData ? cardData.name : card.id;
                    break;
                case 'skill':
                    cardData = SKILL_CARDS.find(c => c.id === card.id);
                    displayName = cardData ? cardData.name : card.id;
                    break;
                case 'equipment':
                    cardData = EQUIPMENT_CARDS.find(c => c.id === card.id);
                    displayName = cardData ? cardData.name : card.id;
                    break;
            }

            const isEquipped = GameState.isCardEquipped(card.id);
            const maxLevel = GameState.getCardMaxLevel(card.type);
            const canUpgrade = card.count > 1 && card.level < maxLevel;

            let imageUrl = '';
            if (cardData && cardData.imageUrl) {
                imageUrl = `<img src="${cardData.imageUrl}" alt="${displayName}" class="card-image" onerror="this.style.display='none'">`;
            }

            return `
                <div class="collection-card rarity-${card.rarity.toLowerCase()} ${isEquipped ? 'equipped' : ''}" data-card-id="${card.id}">
                    ${imageUrl}
                    <div class="card-rarity">${rarityData.name}</div>
                    <div class="card-name">${displayName}</div>
                    <div class="card-level">Lv.${card.level}</div>
                    <div class="card-count">x${card.count}</div>
                    ${canUpgrade ? `<button class="upgrade-btn" data-card-id="${card.id}">升级</button>` : ''}
                    <button class="detail-btn" data-card-id="${card.id}">详情</button>
                </div>
            `;
        }).join('');

        grid.querySelectorAll('.upgrade-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const cardId = btn.dataset.cardId;
                this.upgradeCard(cardId);
            });
        });

        grid.querySelectorAll('.detail-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const cardId = btn.dataset.cardId;
                this.showCardDetail(cardId);
            });
        });
    },

    upgradeCard(cardId) {
        const entry = GameState.state.collection[cardId];
        if (!entry) return;

        const maxLevel = GameState.getCardMaxLevel(entry.type);

        if (entry.count <= 1) {
            alert('需要至少2张同名卡牌才能升级');
            return;
        }

        if (entry.level >= maxLevel) {
            alert('已达到最高等级');
            return;
        }

        if (confirm(`确定要消耗1张${entry.id}将等级从${entry.level}提升到${entry.level + 1}吗？`)) {
            if (GameState.upgradeCard(cardId)) {
                this.renderCards(this.getFilteredCards());
            } else {
                alert('升级失败');
            }
        }
    },

    showCardDetail(cardId) {
        const entry = GameState.state.collection[cardId];
        if (!entry) return;

        let cardData, displayName, displayType, description;
        const rarityData = RARITY[entry.rarity];

        switch (entry.type) {
            case 'hero':
                cardData = CHARACTER_CARDS.find(c => c.id === card.id);
                displayName = cardData ? cardData.name : card.id;
                displayType = '英雄';
                description = cardData ? cardData.description : '';
                break;
            case 'skill':
                cardData = SKILL_CARDS.find(c => c.id === card.id);
                displayName = cardData ? cardData.name : card.id;
                displayType = '武学';
                description = cardData ? cardData.description : '';
                break;
            case 'weapon':
            case 'armor':
            case 'accessory':
                cardData = EQUIPMENT_CARDS.find(c => c.id === card.id);
                displayName = cardData ? cardData.name : card.id;
                displayType = '装备';
                description = cardData ? cardData.description : '';
                break;
        }

        let detailsHtml = `<div class="card-detail-overlay" id="card-detail-overlay">
            <div class="card-detail-modal">
                <h3>${displayName}</h3>
                <div class="detail-info">
                    <p>类型: ${displayType}</p>
                    <p>稀有度: ${rarityData.name}</p>
                    <p>等级: ${entry.level}</p>
                    <p>数量: ${entry.count}</p>
                    <p class="detail-desc">${description}</p>
                </div>
                <button class="close-btn" onclick="document.getElementById('card-detail-overlay').remove()">关闭</button>
            </div>
        </div>`;

        const existing = document.getElementById('card-detail-overlay');
        if (existing) existing.remove();

        this.container.insertAdjacentHTML('beforeend', detailsHtml);
    }
};

window.CollectionUI = CollectionUI;
