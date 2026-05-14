const GachaUI = {
    container: null,

    init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        this.render();
    },

    render() {
        if (!this.container) return;

        const gold = GameState.state.gold;
        const canFreeGacha = !GameState.state.firstGachaUsed;

        this.container.innerHTML = `
            <div class="gacha-container">
                <div class="gacha-header">
                    <h2>抽卡</h2>
                    <div class="gold-display">金币: ${gold}</div>
                </div>
                <div class="gacha-pools">
                    <div class="pool-section">
                        <h3>角色池</h3>
                        <div class="pool-rates">
                            <div class="rate-item"><span class="rate-label">普通:</span> 60%</div>
                            <div class="rate-item"><span class="rate-label">精良:</span> 25%</div>
                            <div class="rate-item"><span class="rate-label">稀有:</span> 12%</div>
                            <div class="rate-item"><span class="rate-label">传说:</span> 3%</div>
                        </div>
                        <div class="gacha-buttons">
                            ${canFreeGacha ? '<button class="gacha-btn free-btn" id="free-gacha-btn">免费抽取</button>' : ''}
                            <button class="gacha-btn" id="gacha-10-btn">十连抽 (1000金币)</button>
                            <button class="gacha-btn" id="gacha-1-btn">单抽 (100金币)</button>
                        </div>
                    </div>
                </div>
                <div class="gacha-history" id="gacha-history">
                    <h3>最近抽取</h3>
                    <div class="history-list" id="history-list"></div>
                </div>
            </div>
        `;

        this.bindEvents();
    },

    bindEvents() {
        const freeBtn = document.getElementById('free-gacha-btn');
        if (freeBtn) {
            freeBtn.addEventListener('click', () => this.doFreeGacha());
        }

        const gacha10Btn = document.getElementById('gacha-10-btn');
        if (gacha10Btn) {
            gacha10Btn.addEventListener('click', () => this.doGacha(10));
        }

        const gacha1Btn = document.getElementById('gacha-1-btn');
        if (gacha1Btn) {
            gacha1Btn.addEventListener('click', () => this.doGacha(1));
        }
    },

    doFreeGacha() {
        const card = this.drawCard('hero');
        GameState.state.firstGachaUsed = true;
        GameState.save();
        this.showGachaResult([card]);
        this.updateGoldDisplay();
        this.render();
    },

    doGacha(count) {
        const cost = count === 10 ? 1000 : 100;
        if (!GameState.spendGold(cost)) {
            alert('金币不足！');
            return;
        }

        const cards = [];
        for (let i = 0; i < count; i++) {
            cards.push(this.drawCard('random'));
        }

        this.showGachaResult(cards);
        this.updateGoldDisplay();
        this.render();
    },

    drawCard(type) {
        const rarityRoll = Math.random();
        let rarity;
        if (rarityRoll < 0.03) {
            rarity = 'LEGEND';
        } else if (rarityRoll < 0.15) {
            rarity = 'RARE';
        } else if (rarityRoll < 0.40) {
            rarity = 'FINE';
        } else {
            rarity = 'COMMON';
        }

        if (type === 'hero') {
            const heroCards = CHARACTER_CARDS.filter(c => c.rarity === rarity);
            if (heroCards.length > 0) {
                const selected = heroCards[Math.floor(Math.random() * heroCards.length)];
                GameState.addCard(selected.id, 'hero', rarity);
                return { ...selected, rarity };
            }
        }

        const typeRoll = Math.random();
        let cardType;
        if (typeRoll < 0.30) {
            cardType = 'weapon';
        } else if (typeRoll < 0.60) {
            cardType = 'armor';
        } else if (typeRoll < 0.80) {
            cardType = 'accessory';
        } else if (typeRoll < 0.92) {
            cardType = 'skill';
        } else {
            cardType = 'hero';
        }

        let cardPool;
        switch (cardType) {
            case 'weapon': cardPool = EQUIPMENT_CARDS.filter(c => c.rarity === rarity); break;
            case 'armor': cardPool = EQUIPMENT_CARDS.filter(c => c.rarity === rarity); break;
            case 'accessory': cardPool = EQUIPMENT_CARDS.filter(c => c.rarity === rarity); break;
            case 'skill': cardPool = SKILL_CARDS.filter(c => c.rarity === rarity); break;
            case 'hero': cardPool = CHARACTER_CARDS.filter(c => c.rarity === rarity); break;
            default: cardPool = [];
        }

        if (cardPool.length > 0) {
            const selected = cardPool[Math.floor(Math.random() * cardPool.length)];
            GameState.addCard(selected.id, cardType, rarity);
            return { ...selected, rarity };
        }

        const fallbackCards = EQUIPMENT_CARDS.filter(c => c.rarity === 'COMMON');
        if (fallbackCards.length > 0) {
            const selected = fallbackCards[Math.floor(Math.random() * fallbackCards.length)];
            GameState.addCard(selected.id, 'weapon', 'COMMON');
            return { ...selected, rarity: 'COMMON' };
        }

        return null;
    },

    showGachaResult(cards) {
        const overlay = document.createElement('div');
        overlay.className = 'gacha-overlay';

        const cardsHtml = cards.map(card => {
            if (!card) return '';
            const rarityData = RARITY[card.rarity];
            let typeLabel = '';
            switch (card.type || card.classId) {
                case 'weapon': typeLabel = '武器'; break;
                case 'armor': typeLabel = '防具'; break;
                case 'accessory': typeLabel = '饰品'; break;
                case 'skill': typeLabel = '武学'; break;
                default: typeLabel = '英雄';
            }

            return `
                <div class="gacha-card rarity-${card.rarity.toLowerCase()}">
                    <div class="card-rarity" style="color: ${rarityData.color}">${rarityData.name}</div>
                    <div class="card-name">${card.name}</div>
                    <div class="card-type">${typeLabel}</div>
                    <div class="card-effect">${card.effect || card.description || ''}</div>
                </div>
            `;
        }).join('');

        overlay.innerHTML = `
            <div class="gacha-result-modal">
                <h2>恭喜获得</h2>
                <div class="gacha-cards">${cardsHtml}</div>
                <button class="gacha-close-btn" id="gacha-close-btn">确定</button>
            </div>
        `;

        document.body.appendChild(overlay);

        document.getElementById('gacha-close-btn').addEventListener('click', () => {
            overlay.remove();
        });

        this.addToHistory(cards);
    },

    addToHistory(cards) {
        const historyList = document.getElementById('history-list');
        if (!historyList) return;

        cards.forEach(card => {
            if (!card) return;
            const rarityData = RARITY[card.rarity];
            const entry = document.createElement('div');
            entry.className = `history-item rarity-${card.rarity.toLowerCase()}`;
            entry.innerHTML = `
                <span class="history-rarity" style="color: ${rarityData.color}">${rarityData.name}</span>
                <span class="history-name">${card.name}</span>
            `;
            historyList.insertBefore(entry, historyList.firstChild);
        });

        while (historyList.children.length > 10) {
            historyList.removeChild(historyList.lastChild);
        }
    },

    updateGoldDisplay() {
        const goldDisplay = this.container.querySelector('.gold-display');
        if (goldDisplay) {
            goldDisplay.textContent = `金币: ${GameState.state.gold}`;
        }
    }
};

window.GachaUI = GachaUI;
