
(function () {
    window.renderHeroes = function () {
        var container = document.getElementById('heroes-list');
        if (!container) return;

        container.innerHTML = renderHeroCards();
        bindCardEvents();
    };

    window.renderHeroesPage = function () {
        window.renderHeroes();
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
        var formation = GameState.state.formation;
        if (!formation.equips) formation.equips = {};
        if (!formation.equips[heroId]) formation.equips[heroId] = { weapon: null, armor: null, accessory1: null, accessory2: null };
        if (!formation.skills) formation.skills = {};
        if (!formation.skills[heroId]) formation.skills[heroId] = { skill1: null, skill2: null, skill3: null, skill4: null };

        var stats = GameState.getHeroStats(heroId, formation);
        var heroEquips = formation.equips[heroId];
        var heroSkills = formation.skills[heroId];
        var isInFormation = formation.slots.indexOf(heroId) !== -1;

        var overlay = document.createElement('div');
        overlay.id = 'hero-detail-overlay';
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.95);display:flex;align-items:center;justify-content:center;z-index:2000;padding:20px;overflow-y:auto;';

        var cgImageUrl = cardData.imageUrl || '';

        var html = '';
        html += '<div class="hero-detail-modal" style="background:linear-gradient(180deg,#2a1a10,#1a0a05);border:2px solid ' + rarityData.color + ';border-radius:16px;max-width:900px;width:100%;max-height:90vh;overflow-y:auto;padding:0;position:relative;">';

        html += '<button id="detail-close-btn" style="position:absolute;top:12px;right:12px;width:40px;height:40px;border-radius:50%;background:rgba(0,0,0,0.5);border:2px solid #8b9dab;color:#8b9dab;font-size:20px;cursor:pointer;z-index:10;">✕</button>';

        html += '<div style="width:100%;height:350px;background:linear-gradient(180deg,#1a0a05,#0a0503);position:relative;overflow:hidden;">';
        html += '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;">';
        if (cgImageUrl) {
            html += '<img src="' + cgImageUrl + '" alt="' + cardData.name + '" style="max-width:100%;max-height:100%;object-fit:contain;display:block;">';
        } else {
            html += '<div style="font-size:120px;color:' + rarityData.color + ';">' + (classData ? classData.icon : '?') + '</div>';
        }
        html += '</div>';
        html += '<div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,#0a0503);height:120px;pointer-events:none;"></div>';
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

        if (!isInFormation) {
            html += '<div style="background:rgba(231,76,60,0.15);border:1px solid rgba(231,76,60,0.3);padding:12px;border-radius:8px;margin-bottom:16px;text-align:center;">';
            html += '<div style="color:#e74c3c;font-size:13px;">⚠️ 该侠客尚未加入编队，请先在编队页面将其上阵后再装备</div>';
            html += '</div>';
        }

        html += '<div style="background:rgba(0,0,0,0.3);padding:16px;border-radius:8px;margin-bottom:24px;">';
        html += '<div style="color:#d4a017;font-size:14px;margin-bottom:8px;">📜 人物故事</div>';
        html += '<div style="color:#8b9dab;line-height:1.6;">' + cardData.description + '</div>';
        html += '</div>';

        html += '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:24px;">';
        html += '<div style="background:rgba(0,0,0,0.3);padding:12px;border-radius:8px;border-left:3px solid #e74c3c;">';
        html += '<div style="color:#8b9dab;font-size:12px;margin-bottom:2px;">❤️ 生命</div>';
        html += '<div style="color:#f5e6c8;font-size:22px;font-weight:bold;">' + stats.hp + '</div>';
        html += '</div>';
        html += '<div style="background:rgba(0,0,0,0.3);padding:12px;border-radius:8px;border-left:3px solid #3498db;">';
        html += '<div style="color:#8b9dab;font-size:12px;margin-bottom:2px;">⚔️ 攻击</div>';
        html += '<div style="color:#f5e6c8;font-size:22px;font-weight:bold;">' + stats.atk + '</div>';
        html += '</div>';
        html += '<div style="background:rgba(0,0,0,0.3);padding:12px;border-radius:8px;border-left:3px solid #2ecc71;">';
        html += '<div style="color:#8b9dab;font-size:12px;margin-bottom:2px;">🛡️ 防御</div>';
        html += '<div style="color:#f5e6c8;font-size:22px;font-weight:bold;">' + stats.def + '</div>';
        html += '</div>';
        html += '<div style="background:rgba(0,0,0,0.3);padding:12px;border-radius:8px;border-left:3px solid #9b59b6;">';
        html += '<div style="color:#8b9dab;font-size:12px;margin-bottom:2px;">💨 身法</div>';
        html += '<div style="color:#f5e6c8;font-size:22px;font-weight:bold;">' + stats.agi + '</div>';
        html += '</div>';
        html += '</div>';

        if (cardData.innateSkill) {
            html += '<div style="background:linear-gradient(135deg,rgba(155,89,182,0.2),rgba(155,89,182,0.05));padding:16px;border-radius:12px;border:1px solid rgba(155,89,182,0.3);margin-bottom:24px;">';
            html += '<div style="color:#9b59b6;font-size:14px;margin-bottom:8px;display:flex;align-items:center;gap:8px;">';
            html += '<span style="font-size:20px;">✨</span>';
            html += '<span style="font-weight:bold;">先天技能</span>';
            html += '</div>';
            html += '<div style="color:#f5e6c8;font-size:16px;font-weight:bold;margin-bottom:4px;">' + cardData.innateSkill.name + '</div>';
            html += '<div style="color:#8b9dab;line-height:1.6;font-size:13px;">' + cardData.innateSkill.description + '</div>';
            html += '</div>';
        }

        var equipSlots = [
            { key: 'weapon', label: '⚔️ 武器', type: 'weapon' },
            { key: 'armor', label: '🛡️ 护甲', type: 'armor' },
            { key: 'accessory1', label: '💍 饰品一', type: 'accessory' },
            { key: 'accessory2', label: '💍 饰品二', type: 'accessory' }
        ];

        html += '<div style="margin-bottom:24px;">';
        html += '<div style="color:#d4a017;font-size:16px;font-weight:bold;margin-bottom:12px;display:flex;align-items:center;gap:8px;">⚔️ 装备栏</div>';
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">';
        for (var i = 0; i < equipSlots.length; i++) {
            var slot = equipSlots[i];
            var equipId = heroEquips[slot.key];
            var equipData = equipId ? EQUIPMENT_CARDS.find(function (e) { return e.id === equipId; }) : null;
            var equipEntry = equipId ? GameState.state.collection[equipId] : null;

            html += '<div class="hero-equip-slot" data-hero-id="' + heroId + '" data-slot-key="' + slot.key + '" data-slot-type="equip" data-equip-type="' + slot.type + '" style="background:rgba(0,0,0,0.3);padding:10px;border-radius:8px;cursor:pointer;border:1px solid ' + (equipData ? (equipEntry && RARITY[equipEntry.rarity] ? RARITY[equipEntry.rarity].color : '#8b9dab') : '#555') + ';' + (!isInFormation ? 'opacity:0.5;pointer-events:none;' : '') + '">';
            html += '<div style="font-size:11px;color:#8b9dab;margin-bottom:4px;">' + slot.label + '</div>';
            if (equipData && equipEntry) {
                var bonusStr = Object.keys(equipData.bonus).map(function (k) {
                    var labels = { hp: '生命', atk: '攻击', def: '防御', agi: '身法' };
                    return (labels[k] || k) + '+' + Math.floor(equipData.bonus[k] * (1 + (equipEntry.level - 1) * 0.20));
                }).join(' ');
                html += '<div style="font-size:13px;color:#f5e6c8;font-weight:bold;">' + equipData.name + '</div>';
                html += '<div style="font-size:10px;color:#2ecc71;">' + bonusStr + '</div>';
                html += '<div style="font-size:9px;color:#8b9dab;">Lv.' + equipEntry.level + ' · 点击卸下</div>';
            } else {
                html += '<div style="font-size:13px;color:#8b9dab;">空 · 点击装备</div>';
            }
            html += '</div>';
        }
        html += '</div>';
        html += '</div>';

        var skillSlots = [
            { key: 'skill1', label: '📖 秘籍一' },
            { key: 'skill2', label: '📖 秘籍二' },
            { key: 'skill3', label: '📖 秘籍三' },
            { key: 'skill4', label: '📖 秘籍四' }
        ];

        html += '<div style="margin-bottom:24px;">';
        html += '<div style="color:#9b59b6;font-size:16px;font-weight:bold;margin-bottom:12px;display:flex;align-items:center;gap:8px;">📖 武林秘籍</div>';
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">';
        for (var i = 0; i < skillSlots.length; i++) {
            var slot = skillSlots[i];
            var skillId = heroSkills[slot.key];
            var skillData = skillId ? SKILL_CARDS.find(function (s) { return s.id === skillId; }) : null;
            var skillEntry = skillId ? GameState.state.collection[skillId] : null;

            html += '<div class="hero-skill-slot" data-hero-id="' + heroId + '" data-slot-key="' + slot.key + '" data-slot-type="skill" style="background:rgba(0,0,0,0.3);padding:10px;border-radius:8px;cursor:pointer;border:1px solid ' + (skillData ? '#9b59b6' : '#555') + ';' + (!isInFormation ? 'opacity:0.5;pointer-events:none;' : '') + '">';
            html += '<div style="font-size:11px;color:#8b9dab;margin-bottom:4px;">' + slot.label + '</div>';
            if (skillData && skillEntry) {
                html += '<div style="font-size:13px;color:#f5e6c8;font-weight:bold;">' + skillData.name + '</div>';
                html += '<div style="font-size:10px;color:#9b59b6;">' + (skillData.description || skillData.effect || '') + '</div>';
                html += '<div style="font-size:9px;color:#8b9dab;">Lv.' + skillEntry.level + ' · 点击卸下</div>';
            } else {
                html += '<div style="font-size:13px;color:#8b9dab;">空 · 点击装备</div>';
            }
            html += '</div>';
        }
        html += '</div>';
        html += '</div>';

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

            if (!isInFormation) return;

            var equipSlotItems = overlay.querySelectorAll('.hero-equip-slot');
            for (var i = 0; i < equipSlotItems.length; i++) {
                (function (item) {
                    item.onclick = function () {
                        var hid = item.getAttribute('data-hero-id');
                        var slotKey = item.getAttribute('data-slot-key');
                        var equipType = item.getAttribute('data-equip-type');
                        var formation = GameState.state.formation;
                        var currentEquip = formation.equips[hid] ? formation.equips[hid][slotKey] : null;

                        if (currentEquip) {
                            formation.equips[hid][slotKey] = null;
                            GameState.setFormation(formation);
                            overlay.remove();
                            setTimeout(function () { showHeroDetail(hid); }, 50);
                            window.showToast('已卸下装备');
                        } else {
                            showEquipSelectorInHero(hid, slotKey, equipType, overlay);
                        }
                    };
                })(equipSlotItems[i]);
            }

            var skillSlotItems = overlay.querySelectorAll('.hero-skill-slot');
            for (var i = 0; i < skillSlotItems.length; i++) {
                (function (item) {
                    item.onclick = function () {
                        var hid = item.getAttribute('data-hero-id');
                        var slotKey = item.getAttribute('data-slot-key');
                        var formation = GameState.state.formation;
                        var currentSkill = formation.skills[hid] ? formation.skills[hid][slotKey] : null;

                        if (currentSkill) {
                            formation.skills[hid][slotKey] = null;
                            GameState.setFormation(formation);
                            overlay.remove();
                            setTimeout(function () { showHeroDetail(hid); }, 50);
                            window.showToast('已卸下秘籍');
                        } else {
                            showSkillSelectorInHero(hid, slotKey, overlay);
                        }
                    };
                })(skillSlotItems[i]);
            }
        }, 100);
    }

    function showEquipSelectorInHero(heroId, slotKey, equipType, heroOverlay) {
        var allEquips = [];
        var collection = GameState.state.collection;
        for (var id in collection) {
            var entry = collection[id];
            if (entry.type === 'weapon' || entry.type === 'armor' || entry.type === 'accessory') {
                var equipData = EQUIPMENT_CARDS.find(function (e) { return e.id === entry.id; });
                if (equipData && equipData.type === equipType) {
                    if (!GameState.isCardEquipped(entry.id)) {
                        allEquips.push(entry);
                    }
                }
            }
        }

        var html = '';

        if (allEquips.length === 0) {
            html += '<div style="text-align:center;color:#8b9dab;padding:24px;">暂无可用装备，去酒馆抽取吧！</div>';
        } else {
            html += '<div style="display:flex;flex-direction:column;gap:8px;max-height:55vh;overflow-y:auto;padding:8px;">';
            for (var i = 0; i < allEquips.length; i++) {
                var equip = allEquips[i];
                var equipData = EQUIPMENT_CARDS.find(function (e) { return e.id === equip.id; });
                var rarityData = RARITY[equip.rarity];
                var bonusStr = Object.keys(equipData.bonus).map(function (k) {
                    var labels = { hp: '生命', atk: '攻击', def: '防御', agi: '身法' };
                    return (labels[k] || k) + '+' + Math.floor(equipData.bonus[k] * (1 + (equip.level - 1) * 0.20));
                }).join(' ');

                html += '<div class="equip-select-item" data-equip-id="' + equip.id + '" style="display:flex;align-items:center;gap:12px;padding:10px;background:rgba(0,0,0,0.3);border-radius:8px;cursor:pointer;border-left:3px solid ' + rarityData.color + ';">';
                html += '<div style="flex:1;"><div style="color:#f5e6c8;font-weight:bold;">' + equipData.name + '</div>';
                html += '<div style="color:#2ecc71;font-size:12px;">' + bonusStr + '</div>';
                html += '<div style="color:#8b9dab;font-size:11px;">Lv.' + equip.level + ' · ' + rarityData.name + '</div></div>';
                html += '</div>';
            }
            html += '</div>';
        }

        window.showModal('选择装备', html, null);

        setTimeout(function () {
            var items = document.querySelectorAll('.equip-select-item');
            for (var i = 0; i < items.length; i++) {
                (function (item) {
                    item.onclick = function () {
                        var equipId = item.getAttribute('data-equip-id');
                        var formation = GameState.state.formation;
                        if (!formation.equips[heroId]) formation.equips[heroId] = { weapon: null, armor: null, accessory1: null, accessory2: null };
                        formation.equips[heroId][slotKey] = equipId;
                        GameState.setFormation(formation);
                        window.hideModal();
                        if (heroOverlay) heroOverlay.remove();
                        setTimeout(function () { showHeroDetail(heroId); }, 100);
                        window.showToast('装备成功！');
                    };
                })(items[i]);
            }
        }, 100);
    }

    function showSkillSelectorInHero(heroId, slotKey, heroOverlay) {
        var allSkills = GameState.getCollectionByType('skill');
        var available = allSkills.filter(function (s) {
            return !GameState.isCardEquipped(s.id);
        });

        var html = '';

        if (available.length === 0) {
            html += '<div style="text-align:center;color:#8b9dab;padding:24px;">暂无可用秘籍，去酒馆抽取吧！</div>';
        } else {
            html += '<div style="display:flex;flex-direction:column;gap:8px;max-height:55vh;overflow-y:auto;padding:8px;">';
            for (var i = 0; i < available.length; i++) {
                var skill = available[i];
                var skillData = SKILL_CARDS.find(function (s) { return s.id === skill.id; });
                var rarityData = RARITY[skill.rarity];

                html += '<div class="skill-select-item" data-skill-id="' + skill.id + '" style="display:flex;align-items:center;gap:12px;padding:10px;background:rgba(0,0,0,0.3);border-radius:8px;cursor:pointer;border-left:3px solid ' + rarityData.color + ';">';
                html += '<div style="flex:1;"><div style="color:#f5e6c8;font-weight:bold;">' + (skillData ? skillData.name : skill.id) + '</div>';
                html += '<div style="color:#9b59b6;font-size:12px;">' + (skillData ? (skillData.description || skillData.effect || '') : '') + '</div>';
                html += '<div style="color:#8b9dab;font-size:11px;">Lv.' + skill.level + ' · ' + rarityData.name + '</div></div>';
                html += '</div>';
            }
            html += '</div>';
        }

        window.showModal('选择秘籍', html, null);

        setTimeout(function () {
            var items = document.querySelectorAll('.skill-select-item');
            for (var i = 0; i < items.length; i++) {
                (function (item) {
                    item.onclick = function () {
                        var skillId = item.getAttribute('data-skill-id');
                        var formation = GameState.state.formation;
                        if (!formation.skills[heroId]) formation.skills[heroId] = { skill1: null, skill2: null, skill3: null, skill4: null };
                        formation.skills[heroId][slotKey] = skillId;
                        GameState.setFormation(formation);
                        window.hideModal();
                        if (heroOverlay) heroOverlay.remove();
                        setTimeout(function () { showHeroDetail(heroId); }, 100);
                        window.showToast('秘籍装备成功！');
                    };
                })(items[i]);
            }
        }, 100);
    }
})();
