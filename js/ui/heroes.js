(function () {

    var STAT_LABELS = { hp: '生命', atk: '攻击', def: '防御', spd: '速度' };
    var STAT_COLORS = { hp: '#e74c3c', atk: '#e67e22', def: '#3498db', spd: '#2ecc71' };
    var STAT_ICONS = { hp: '❤️', atk: '⚔️', def: '🛡️', spd: '💨' };

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

    function getEquipBonusStr(equipId) {
        var equipData = getEquipData(equipId);
        var equipEntry = equipId ? GameState.state.collection[equipId] : null;
        if (!equipData || !equipEntry) return '';
        return Object.keys(equipData.bonus).map(function (k) {
            var label = STAT_LABELS[k] || k;
            return label + '+' + Math.floor(equipData.bonus[k] * (1 + (equipEntry.level - 1) * 0.20));
        }).join(' ');
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

    function showToast(msg, isError) {
        var existing = document.querySelector('.toast');
        if (existing) existing.remove();
        var toast = document.createElement('div');
        toast.className = 'toast' + (isError ? ' toast-error' : '');
        toast.textContent = msg;
        document.getElementById('app').appendChild(toast);
        setTimeout(function () { if (toast.parentNode) toast.remove(); }, 2500);
    }

    function renderProtagonistCard() {
        var stats = GameState.getProtagonistStats();
        if (!stats) return '';

        var p = GameState.state.protagonist;
        var html = '<div class="hero-card protagonist-card">';
        html += '<div class="hero-header">';
        html += '<span class="hero-badge">⚔️ 少侠</span>';
        html += '<span class="hero-level">Lv.' + stats.level + '</span>';
        html += '</div>';

        html += '<div class="hero-stats">';
        for (var stat in STAT_LABELS) {
            html += '<span class="stat-item" style="color:' + STAT_COLORS[stat] + ';">' +
                STAT_ICONS[stat] + stats[stat] + '</span>';
        }
        html += '</div>';

        html += '<div class="hero-equips">';
        EQUIP_SLOT_CONFIG.forEach(function (cfg) {
            var equipId = p.equips ? p.equips[cfg.key] : null;
            var equipData = equipId ? getEquipData(equipId) : null;
            html += '<div class="equip-mini-slot' + (equipData ? ' filled' : '') + '">';
            if (equipData) {
                html += '<span class="equip-icon">' + cfg.icon + '</span>';
                html += '<span class="equip-name">' + equipData.name + '</span>';
            } else {
                html += '<span class="equip-icon empty">' + cfg.icon + '</span>';
                html += '<span class="equip-name empty">' + cfg.label + '</span>';
            }
            html += '</div>';
        });
        html += '</div>';

        html += '<div class="hero-skills">';
        var skillCount = 0;
        SKILL_SLOT_CONFIG.forEach(function (cfg) {
            var skillId = p.skills ? p.skills[cfg.key] : null;
            var skillData = skillId ? getSkillData(skillId) : null;
            if (skillData) {
                skillCount++;
                html += '<span class="skill-badge">' + skillData.name + '</span>';
            }
        });
        if (skillCount === 0) {
            html += '<span class="skill-badge empty">暂无秘籍</span>';
        }
        html += '</div>';

        html += '<div class="hero-actions">';
        html += '<button class="btn-ancient btn-sm" onclick="window.showProtagonistDetail()">查看详情</button>';
        html += '</div>';

        html += '</div>';
        return html;
    }

    function renderHeroCard(heroId) {
        var heroData = getHeroData(heroId);
        var heroEntry = GameState.state.collection[heroId];
        if (!heroData || !heroEntry) return '';

        var stats = GameState.getHeroStats(heroId);
        var classData = CLASSES[heroData.classId];
        var rarityCls = getRarityClass(heroEntry.rarity);

        var formation = GameState.state.formation;
        var isInFormation = formation.slots && formation.slots.indexOf(heroId) !== -1;

        var html = '<div class="hero-card ' + rarityCls + '" data-hero-id="' + heroId + '" data-hero-class="' + heroData.classId + '">';

        html += '<div class="hero-header">';
        html += '<span class="hero-badge">' + (classData ? classData.icon : '') + ' ' + heroData.name + '</span>';
        if (isInFormation) {
            html += '<span class="hero-status in-formation">已上阵</span>';
        }
        html += '<span class="hero-level">Lv.' + heroEntry.level + '</span>';
        html += '</div>';

        html += '<div class="hero-info">';
        html += '<span class="card-element element-' + heroData.element + '">' + heroData.element + '</span>';
        html += '<span class="hero-rarity">' + getRarityName(heroEntry.rarity) + '</span>';
        html += '</div>';

        if (stats) {
            html += '<div class="hero-stats">';
            for (var stat in STAT_LABELS) {
                html += '<span class="stat-item" style="color:' + STAT_COLORS[stat] + ';">' +
                    STAT_ICONS[stat] + stats[stat] + '</span>';
            }
            html += '</div>';
        }

        var heroEquips = formation.equips ? formation.equips[heroId] : null;
        var heroSkills = formation.skills ? formation.skills[heroId] : null;

        html += '<div class="hero-equips">';
        EQUIP_SLOT_CONFIG.forEach(function (cfg) {
            var equipId = heroEquips ? heroEquips[cfg.key] : null;
            var equipData = equipId ? getEquipData(equipId) : null;
            html += '<div class="equip-mini-slot' + (equipData ? ' filled' : '') + '">';
            if (equipData) {
                html += '<span class="equip-icon">' + cfg.icon + '</span>';
                html += '<span class="equip-name">' + equipData.name + '</span>';
            } else {
                html += '<span class="equip-icon empty">' + cfg.icon + '</span>';
                html += '<span class="equip-name empty">' + cfg.label + '</span>';
            }
            html += '</div>';
        });
        html += '</div>';

        html += '<div class="hero-skills">';
        var skillCount = 0;
        SKILL_SLOT_CONFIG.forEach(function (cfg) {
            var skillId = heroSkills ? heroSkills[cfg.key] : null;
            var skillData = skillId ? getSkillData(skillId) : null;
            if (skillData) {
                skillCount++;
                html += '<span class="skill-badge">' + skillData.name + '</span>';
            }
        });
        if (skillCount === 0) {
            html += '<span class="skill-badge empty">暂无秘籍</span>';
        }
        html += '</div>';

        html += '<div class="hero-actions">';
        html += '<button class="btn-ancient btn-sm" onclick="window.showHeroDetail(\'' + heroId + '\')">查看详情</button>';
        html += '</div>';

        html += '</div>';
        return html;
    }

    window.renderHeroes = function () {
        var container = document.getElementById('heroes-list');
        if (!container) return;

        var filterContainer = document.querySelector('.heroes-filters');
        if (filterContainer) {
            var allHeroes = GameState.getCollectionByType('hero');
            var classIds = [];
            allHeroes.forEach(function (h) {
                var heroData = getHeroData(h.id);
                if (heroData && classIds.indexOf(heroData.classId) === -1) {
                    classIds.push(heroData.classId);
                }
            });

            var filterHtml = '<button class="filter-btn active" data-filter-class="all">全部</button>';
            classIds.forEach(function (cid) {
                var cls = CLASSES[cid];
                if (cls) {
                    filterHtml += '<button class="filter-btn" data-filter-class="' + cid + '">' + cls.icon + cls.name + '</button>';
                }
            });
            filterContainer.innerHTML = filterHtml;

            setTimeout(function () {
                filterContainer.querySelectorAll('[data-filter-class]').forEach(function (btn) {
                    btn.onclick = function () {
                        filterContainer.querySelectorAll('[data-filter-class]').forEach(function (b) {
                            b.classList.remove('active');
                        });
                        btn.classList.add('active');
                        applyHeroFilter();
                    };
                });
            }, 50);
        }

        var html = '<div class="heroes-section">';
        html += '<h3 class="section-title">少侠</h3>';
        html += '<div class="heroes-grid">';
        html += renderProtagonistCard();
        html += '</div>';
        html += '</div>';

        var allHeroes = GameState.getCollectionByType('hero');
        if (allHeroes.length > 0) {
            html += '<div class="heroes-section">';
            html += '<h3 class="section-title">侠客 (' + allHeroes.length + ')</h3>';
            html += '<div class="heroes-grid">';
            allHeroes.forEach(function (h) {
                html += renderHeroCard(h.id);
            });
            html += '</div>';
            html += '</div>';
        } else {
            html += '<div class="heroes-section">';
            html += '<h3 class="section-title">侠客</h3>';
            html += '<div class="empty-state" style="padding:24px;text-align:center;">暂无侠客，前往酒馆招募</div>';
            html += '</div>';
        }

        container.innerHTML = html;
    };

    function applyHeroFilter() {
        var activeBtn = document.querySelector('.heroes-filters .filter-btn.active');
        var filter = activeBtn ? activeBtn.getAttribute('data-filter-class') : 'all';

        document.querySelectorAll('#heroes-list .hero-card[data-hero-class]').forEach(function (card) {
            var cardClass = card.getAttribute('data-hero-class');
            card.style.display = (filter === 'all' || cardClass === filter) ? '' : 'none';
        });
    }

    window.showProtagonistDetail = function () {
        var stats = GameState.getProtagonistStats();
        var p = GameState.state.protagonist;

        var html = '<div class="modal-title">⚔️ 少侠详情</div>';
        html += '<button class="modal-close" onclick="window._hideHeroesModal()">✕</button>';

        html += '<div class="hero-detail-content">';

        html += '<div class="detail-section">';
        html += '<h4>基础属性</h4>';
        html += '<div class="detail-stats">';
        for (var stat in STAT_LABELS) {
            html += '<div class="detail-stat-item">';
            html += '<span class="stat-label">' + STAT_ICONS[stat] + ' ' + STAT_LABELS[stat] + '</span>';
            html += '<span class="stat-value" style="color:' + STAT_COLORS[stat] + ';">' + stats[stat] + '</span>';
            html += '</div>';
        }
        html += '</div>';
        html += '</div>';

        html += '<div class="detail-section">';
        html += '<h4>装备栏</h4>';
        html += '<div class="detail-equips">';
        EQUIP_SLOT_CONFIG.forEach(function (cfg) {
            var equipId = p.equips ? p.equips[cfg.key] : null;
            var equipData = equipId ? getEquipData(equipId) : null;
            var equipEntry = equipId ? GameState.state.collection[equipId] : null;

            html += '<div class="detail-equip-slot' + (equipData ? ' filled' : '') + '">';
            html += '<div class="slot-header">' + cfg.icon + ' ' + cfg.label + '</div>';
            if (equipData && equipEntry) {
                html += '<div class="slot-name">' + equipData.name + '</div>';
                html += '<div class="slot-bonus">' + getEquipBonusStr(equipId) + '</div>';
                html += '<div class="slot-level">Lv.' + equipEntry.level + '</div>';
            } else {
                html += '<div class="slot-empty">未装备</div>';
            }
            html += '</div>';
        });
        html += '</div>';
        html += '</div>';

        html += '<div class="detail-section">';
        html += '<h4>武林秘籍</h4>';
        html += '<div class="detail-skills">';
        var hasSkill = false;
        SKILL_SLOT_CONFIG.forEach(function (cfg) {
            var skillId = p.skills ? p.skills[cfg.key] : null;
            var skillData = skillId ? getSkillData(skillId) : null;
            var skillEntry = skillId ? GameState.state.collection[skillId] : null;

            if (skillData) {
                hasSkill = true;
                html += '<div class="detail-skill-slot filled">';
                html += '<div class="slot-header">' + cfg.icon + ' ' + cfg.label + '</div>';
                html += '<div class="slot-name">' + skillData.name + '</div>';
                html += '<div class="slot-effect">' + skillData.effect + '</div>';
                if (skillEntry) {
                    html += '<div class="slot-level">Lv.' + skillEntry.level + '</div>';
                }
                html += '</div>';
            }
        });
        if (!hasSkill) {
            html += '<div class="slot-empty">暂无秘籍</div>';
        }
        html += '</div>';
        html += '</div>';

        html += '<div class="detail-actions">';
        html += '<button class="btn-ancient" onclick="window._hideHeroesModal();window.navigateTo(\'protagonist\');">前往配置</button>';
        html += '</div>';

        html += '</div>';

        showModal(html);
    };

    window.showHeroDetail = function (heroId) {
        var heroData = getHeroData(heroId);
        var heroEntry = GameState.state.collection[heroId];
        if (!heroData || !heroEntry) return;

        var stats = GameState.getHeroStats(heroId);
        var classData = CLASSES[heroData.classId];
        var rarityCls = getRarityClass(heroEntry.rarity);

        var formation = GameState.state.formation;
        var heroEquips = formation.equips ? formation.equips[heroId] : null;
        var heroSkills = formation.skills ? formation.skills[heroId] : null;
        var isInFormation = formation.slots && formation.slots.indexOf(heroId) !== -1;

        var html = '<div class="modal-title">' + (classData ? classData.icon : '') + ' ' + heroData.name + ' 详情</div>';
        html += '<button class="modal-close" onclick="window._hideHeroesModal()">✕</button>';

        html += '<div class="hero-detail-content ' + rarityCls + '">';

        html += '<div class="detail-header">';
        html += '<span class="card-element element-' + heroData.element + '">' + heroData.element + '</span>';
        html += '<span class="hero-rarity">' + getRarityName(heroEntry.rarity) + '</span>';
        html += '<span class="hero-level">Lv.' + heroEntry.level + '</span>';
        if (isInFormation) {
            var slotIndex = formation.slots.indexOf(heroId);
            var slotLabels = ['先锋', '左翼', '中军', '右翼', '殿后'];
            html += '<span class="in-formation-badge">' + slotLabels[slotIndex] + '</span>';
        }
        html += '</div>';

        if (heroData.description) {
            html += '<div class="detail-desc">' + heroData.description + '</div>';
        }

        if (stats) {
            html += '<div class="detail-section">';
            html += '<h4>属性</h4>';
            html += '<div class="detail-stats">';
            for (var stat in STAT_LABELS) {
                html += '<div class="detail-stat-item">';
                html += '<span class="stat-label">' + STAT_ICONS[stat] + ' ' + STAT_LABELS[stat] + '</span>';
                html += '<span class="stat-value" style="color:' + STAT_COLORS[stat] + ';">' + stats[stat] + '</span>';
                html += '</div>';
            }
            html += '</div>';
            html += '</div>';
        }

        html += '<div class="detail-section">';
        html += '<h4>装备栏</h4>';
        html += '<div class="detail-equips">';
        EQUIP_SLOT_CONFIG.forEach(function (cfg) {
            var equipId = heroEquips ? heroEquips[cfg.key] : null;
            var equipData = equipId ? getEquipData(equipId) : null;
            var equipEntry = equipId ? GameState.state.collection[equipId] : null;

            html += '<div class="detail-equip-slot' + (equipData ? ' filled' : '') + '">';
            html += '<div class="slot-header">' + cfg.icon + ' ' + cfg.label + '</div>';
            if (equipData && equipEntry) {
                html += '<div class="slot-name">' + equipData.name + '</div>';
                html += '<div class="slot-bonus">' + getEquipBonusStr(equipId) + '</div>';
                html += '<div class="slot-level">Lv.' + equipEntry.level + '</div>';
            } else {
                html += '<div class="slot-empty">未装备</div>';
            }
            html += '</div>';
        });
        html += '</div>';
        html += '</div>';

        html += '<div class="detail-section">';
        html += '<h4>武林秘籍</h4>';
        html += '<div class="detail-skills">';
        var hasSkill = false;
        SKILL_SLOT_CONFIG.forEach(function (cfg) {
            var skillId = heroSkills ? heroSkills[cfg.key] : null;
            var skillData = skillId ? getSkillData(skillId) : null;
            var skillEntry = skillId ? GameState.state.collection[skillId] : null;

            if (skillData) {
                hasSkill = true;
                html += '<div class="detail-skill-slot filled">';
                html += '<div class="slot-header">' + cfg.icon + ' ' + cfg.label + '</div>';
                html += '<div class="slot-name">' + skillData.name + '</div>';
                html += '<div class="slot-effect">' + skillData.effect + '</div>';
                if (skillEntry) {
                    html += '<div class="slot-level">Lv.' + skillEntry.level + '</div>';
                }
                html += '</div>';
            }
        });
        if (!hasSkill) {
            html += '<div class="slot-empty">暂无秘籍</div>';
        }
        html += '</div>';
        html += '</div>';

        html += '<div class="detail-actions">';
        if (isInFormation) {
            html += '<button class="btn-ancient" onclick="window._hideHeroesModal();window.navigateTo(\'formation\');">前往编队</button>';
        } else {
            html += '<button class="btn-ancient" onclick="window._hideHeroesModal();window.navigateTo(\'formation\');">加入编队</button>';
        }
        html += '</div>';

        html += '</div>';

        showModal(html);
    };

    window.navigateTo = function (pageId) {
        document.querySelectorAll('.page').forEach(function (p) { p.classList.remove('active'); });
        var page = document.getElementById('page-' + pageId);
        if (page) page.classList.add('active');
        document.querySelectorAll('.nav-btn').forEach(function (btn) {
            btn.classList.toggle('active', btn.getAttribute('data-page') === pageId);
        });
        if (pageId === 'formation') {
            window.renderFormation();
        } else if (pageId === 'protagonist') {
            window.renderProtagonist();
        }
    };

    window._hideHeroesModal = function () {
        hideModal();
    };

})();
