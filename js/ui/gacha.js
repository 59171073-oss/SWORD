(function () {
    var GACHA_COST_SINGLE = 100;
    var GACHA_COST_TEN = 900;

    var RARITY_ORDER = { COMMON: 0, FINE: 1, RARE: 2, LEGEND: 3 };
    var RARITY_NAMES = { COMMON: '普通', FINE: '精良', RARE: '稀有', LEGEND: '传说' };
    var TYPE_ICONS = { hero: '🗡️', equip: '🛡️', skill: '📖' };
    var TYPE_NAMES = { hero: '人物', equip: '装备', skill: '技能' };

    var _gachaAnimating = false;

    function getCardPool(type, rarity) {
        if (type === 'hero') return CHARACTER_CARDS.filter(function (c) { return c.rarity === rarity; });
        if (type === 'equip') return EQUIPMENT_CARDS.filter(function (c) { return c.rarity === rarity; });
        if (type === 'skill') return SKILL_CARDS.filter(function (c) { return c.rarity === rarity; });
        return [];
    }

    function pickRarity() {
        var r = Math.random();
        var probs = GACHA_CONFIG.rarityProbability;
        if (r < probs.LEGEND) return 'LEGEND';
        if (r < probs.LEGEND + probs.RARE) return 'RARE';
        if (r < probs.LEGEND + probs.RARE + probs.FINE) return 'FINE';
        return 'COMMON';
    }

    function pickType() {
        var r = Math.random();
        var probs = GACHA_CONFIG.typeProbability;
        if (r < probs.skill) return 'skill';
        if (r < probs.skill + probs.equipment) return 'equip';
        return 'hero';
    }

    function gachaRoll(count) {
        var results = [];
        for (var i = 0; i < count; i++) {
            var type = pickType();
            var rarity = pickRarity();
            var pool = getCardPool(type, rarity);
            if (pool.length === 0) {
                var fallbackOrder = ['FINE', 'RARE', 'COMMON', 'LEGEND'];
                for (var f = 0; f < fallbackOrder.length; f++) {
                    pool = getCardPool(type, fallbackOrder[f]);
                    if (pool.length > 0) {
                        rarity = fallbackOrder[f];
                        break;
                    }
                }
            }
            if (pool.length === 0) continue;
            var card = pool[Math.floor(Math.random() * pool.length)];
            results.push({ cardId: card.id, type: type, rarity: rarity });
        }
        return results;
    }

    function doGacha(count) {
        if (_gachaAnimating) return;
        var cost = count === 10 ? GACHA_COST_TEN : GACHA_COST_SINGLE;
        var isFirstFree = (count === 1 && !GameState.state.firstGachaUsed);

        if (!isFirstFree && GameState.state.gold < cost) {
            showToast('金币不足', 'error');
            return;
        }
        _gachaAnimating = true;
        setGachaButtonsDisabled(true);

        if (isFirstFree) {
            GameState.state.firstGachaUsed = true;
            GameState.save();
        } else {
            GameState.spendGold(cost);
        }
        updateGoldDisplay();

        var results = gachaRoll(count);

        if (count === 10) {
            var allCommon = results.every(function (r) { return r.rarity === 'COMMON'; });
            if (allCommon && results.length > 0) {
                var last = results[results.length - 1];
                var finePool = getCardPool(last.type, 'FINE');
                if (finePool.length > 0) {
                    var replacement = finePool[Math.floor(Math.random() * finePool.length)];
                    results[results.length - 1] = { cardId: replacement.id, type: last.type, rarity: 'FINE' };
                }
            }
        }

        var upgradeInfo = [];
        results.forEach(function (r) {
            var existing = GameState.state.collection[r.cardId];
            var isUpgrade = !!(existing && existing.rarity === r.rarity);
            GameState.addCard(r.cardId, r.type, r.rarity);
            upgradeInfo.push(isUpgrade);
        });

        showGachaResult(results, upgradeInfo);
    }

    function renderGacha() {
        var page = document.getElementById('page-gacha');
        if (!page) return;

        var gold = GameState.state.gold;
        document.getElementById('gacha-gold').textContent = gold;

        var btnSingle = document.getElementById('btn-gacha-single');
        var btnTen = document.getElementById('btn-gacha-ten');

        if (btnSingle) {
            btnSingle.disabled = gold < GACHA_COST_SINGLE;
            btnSingle.onclick = function () { doGacha(1); };
        }
        if (btnTen) {
            btnTen.disabled = gold < GACHA_COST_TEN;
            btnTen.onclick = function () { doGacha(10); };
        }

        var resultsContainer = document.getElementById('gacha-results');
        if (resultsContainer && !resultsContainer.hasChildNodes()) {
            resultsContainer.innerHTML = '<div class="gacha-prayer"><div class="prayer-icon">🎴</div><div class="prayer-text">祈愿池</div><div class="prayer-sub">江湖豪杰，尽入麾下</div></div>';
        }

        renderGachaRates();
    }

    function renderGachaRates() {
        var page = document.getElementById('page-gacha');
        var existing = page.querySelector('.gacha-rates-detail');
        if (existing) existing.remove();

        var wrapper = document.createElement('div');
        wrapper.className = 'gacha-rates-detail';

        var toggle = document.createElement('div');
        toggle.className = 'rates-toggle';
        toggle.innerHTML = '<span class="rates-toggle-text">概率详情</span><span class="rates-toggle-arrow">▼</span>';
        toggle.onclick = function () {
            var body = wrapper.querySelector('.rates-body');
            var arrow = toggle.querySelector('.rates-toggle-arrow');
            if (body.style.display === 'none') {
                body.style.display = 'block';
                arrow.textContent = '▲';
            } else {
                body.style.display = 'none';
                arrow.textContent = '▼';
            }
        };

        var body = document.createElement('div');
        body.className = 'rates-body';
        body.style.display = 'none';

        var typeProbs = GACHA_CONFIG.typeProbability;
        var rarityProbs = GACHA_CONFIG.rarityProbability;

        body.innerHTML =
            '<div class="rates-section">' +
                '<div class="rates-section-title">卡牌类型</div>' +
                '<div class="rates-row"><span>人物</span><span>' + (typeProbs.character * 100) + '%</span></div>' +
                '<div class="rates-row"><span>装备</span><span>' + (typeProbs.equipment * 100) + '%</span></div>' +
                '<div class="rates-row"><span>技能</span><span>' + (typeProbs.skill * 100) + '%</span></div>' +
            '</div>' +
            '<div class="rates-section">' +
                '<div class="rates-section-title">稀有度</div>' +
                '<div class="rates-row"><span style="color:var(--rarity-common)">普通</span><span>' + (rarityProbs.COMMON * 100) + '%</span></div>' +
                '<div class="rates-row"><span style="color:var(--rarity-fine)">精良</span><span>' + (rarityProbs.FINE * 100) + '%</span></div>' +
                '<div class="rates-row"><span style="color:var(--rarity-rare)">稀有</span><span>' + (rarityProbs.RARE * 100) + '%</span></div>' +
                '<div class="rates-row"><span style="color:var(--rarity-legend)">传说</span><span>' + (rarityProbs.LEGEND * 100) + '%</span></div>' +
            '</div>' +
            '<div class="rates-note">十连招募保底：若十张皆为普通，最后一张提升为精良</div>';

        wrapper.appendChild(toggle);
        wrapper.appendChild(body);

        var gachaInfo = page.querySelector('.gacha-info');
        if (gachaInfo) {
            gachaInfo.parentNode.insertBefore(wrapper, gachaInfo.nextSibling);
        }
    }

    function showGachaResult(results, upgradeInfo) {
        var overlay = document.createElement('div');
        overlay.className = 'gacha-result-overlay';

        var container = document.createElement('div');
        container.className = 'gacha-result-container';

        var title = document.createElement('div');
        title.className = 'gacha-result-title';
        title.textContent = results.length === 1 ? '招募结果' : '十连招募';
        container.appendChild(title);

        var cardsWrap = document.createElement('div');
        cardsWrap.className = 'gacha-result-cards';
        if (results.length === 1) {
            cardsWrap.classList.add('single-result');
        }

        var hasLegend = results.some(function (r) { return r.rarity === 'LEGEND'; });

        results.forEach(function (result, index) {
            var cardData = findCardData(result.cardId, result.type);
            if (!cardData) return;

            var isUpgrade = upgradeInfo[index];
            var isNew = !isUpgrade;

            var cardEl = document.createElement('div');
            cardEl.className = 'gacha-flip-card';
            cardEl.style.animationDelay = (index * 200) + 'ms';

            var inner = document.createElement('div');
            inner.className = 'gacha-flip-inner';

            var back = document.createElement('div');
            back.className = 'gacha-flip-back';
            back.innerHTML = '<div class="flip-back-pattern">🎴</div>';

            var front = document.createElement('div');
            front.className = 'gacha-flip-front rarity-' + result.rarity.toLowerCase();
            if (isNew) front.classList.add('new-card');
            if (isUpgrade) front.classList.add('upgraded');

            var icon = TYPE_ICONS[result.type] || '🎴';
            var rarityClass = 'rarity-' + result.rarity.toLowerCase();

            front.innerHTML =
                '<div class="flip-card-icon">' + icon + '</div>' +
                '<div class="flip-card-name">' + cardData.name + '</div>' +
                '<div class="flip-card-rarity ' + rarityClass + '">' + RARITY_NAMES[result.rarity] + '</div>' +
                (isUpgrade ? '<div class="flip-card-upgrade">升级！</div>' : '');

            inner.appendChild(back);
            inner.appendChild(front);
            cardEl.appendChild(inner);
            cardsWrap.appendChild(cardEl);
        });

        container.appendChild(cardsWrap);

        var confirmBtn = document.createElement('button');
        confirmBtn.className = 'btn-ancient gacha-confirm-btn';
        confirmBtn.textContent = '确认';
        confirmBtn.style.display = 'none';
        confirmBtn.onclick = function () {
            if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
            _gachaAnimating = false;
            setGachaButtonsDisabled(false);
            renderGacha();
        };
        container.appendChild(confirmBtn);

        overlay.appendChild(container);
        document.body.appendChild(overlay);

        if (hasLegend) {
            triggerLegendEffect(overlay);
        }

        var totalDelay = (results.length - 1) * 200 + 600;
        setTimeout(function () {
            confirmBtn.style.display = 'inline-flex';
        }, totalDelay);
    }

    function findCardData(cardId, type) {
        if (type === 'hero') return CHARACTER_CARDS.find(function (c) { return c.id === cardId; });
        if (type === 'equip') return EQUIPMENT_CARDS.find(function (c) { return c.id === cardId; });
        if (type === 'skill') return SKILL_CARDS.find(function (c) { return c.id === cardId; });
        return null;
    }

    function triggerLegendEffect(overlay) {
        var flash = document.createElement('div');
        flash.className = 'legend-flash';
        overlay.appendChild(flash);
        setTimeout(function () {
            if (flash.parentNode) flash.parentNode.removeChild(flash);
        }, 1200);
    }

    function setGachaButtonsDisabled(disabled) {
        var btnSingle = document.getElementById('btn-gacha-single');
        var btnTen = document.getElementById('btn-gacha-ten');
        if (btnSingle) btnSingle.disabled = disabled;
        if (btnTen) btnTen.disabled = disabled;
    }

    function updateGoldDisplay() {
        var gachaGold = document.getElementById('gacha-gold');
        var goldDisplay = document.getElementById('gold-display');
        if (gachaGold) gachaGold.textContent = GameState.state.gold;
        if (goldDisplay) goldDisplay.textContent = GameState.state.gold;
    }

    function showToast(message, type) {
        var existing = document.querySelector('.toast');
        if (existing) existing.remove();

        var toast = document.createElement('div');
        toast.className = 'toast' + (type === 'error' ? ' toast-error' : '');
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(function () {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 2500);
    }

    window.renderGacha = renderGacha;
    window.doGacha = doGacha;
    window.gachaRoll = gachaRoll;
    window.showGachaResult = showGachaResult;
})();
