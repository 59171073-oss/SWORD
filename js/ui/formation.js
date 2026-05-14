const FormationUI = {
    container: null,
    selectedSlot: null,
    selectedHeroId: null,
    currentPanel: 'main',

    init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        this.render();
    },

    render() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="formation-container">
                <div class="formation-header">
                    <h2>阵型</h2>
                    <div class="team-power">战力: <span id="team-power">0</span></div>
                </div>
                <div class="formation-grid" id="formation-grid"></div>
                <div class="formation-actions">
                    <button class="formation-btn" id="btn-add-hero">添加英雄</button>
                    <button class="formation-btn" id="btn-manage-equip">装备管理</button>
                    <button class="formation-btn" id="btn-manage-skill">技能配置</button>
                </div>
                <div class="formation-panel" id="formation-panel"></div>
            </div>
        `;

        this.bindEvents();
        this.renderFormation();
        this.updateTeamPower();
    },

    bindEvents() {
        document.getElementById('btn-add-hero').addEventListener('click', () => this.showAddHeroPanel());
        document.getElementById('btn-manage-equip').addEventListener('click', () => this.showEquipPanel());
        document.getElementById('btn-manage-skill').addEventListener('click', () => this.showSkillPanel());
    },

    renderFormation() {
        const grid = document.getElementById('formation-grid');
        if (!grid) return;

        const formation = GameState.getFormation();
        const slots = formation.slots || [null, null, null, null, null];

        grid.innerHTML = slots.map((heroId, index) => {
            if (heroId) {
                const stats = GameState.getHeroStats(heroId, formation);
                const cardData = CHARACTER_CARDS.find(c => c.id === heroId);
                const rarityData = cardData ? RARITY[cardData.rarity] : null;
                let imageHtml = '';
                if (cardData && cardData.imageUrl) {
                    imageHtml = `<img src="${cardData.imageUrl}" alt="${cardData.name}" class="hero-portrait" onerror="this.style.display='none'">`;
                }
                return `
                    <div class="formation-slot filled" data-slot="${index}">
                        ${imageHtml}
                        <div class="slot-name">${stats ? stats.name : heroId}</div>
                        <div class="slot-level">Lv.${stats ? stats.level : 1}</div>
                        <div class="slot-hp">生命: ${stats ? stats.hp : 0}</div>
                        <div class="slot-element">${stats ? stats.element : '-'}</div>
                        ${rarityData ? `<div class="slot-rarity" style="color: ${rarityData.color}">${rarityData.name}</div>` : ''}
                        <button class="remove-btn" data-slot="${index}">移除</button>
                    </div>
                `;
            } else {
                return `
                    <div class="formation-slot empty" data-slot="${index}">
                        <div class="empty-slot-text">空</div>
                        <button class="add-btn" data-slot="${index}">+</button>
                    </div>
                `;
            }
        }).join('');

        grid.querySelectorAll('.add-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectedSlot = parseInt(btn.dataset.slot);
                this.showAddHeroPanel();
            });
        });

        grid.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const slot = parseInt(btn.dataset.slot);
                this.removeHeroFromSlot(slot);
            });
        });
    },

    showAddHeroPanel() {
        this.currentPanel = 'heroes';
        const panel = document.getElementById('formation-panel');
        if (!panel) return;

        const heroes = GameState.getCollectionByType('hero');

        panel.innerHTML = `
            <div class="panel-header">
                <h3>选择英雄</h3>
                <button class="close-panel-btn" id="close-hero-panel">关闭</button>
            </div>
            <div class="hero-list" id="hero-list"></div>
        `;

        document.getElementById('close-hero-panel').addEventListener('click', () => this.closePanel());

        const heroList = document.getElementById('hero-list');
        if (heroes.length === 0) {
            heroList.innerHTML = '<div class="empty-list">暂无英雄</div>';
            return;
        }

        heroList.innerHTML = heroes.map(hero => {
            const cardData = CHARACTER_CARDS.find(c => c.id === hero.id);
            const rarityData = cardData ? RARITY[cardData.rarity] : null;
            let imageHtml = '';
            if (cardData && cardData.imageUrl) {
                imageHtml = `<img src="${cardData.imageUrl}" alt="${cardData.name}" class="hero-thumb" onerror="this.style.display='none'">`;
            }
            return `
                <div class="hero-item" data-hero-id="${hero.id}">
                    ${imageHtml}
                    <div class="hero-info">
                        <div class="hero-name" style="${rarityData ? `color: ${rarityData.color}` : ''}">${cardData ? cardData.name : hero.id}</div>
                        <div class="hero-details">
                            <span>等级: ${hero.level}</span>
                            <span>数量: x${hero.count}</span>
                            <span>稀有度: ${rarityData ? rarityData.name : '-'}</span>
                        </div>
                    </div>
                    <button class="select-hero-btn" data-hero-id="${hero.id}">选择</button>
                </div>
            `;
        }).join('');

        heroList.querySelectorAll('.select-hero-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const heroId = btn.dataset.heroId;
                this.addHeroToSlot(heroId);
            });
        });
    },

    addHeroToSlot(heroId) {
        const formation = GameState.getFormation();
        if (this.selectedSlot !== null) {
            formation.slots[this.selectedSlot] = heroId;
        } else {
            const emptySlot = formation.slots.findIndex(s => s === null);
            if (emptySlot !== -1) {
                formation.slots[emptySlot] = heroId;
            } else {
                alert('阵型已满');
                return;
            }
        }

        GameState.setFormation(formation);
        this.renderFormation();
        this.updateTeamPower();
        this.closePanel();
    },

    removeHeroFromSlot(slotIndex) {
        const formation = GameState.getFormation();
        formation.slots[slotIndex] = null;
        GameState.setFormation(formation);
        this.renderFormation();
        this.updateTeamPower();
    },

    showEquipPanel() {
        this.currentPanel = 'equip';
        const panel = document.getElementById('formation-panel');
        if (!panel) return;

        const formation = GameState.getFormation();
        const equippedHeroes = formation.slots.filter(id => id !== null);

        if (equippedHeroes.length === 0) {
            panel.innerHTML = `
                <div class="panel-header">
                    <h3>装备管理</h3>
                    <button class="close-panel-btn" id="close-equip-panel">关闭</button>
                </div>
                <div class="empty-list">请先添加英雄到阵型</div>
            `;
            document.getElementById('close-equip-panel').addEventListener('click', () => this.closePanel());
            return;
        }

        panel.innerHTML = `
            <div class="panel-header">
                <h3>装备管理</h3>
                <button class="close-panel-btn" id="close-equip-panel">关闭</button>
            </div>
            <div class="equip-tabs" id="equip-tabs">
                ${equippedHeroes.map((heroId, index) => {
                    const cardData = CHARACTER_CARDS.find(c => c.id === heroId);
                    return `<button class="equip-tab-btn ${index === 0 ? 'active' : ''}" data-hero-index="${index}" data-hero-id="${heroId}">${cardData ? cardData.name : heroId}</button>`;
                }).join('')}
            </div>
            <div class="equip-content" id="equip-content"></div>
        `;

        document.getElementById('close-equip-panel').addEventListener('click', () => this.closePanel());

        const tabs = panel.querySelectorAll('.equip-tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.renderEquipContent(tab.dataset.heroId);
            });
        });

        if (equippedHeroes.length > 0) {
            this.renderEquipContent(equippedHeroes[0]);
        }
    },

    renderEquipContent(heroId) {
        const content = document.getElementById('equip-content');
        if (!content) return;

        const formation = GameState.getFormation();
        const heroEquips = formation.equips[heroId] || { weapon: null, armor: null, accessory1: null, accessory2: null };

        const slots = [
            { key: 'weapon', name: '武器', types: ['weapon'] },
            { key: 'armor', name: '防具', types: ['armor'] },
            { key: 'accessory1', name: '饰品一', types: ['accessory'] },
            { key: 'accessory2', name: '饰品二', types: ['accessory'] }
        ];

        content.innerHTML = slots.map(slot => {
            const equipId = heroEquips[slot.key];
            let equipHtml = '<div class="equip-slot empty-slot">空</div>';
            let equipName = '';
            let equipRarity = null;

            if (equipId) {
                const equipEntry = GameState.state.collection[equipId];
                const equipData = EQUIPMENT_CARDS.find(e => e.id === equipId);
                equipRarity = equipEntry ? RARITY[equipEntry.rarity] : null;
                equipName = equipData ? equipData.name : equipId;
                equipHtml = `<div class="equip-slot filled-slot ${equipEntry ? 'rarity-' + equipEntry.rarity.toLowerCase() : ''}">
                    <div class="equip-name" style="${equipRarity ? `color: ${equipRarity.color}` : ''}">${equipName}</div>
                    <div class="equip-level">Lv.${equipEntry ? equipEntry.level : 1}</div>
                </div>`;
            }

            return `
                <div class="equip-row">
                    <div class="equip-slot-label">${slot.name}</div>
                    <div class="equip-display" data-hero-id="${heroId}" data-slot="${slot.key}">
                        ${equipHtml}
                    </div>
                    <button class="equip-btn" data-hero-id="${heroId}" data-slot="${slot.key}">选择装备</button>
                </div>
            `;
        }).join('');

        content.querySelectorAll('.equip-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.showEquipSelectModal(btn.dataset.heroId, btn.dataset.slot);
            });
        });
    },

    showEquipSelectModal(heroId, slotKey) {
        const modal = document.createElement('div');
        modal.className = 'equip-select-modal';
        modal.id = 'equip-select-modal';

        const validTypes = {
            'weapon': ['weapon'],
            'armor': ['armor'],
            'accessory1': ['accessory'],
            'accessory2': ['accessory']
        };

        const allEquipment = GameState.getCollectionByType('weapon')
            .concat(GameState.getCollectionByType('armor'))
            .concat(GameState.getCollectionByType('accessory'));

        const availableEquip = allEquipment.filter(e => {
            const cardData = EQUIPMENT_CARDS.find(c => c.id === e.id);
            return cardData && validTypes[slotKey].includes(cardData.type);
        });

        modal.innerHTML = `
            <div class="modal-content">
                <h3>选择装备</h3>
                <div class="equip-grid" id="modal-equip-grid"></div>
                <button class="close-modal-btn" id="close-modal">关闭</button>
            </div>
        `;

        document.body.appendChild(modal);

        const grid = document.getElementById('modal-equip-grid');
        if (availableEquip.length === 0) {
            grid.innerHTML = '<div class="empty-list">暂无可用装备</div>';
        } else {
            grid.innerHTML = availableEquip.map(equip => {
                const equipData = EQUIPMENT_CARDS.find(c => c.id === equip.id);
                const rarityData = equipData ? RARITY[equip.rarity] : null;
                const isUsed = GameState.isCardEquipped(equip.id);
                return `
                    <div class="modal-equip-item ${isUsed ? 'in-use' : ''}" data-equip-id="${equip.id}">
                        <div class="equip-name" style="${rarityData ? `color: ${rarityData.color}` : ''}">${equipData ? equipData.name : equip.id}</div>
                        <div class="equip-level">Lv.${equip.level}</div>
                        ${isUsed ? '<div class="equip-used">已装备</div>' : ''}
                        <button class="select-equip-btn" data-equip-id="${equip.id}" ${isUsed ? 'disabled' : ''}>选择</button>
                    </div>
                `;
            }).join('');
        }

        modal.querySelectorAll('.select-equip-btn:not([disabled])').forEach(btn => {
            btn.addEventListener('click', () => {
                const equipId = btn.dataset.equipId;
                this.equipItem(heroId, slotKey, equipId);
                modal.remove();
            });
        });

        document.getElementById('close-modal').addEventListener('click', () => modal.remove());
    },

    equipItem(heroId, slotKey, equipId) {
        const formation = GameState.getFormation();
        if (!formation.equips[heroId]) {
            formation.equips[heroId] = { weapon: null, armor: null, accessory1: null, accessory2: null };
        }
        formation.equips[heroId][slotKey] = equipId;
        GameState.setFormation(formation);
        this.renderEquipContent(heroId);
        this.updateTeamPower();
    },

    showSkillPanel() {
        this.currentPanel = 'skill';
        const panel = document.getElementById('formation-panel');
        if (!panel) return;

        const formation = GameState.getFormation();
        const equippedHeroes = formation.slots.filter(id => id !== null);

        if (equippedHeroes.length === 0) {
            panel.innerHTML = `
                <div class="panel-header">
                    <h3>技能配置</h3>
                    <button class="close-panel-btn" id="close-skill-panel">关闭</button>
                </div>
                <div class="empty-list">请先添加英雄到阵型</div>
            `;
            document.getElementById('close-skill-panel').addEventListener('click', () => this.closePanel());
            return;
        }

        panel.innerHTML = `
            <div class="panel-header">
                <h3>技能配置</h3>
                <button class="close-panel-btn" id="close-skill-panel">关闭</button>
            </div>
            <div class="skill-tabs" id="skill-tabs">
                ${equippedHeroes.map((heroId, index) => {
                    const cardData = CHARACTER_CARDS.find(c => c.id === heroId);
                    return `<button class="skill-tab-btn ${index === 0 ? 'active' : ''}" data-hero-index="${index}" data-hero-id="${heroId}">${cardData ? cardData.name : heroId}</button>`;
                }).join('')}
            </div>
            <div class="skill-content" id="skill-content"></div>
        `;

        document.getElementById('close-skill-panel').addEventListener('click', () => this.closePanel());

        const tabs = panel.querySelectorAll('.skill-tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.renderSkillContent(tab.dataset.heroId);
            });
        });

        if (equippedHeroes.length > 0) {
            this.renderSkillContent(equippedHeroes[0]);
        }
    },

    renderSkillContent(heroId) {
        const content = document.getElementById('skill-content');
        if (!content) return;

        const formation = GameState.getFormation();
        const heroSkills = formation.skills[heroId] || { skill1: null, skill2: null, skill3: null, skill4: null };

        const slots = [
            { key: 'skill1', name: '技能一' },
            { key: 'skill2', name: '技能二' },
            { key: 'skill3', name: '技能三' },
            { key: 'skill4', name: '技能四' }
        ];

        content.innerHTML = slots.map(slot => {
            const skillId = heroSkills[slot.key];
            let skillHtml = '<div class="skill-slot empty-slot">空</div>';
            let skillName = '';
            let skillRarity = null;

            if (skillId) {
                const skillEntry = GameState.state.collection[skillId];
                const skillData = SKILL_CARDS.find(s => s.id === skillId);
                skillRarity = skillEntry ? RARITY[skillEntry.rarity] : null;
                skillName = skillData ? skillData.name : skillId;
                skillHtml = `<div class="skill-slot filled-slot ${skillEntry ? 'rarity-' + skillEntry.rarity.toLowerCase() : ''}">
                    <div class="skill-name" style="${skillRarity ? `color: ${skillRarity.color}` : ''}">${skillName}</div>
                    <div class="skill-level">Lv.${skillEntry ? skillEntry.level : 1}</div>
                    ${skillData ? `<div class="skill-desc">${skillData.effect || skillData.description || ''}</div>` : ''}
                </div>`;
            }

            return `
                <div class="skill-row">
                    <div class="skill-slot-label">${slot.name}</div>
                    <div class="skill-display" data-hero-id="${heroId}" data-slot="${slot.key}">
                        ${skillHtml}
                    </div>
                    <button class="skill-btn" data-hero-id="${heroId}" data-slot="${slot.key}">选择技能</button>
                </div>
            `;
        }).join('');

        content.querySelectorAll('.skill-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.showSkillSelectModal(btn.dataset.heroId, btn.dataset.slot);
            });
        });
    },

    showSkillSelectModal(heroId, slotKey) {
        const modal = document.createElement('div');
        modal.className = 'skill-select-modal';
        modal.id = 'skill-select-modal';

        const allSkills = GameState.getCollectionByType('skill');

        modal.innerHTML = `
            <div class="modal-content">
                <h3>选择技能</h3>
                <div class="skill-grid" id="modal-skill-grid"></div>
                <button class="close-modal-btn" id="close-modal">关闭</button>
            </div>
        `;

        document.body.appendChild(modal);

        const grid = document.getElementById('modal-skill-grid');
        if (allSkills.length === 0) {
            grid.innerHTML = '<div class="empty-list">暂无可用技能</div>';
        } else {
            grid.innerHTML = allSkills.map(skill => {
                const skillData = SKILL_CARDS.find(s => s.id === skill.id);
                const rarityData = skillData ? RARITY[skill.rarity] : null;
                const isUsed = GameState.isSkillUsedByProtagonist(skill.id) || GameState.isSkillUsedByProtagonist(skill.id);
                return `
                    <div class="modal-skill-item ${isUsed ? 'in-use' : ''}" data-skill-id="${skill.id}">
                        <div class="skill-name" style="${rarityData ? `color: ${rarityData.color}` : ''}">${skillData ? skillData.name : skill.id}</div>
                        <div class="skill-level">Lv.${skill.level}</div>
                        <div class="skill-type">${skillData ? skillData.type : ''}</div>
                        ${skillData ? `<div class="skill-effect">${skillData.effect || skillData.description || ''}</div>` : ''}
                        ${isUsed ? '<div class="skill-used">已装备</div>' : ''}
                        <button class="select-skill-btn" data-skill-id="${skill.id}" ${isUsed ? 'disabled' : ''}>选择</button>
                    </div>
                `;
            }).join('');
        }

        modal.querySelectorAll('.select-skill-btn:not([disabled])').forEach(btn => {
            btn.addEventListener('click', () => {
                const skillId = btn.dataset.skillId;
                this.equipSkill(heroId, slotKey, skillId);
                modal.remove();
            });
        });

        document.getElementById('close-modal').addEventListener('click', () => modal.remove());
    },

    equipSkill(heroId, slotKey, skillId) {
        const formation = GameState.getFormation();
        if (!formation.skills[heroId]) {
            formation.skills[heroId] = { skill1: null, skill2: null, skill3: null, skill4: null };
        }
        formation.skills[heroId][slotKey] = skillId;
        GameState.setFormation(formation);
        this.renderSkillContent(heroId);
        this.updateTeamPower();
    },

    closePanel() {
        const panel = document.getElementById('formation-panel');
        if (panel) {
            panel.innerHTML = '';
        }
        this.currentPanel = 'main';
        this.selectedSlot = null;
    },

    updateTeamPower() {
        const power = GameState.getTeamPower();
        const powerEl = document.getElementById('team-power');
        if (powerEl) {
            powerEl.textContent = power;
        }
    }
};

window.FormationUI = FormationUI;
