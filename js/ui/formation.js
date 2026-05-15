
(function () {
    var selectedHeroId = null;
    var eventsBound = false;

    window.renderFormationPage = function () {
        renderFormationSlots();
        renderRoster();
        updateFormationPower();
        renderFormationElements();
        bindFormationEvents();
    };

    function bindFormationEvents() {
        if (eventsBound) return;
        eventsBound = true;

        var saveBtn = document.getElementById('btn-save-formation');
        if (saveBtn) {
            saveBtn.onclick = function () {
                window.showToast('编队已保存');
            };
        }
    }

    function renderFormationSlots() {
        var formation = GameState.state.formation;
        var slots = formation.slots || [null, null, null, null, null];
        var slotLabels = ['先锋', '左翼', '中军', '右翼', '殿后'];

        for (var i = 0; i < 5; i++) {
            var slotEl = document.querySelector('.formation-slot[data-slot="' + i + '"]');
            if (!slotEl) continue;

            var heroId = slots[i];
            var cardEl = slotEl.querySelector('.slot-card');
            if (!cardEl) continue;

            if (heroId) {
                var cardData = CHARACTER_CARDS.find(function (c) { return c.id === heroId; });
                var heroEntry = GameState.state.collection[heroId];
                var stats = GameState.getHeroStats(heroId, formation);
                var classData = cardData ? CLASSES[cardData.classId] : null;

                var html = '';
                if (cardData && cardData.imageUrl) {
                    html += '<img src="' + cardData.imageUrl + '" style="width:48px;height:48px;object-fit:cover;border-radius:6px;margin-bottom:4px;" onerror="this.style.display=\'none\'">';
                } else {
                    html += '<div style="font-size:28px;margin-bottom:4px;">' + (classData ? classData.icon : '?') + '</div>';
                }
                html += '<div style="font-size:12px;color:#f5e6c8;font-weight:bold;">' + (cardData ? cardData.name : heroId) + '</div>';
                html += '<div style="font-size:10px;color:#8b9dab;">Lv.' + (heroEntry ? heroEntry.level : 1) + '</div>';
                if (stats) {
                    html += '<div style="font-size:9px;color:#8b9dab;margin-top:2px;">❤' + stats.hp + ' ⚔' + stats.atk + '</div>';
                }
                html += '<button class="btn-ancient remove-hero-btn" data-slot="' + i + '" style="padding:2px 8px;font-size:10px;margin-top:4px;background:linear-gradient(180deg,#3d1a1a,#2a1010);">移除</button>';

                cardEl.innerHTML = html;
                slotEl.classList.add('filled');

                var removeBtn = cardEl.querySelector('.remove-hero-btn');
                if (removeBtn) {
                    (function (slotIdx, hid) {
                        removeBtn.onclick = function (e) {
                            e.stopPropagation();
                            formation.slots[slotIdx] = null;
                            GameState.setFormation(formation);
                            if (formation.equips) delete formation.equips[hid];
                            if (formation.skills) delete formation.skills[hid];
                            renderFormationSlots();
                            renderRoster();
                            updateFormationPower();
                            renderFormationElements();
                        };
                    })(i, heroId);
                }

                (function (hid) {
                    cardEl.onclick = function (e) {
                        if (e.target.tagName === 'BUTTON') return;
                        selectedHeroId = hid;
                        showHeroEquipModal(hid);
                    };
                })(heroId);
            } else {
                cardEl.innerHTML = '<div style="font-size:28px;color:#8b9dab;">+</div><div style="font-size:10px;color:#8b9dab;">空位</div>';
                slotEl.classList.remove('filled');

                (function (slotIndex) {
                    cardEl.onclick = function () {
                        showHeroSelector(slotIndex);
                    };
                })(i);
            }
        }
    }

    function renderRoster() {
        var rosterEl = document.getElementById('formation-roster');
        if (!rosterEl) return;

        var heroes = GameState.getCollectionByType('hero');
        var formation = GameState.state.formation;

        if (heroes.length === 0) {
            rosterEl.innerHTML = '<div style="text-align:center;color:#8b9dab;padding:20px;">暂无侠客，去酒馆招募吧！</div>';
            return;
        }

        var html = '<div style="display:flex;gap:8px;flex-wrap:wrap;padding:8px;">';
        for (var i = 0; i < heroes.length; i++) {
            var hero = heroes[i];
            var cardData = CHARACTER_CARDS.find(function (c) { return c.id === hero.id; });
            var isSlotted = formation.slots.indexOf(hero.id) !== -1;
            var classData = cardData ? CLASSES[cardData.classId] : null;

            html += '<div class="roster-card" data-hero-id="' + hero.id + '" style="background:linear-gradient(180deg,#2a1a10,#1a0a05);border:2px solid ' + (isSlotted ? '#d4a017' : '#8b9dab') + ';border-radius:8px;padding:8px;cursor:' + (isSlotted ? 'default' : 'pointer') + ';text-align:center;min-width:80px;' + (isSlotted ? 'opacity:0.5;' : '') + '">';
            html += '<div style="font-size:24px;">' + (classData ? classData.icon : '?') + '</div>';
            html += '<div style="font-size:11px;color:#f5e6c8;">' + (cardData ? cardData.name : hero.id) + '</div>';
            html += '<div style="font-size:10px;color:#8b9dab;">Lv.' + hero.level + '</div>';
            if (isSlotted) {
                html += '<div style="font-size:9px;color:#d4a017;">已上阵</div>';
            }
            html += '</div>';
        }
        html += '</div>';

        rosterEl.innerHTML = html;

        var rosterCards = rosterEl.querySelectorAll('.roster-card');
        for (var i = 0; i < rosterCards.length; i++) {
            rosterCards[i].onclick = function () {
                var heroId = this.getAttribute('data-hero-id');
                var formation = GameState.state.formation;
                if (formation.slots.indexOf(heroId) !== -1) return;

                var emptySlot = formation.slots.indexOf(null);
                if (emptySlot === -1) {
                    window.showToast('阵容已满！');
                    return;
                }

                formation.slots[emptySlot] = heroId;
                if (!formation.equips) formation.equips = {};
                if (!formation.equips[heroId]) formation.equips[heroId] = { weapon: null, armor: null, accessory1: null, accessory2: null };
                if (!formation.skills) formation.skills = {};
                if (!formation.skills[heroId]) formation.skills[heroId] = { skill1: null, skill2: null, skill3: null, skill4: null };
                GameState.setFormation(formation);
                renderFormationSlots();
                renderRoster();
                updateFormationPower();
                renderFormationElements();
            };
        }
    }

    function showHeroSelector(slotIndex) {
        var heroes = GameState.getCollectionByType('hero');
        var formation = GameState.state.formation;

        if (heroes.length === 0) {
            window.showToast('暂无侠客，去酒馆招募吧！');
            return;
        }

        var available = heroes.filter(function (h) {
            return formation.slots.indexOf(h.id) === -1;
        });

        if (available.length === 0) {
            window.showToast('所有侠客都已上阵！');
            return;
        }

        var html = '<div style="display:flex;flex-direction:column;gap:8px;max-height:55vh;overflow-y:auto;padding:8px;">';

        for (var i = 0; i < available.length; i++) {
            var hero = available[i];
            var cardData = CHARACTER_CARDS.find(function (c) { return c.id === hero.id; });
            var classData = cardData ? CLASSES[cardData.classId] : null;
            var rarityData = cardData ? RARITY[cardData.rarity] : null;

            html += '<div class="hero-select-item" data-hero-id="' + hero.id + '" style="display:flex;align-items:center;gap:12px;padding:10px;background:rgba(0,0,0,0.3);border-radius:8px;cursor:pointer;border-left:3px solid ' + (rarityData ? rarityData.color : '#8b9dab') + ';">';
            html += '<div style="font-size:32px;">' + (classData ? classData.icon : '?') + '</div>';
            html += '<div><div style="color:#f5e6c8;font-weight:bold;">' + (cardData ? cardData.name : hero.id) + '</div>';
            html += '<div style="color:#8b9dab;font-size:12px;">Lv.' + hero.level + ' · ' + (rarityData ? rarityData.name : '') + '</div></div>';
            html += '</div>';
        }

        html += '</div>';

        window.showModal('选择侠客', html, null);

        setTimeout(function () {
            var items = document.querySelectorAll('.hero-select-item');
            for (var i = 0; i < items.length; i++) {
                (function (item) {
                    item.onclick = function () {
                        var heroId = item.getAttribute('data-hero-id');
                        var formation = GameState.state.formation;
                        formation.slots[slotIndex] = heroId;
                        if (!formation.equips) formation.equips = {};
                        if (!formation.equips[heroId]) formation.equips[heroId] = { weapon: null, armor: null, accessory1: null, accessory2: null };
                        if (!formation.skills) formation.skills = {};
                        if (!formation.skills[heroId]) formation.skills[heroId] = { skill1: null, skill2: null, skill3: null, skill4: null };
                        GameState.setFormation(formation);
                        window.hideModal();
                        renderFormationSlots();
                        renderRoster();
                        updateFormationPower();
                        renderFormationElements();
                    };
                })(items[i]);
            }
        }, 100);
    }

    function showHeroEquipModal(heroId) {
        var formation = GameState.state.formation;
        if (!formation.equips) formation.equips = {};
        if (!formation.equips[heroId]) formation.equips[heroId] = { weapon: null, armor: null, accessory1: null, accessory2: null };
        if (!formation.skills) formation.skills = {};
        if (!formation.skills[heroId]) formation.skills[heroId] = { skill1: null, skill2: null, skill3: null, skill4: null };

        var heroEquips = formation.equips[heroId];
        var heroSkills = formation.skills[heroId];
        var cardData = CHARACTER_CARDS.find(function (c) { return c.id === heroId; });
        var stats = GameState.getHeroStats(heroId, formation);

        var equipSlots = [
            { key: 'weapon', label: '⚔️ 武器', type: 'weapon' },
            { key: 'armor', label: '🛡️ 护甲', type: 'armor' },
            { key: 'accessory1', label: '💍 饰品一', type: 'accessory' },
            { key: 'accessory2', label: '💍 饰品二', type: 'accessory' }
        ];

        var skillSlots = [
            { key: 'skill1', label: '📖 秘籍一' },
            { key: 'skill2', label: '📖 秘籍二' },
            { key: 'skill3', label: '📖 秘籍三' },
            { key: 'skill4', label: '📖 秘籍四' }
        ];

        var html = '';

        html += '<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid rgba(212,160,23,0.3);">';
        if (cardData && cardData.imageUrl) {
            html += '<img src="' + cardData.imageUrl + '" style="width:64px;height:64px;object-fit:cover;border-radius:8px;border:2px solid #d4a017;" onerror="this.style.display=\'none\'">';
        }
        html += '<div>';
        html += '<div style="font-size:16px;color:#d4a017;font-weight:bold;">' + (cardData ? cardData.name : heroId) + '</div>';
        if (stats) {
            html += '<div style="font-size:11px;color:#8b9dab;margin-top:4px;">❤' + stats.hp + ' ⚔' + stats.atk + ' 🛡' + stats.def + ' 💨' + stats.agi + '</div>';
        }
        html += '</div>';
        html += '</div>';

        html += '<div style="color:#d4a017;font-size:13px;font-weight:bold;margin-bottom:8px;">装备栏</div>';
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px;">';
        for (var i = 0; i < equipSlots.length; i++) {
            var slot = equipSlots[i];
            var equipId = heroEquips[slot.key];
            var equipData = equipId ? EQUIPMENT_CARDS.find(function (e) { return e.id === equipId; }) : null;
            var equipEntry = equipId ? GameState.state.collection[equipId] : null;

            html += '<div class="hero-equip-slot" data-hero-id="' + heroId + '" data-slot-key="' + slot.key + '" data-slot-type="equip" data-equip-type="' + slot.type + '" style="background:rgba(0,0,0,0.3);padding:10px;border-radius:8px;cursor:pointer;border:1px solid ' + (equipData ? (equipEntry && RARITY[equipEntry.rarity] ? RARITY[equipEntry.rarity].color : '#8b9dab') : '#555') + ';">';
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

        html += '<div style="color:#9b59b6;font-size:13px;font-weight:bold;margin-bottom:8px;">武林秘籍</div>';
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">';
        for (var i = 0; i < skillSlots.length; i++) {
            var slot = skillSlots[i];
            var skillId = heroSkills[slot.key];
            var skillData = skillId ? SKILL_CARDS.find(function (s) { return s.id === skillId; }) : null;
            var skillEntry = skillId ? GameState.state.collection[skillId] : null;

            html += '<div class="hero-skill-slot" data-hero-id="' + heroId + '" data-slot-key="' + slot.key + '" data-slot-type="skill" style="background:rgba(0,0,0,0.3);padding:10px;border-radius:8px;cursor:pointer;border:1px solid ' + (skillData ? '#9b59b6' : '#555') + ';">';
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

        window.showModal((cardData ? cardData.name : heroId) + ' 的装备', html, null);

        setTimeout(function () {
            var equipSlotItems = document.querySelectorAll('.hero-equip-slot');
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
                            window.hideModal();
                            setTimeout(function () { showHeroEquipModal(hid); }, 100);
                            updateFormationPower();
                            window.showToast('已卸下装备');
                        } else {
                            showEquipSelector(hid, slotKey, equipType);
                        }
                    };
                })(equipSlotItems[i]);
            }

            var skillSlotItems = document.querySelectorAll('.hero-skill-slot');
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
                            window.hideModal();
                            setTimeout(function () { showHeroEquipModal(hid); }, 100);
                            updateFormationPower();
                            window.showToast('已卸下秘籍');
                        } else {
                            showSkillSelector(hid, slotKey);
                        }
                    };
                })(skillSlotItems[i]);
            }
        }, 100);
    }

    function showEquipSelector(heroId, slotKey, equipType) {
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
                        setTimeout(function () { showHeroEquipModal(heroId); }, 100);
                        updateFormationPower();
                        window.showToast('装备成功！');
                    };
                })(items[i]);
            }
        }, 100);
    }

    function showSkillSelector(heroId, slotKey) {
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
                        setTimeout(function () { showHeroEquipModal(heroId); }, 100);
                        updateFormationPower();
                        window.showToast('秘籍装备成功！');
                    };
                })(items[i]);
            }
        }, 100);
    }

    function updateFormationPower() {
        var power = GameState.getTeamPower();
        var powerEl = document.getElementById('formation-power');
        if (powerEl) powerEl.textContent = power;
    }

    function renderFormationElements() {
        var elContainer = document.getElementById('formation-elements');
        if (!elContainer) return;

        var formation = GameState.state.formation;
        var elements = {};
        for (var i = 0; i < formation.slots.length; i++) {
            var heroId = formation.slots[i];
            if (heroId) {
                var cardData = CHARACTER_CARDS.find(function (c) { return c.id === heroId; });
                if (cardData) {
                    elements[cardData.element] = (elements[cardData.element] || 0) + 1;
                }
            }
        }

        var protEl = PROTAGONIST.element;
        elements[protEl] = (elements[protEl] || 0) + 1;

        var html = '';
        for (var el in elements) {
            html += '<span style="color:#d4a017;font-size:12px;margin-right:8px;">' + el + ' x' + elements[el] + '</span>';
        }
        elContainer.innerHTML = html;
    }
})();
