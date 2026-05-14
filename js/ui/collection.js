(function () {

    var _currentFilter = 'all';
    var _currentSort = 'rarity-desc';

    var RARITY_WEIGHT = { LEGEND: 4, RARE: 3, FINE: 2, COMMON: 1 };
    var RARITY_NAMES = { COMMON: '普通', FINE: '精良', RARE: '稀有', LEGEND: '传说' };
    var TYPE_ICONS = { hero: '🗡️', equip: '🛡️', skill: '📖', task: '📜' };
    var TYPE_NAMES = { hero: '人物', equip: '装备', skill: '技能', task: '任务' };
    var EQUIP_TYPE_ICONS = { weapon: '🗡️', armor: '🛡️', accessory: '💍', secret: '📖' };
    var SKILL_TYPE_ICONS = { active_attack: '⚔️', heal: '💚', control: '🔒', passive_buff: '✨' };
    var STAT_LABELS = { hp: '血', atk: '攻', def: '防', spd: '速' };

    var FILTER_TYPE_MAP = { all: 'all', hero: 'hero', equip: 'equip', skill: 'skill', quest: 'task' };

    function getCardDefinition(cardId, type) {
        if (type === 'hero') return CHARACTER_CARDS.find(function (c) { return c.id === cardId; });
        if (type === 'equip') return EQUIPMENT_CARDS.find(function (c) { return c.id === cardId; });
        if (type === 'skill') return SKILL_CARDS.find(function (c) { return c.id === cardId; });
        if (type === 'task') return TASK_CARDS.find(function (c) { return c.id === cardId; });
        return null;
    }

    function filterCollection() {
        var collection = Object.values(GameState.state.collection);
        if (_currentFilter === 'all') return collection;
        return collection.filter(function (c) { return c.type === _currentFilter; });
    }

    function sortCollection(items) {
        var sorted = items.slice();
        switch (_currentSort) {
            case 'rarity-desc':
                sorted.sort(function (a, b) { return (RARITY_WEIGHT[b.rarity] || 0) - (RARITY_WEIGHT[a.rarity] || 0); });
                break;
            case 'rarity-asc':
                sorted.sort(function (a, b) { return (RARITY_WEIGHT[a.rarity] || 0) - (RARITY_WEIGHT[b.rarity] || 0); });
                break;
            case 'level-desc':
                sorted.sort(function (a, b) { return b.level - a.level; });
                break;
            case 'level-asc':
                sorted.sort(function (a, b) { return a.level - b.level; });
                break;
            case 'name':
                sorted.sort(function (a, b) {
                    var defA = getCardDefinition(a.id, a.type);
                    var defB = getCardDefinition(b.id, b.type);
                    var nameA = defA ? defA.name : '';
                    var nameB = defB ? defB.name : '';
                    return nameA.localeCompare(nameB, 'zh-CN');
                });
                break;
        }
        return sorted;
    }

    function renderCollection() {
        var grid = document.getElementById('collection-grid');
        if (!grid) return;

        bindFilterEvents();
        bindSortEvent();

        var filtered = filterCollection();
        var sorted = sortCollection(filtered);

        grid.innerHTML = '';

        if (sorted.length === 0) {
            grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1;">尚无卡牌，前往抽卡获取</div>';
            return;
        }

        sorted.forEach(function (entry) {
            var cardEl = renderCardItem(entry);
            grid.appendChild(cardEl);
        });
    }

    function bindFilterEvents() {
        var filterBtns = document.querySelectorAll('.collection-filters .filter-btn');
        filterBtns.forEach(function (btn) {
            btn.onclick = function () {
                filterBtns.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                var rawFilter = btn.getAttribute('data-filter');
                _currentFilter = FILTER_TYPE_MAP[rawFilter] || rawFilter;
                renderCollection();
            };
        });
    }

    function bindSortEvent() {
        var sortSelect = document.getElementById('collection-sort');
        if (sortSelect) {
            sortSelect.value = _currentSort;
            sortSelect.onchange = function () {
                _currentSort = sortSelect.value;
                renderCollection();
            };
        }
    }

    function renderCardItem(entry) {
        var cardDef = getCardDefinition(entry.id, entry.type);
        var rarityCls = 'rarity-' + entry.rarity.toLowerCase();
        var rarityColor = RARITY[entry.rarity] ? RARITY[entry.rarity].color : '#cccccc';

        var el = document.createElement('div');
        el.className = 'card ' + rarityCls;
        el.style.cursor = 'pointer';
        el.style.position = 'relative';

        var portraitIcon = TYPE_ICONS[entry.type] || '🎴';
        var name = cardDef ? cardDef.name : '未知';
        var html = '';

        html += '<div class="card-portrait">' + portraitIcon + '</div>';
        html += '<div class="card-name">' + name + '</div>';
        html += '<div style="display:flex;align-items:center;gap:3px;flex-wrap:wrap;margin-top:2px;">';
        html += '<span class="card-level">Lv.' + entry.level + '</span>';
        html += '<span style="font-size:9px;color:' + rarityColor + ';">' + (RARITY_NAMES[entry.rarity] || '') + '</span>';
        html += '</div>';

        if (entry.type === 'hero' && cardDef) {
            var classData = CLASSES[cardDef.classId];
            var elementIcon = ELEMENT_ICONS[cardDef.element] || '';
            html += '<div style="display:flex;gap:3px;margin-top:3px;">';
            if (classData) html += '<span class="card-class">' + classData.icon + classData.name + '</span>';
            html += '<span class="card-element element-' + cardDef.element + '">' + elementIcon + cardDef.element + '</span>';
            html += '</div>';
            var stats = GameState.getHeroStats(entry.id);
            if (stats) {
                html += '<div class="card-stats">';
                html += '<span class="card-stat">血' + stats.hp + '</span>';
                html += '<span class="card-stat">攻' + stats.atk + '</span>';
                html += '<span class="card-stat">防' + stats.def + '</span>';
                html += '<span class="card-stat">速' + stats.spd + '</span>';
                html += '</div>';
            }
        }

        if (entry.type === 'equip' && cardDef) {
            var equipIcon = EQUIP_TYPE_ICONS[cardDef.type] || '📦';
            html += '<div style="display:flex;gap:3px;margin-top:3px;">';
            html += '<span class="card-class">' + equipIcon + '</span>';
            html += '</div>';
            var bonusStr = Object.keys(cardDef.bonus).map(function (k) {
                var label = STAT_LABELS[k] || k;
                var val = Math.floor(cardDef.bonus[k] * (1 + (entry.level - 1) * 0.20));
                return label + '+' + val;
            }).join(' ');
            html += '<div class="card-stats"><span class="card-stat">' + bonusStr + '</span></div>';
        }

        if (entry.type === 'skill' && cardDef) {
            var skillIcon = SKILL_TYPE_ICONS[cardDef.type] || '✨';
            html += '<div style="display:flex;gap:3px;margin-top:3px;align-items:center;">';
            html += '<span class="card-class">' + skillIcon + '</span>';
            if (cardDef.multiplier > 0) {
                var effectiveMultiplier = (cardDef.multiplier * (1 + (entry.level - 1) * 0.25)).toFixed(2);
                html += '<span class="card-stat">×' + effectiveMultiplier + '</span>';
            }
            html += '</div>';
        }

        if (entry.count > 1) {
            html += '<div style="position:absolute;top:4px;right:4px;font-size:10px;color:var(--gold);background:rgba(0,0,0,0.5);padding:1px 4px;border-radius:3px;">×' + entry.count + '</div>';
        }

        el.innerHTML = html;

        el.onclick = function () {
            showCardDetail(entry.id);
        };

        return el;
    }

    function showCardDetail(cardId) {
        var entry = GameState.state.collection[cardId];
        if (!entry) return;

        var cardDef = getCardDefinition(cardId, entry.type);
        if (!cardDef) return;

        var rarityColor = RARITY[entry.rarity] ? RARITY[entry.rarity].color : '#cccccc';
        var rarityName = RARITY_NAMES[entry.rarity] || entry.rarity;
        var typeName = TYPE_NAMES[entry.type] || entry.type;
        var typeIcon = TYPE_ICONS[entry.type] || '🎴';

        var html = '<div class="card-detail">';

        html += '<div class="detail-header">';
        html += '<div class="detail-portrait" style="border-color:' + rarityColor + ';">' + typeIcon + '</div>';
        html += '<div class="detail-name">' + cardDef.name + '</div>';
        html += '<div class="detail-tags">';
        html += '<span style="color:' + rarityColor + ';font-size:12px;letter-spacing:1px;">' + rarityName + '</span>';
        html += '<span style="color:var(--cyan-gray);font-size:12px;margin-left:8px;">' + typeName + '</span>';
        html += '</div>';
        html += '<div class="detail-level">Lv.' + entry.level + (entry.count > 1 ? ' · 叠加 ×' + entry.count : '') + '</div>';
        html += '</div>';

        if (entry.type === 'hero') {
            var stats = GameState.getHeroStats(cardId);
            if (stats) {
                html += '<div class="detail-stats">';
                html += buildDetailStat('血', stats.hp);
                html += buildDetailStat('攻', stats.atk);
                html += buildDetailStat('防', stats.def);
                html += buildDetailStat('速', stats.spd);
                html += '</div>';

                var classData = CLASSES[cardDef.classId];
                if (classData) {
                    html += '<div style="text-align:center;margin:8px 0;font-size:12px;color:var(--cyan-gray);">';
                    html += classData.icon + ' ' + classData.name + ' · ' + ELEMENT_ICONS[cardDef.element] + cardDef.element;
                    html += '</div>';
                }

                var equipBonus = getEquipBonusDetail(cardId);
                if (equipBonus) {
                    html += '<div class="detail-equipped"><h4>装备加成</h4>';
                    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;">';
                    if (equipBonus.hp > 0) html += buildDetailStat('血+', equipBonus.hp);
                    if (equipBonus.atk > 0) html += buildDetailStat('攻+', equipBonus.atk);
                    if (equipBonus.def > 0) html += buildDetailStat('防+', equipBonus.def);
                    if (equipBonus.spd > 0) html += buildDetailStat('速+', equipBonus.spd);
                    html += '</div></div>';
                }
            }
        }

        if (entry.type === 'equip') {
            html += '<div class="detail-stats">';
            var equipIcon = EQUIP_TYPE_ICONS[cardDef.type] || '📦';
            html += '<div class="detail-stat" style="grid-column:1/-1;"><span class="stat-label">类型</span><span class="stat-value">' + equipIcon + ' ' + cardDef.type + '</span></div>';
            Object.keys(cardDef.bonus).forEach(function (k) {
                var label = STAT_LABELS[k] || k;
                var baseVal = cardDef.bonus[k];
                var currentVal = Math.floor(baseVal * (1 + (entry.level - 1) * 0.20));
                html += '<div class="detail-stat"><span class="stat-label">' + label + '</span><span class="stat-value">' + currentVal + '</span></div>';
            });
            html += '</div>';
        }

        if (entry.type === 'skill') {
            var skillIcon = SKILL_TYPE_ICONS[cardDef.type] || '✨';
            html += '<div style="text-align:center;margin:8px 0;font-size:12px;color:var(--cyan-gray);">';
            html += skillIcon + ' ' + cardDef.type;
            html += '</div>';
            html += '<div style="padding:8px;background:rgba(0,0,0,0.2);border-radius:var(--radius-sm);margin:8px 0;font-size:13px;color:var(--parchment);line-height:1.6;">';
            html += cardDef.effect;
            html += '</div>';
            if (cardDef.multiplier > 0) {
                var currentMultiplier = (cardDef.multiplier * (1 + (entry.level - 1) * 0.25)).toFixed(2);
                html += '<div class="detail-stats">';
                html += '<div class="detail-stat"><span class="stat-label">基础倍率</span><span class="stat-value">×' + cardDef.multiplier + '</span></div>';
                html += '<div class="detail-stat"><span class="stat-label">当前倍率</span><span class="stat-value" style="color:var(--gold);">×' + currentMultiplier + '</span></div>';
                html += '</div>';
            }
        }

        if (entry.type === 'task') {
            html += '<div style="padding:8px;background:rgba(0,0,0,0.2);border-radius:var(--radius-sm);margin:8px 0;font-size:13px;color:var(--parchment);line-height:1.6;">';
            html += cardDef.description;
            html += '</div>';
            html += '<div class="detail-stats">';
            html += '<div class="detail-stat" style="grid-column:1/-1;"><span class="stat-label">条件</span><span class="stat-value">' + cardDef.condition + '</span></div>';
            html += '</div>';
        }

        var maxLevel;
        if (entry.type === 'hero') {
            maxLevel = 20;
        } else if (entry.type === 'skill') {
            maxLevel = 10;
        } else {
            maxLevel = 5;
        }
        var isMaxLevel = entry.level >= maxLevel;

        html += '<div class="detail-upgrade">';
        if (isMaxLevel) {
            html += '已达最高等级 Lv.' + maxLevel;
        } else {
            html += '当前 Lv.' + entry.level + ' → 下一级 Lv.' + (entry.level + 1);
            var preview = buildUpgradePreview(entry, cardDef);
            if (preview) {
                html += '<div style="font-size:11px;color:var(--cyan-gray);margin-top:4px;">' + preview + '</div>';
            }
        }
        html += '</div>';

        if (entry.type !== 'task') {
            var sellPrice = GameState.getCardSellPrice(cardId);
            var isEquipped = GameState.isCardEquipped(cardId);
            html += '<div class="detail-actions" style="margin-top:12px;padding-top:12px;border-top:1px solid rgba(212,160,23,0.2);">';
            if (isEquipped) {
                html += '<div style="font-size:11px;color:var(--vermilion);margin-bottom:8px;">该卡牌已装备，请先卸下后再出售</div>';
            } else {
                html += '<button class="btn-ancient btn-sell-card" data-card-id="' + cardId + '" style="background:linear-gradient(180deg,#8b1a1a,#5c1010);">';
                html += '💰 卖出 (' + sellPrice + '金币)';
                html += '</button>';
                if (entry.count > 1) {
                    html += '<div style="font-size:10px;color:var(--cyan-gray);margin-top:4px;">拥有 ' + entry.count + ' 张</div>';
                }
            }
            html += '</div>';
        }

        html += '</div>';

        showModal(cardDef.name, html);

        setTimeout(function () {
            var sellBtn = document.querySelector('.btn-sell-card');
            if (sellBtn) {
                sellBtn.onclick = function () {
                    var cardId = sellBtn.getAttribute('data-card-id');
                    if (confirm('确定要卖出这张卡牌吗？')) {
                        var price = GameState.sellCard(cardId);
                        if (price > 0) {
                            showToast('卖出成功，获得 ' + price + ' 金币');
                            hideModal();
                            renderCollection();
                            if (typeof window.updateStatusBar === 'function') {
                                window.updateStatusBar();
                            }
                        }
                    }
                };
            }
        }, 50);
    }

    function buildDetailStat(label, value) {
        return '<div class="detail-stat"><span class="stat-label">' + label + '</span><span class="stat-value">' + value + '</span></div>';
    }

    function getEquipBonusDetail(heroId) {
        var formation = GameState.state.formation;
        if (!formation.equips || !formation.equips[heroId]) return null;
        var heroEquips = formation.equips[heroId];
        var bonus = { hp: 0, atk: 0, def: 0, spd: 0 };
        var hasBonus = false;
        for (var slot in heroEquips) {
            var equipId = heroEquips[slot];
            if (equipId && GameState.state.collection[equipId]) {
                var equipEntry = GameState.state.collection[equipId];
                var equipData = EQUIPMENT_CARDS.find(function (e) { return e.id === equipId; });
                if (equipData && equipData.bonus) {
                    var equipLevelMultiplier = 1 + (equipEntry.level - 1) * 0.20;
                    for (var stat in equipData.bonus) {
                        if (bonus.hasOwnProperty(stat)) {
                            bonus[stat] += Math.floor(equipData.bonus[stat] * equipLevelMultiplier);
                            hasBonus = true;
                        }
                    }
                }
            }
        }
        return hasBonus ? bonus : null;
    }

    function buildUpgradePreview(entry, cardDef) {
        var nextLevel = entry.level + 1;
        var maxLevel;
        if (entry.type === 'hero') {
            maxLevel = 20;
        } else if (entry.type === 'skill') {
            maxLevel = 10;
        } else {
            maxLevel = 5;
        }
        if (nextLevel > maxLevel) return '';

        if (entry.type === 'hero') {
            var classData = CLASSES[cardDef.classId];
            var rarityData = RARITY[entry.rarity];
            if (!classData || !rarityData) return '';

            var currentLevelMult = 1 + (entry.level - 1) * 0.15;
            var nextLevelMult = 1 + (nextLevel - 1) * 0.15;

            var preview = [];
            ['hp', 'atk', 'def', 'spd'].forEach(function (stat) {
                var base = Math.floor(classData.baseStats[stat] * rarityData.multiplier);
                var currentVal = Math.floor(base * currentLevelMult);
                var nextVal = Math.floor(base * nextLevelMult);
                if (nextVal > currentVal) {
                    preview.push(STAT_LABELS[stat] + ' ' + currentVal + '→' + nextVal);
                }
            });
            return preview.join('  ');
        }

        if (entry.type === 'equip') {
            var preview = [];
            Object.keys(cardDef.bonus).forEach(function (k) {
                var label = STAT_LABELS[k] || k;
                var currentVal = Math.floor(cardDef.bonus[k] * (1 + (entry.level - 1) * 0.20));
                var nextVal = Math.floor(cardDef.bonus[k] * (1 + (nextLevel - 1) * 0.20));
                preview.push(label + ' ' + currentVal + '→' + nextVal);
            });
            return preview.join('  ');
        }

        if (entry.type === 'skill' && cardDef.multiplier > 0) {
            var currentMult = (cardDef.multiplier * (1 + (entry.level - 1) * 0.25)).toFixed(2);
            var nextMult = (cardDef.multiplier * (1 + (nextLevel - 1) * 0.25)).toFixed(2);
            return '倍率 ×' + currentMult + '→×' + nextMult;
        }

        return '';
    }

    window.renderCollection = renderCollection;
    window.renderCardItem = renderCardItem;
    window.showCardDetail = showCardDetail;
    window.getCardDefinition = getCardDefinition;
    window.renderCollectionPage = function () {
        renderCollection();
    };

})();
