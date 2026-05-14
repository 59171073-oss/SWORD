const HeroesUI = {
    container: null,

    init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        this.render();
    },

    render() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="heroes-container">
                <div class="heroes-header">
                    <h2>角色</h2>
                </div>
                <div class="heroes-content" id="heroes-content"></div>
            </div>
        `;

        this.renderHeroes();
    },

    renderHeroes() {
        const content = document.getElementById('heroes-content');
        if (!content) return;

        const heroesHtml = this.renderProtagonist() + this.renderHeroCards();
        content.innerHTML = heroesHtml;
    },

    renderProtagonist() {
        const p = GameState.state.protagonist;
        const stats = GameState.getProtagonistStats();
        const rarityData = RARITY['FINE'];

        let equipsHtml = '';
        const equipSlots = [
            { key: 'weapon', name: '武器' },
            { key: 'armor', name: '防具' },
            { key: 'accessory1', name: '饰品一' },
            { key: 'accessory2', name: '饰品二' }
        ];

        equipSlots.forEach(slot => {
            const equipId = p.equips && p.equips[slot.key];
            if (equipId) {
                const equipEntry = GameState.state.collection[equipId];
                const equipData = EQUIPMENT_CARDS.find(e => e.id === equipId);
                const equipRarity = equipEntry ? RARITY[equipEntry.rarity] : null;
                equipsHtml += `
                    <div class="equip-item ${equipEntry ? 'rarity-' + equipEntry.rarity.toLowerCase() : ''}">
                        <span class="equip-name" style="${equipRarity ? `color: ${equipRarity.color}` : ''}">${equipData ? equipData.name : equipId}</span>
                        <span class="equip-level">Lv.${equipEntry ? equipEntry.level : 1}</span>
                    </div>
                `;
            } else {
                equipsHtml += `<div class="equip-item empty">空</div>`;
            }
        });

        let skillsHtml = '';
        const skillSlots = ['skill1', 'skill2', 'skill3', 'skill4'];
        skillSlots.forEach(slot => {
            const skillId = p.skills && p.skills[slot];
            if (skillId) {
                const skillEntry = GameState.state.collection[skillId];
                const skillData = SKILL_CARDS.find(s => s.id === skillId);
                const skillRarity = skillEntry ? RARITY[skillEntry.rarity] : null;
                skillsHtml += `
                    <div class="skill-item ${skillEntry ? 'rarity-' + skillEntry.rarity.toLowerCase() : ''}">
                        <span class="skill-name" style="${skillRarity ? `color: ${skillRarity.color}` : ''}">${skillData ? skillData.name : skillId}</span>
                    </div>
                `;
            } else {
                skillsHtml += `<div class="skill-item empty">空</div>`;
            }
        });

        return `
            <div class="protagonist-section">
                <div class="protagonist-portrait">
                    <img src="${PROTAGONIST.imageUrl}" alt="${PROTAGONIST.name}" onerror="this.style.display='none'">
                </div>
                <div class="protagonist-info">
                    <h3 class="protagonist-name">${PROTAGONIST.name}</h3>
                    <div class="protagonist-level">等级 ${p.level}</div>
                    <div class="protagonist-element">${PROTAGONIST.element}属性</div>
                    <div class="protagonist-innate">
                        <div class="innate-label">先天技能</div>
                        <div class="innate-name">${PROTAGONIST.innateSkill.name}</div>
                        <div class="innate-desc">${PROTAGONIST.innateSkill.description}</div>
                    </div>
                </div>
                <div class="protagonist-stats">
                    <div class="stats-title">属性</div>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <span class="stat-label">生命</span>
                            <span class="stat-value">${stats.hp}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">攻击</span>
                            <span class="stat-value">${stats.atk}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">防御</span>
                            <span class="stat-value">${stats.def}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">身法</span>
                            <span class="stat-value">${stats.agi}</span>
                        </div>
                    </div>
                </div>
                <div class="protagonist-equips">
                    <div class="equips-title">装备</div>
                    <div class="equips-grid">${equipsHtml}</div>
                </div>
                <div class="protagonist-skills">
                    <div class="skills-title">技能</div>
                    <div class="skills-grid">${skillsHtml}</div>
                </div>
            </div>
        `;
    },

    renderHeroCards() {
        const heroes = GameState.getCollectionByType('hero');
        if (heroes.length === 0) {
            return '<div class="no-heroes">暂无英雄</div>';
        }

        return `
            <div class="heroes-section">
                <h3>英雄卡牌</h3>
                <div class="heroes-grid">
                    ${heroes.map(hero => {
                        const cardData = CHARACTER_CARDS.find(c => c.id === hero.id);
                        const rarityData = cardData ? RARITY[cardData.rarity] : null;
                        let imageHtml = '';
                        if (cardData && cardData.imageUrl) {
                            imageHtml = `<img src="${cardData.imageUrl}" alt="${cardData.name}" class="hero-image" onerror="this.style.display='none'">`;
                        }
                        return `
                            <div class="hero-card ${rarityData ? 'rarity-' + cardData.rarity.toLowerCase() : ''}">
                                ${imageHtml}
                                <div class="card-rarity" style="${rarityData ? `color: ${rarityData.color}` : ''}">${rarityData ? rarityData.name : ''}</div>
                                <div class="card-name">${cardData ? cardData.name : hero.id}</div>
                                <div class="card-level">Lv.${hero.level}</div>
                                <div class="card-count">x${hero.count}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }
};

window.HeroesUI = HeroesUI;
