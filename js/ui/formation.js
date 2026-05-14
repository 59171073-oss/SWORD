(function () {

    var _selectedSlotIndex = null;
    var _selectedHeroId = null;
    var _longPressTimer = null;

    var SLOT_LABELS = ['先锋', '左翼', '中军', '右翼', '殿后'];

    var EQUIP_SLOT_CONFIG = [
        { key: 'weapon', label: '武器', icon: '⚔️' },
        { key: 'armor', label: '护甲', icon: '🛡️' },
        { key: 'accessory1', label: '饰品一', icon: '💍' },
        { key: 'accessory2', label: '饰品二', icon: '💍' }
    ];

    var SKILL_SLOT_CONFIG = [
        { key: 'skill1', label: '秘籍一', icon: '�' },
        { key: 'skill2', label: '秘籍二', icon: '📖' },
        { key: 'skill3', label: '秘籍三', icon: '�' },
        { key: 'skill4', label: '秘籍四', icon: '📖' }
    ];

    var FIVE_ELEMENTS = ['金', '水', '木', '火', '土'];

    var ELEMENT_COLORS = {
        '金': '#8e8e8e',
        '木': '#27ae60',
        '水': '#2980b9',
        '火': '#e74c3c',
        '土': '#a0522d'
    };

    var ELEMENT_PENTAGON = {
        '火': { x: 80, y: 12 },
        '土': { x: 144, y: 46 },
        '金': { x: 118, y: 100 },
        '水': { x: 42, y: 100 },
        '木': { x: 16, y: 46 }
    };

    var GENERATE_PAIRS = [
        ['金', '水'],
        ['水', '木'],
        ['木', '火'],
        ['火', '土'],
        ['土', '金']
    ];

    var STAT_MAX = { hp: 5000, atk: 600, def: 500, spd: 500 };
    var STAT_LABELS = { hp: '血', atk: '攻', def: '防', spd: '速' };
    var STAT_COLORS = { hp: '#e74c3c', atk: '#e67e22', def: '#3498db', spd: '#2ecc71' };

    function getHeroData(heroId) {
        return CHARACTER_CARDS.find(function (c) { return c.id === heroId; });
    }

    function getEquipData(equipId) {
        return EQUIPMENT_CARDS.find(function (e) { return e.id === equipId; });
    }

    function getSkillData(skillId) {
        return SKILL_CARDS.find(function (s) { return s.id === skillId; });
    }

    function getRarityClass(rarity) {
        return 'rarity-' + rarity.toLowerCase();
    }

    function getRarityName(rarity) {
        return RARITY[rarity] ? RARITY[rarity].name : rarity;
    }

    function isEquipUsedByOther(heroId, equipId) {
        var formation = GameState.state.formation;
        if (!formation.equips) return false;
        for (var hid in formation.equips) {
            if (hid === heroId) continue;
            var heroEquips = formation.equips[hid];
            for (var slot in heroEquips) {
                if (heroEquips[slot] === equipId) return true;
            }
        }
        if (GameState.isEquipUsedByProtagonist(equipId)) return true;
        return false;
    }

    function isSkillUsedByOther(heroId, skillId) {
        var formation = GameState.state.formation;
        if (!formation.skills) return false;
        for (var hid in formation.skills) {
            if (hid === heroId) continue;
            var heroSkills = formation.skills[hid];
            for (var slot in heroSkills) {
                if (heroSkills[slot] === skillId) return true;
            }
        }
        if (GameState.isSkillUsedByProtagonist(skillId)) return true;
        return false;
    }

    function getTeamElements() {
        var formation = GameState.state.formation;
        var elements = [];
        if (formation.slots) {
            formation.slots.forEach(function (heroId) {
                if (heroId) {
                    var heroData = getHeroData(heroId);
                    if (heroData && elements.indexOf(heroData.element) === -1) {
                        elements.push(heroData.element);
                    }
                }
            });
        }
        return elements;
    }

    function getHeroesInFormation() {
        var formation = GameState.state.formation;
        var heroes = [];
        if (formation.slots) {
            formation.slots.forEach(function (heroId) {
                if (heroId && heroes.indexOf(heroId) === -1) {
                    heroes.push(heroId);
                }
            });
        }
        return heroes;
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
        overlay.onclick = null;
        document.getElementById('modal-content').innerHTML = '';
    }

    function showToast(msg, isError) {
        var existing = document.querySelector('.toast');
        if (existing) existing.remove();
        var toast = document.createElement('div');
        toast.className = 'toast' + (isError ? ' toast-error' : '');
        toast.textContent = msg;
        document.getElementById('app').appendChild(toast);
        setTimeout(function () { if (toast.parentNode) toast.remove(); }, 2500);
    }

    function navigateTo(pageId) {
        document.querySelectorAll('.page').forEach(function (p) { p.classList.remove('active'); });
        var page = document.getElementById('page-' + pageId);
        if (page) page.classList.add('active');
        document.querySelectorAll('.nav-btn').forEach(function (btn) {
            btn.classList.toggle('active', btn.getAttribute('data-page') === pageId);
        });
    }

    function renderElementDiagram() {
        var teamElements = getTeamElements();
        var container = document.getElementById('formation-elements');
        if (!container) return;

        var svgLines = '';
        GENERATE_PAIRS.forEach(function (pair) {
            var from = ELEMENT_PENTAGON[pair[0]];
            var to = ELEMENT_PENTAGON[pair[1]];
            var bothPresent = teamElements.indexOf(pair[0]) !== -1 && teamElements.indexOf(pair[1]) !== -1;
            var lineColor = bothPresent ? 'rgba(212, 160, 23, 0.8)' : 'rgba(139, 115, 85, 0.2)';
            var lineWidth = bothPresent ? 2 : 1;
            svgLines += '<line x1="' + from.x + '" y1="' + from.y + '" x2="' + to.x + '" y2="' + to.y + '" stroke="' + lineColor + '" stroke-width="' + lineWidth + '"' + (bothPresent ? ' filter="url(#glow)"' : '') + '/>';
        });

        var svgNodes = '';
        FIVE_ELEMENTS.forEach(function (el) {
            var pos = ELEMENT_PENTAGON[el];
            var isPresent = teamElements.indexOf(el) !== -1;
            var fillColor = isPresent ? ELEMENT_COLORS[el] : 'rgba(139, 115, 85, 0.15)';
            var strokeColor = isPresent ? ELEMENT_COLORS[el] : 'rgba(139, 115, 85, 0.3)';
            var textColor = isPresent ? '#fff' : 'rgba(127, 140, 141, 0.5)';
            var r = isPresent ? 16 : 13;
            var sw = isPresent ? 2 : 1;
            svgNodes += '<circle cx="' + pos.x + '" cy="' + pos.y + '" r="' + r + '" fill="' + fillColor + '" stroke="' + strokeColor + '" stroke-width="' + sw + '" opacity="' + (isPresent ? 1 : 0.6) + '"/>';
            svgNodes += '<text x="' + pos.x + '" y="' + (pos.y + 1) + '" text-anchor="middle" dominant-baseline="middle" fill="' + textColor + '" font-size="11" font-family="KaiTi, STKaiti, FangSong, serif">' + ELEMENT_ICONS[el] + '</text>';
        });

        container.innerHTML =
            '<svg width="160" height="112" viewBox="0 0 160 112" style="display:block;">' +
            '<defs><filter id="glow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>' +
            svgLines + svgNodes +
            '</svg>';
    }

    function renderStatBar(stat, value, maxVal) {
        var pct = Math.min(100, Math.max(0, (value / maxVal) * 100));
        return '<div style="display:flex;align-items:center;gap:3px;margin-top:2px;">' +
            '<span style="font-size:8px;color:' + STAT_COLORS[stat] + ';width:14px;text-align:right;">' + STAT_LABELS[stat] + '</span>' +
            '<div style="flex:1;height:3px;background:rgba(0,0,0,0.4);border-radius:2px;overflow:hidden;">' +
            '<div style="width:' + pct + '%;height:100%;background:' + STAT_COLORS[stat] + ';border-radius:2px;transition:width 0.3s;"></div>' +
            '</div>' +
            '<span style="font-size:7px;color:var(--cyan-gray);width:22px;">' + value + '</span>' +
            '</div>';
    }

    window.renderFormation = function () {
        var formation = GameState.getFormation();
        if (!formation.slots) formation.slots = [null, null, null, null, null];
        if (!formation.equips) formation.equips = {};
        if (!formation.skills) formation.skills = {};

        var powerEl = document.getElementById('formation-power');
        if (powerEl) powerEl.textContent = window.calculateTeamPower();

        renderElementDiagram();

        var protContainer = document.getElementById('formation-protagonist');
        if (protContainer) {
            var protStats = GameState.getProtagonistStats();
            if (protStats) {
                var classData = CLASSES[protStats.classId];
                protContainer.innerHTML =
                    '<div class="prot-in-formation">' +
                    '<span class="prot-badge">' + (classData ? classData.icon : '⚔️') + ' 少侠 Lv.' + protStats.level + '</span>' +
                    '<span class="prot-note">（自动参战，不占坑位）</span>' +
                    '<span class="prot-stats-brief" style="font-size:10px;color:var(--cyan-gray);margin-left:8px;">' +
                    '❤️' + protStats.hp + ' ⚔️' + protStats.atk + ' 🛡️' + protStats.def + ' 💨' + protStats.spd +
                    '</span>' +
                    '</div>';
            }
        }

        var slotsContainer = document.getElementById('formation-slots');
        if (slotsContainer) {
            slotsContainer.innerHTML = '';
            for (var i = 0; i < 5; i++) {
                slotsContainer.appendChild(createSlotElement(i));
            }
        }

        var equipPanel = document.getElementById('formation-equip');
        if (equipPanel) {
            if (_selectedHeroId) {
                window.renderEquipPanel(_selectedHeroId);
                equipPanel.style.display = '';
            } else {
                equipPanel.style.display = 'none';
            }
        }

        var actionsEl = document.querySelector('.formation-actions');
        if (actionsEl) {
            actionsEl.innerHTML =
                '<button class="btn-ancient" id="btn-save-formation" style="margin-right:12px;">保存编队</button>' +
                '<button class="btn-ancient" id="btn-go-battle">出战</button>';
            document.getElementById('btn-save-formation').onclick = function () {
                window.saveFormation();
            };
            document.getElementById('btn-go-battle').onclick = function () {
                var formation = GameState.getFormation();
                var heroCount = formation.slots ? formation.slots.filter(function (s) { return s !== null; }).length : 0;
                if (heroCount === 0) {
                    showToast('编队中至少需要一位侠客', true);
                    return;
                }
                if (heroCount < 5) {
                    if (!confirm('当前编队不足5人，是否仍要出战？')) return;
                }
                window.saveFormation();
                navigateTo('stages');
            };
        }
    };

    function createSlotElement(slotIndex) {
        var formation = GameState.getFormation();
        var heroId = formation.slots[slotIndex];
        var slot = document.createElement('div');
        slot.className = 'formation-slot' + (heroId ? ' filled' : '') + (_selectedSlotIndex === slotIndex ? ' selected' : '');
        slot.setAttribute('data-slot', slotIndex);

        var labelDiv = document.createElement('div');
        labelDiv.className = 'slot-label';
        labelDiv.textContent = SLOT_LABELS[slotIndex];
        slot.appendChild(labelDiv);

        var cardDiv = document.createElement('div');
        cardDiv.className = 'slot-card';

        if (heroId) {
            var heroData = getHeroData(heroId);
            var heroEntry = GameState.state.collection[heroId];
            if (heroData && heroEntry) {
                var stats = GameState.getHeroStats(heroId);
                var classData = CLASSES[heroData.classId];
                var rarityCls = getRarityClass(heroEntry.rarity);

                cardDiv.innerHTML =
                    '<div class="card ' + rarityCls + '" style="padding:6px;border-radius:6px;">' +
                    '<div style="display:flex;align-items:center;gap:4px;margin-bottom:3px;">' +
                    '<span style="font-size:14px;">' + (classData ? classData.icon : '') + '</span>' +
                    '<span class="card-name" style="font-size:11px;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + heroData.name + '</span>' +
                    '</div>' +
                    '<div style="display:flex;gap:3px;margin-bottom:3px;">' +
                    '<span class="card-element element-' + heroData.element + '" style="font-size:8px;padding:0 4px;">' + heroData.element + '</span>' +
                    '<span class="card-level" style="font-size:9px;">Lv.' + heroEntry.level + '</span>' +
                    '</div>' +
                    (stats ? renderStatBar('hp', stats.hp, STAT_MAX.hp) + renderStatBar('atk', stats.atk, STAT_MAX.atk) : '') +
                    '</div>';
            }
        } else {
            cardDiv.innerHTML = '<div style="font-size:28px;color:var(--border-ancient);opacity:0.5;">+</div>';
        }

        slot.appendChild(cardDiv);

        slot.onclick = function (e) {
            e.stopPropagation();
            if (_longPressTimer) { clearTimeout(_longPressTimer); _longPressTimer = null; }
            if (heroId) {
                _selectedSlotIndex = slotIndex;
                _selectedHeroId = heroId;
                window.renderFormation();
            } else {
                window.showHeroSelector(slotIndex);
            }
        };

        slot.oncontextmenu = function (e) {
            e.preventDefault();
            if (heroId) {
                window.removeFromFormation(slotIndex);
            }
        };

        var touchStartY = 0;
        slot.addEventListener('touchstart', function (e) {
            touchStartY = e.touches[0].clientY;
            if (heroId) {
                _longPressTimer = setTimeout(function () {
                    _longPressTimer = null;
                    window.removeFromFormation(slotIndex);
                }, 600);
            }
        }, { passive: true });

        slot.addEventListener('touchmove', function (e) {
            if (_longPressTimer) {
                var dy = Math.abs(e.touches[0].clientY - touchStartY);
                if (dy > 10) { clearTimeout(_longPressTimer); _longPressTimer = null; }
            }
        }, { passive: true });

        slot.addEventListener('touchend', function () {
            if (_longPressTimer) { clearTimeout(_longPressTimer); _longPressTimer = null; }
        }, { passive: true });

        return slot;
    }

    window.renderFormationSlot = function (slotIndex) {
        var slotsContainer = document.getElementById('formation-slots');
        if (!slotsContainer) return;
        var existing = slotsContainer.querySelector('[data-slot="' + slotIndex + '"]');
        if (existing) {
            var newSlot = createSlotElement(slotIndex);
            slotsContainer.replaceChild(newSlot, existing);
        }
    };

    window.showHeroSelector = function (slotIndex) {
        var formation = GameState.getFormation();
        var heroesInFormation = getHeroesInFormation();
        var allHeroes = GameState.getCollectionByType('hero');

        var available = allHeroes.filter(function (h) {
            return heroesInFormation.indexOf(h.id) === -1;
        });

        var filterHtml =
            '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:12px;">' +
            '<button class="filter-btn active" data-filter-class="all">全部</button>';

        var classIds = [];
        available.forEach(function (h) {
            var heroData = getHeroData(h.id);
            if (heroData && classIds.indexOf(heroData.classId) === -1) classIds.push(heroData.classId);
        });
        classIds.forEach(function (cid) {
            var cls = CLASSES[cid];
            if (cls) filterHtml += '<button class="filter-btn" data-filter-class="' + cid + '">' + cls.icon + cls.name + '</button>';
        });

        filterHtml += '</div><div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:12px;">' +
            '<button class="filter-btn active" data-filter-element="all">五行</button>';
        var elementSet = [];
        available.forEach(function (h) {
            var heroData = getHeroData(h.id);
            if (heroData && elementSet.indexOf(heroData.element) === -1) elementSet.push(heroData.element);
        });
        elementSet.forEach(function (el) {
            filterHtml += '<button class="filter-btn" data-filter-element="' + el + '">' + ELEMENT_ICONS[el] + el + '</button>';
        });
        filterHtml += '</div>';

        var listHtml = '<div id="hero-list" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;max-height:50vh;overflow-y:auto;">';
        available.forEach(function (h) {
            var heroData = getHeroData(h.id);
            if (!heroData) return;
            var classData = CLASSES[heroData.classId];
            var stats = GameState.getHeroStats(h.id);
            var power = stats ? (stats.hp + stats.atk + stats.def + stats.spd) : 0;
            var rarityCls = getRarityClass(h.rarity);
            listHtml +=
                '<div class="card ' + rarityCls + ' hero-select-card" data-hero-id="' + h.id + '" data-hero-class="' + heroData.classId + '" data-hero-element="' + heroData.element + '" style="padding:8px;cursor:pointer;">' +
                '<div style="font-size:20px;text-align:center;margin-bottom:4px;">' + (classData ? classData.icon : '') + '</div>' +
                '<div class="card-name" style="font-size:11px;text-align:center;">' + heroData.name + '</div>' +
                '<div style="text-align:center;margin:3px 0;">' +
                '<span class="card-element element-' + heroData.element + '" style="font-size:8px;padding:0 4px;">' + heroData.element + '</span>' +
                '</div>' +
                '<div class="card-level" style="font-size:10px;text-align:center;">Lv.' + h.level + '</div>' +
                '<div style="font-size:9px;color:var(--gold);text-align:center;margin-top:2px;">⚔' + power + '</div>' +
                '</div>';
        });
        listHtml += '</div>';

        if (available.length === 0) {
            listHtml = '<div class="empty-state" style="padding:24px;">暂无可上阵侠客</div>';
        }

        var html =
            '<div class="modal-title">选择侠客 · ' + SLOT_LABELS[slotIndex] + '</div>' +
            '<button class="modal-close" onclick="window._hideFormationModal()">✕</button>' +
            filterHtml + listHtml;

        showModal(html);

        setTimeout(function () {
            document.querySelectorAll('.hero-select-card').forEach(function (card) {
                card.onclick = function () {
                    var heroId = card.getAttribute('data-hero-id');
                    window.addToFormation(heroId, slotIndex);
                    hideModal();
                };
            });

            document.querySelectorAll('[data-filter-class]').forEach(function (btn) {
                btn.onclick = function () {
                    document.querySelectorAll('[data-filter-class]').forEach(function (b) { b.classList.remove('active'); });
                    btn.classList.add('active');
                    applyHeroFilters();
                };
            });

            document.querySelectorAll('[data-filter-element]').forEach(function (btn) {
                btn.onclick = function () {
                    document.querySelectorAll('[data-filter-element]').forEach(function (b) { b.classList.remove('active'); });
                    btn.classList.add('active');
                    applyHeroFilters();
                };
            });
        }, 50);
    };

    function applyHeroFilters() {
        var classFilter = 'all';
        var elementFilter = 'all';
        var activeClassBtn = document.querySelector('[data-filter-class].active');
        var activeElementBtn = document.querySelector('[data-filter-element].active');
        if (activeClassBtn) classFilter = activeClassBtn.getAttribute('data-filter-class');
        if (activeElementBtn) elementFilter = activeElementBtn.getAttribute('data-filter-element');

        document.querySelectorAll('.hero-select-card').forEach(function (card) {
            var cardClass = card.getAttribute('data-hero-class');
            var cardElement = card.getAttribute('data-hero-element');
            var show = (classFilter === 'all' || cardClass === classFilter) &&
                (elementFilter === 'all' || cardElement === elementFilter);
            card.style.display = show ? '' : 'none';
        });
    }

    window.renderEquipPanel = function (heroInstanceId) {
        var equipPanel = document.getElementById('formation-equip');
        if (!equipPanel) return;

        var heroData = getHeroData(heroInstanceId);
        var heroEntry = GameState.state.collection[heroInstanceId];
        if (!heroData || !heroEntry) {
            equipPanel.style.display = 'none';
            return;
        }

        var formation = GameState.getFormation();
        if (!formation.equips[heroInstanceId]) formation.equips[heroInstanceId] = { weapon: null, armor: null, accessory: null, secret: null };
        if (!formation.skills[heroInstanceId]) formation.skills[heroInstanceId] = { active: null, passive: null };

        var heroEquips = formation.equips[heroInstanceId];
        var heroSkills = formation.skills[heroInstanceId];
        var classData = CLASSES[heroData.classId];

        var html = '<h3>' + (classData ? classData.icon : '') + ' ' + heroData.name + ' · 装备配置</h3>';

        html += '<div class="equip-slots">';
        EQUIP_SLOT_CONFIG.forEach(function (cfg) {
            var equipId = heroEquips[cfg.key];
            var equipData = equipId ? getEquipData(equipId) : null;
            var equipEntry = equipId ? GameState.state.collection[equipId] : null;

            html += '<div class="equip-slot' + (equipData ? ' filled' : '') + '" data-equip-slot="' + cfg.key + '">';
            html += '<div class="equip-label">' + cfg.icon + ' ' + cfg.label + '</div>';
            if (equipData && equipEntry) {
                var bonusStr = Object.keys(equipData.bonus).map(function (k) {
                    return STAT_LABELS[k] ? STAT_LABELS[k] + '+' + Math.floor(equipData.bonus[k] * (1 + (equipEntry.level - 1) * 0.20)) : k;
                }).join(' ');
                html += '<div style="font-size:10px;color:var(--parchment);margin-top:2px;">' + equipData.name + '</div>';
                html += '<div style="font-size:8px;color:var(--jade);">' + bonusStr + '</div>';
                html += '<div style="font-size:8px;color:var(--gold);">Lv.' + equipEntry.level + '</div>';
            } else {
                html += '<div style="font-size:18px;color:var(--border-ancient);opacity:0.4;">+</div>';
            }
            html += '</div>';
        });
        html += '</div>';

        html += '<div class="skill-slots">';
        SKILL_SLOT_CONFIG.forEach(function (cfg) {
            var skillId = heroSkills[cfg.key];
            var skillData = skillId ? getSkillData(skillId) : null;
            var skillEntry = skillId ? GameState.state.collection[skillId] : null;

            html += '<div class="skill-slot' + (skillData ? ' filled' : '') + '" data-skill-slot="' + cfg.key + '">';
            html += '<div class="skill-label">' + cfg.icon + ' ' + cfg.label + '</div>';
            if (skillData && skillEntry) {
                html += '<div style="font-size:10px;color:var(--parchment);margin-top:2px;">' + skillData.name + '</div>';
                html += '<div style="font-size:8px;color:var(--azure);">' + skillData.effect + '</div>';
                if (skillData.multiplier > 0) {
                    html += '<div style="font-size:8px;color:var(--gold);">×' + skillData.multiplier + '</div>';
                }
            } else {
                html += '<div style="font-size:18px;color:var(--border-ancient);opacity:0.4;">+</div>';
            }
            html += '</div>';
        });
        html += '</div>';

        equipPanel.innerHTML = html;
        equipPanel.style.display = '';

        setTimeout(function () {
            equipPanel.querySelectorAll('[data-equip-slot]').forEach(function (el) {
                el.onclick = function () {
                    var slotKey = el.getAttribute('data-equip-slot');
                    var equipId = heroEquips[slotKey];
                    if (equipId) {
                        window.unequipItem(heroInstanceId, slotKey);
                    } else {
                        window.showEquipSelector(heroInstanceId, slotKey);
                    }
                };
            });

            equipPanel.querySelectorAll('[data-skill-slot]').forEach(function (el) {
                el.onclick = function () {
                    var slotKey = el.getAttribute('data-skill-slot');
                    var skillId = heroSkills[slotKey];
                    if (skillId) {
                        window.unequipSkill(heroInstanceId, slotKey);
                    } else {
                        window.showSkillSelector(heroInstanceId, slotKey);
                    }
                };
            });
        }, 50);
    };

    window.showEquipSelector = function (heroInstanceId, slotType) {
        var allEquips = GameState.getCollectionByType('equip');
        var available = allEquips.filter(function (e) {
            if (e.type !== 'equip') return false;
            var equipData = getEquipData(e.id);
            if (!equipData) return false;
            var matchType = slotType === 'accessory1' || slotType === 'accessory2' ? 'accessory' : slotType;
            if (equipData.type !== matchType) return false;
            if (isEquipUsedByOther(heroInstanceId, e.id)) return false;
            return true;
        });

        var slotLabel = '';
        EQUIP_SLOT_CONFIG.forEach(function (cfg) {
            if (cfg.key === slotType) slotLabel = cfg.label;
        });

        var listHtml = '<div style="display:flex;flex-direction:column;gap:8px;max-height:55vh;overflow-y:auto;">';
        available.forEach(function (e) {
            var equipData = getEquipData(e.id);
            if (!equipData) return;
            var rarityCls = getRarityClass(e.rarity);
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
                '<div style="font-size:10px;color:var(--gold);">Lv.' + e.level + ' · ' + getRarityName(e.rarity) + '</div>' +
                '</div>' +
                '</div>';
        });
        listHtml += '</div>';

        if (available.length === 0) {
            listHtml = '<div class="empty-state" style="padding:24px;">暂无可用' + slotLabel + '</div>';
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
                    window.equipItem(heroInstanceId, slotType, equipId);
                    hideModal();
                };
            });
        }, 50);
    };

    window.showSkillSelector = function (heroInstanceId, slotType) {
        var allSkills = GameState.getCollectionByType('skill');
        var heroSkills = GameState.state.formation.skills[heroInstanceId] || {};
        var usedSkillIds = [];
        for (var s in heroSkills) {
            if (heroSkills[s] && s !== slotType) usedSkillIds.push(heroSkills[s]);
        }

        var available = allSkills.filter(function (s) {
            if (s.type !== 'skill') return false;
            if (usedSkillIds.indexOf(s.id) !== -1) return false;
            if (isSkillUsedByOther(heroInstanceId, s.id)) return false;
            return true;
        });

        var listHtml = '<div style="display:flex;flex-direction:column;gap:8px;max-height:55vh;overflow-y:auto;">';
        available.forEach(function (s) {
            var skillData = getSkillData(s.id);
            if (!skillData) return;
            var rarityCls = getRarityClass(s.rarity);

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
                    window.equipSkill(heroInstanceId, slotType, skillId);
                    hideModal();
                };
            });
        }, 50);
    };

    window.addToFormation = function (heroInstanceId, slotIndex) {
        var formation = GameState.getFormation();
        if (!formation.slots) formation.slots = [null, null, null, null, null];
        if (slotIndex < 0 || slotIndex > 4) {
            showToast('无效槽位', true);
            return;
        }
        var existingSlot = formation.slots.indexOf(heroInstanceId);
        if (existingSlot !== -1) {
            showToast('该侠客已在编队中', true);
            return;
        }
        formation.slots[slotIndex] = heroInstanceId;
        if (!formation.equips[heroInstanceId]) formation.equips[heroInstanceId] = { weapon: null, armor: null, accessory1: null, accessory2: null };
        if (!formation.skills[heroInstanceId]) formation.skills[heroInstanceId] = { skill1: null, skill2: null, skill3: null, skill4: null };
        _selectedSlotIndex = slotIndex;
        _selectedHeroId = heroInstanceId;
        window.renderFormation();
        showToast(getHeroData(heroInstanceId).name + ' 入阵');
    };

    window.removeFromFormation = function (slotIndex) {
        var formation = GameState.getFormation();
        if (!formation.slots) return;
        var heroId = formation.slots[slotIndex];
        if (!heroId) return;

        var heroData = getHeroData(heroId);
        formation.slots[slotIndex] = null;
        delete formation.equips[heroId];
        delete formation.skills[heroId];

        if (_selectedSlotIndex === slotIndex) {
            _selectedSlotIndex = null;
            _selectedHeroId = null;
        }

        window.renderFormation();
        showToast((heroData ? heroData.name : '侠客') + ' 离阵');
    };

    window.equipItem = function (heroInstanceId, slotType, equipInstanceId) {
        var formation = GameState.getFormation();
        if (!formation.equips[heroInstanceId]) formation.equips[heroInstanceId] = { weapon: null, armor: null, accessory1: null, accessory2: null };

        if (isEquipUsedByOther(heroInstanceId, equipInstanceId)) {
            showToast('该装备已被其他侠客使用', true);
            return;
        }

        var currentEquip = formation.equips[heroInstanceId][slotType];
        formation.equips[heroInstanceId][slotType] = equipInstanceId;

        var equipData = getEquipData(equipInstanceId);
        showToast((equipData ? equipData.name : '装备') + ' 已装备');
        window.renderFormation();
    };

    window.unequipItem = function (heroInstanceId, slotType) {
        var formation = GameState.getFormation();
        if (!formation.equips[heroInstanceId]) return;
        var equipId = formation.equips[heroInstanceId][slotType];
        if (!equipId) return;

        formation.equips[heroInstanceId][slotType] = null;
        var equipData = getEquipData(equipId);
        showToast((equipData ? equipData.name : '装备') + ' 已卸下');
        window.renderFormation();
    };

    window.equipSkill = function (heroInstanceId, slotType, skillInstanceId) {
        var formation = GameState.getFormation();
        if (!formation.skills[heroInstanceId]) formation.skills[heroInstanceId] = { skill1: null, skill2: null, skill3: null, skill4: null };

        if (isSkillUsedByOther(heroInstanceId, skillInstanceId)) {
            showToast('该技能已被其他侠客使用', true);
            return;
        }

        formation.skills[heroInstanceId][slotType] = skillInstanceId;

        var skillData = getSkillData(skillInstanceId);
        showToast((skillData ? skillData.name : '技能') + ' 已装备');
        window.renderFormation();
    };

    window.unequipSkill = function (heroInstanceId, slotType) {
        var formation = GameState.getFormation();
        if (!formation.skills[heroInstanceId]) return;
        var skillId = formation.skills[heroInstanceId][slotType];
        if (!skillId) return;

        formation.skills[heroInstanceId][slotType] = null;
        var skillData = getSkillData(skillId);
        showToast((skillData ? skillData.name : '技能') + ' 已卸下');
        window.renderFormation();
    };

    window.saveFormation = function () {
        GameState.setFormation(GameState.getFormation());
        showToast('编队已保存');
    };

    window.calculateTeamPower = function () {
        return GameState.getTeamPower();
    };

    window._hideFormationModal = function () {
        hideModal();
    };

})();
