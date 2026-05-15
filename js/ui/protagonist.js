(function () {
    var EQUIP_SLOT_CONFIG = [
        { key: 'weapon', label: '武器', icon: '⚔️' },
        { key: 'armor', label: '护甲', icon: '🛡️' },
        { key: 'accessory1', label: '饰品一', icon: '💍' },
        { key: 'accessory2', label: '饰品二', icon: '💍' }
    ];

    var SKILL_SLOT_CONFIG = [
        { key: 'skill1', label: '秘籍一', icon: '📖' },
        { key: 'skill2', label: '秘籍二', icon: '📖' },
        { key: 'skill3', label: '秘籍三', icon: '📖' },
        { key: 'skill4', label: '秘籍四', icon: '📖' }
    ];

    var STAT_LABELS = { hp: '生命', atk: '攻击', def: '防御', agi: '身法' };
    var STAT_COLORS = { hp: '#e74c3c', atk: '#e67e22', def: '#3498db', agi: '#9b59b6' };
    var STAT_ICONS = { hp: '❤️', atk: '⚔️', def: '🛡️', agi: '💨' };

    function renderProtagonist() {
        var stats = GameState.getProtagonistStats();
        if (!stats) return;

        var nameEl = document.getElementById('protagonist-name');
        var levelEl = document.getElementById('protagonist-level');
        var statsEl = document.getElementById('protagonist-stats');

        if (nameEl) nameEl.textContent = PROTAGONIST.name;
        if (levelEl) levelEl.textContent = 'Lv.' + stats.level + ' · ' + PROTAGONIST.element + '属性';

        if (statsEl) {
            var html = '';
            for (var stat in STAT_LABELS) {
                html += '<div class="prot-stat-item" style="border-left-color:' + STAT_COLORS[stat] + ';">' +
                    '<span class="prot-stat-label">' + STAT_ICONS[stat] + ' ' + STAT_LABELS[stat] + '</span>' +
                    '<span class="prot-stat-value" style="color:' + STAT_COLORS[stat] + ';">' + stats[stat] + '</span>' +
                    '</div>';
            }
            statsEl.innerHTML = html;
        }

        renderProtagonistEquips();
        renderProtagonistSkills();
    }

    function renderProtagonistEquips() {
        var container = document.getElementById('protagonist-equip-slots');
        if (!container) return;

        var p = GameState.state.protagonist;
        var html = '';

        EQUIP_SLOT_CONFIG.forEach(function (cfg) {
            var equipId = p.equips ? p.equips[cfg.key] : null;
            var equipData = equipId ? EQUIPMENT_CARDS.find(function (e) { return e.id === equipId; }) : null;
            var equipEntry = equipId ? GameState.state.collection[equipId] : null;

            html += '<div class="prot-equip-slot' + (equipData ? ' filled' : '') + '" data-equip-slot="' + cfg.key + '">';
            html += '<div class="prot-slot-label">' + cfg.icon + ' ' + cfg.label + '</div>';

            if (equipData && equipEntry) {
                var bonusStr = Object.keys(equipData.bonus).map(function (k) {
                    var label = STAT_LABELS[k] || k;
                    return label + '+' + Math.floor(equipData.bonus[k] * (1 + (equipEntry.level - 1) * 0.20));
                }).join(' ');
                html += '<div class="prot-slot-name">' + equipData.name + '</div>';
                html += '<div class="prot-slot-bonus">' + bonusStr + '</div>';
            } else {
                html += '<div class="prot-slot-empty">+</div>';
            }

            html += '</div>';
        });

        container.innerHTML = html;

        setTimeout(function () {
            container.querySelectorAll('[data-equip-slot]').forEach(function (el) {
                el.onclick = function () {
                    var slotKey = el.getAttribute('data-equip-slot');
                    var equipId = p.equips ? p.equips[slotKey] : null;
                    if (equipId) {
                        GameState.unequipProtagonistItem(slotKey);
                        var equipData = EQUIPMENT_CARDS.find(function (e) { return e.id === equipId; });
                        showToast((equipData ? equipData.name : '装备') + ' 已卸下');
                        renderProtagonist();
                    } else {
                        showProtagonistEquipSelector(slotKey);
                    }
                };
            });
        }, 50);
    }

    function renderProtagonistSkills() {
        var container = document.getElementById('protagonist-skill-slots');
        if (!container) return;

        var p = GameState.state.protagonist;
        var html = '';

        SKILL_SLOT_CONFIG.forEach(function (cfg) {
            var skillId = p.skills ? p.skills[cfg.key] : null;
            var skillData = skillId ? SKILL_CARDS.find(function (s) { return s.id === skillId; }) : null;
            var skillEntry = skillId ? GameState.state.collection[skillId] : null;

            html += '<div class="prot-skill-slot' + (skillData ? ' filled' : '') + '" data-skill-slot="' + cfg.key + '">';
            html += '<div class="prot-slot-label">' + cfg.icon + ' ' + cfg.label + '</div>';

            if (skillData && skillEntry) {
                html += '<div class="prot-slot-name">' + skillData.name + '</div>';
                html += '<div class="prot-slot-bonus">' + skillData.effect + '</div>';
            } else {
                html += '<div class="prot-slot-empty">+</div>';
            }

            html += '</div>';
        });

        container.innerHTML = html;

        setTimeout(function () {
            container.querySelectorAll('[data-skill-slot]').forEach(function (el) {
                el.onclick = function () {
                    var slotKey = el.getAttribute('data-skill-slot');
                    var skillId = p.skills ? p.skills[slotKey] : null;
                    if (skillId) {
                        GameState.unequipProtagonistSkill(slotKey);
                        var skillData = SKILL_CARDS.find(function (s) { return s.id === skillId; });
                        showToast((skillData ? skillData.name : '秘籍') + ' 已卸下');
                        renderProtagonist();
                    } else {
                        showProtagonistSkillSelector(slotKey);
                    }
                };
            });
        }, 50);
    }

    function showProtagonistEquipSelector(slotType) {
        var matchType = slotType === 'accessory1' || slotType === 'accessory2' ? 'accessory' : slotType;
        var collection = GameState.state.collection;
        var allEquips = [];
        for (var id in collection) {
            var entry = collection[id];
            if (entry.type === 'weapon' || entry.type === 'armor' || entry.type === 'accessory') {
                var equipData = EQUIPMENT_CARDS.find(function (eq) { return eq.id === entry.id; });
                if (equipData && equipData.type === matchType) {
                    if (!isEquipUsedByFormation(entry.id) && !isEquipUsedByProtagonistOtherSlot(entry.id, slotType)) {
                        allEquips.push(entry);
                    }
                }
            }
        }

        var slotLabel = '';
        EQUIP_SLOT_CONFIG.forEach(function (cfg) {
            if (cfg.key === slotType) slotLabel = cfg.label;
        });

        var listHtml = '<div style="display:flex;flex-direction:column;gap:8px;max-height:55vh;overflow-y:auto;">';
        allEquips.forEach(function (e) {
            var equipData = EQUIPMENT_CARDS.find(function (eq) { return eq.id === e.id; });
            if (!equipData) return;
            var rarityCls = 'rarity-' + e.rarity.toLowerCase();
            var bonusStr = Object.keys(equipData.bonus).map(function (k) {
                var val = Math.floor(equipData.bonus[k] * (1 + (e.level - 1) * 0.20));
                var label = STAT_LABELS[k] || k;
                return label + '+' + val;
            }).join('  ');

            listHtml +=
                '<div class="card ' + rarityCls + ' equip-select-card" data-equip-id="' + e.id + '" style="padding:10px;cursor:pointer;display:flex;align-items:center;gap:10px;">' +
                '<div style="font-size:24px;">' + equipData.name.charAt(0) + '</div>' +
                '<div style="flex:1;">' +
                '<div class="card-name" style="font-size:13px;">' + equipData.name + '</div>' +
                '<div style="font-size:11px;color:var(--jade);margin-top:2px;">' + bonusStr + '</div>' +
                '<div style="font-size:10px;color:var(--gold);">Lv.' + e.level + ' · ' + (RARITY[e.rarity] ? RARITY[e.rarity].name : e.rarity) + '</div>' +
                '</div>' +
                '</div>';
        });
        listHtml += '</div>';

        if (allEquips.length === 0) {
            listHtml = '<div class="empty-state" style="padding:24px;">暂无可用' + slotLabel + '，前往酒馆抽卡获取</div>';
        }

        var html =
            '<div class="modal-title">选择' + slotLabel + '</div>' +
            '<button class="modal-close" onclick="window._hideFormationModal()">✕</button>' +
            listHtml;

        showModal(html);

        setTimeout(function () {
            document.querySelectorAll('.equip-select-card').forEach(function (card) {
                card.onclick = function () {
                    var equipId = card.getAttribute('data-equip-id');
                    GameState.equipProtagonistItem(slotType, equipId);
                    hideModal();
                    showToast('已装备到少侠');
                    renderProtagonist();
                };
            });
        }, 50);
    }

    function showProtagonistSkillSelector(slotType) {
        var protSkills = GameState.state.protagonist.skills || {};
        var usedSkillIds = [];
        for (var s in protSkills) {
            if (protSkills[s] && s !== slotType) usedSkillIds.push(protSkills[s]);
        }

        var allSkills = GameState.getCollectionByType('skill');
        var available = allSkills.filter(function (s) {
            if (s.type !== 'skill') return false;
            if (usedSkillIds.indexOf(s.id) !== -1) return false;
            if (isSkillUsedByFormation(s.id)) return false;
            return true;
        });

        var listHtml = '<div style="display:flex;flex-direction:column;gap:8px;max-height:55vh;overflow-y:auto;">';
        available.forEach(function (s) {
            var skillData = SKILL_CARDS.find(function (sk) { return sk.id === s.id; });
            if (!skillData) return;
            var rarityCls = 'rarity-' + s.rarity.toLowerCase();

            var typeLabel = '';
            if (skillData.type === 'active_attack') typeLabel = '攻击';
            else if (skillData.type === 'heal') typeLabel = '治疗';
            else if (skillData.type === 'control') typeLabel = '控制';
            else if (skillData.type === 'passive_buff') typeLabel = '增益';

            listHtml +=
                '<div class="card ' + rarityCls + ' skill-select-card" data-skill-id="' + s.id + '" style="padding:10px;cursor:pointer;display:flex;align-items:center;gap:10px;">' +
                '<div style="font-size:24px;">📖</div>' +
                '<div style="flex:1;">' +
                '<div class="card-name" style="font-size:13px;">' + skillData.name + '</div>' +
                '<div style="font-size:11px;color:var(--azure);margin-top:2px;">' + skillData.effect + '</div>' +
                '<div style="font-size:10px;color:var(--gold);">Lv.' + s.level + ' · ' + typeLabel + (skillData.multiplier > 0 ? ' · ×' + skillData.multiplier : '') + '</div>' +
                '</div>' +
                '</div>';
        });
        listHtml += '</div>';

        if (available.length === 0) {
            listHtml = '<div class="empty-state" style="padding:24px;">暂无可用秘籍</div>';
        }

        var html =
            '<div class="modal-title">选择武林秘籍</div>' +
            '<button class="modal-close" onclick="window._hideFormationModal()">✕</button>' +
            listHtml;

        showModal(html);

        setTimeout(function () {
            document.querySelectorAll('.skill-select-card').forEach(function (card) {
                card.onclick = function () {
                    var skillId = card.getAttribute('data-skill-id');
                    GameState.equipProtagonistSkill(slotType, skillId);
                    hideModal();
                    showToast('秘籍已装备到少侠');
                    renderProtagonist();
                };
            });
        }, 50);
    }

    function isEquipUsedByFormation(equipId) {
        var formation = GameState.state.formation;
        if (!formation.equips) return false;
        for (var hid in formation.equips) {
            var heroEquips = formation.equips[hid];
            for (var slot in heroEquips) {
                if (heroEquips[slot] === equipId) return true;
            }
        }
        return false;
    }

    function isEquipUsedByProtagonistOtherSlot(equipId, currentSlot) {
        var p = GameState.state.protagonist;
        if (!p.equips) return false;
        for (var slot in p.equips) {
            if (slot === currentSlot) continue;
            if (p.equips[slot] === equipId) return true;
        }
        return false;
    }

    function isSkillUsedByFormation(skillId) {
        var formation = GameState.state.formation;
        if (!formation.skills) return false;
        for (var hid in formation.skills) {
            var heroSkills = formation.skills[hid];
            for (var slot in heroSkills) {
                if (heroSkills[slot] === skillId) return true;
            }
        }
        return false;
    }

    function isSkillUsedByProtagonistOtherSlot(skillId, currentSlot) {
        var p = GameState.state.protagonist;
        if (!p.skills) return false;
        for (var slot in p.skills) {
            if (slot === currentSlot) continue;
            if (p.skills[slot] === skillId) return true;
        }
        return false;
    }

    function showModal(html) {
        var overlay = document.getElementById('modal-overlay');
        var content = document.getElementById('modal-content');
        content.innerHTML = html;
        overlay.style.display = 'flex';
        overlay.onclick = function (e) {
            if (e.target === overlay) hideModal();
        };
    }

    function hideModal() {
        var overlay = document.getElementById('modal-overlay');
        overlay.style.display = 'none';
        document.getElementById('modal-content').innerHTML = '';
    }

    function showToast(msg) {
        var existing = document.querySelector('.toast');
        if (existing) existing.remove();
        var toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = msg;
        document.getElementById('app').appendChild(toast);
        setTimeout(function () { if (toast.parentNode) toast.remove(); }, 2500);
    }

    window.renderProtagonist = renderProtagonist;
    window.renderProtagonistPage = renderProtagonist;
})();
