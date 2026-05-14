(function () {

    function updateGachaGold() {
        var goldEl = document.getElementById('gacha-gold');
        if (goldEl) goldEl.textContent = GameState.state.gold;
    }

    function drawCard(type) {
        var rarityRoll = Math.random();
        var rarity;
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
            var heroCards = CHARACTER_CARDS.filter(function (c) { return c.rarity === rarity; });
            if (heroCards.length > 0) {
                var selected = heroCards[Math.floor(Math.random() * heroCards.length)];
                GameState.addCard(selected.id, 'hero', rarity);
                return Object.assign({}, selected, { rarity: rarity });
            }
        }

        var typeRoll = Math.random();
        var cardType;
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

        var cardPool;
        switch (cardType) {
            case 'weapon': cardPool = EQUIPMENT_CARDS.filter(function (c) { return c.rarity === rarity; }); break;
            case 'armor': cardPool = EQUIPMENT_CARDS.filter(function (c) { return c.rarity === rarity; }); break;
            case 'accessory': cardPool = EQUIPMENT_CARDS.filter(function (c) { return c.rarity === rarity; }); break;
            case 'skill': cardPool = SKILL_CARDS.filter(function (c) { return c.rarity === rarity; }); break;
            case 'hero': cardPool = CHARACTER_CARDS.filter(function (c) { return c.rarity === rarity; }); break;
            default: cardPool = [];
        }

        if (cardPool.length > 0) {
            var selected = cardPool[Math.floor(Math.random() * cardPool.length)];
            GameState.addCard(selected.id, cardType === 'weapon' || cardType === 'armor' || cardType === 'accessory' ? 'equip' : cardType, rarity);
            return Object.assign({}, selected, { rarity: rarity });
        }

        var fallbackCards = EQUIPMENT_CARDS.filter(function (c) { return c.rarity === 'COMMON'; });
        if (fallbackCards.length > 0) {
            var selected = fallbackCards[Math.floor(Math.random() * fallbackCards.length)];
            GameState.addCard(selected.id, 'equip', 'COMMON');
            return Object.assign({}, selected, { rarity: 'COMMON' });
        }

        return null;
    }

    function showGachaResult(cards) {
        var resultsEl = document.getElementById('gacha-results');
        if (!resultsEl) return;

        var html = '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;padding:12px 0;">';

        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            if (!card) continue;
            var rarityData = RARITY[card.rarity];
            var typeLabel = '';
            var typeIcon = '';
            switch (card.type) {
                case 'weapon': typeLabel = '武器'; typeIcon = '⚔️'; break;
                case 'armor': typeLabel = '护甲'; typeIcon = '🛡️'; break;
                case 'accessory': typeLabel = '饰品'; typeIcon = '💍'; break;
                case 'skill': typeLabel = '武学'; typeIcon = '📖'; break;
                default: typeLabel = '侠客'; typeIcon = '👤';
            }

            var rarityCls = 'rarity-' + card.rarity.toLowerCase();
            html += '<div class="card ' + rarityCls + '" style="width:80px;text-align:center;padding:8px;border-radius:6px;">';
            html += '<div style="font-size:24px;margin-bottom:4px;">' + typeIcon + '</div>';
            html += '<div style="font-size:11px;color:var(--parchment);margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + card.name + '</div>';
            html += '<div style="font-size:9px;color:' + (rarityData ? rarityData.color : '#ccc') + ';">' + (rarityData ? rarityData.name : '') + '</div>';
            html += '<div style="font-size:9px;color:var(--cyan-gray);">' + typeLabel + '</div>';
            html += '</div>';
        }

        html += '</div>';
        resultsEl.innerHTML = html;
    }

    function doFreeGacha() {
        var qinZiwei = CHARACTER_CARDS.find(function (c) { return c.id === 'char_002'; });
        if (qinZiwei) {
            GameState.addCard('char_002', 'hero', 'FINE');
            GameState.state.firstGachaUsed = true;
            GameState.save();
            showGachaResult([Object.assign({}, qinZiwei, { rarity: 'FINE' })]);
            updateGachaGold();
            window.updateStatusBar();
            window.showToast('获得侠客：秦紫薇！');
            renderGachaPage();
        }
    }

    function doGacha(count) {
        var cost = count === 10 ? 900 : 100;
        if (!GameState.spendGold(cost)) {
            window.showToast('金币不足！', true);
            return;
        }

        var cards = [];
        for (var i = 0; i < count; i++) {
            cards.push(drawCard('random'));
        }

        showGachaResult(cards);
        updateGachaGold();
        window.updateStatusBar();
    }

    window.renderGachaPage = function () {
        updateGachaGold();

        var freeBtn = document.getElementById('btn-gacha-free');
        if (freeBtn) {
            freeBtn.parentNode.removeChild(freeBtn);
        }

        var buttonsContainer = document.querySelector('.gacha-buttons');
        if (!buttonsContainer) return;

        if (!GameState.state.firstGachaUsed) {
            var freeBtnEl = document.createElement('button');
            freeBtnEl.className = 'btn-ancient btn-gacha-free';
            freeBtnEl.id = 'btn-gacha-free';
            freeBtnEl.textContent = '免费招募 (秦紫薇)';
            freeBtnEl.style.background = 'linear-gradient(180deg,#1e8449,#145a32)';
            freeBtnEl.style.borderColor = '#2ecc71';
            freeBtnEl.style.marginBottom = '8px';
            freeBtnEl.addEventListener('click', function () {
                doFreeGacha();
            });
            buttonsContainer.insertBefore(freeBtnEl, buttonsContainer.firstChild);
        }

        var singleBtn = document.getElementById('btn-gacha-single');
        if (singleBtn) {
            var newSingle = singleBtn.cloneNode(true);
            singleBtn.parentNode.replaceChild(newSingle, singleBtn);
            newSingle.addEventListener('click', function () {
                doGacha(1);
            });
        }

        var tenBtn = document.getElementById('btn-gacha-ten');
        if (tenBtn) {
            var newTen = tenBtn.cloneNode(true);
            tenBtn.parentNode.replaceChild(newTen, tenBtn);
            newTen.addEventListener('click', function () {
                doGacha(10);
            });
        }
    };

})();
