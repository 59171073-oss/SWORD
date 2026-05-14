
(function () {
    let eventsBound = false;

    window.renderGachaPage = function () {
        if (!eventsBound) {
            bindGachaEvents();
            eventsBound = true;
        }
        updateGachaDisplay();
    };

    function bindGachaEvents() {
        const singleBtn = document.getElementById('btn-gacha-single');
        if (singleBtn) {
            singleBtn.addEventListener('click', function () {
                doGacha(1);
            });
        }

        const tenBtn = document.getElementById('btn-gacha-ten');
        if (tenBtn) {
            tenBtn.addEventListener('click', function () {
                doGacha(10);
            });
        }
    }

    function updateGachaDisplay() {
        const goldDisplay = document.getElementById('gacha-gold');
        if (goldDisplay) {
            goldDisplay.textContent = GameState.state.gold;
        }
    }

    function doFreeGacha() {
        if (GameState.state.firstGachaUsed) return;

        const qinZiwei = CHARACTER_CARDS.find(c =&gt; c.id === 'char_002');
        if (qinZiwei) {
            GameState.addCard('char_002', 'hero', 'FINE');
            GameState.state.firstGachaUsed = true;
            GameState.save();
            showGachaResult([{ ...qinZiwei, rarity: 'FINE' }]);
            updateGachaDisplay();
        }
    }

    function doGacha(count) {
        if (!GameState.state.firstGachaUsed) {
            doFreeGacha();
            return;
        }

        const cost = count === 10 ? 900 : 100;
        if (!GameState.spendGold(cost)) {
            showToast('金币不足！');
            return;
        }

        const cards = [];
        for (let i = 0; i &lt; count; i++) {
            cards.push(drawCard('random'));
        }

        showGachaResult(cards);
        updateGachaDisplay();
        updateStatusBar();
    }

    function drawCard(type) {
        const rarityRoll = Math.random();
        let rarity;
        if (rarityRoll &lt; 0.03) {
            rarity = 'LEGEND';
        } else if (rarityRoll &lt; 0.15) {
            rarity = 'RARE';
        } else if (rarityRoll &lt; 0.40) {
            rarity = 'FINE';
        } else {
            rarity = 'COMMON';
        }

        if (type === 'hero') {
            const heroCards = CHARACTER_CARDS.filter(c =&gt; c.rarity === rarity);
            if (heroCards.length &gt; 0) {
                const selected = heroCards[Math.floor(Math.random() * heroCards.length)];
                GameState.addCard(selected.id, 'hero', rarity);
                return { ...selected, rarity };
            }
        }

        const typeRoll = Math.random();
        let cardType;
        if (typeRoll &lt; 0.30) {
            cardType = 'weapon';
        } else if (typeRoll &lt; 0.60) {
            cardType = 'armor';
        } else if (typeRoll &lt; 0.80) {
            cardType = 'accessory';
        } else if (typeRoll &lt; 0.92) {
            cardType = 'skill';
        } else {
            cardType = 'hero';
        }

        let cardPool;
        switch (cardType) {
            case 'weapon': cardPool = EQUIPMENT_CARDS.filter(c =&gt; c.rarity === rarity &amp;&amp; c.type === 'weapon'); break;
            case 'armor': cardPool = EQUIPMENT_CARDS.filter(c =&gt; c.rarity === rarity &amp;&amp; c.type === 'armor'); break;
            case 'accessory': cardPool = EQUIPMENT_CARDS.filter(c =&gt; c.rarity === rarity &amp;&amp; c.type === 'accessory'); break;
            case 'skill': cardPool = SKILL_CARDS.filter(c =&gt; c.rarity === rarity); break;
            case 'hero': cardPool = CHARACTER_CARDS.filter(c =&gt; c.rarity === rarity); break;
            default: cardPool = [];
        }

        if (cardPool.length &gt; 0) {
            const selected = cardPool[Math.floor(Math.random() * cardPool.length)];
            GameState.addCard(selected.id, cardType, rarity);
            return { ...selected, rarity, cardType };
        }

        const fallbackCards = EQUIPMENT_CARDS.filter(c =&gt; c.rarity === 'COMMON');
        if (fallbackCards.length &gt; 0) {
            const selected = fallbackCards[Math.floor(Math.random() * fallbackCards.length)];
            GameState.addCard(selected.id, selected.type, 'COMMON');
            return { ...selected, rarity: 'COMMON', cardType: selected.type };
        }

        return null;
    }

    function showGachaResult(cards) {
        const overlay = document.createElement('div');
        overlay.className = 'gacha-overlay';
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);display:flex;align-items:center;justify-content:center;z-index:2000;';

        const cardsHtml = cards.map(card =&gt; {
            if (!card) return '';
            const rarityData = RARITY[card.rarity];
            let typeLabel = '';
            switch (card.cardType || card.type || card.classId) {
                case 'weapon': typeLabel = '武器'; break;
                case 'armor': typeLabel = '防具'; break;
                case 'accessory': typeLabel = '饰品'; break;
                case 'skill': typeLabel = '武学'; break;
                default: typeLabel = '英雄';
            }

            let imageHtml = '';
            if (card.imageUrl) {
                imageHtml = `&lt;img src="${card.imageUrl}" alt="${card.name}" onerror="this.style.display='none'" style="width:100%;height:180px;object-fit:cover;border-radius:8px 8px 0 0;margin-bottom:8px;"&gt;`;
            }

            return `
                &lt;div class="gacha-card" style="background:linear-gradient(180deg,#2a1a10,#1a0a05);border:2px solid ${rarityData.color};border-radius:12px;padding:0 16px 16px 16px;min-width:140px;max-width:160px;animation:cardReveal 0.5s ease;box-shadow:0 0 20px ${rarityData.color}40;"&gt;
                    ${imageHtml}
                    &lt;div class="card-rarity" style="color: ${rarityData.color};font-size:14px;font-weight:bold;text-align:center;margin-bottom:8px;"&gt;${rarityData.name}&lt;/div&gt;
                    &lt;div class="card-name" style="color:var(--parchment);font-size:18px;font-weight:bold;text-align:center;margin-bottom:8px;"&gt;${card.name}&lt;/div&gt;
                    &lt;div class="card-type" style="color:var(--cyan-gray);font-size:12px;text-align:center;margin-bottom:8px;"&gt;${typeLabel}&lt;/div&gt;
                    &lt;div class="card-effect" style="color:var(--gold);font-size:11px;text-align:center;line-height:1.4;"&gt;${card.effect || card.description || ''}&lt;/div&gt;
                &lt;/div&gt;
            `;
        }).join('');

        overlay.innerHTML = `
            &lt;div class="gacha-result-modal" style="text-align:center;"&gt;
                &lt;h2 style="color:var(--gold);font-size:32px;margin-bottom:32px;text-shadow:0 0 20px var(--gold);"&gt;恭喜获得&lt;/h2&gt;
                &lt;div class="gacha-cards" style="display:flex;gap:16px;flex-wrap:wrap;justify-content:center;margin-bottom:32px;"&gt;${cardsHtml}&lt;/div&gt;
                &lt;button class="gacha-close-btn btn-ancient" id="gacha-close-btn" style="padding:12px 32px;font-size:16px;"&gt;确定&lt;/button&gt;
            &lt;/div&gt;
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes cardReveal {
                from { transform: scale(0) rotateY(180deg); opacity: 0; }
                to { transform: scale(1) rotateY(0); opacity: 1; }
            }
        `;
        overlay.appendChild(style);

        document.body.appendChild(overlay);

        document.getElementById('gacha-close-btn').addEventListener('click', function () {
            overlay.remove();
        });

        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) overlay.remove();
        });
    }
})();
