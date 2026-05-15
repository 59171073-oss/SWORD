
(function () {
    window.renderGachaPage = function () {
        var goldDisplay = document.getElementById('gacha-gold');
        if (goldDisplay) {
            goldDisplay.textContent = GameState.state.gold;
        }

        var singleBtn = document.getElementById('btn-gacha-single');
        var tenBtn = document.getElementById('btn-gacha-ten');

        if (singleBtn) {
            singleBtn.onclick = function () {
                doGacha(1);
            };
        }

        if (tenBtn) {
            tenBtn.onclick = function () {
                doGacha(10);
            };
        }
    };

    function doFreeGacha() {
        if (GameState.state.firstGachaUsed) return;

        var qinZiwei = CHARACTER_CARDS.find(function (c) {
            return c.id === 'char_002';
        });

        if (qinZiwei) {
            GameState.addCard('char_002', 'hero', 'FINE');
            GameState.state.firstGachaUsed = true;
            GameState.save();
            showGachaResult([{ name: qinZiwei.name, rarity: 'FINE', description: qinZiwei.description, imageUrl: qinZiwei.imageUrl, cardType: 'hero', classId: qinZiwei.classId }]);
            updateGachaDisplay();
        }
    }

    function doGacha(count) {
        if (!GameState.state.firstGachaUsed) {
            doFreeGacha();
            return;
        }

        var cost = count === 10 ? 900 : 100;
        if (!GameState.spendGold(cost)) {
            window.showToast('金币不足！');
            return;
        }

        var cards = [];
        for (var i = 0; i < count; i++) {
            cards.push(drawCard('random'));
        }

        showGachaResult(cards);
        updateGachaDisplay();
        window.updateStatusBar();
    }

    function updateGachaDisplay() {
        var goldDisplay = document.getElementById('gacha-gold');
        if (goldDisplay) {
            goldDisplay.textContent = GameState.state.gold;
        }
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

        var cardPool = [];
        var selectedCard = null;

        switch (cardType) {
            case 'weapon':
                cardPool = EQUIPMENT_CARDS.filter(function (c) {
                    return c.rarity === rarity && c.type === 'weapon';
                });
                break;
            case 'armor':
                cardPool = EQUIPMENT_CARDS.filter(function (c) {
                    return c.rarity === rarity && c.type === 'armor';
                });
                break;
            case 'accessory':
                cardPool = EQUIPMENT_CARDS.filter(function (c) {
                    return c.rarity === rarity && c.type === 'accessory';
                });
                break;
            case 'skill':
                cardPool = SKILL_CARDS.filter(function (c) {
                    return c.rarity === rarity;
                });
                break;
            case 'hero':
                cardPool = CHARACTER_CARDS.filter(function (c) {
                    return c.rarity === rarity;
                });
                break;
        }

        if (cardPool.length > 0) {
            selectedCard = cardPool[Math.floor(Math.random() * cardPool.length)];
            GameState.addCard(selectedCard.id, cardType, rarity);
            return {
                name: selectedCard.name,
                rarity: rarity,
                description: selectedCard.description || selectedCard.effect || '',
                imageUrl: selectedCard.imageUrl || null,
                cardType: cardType,
                classId: selectedCard.classId || null
            };
        }

        var fallbackCards = EQUIPMENT_CARDS.filter(function (c) {
            return c.rarity === 'COMMON';
        });
        if (fallbackCards.length > 0) {
            selectedCard = fallbackCards[Math.floor(Math.random() * fallbackCards.length)];
            GameState.addCard(selectedCard.id, selectedCard.type, 'COMMON');
            return {
                name: selectedCard.name,
                rarity: 'COMMON',
                description: selectedCard.description,
                imageUrl: null,
                cardType: selectedCard.type,
                classId: null
            };
        }

        return null;
    }

    function showGachaResult(cards) {
        var overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.95);display:flex;align-items:center;justify-content:center;z-index:2000;padding:20px;box-sizing:border-box;';

        var validCards = cards.filter(function (c) {
            return c !== null;
        });

        var cardsHtml = '';
        for (var i = 0; i < validCards.length; i++) {
            var card = validCards[i];
            var index = i;
            var rarityData = RARITY[card.rarity];
            var typeLabel = '';
            switch (card.cardType) {
                case 'weapon': typeLabel = '武器'; break;
                case 'armor': typeLabel = '防具'; break;
                case 'accessory': typeLabel = '饰品'; break;
                case 'skill': typeLabel = '武学'; break;
                default: typeLabel = '侠客';
            }

            var classData = card.classId ? CLASSES[card.classId] : null;
            
            cardsHtml += '<div class="gacha-card" style="background:linear-gradient(180deg,#2a1a10,#1a0a05);border:2px solid ' + rarityData.color + ';border-radius:12px;padding:0 16px 16px 16px;min-width:140px;max-width:160px;animation:cardReveal 0.5s ease;animation-delay:' + (index * 0.1) + 's;animation-fill-mode:both;box-shadow:0 0 20px ' + rarityData.color + '40;">';
            if (card.imageUrl) {
                cardsHtml += '<img src="' + card.imageUrl + '" alt="' + card.name + '" onerror="this.style.display=\'none\'" style="width:100%;height:160px;object-fit:cover;border-radius:10px 10px 0 0;margin:0 -16px 12px -16px;">';
            } else {
                cardsHtml += '<div style="width:100%;height:120px;display:flex;align-items:center;justify-content:center;font-size:48px;color:' + rarityData.color + ';margin-bottom:8px;">' + (classData ? classData.icon : '🎴') + '</div>';
            }
            cardsHtml += '<div style="color:' + rarityData.color + ';font-size:14px;font-weight:bold;text-align:center;margin-bottom:8px;">' + rarityData.name + '</div>';
            cardsHtml += '<div style="color:#f5e6c8;font-size:18px;font-weight:bold;text-align:center;margin-bottom:8px;">' + card.name + '</div>';
            cardsHtml += '<div style="color:#8b9dab;font-size:12px;text-align:center;margin-bottom:8px;">' + typeLabel + '</div>';
            cardsHtml += '<div style="color:#d4a017;font-size:11px;text-align:center;line-height:1.4;">' + (card.description || '') + '</div>';
            cardsHtml += '</div>';
        }

        var html = '';
        html += '<div style="text-align:center;max-width:900px;width:100%;">';
        html += '<h2 style="color:#d4a017;font-size:32px;margin-bottom:32px;text-shadow:0 0 20px #d4a017;">恭喜获得</h2>';
        html += '<div style="display:flex;gap:16px;flex-wrap:wrap;justify-content:center;margin-bottom:32px;">' + cardsHtml + '</div>';
        html += '<button class="btn-ancient" id="gacha-close-btn" style="padding:12px 40px;font-size:16px;">确定</button>';
        html += '</div>';

        var style = document.createElement('style');
        style.textContent = '@keyframes cardReveal { from { transform: scale(0) rotateY(180deg); opacity: 0; } to { transform: scale(1) rotateY(0); opacity: 1; } }';
        overlay.appendChild(style);

        overlay.innerHTML = html;
        document.body.appendChild(overlay);

        setTimeout(function () {
            var closeBtn = document.getElementById('gacha-close-btn');
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
