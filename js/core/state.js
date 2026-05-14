const GameState = {
    state: null,

    init() {
        const saved = Storage.load();
        if (saved) {
            this.state = saved;
            if (!this.state.protagonist) {
                this.state.protagonist = {
                    level: 1,
                    exp: 0,
                    equips: { weapon: null, armor: null, accessory1: null, accessory2: null },
                    skills: { skill1: null, skill2: null, skill3: null, skill4: null }
                };
                this.save();
            }
            if (this.state.firstGachaUsed === undefined) {
                this.state.firstGachaUsed = false;
                this.save();
            }
            this._migrateOldSlots();
        } else {
            this.newGame();
        }
    },

    _migrateOldSlots() {
        var p = this.state.protagonist;
        if (p.equips && p.equips.secret !== undefined && p.equips.accessory1 === undefined) {
            var oldEquips = p.equips;
            p.equips = { weapon: oldEquips.weapon || null, armor: oldEquips.armor || null, accessory1: oldEquips.accessory || null, accessory2: null };
        }
        if (p.skills && p.skills.active !== undefined && p.skills.skill1 === undefined) {
            var oldSkills = p.skills;
            p.skills = { skill1: oldSkills.active || null, skill2: oldSkills.passive || null, skill3: null, skill4: null };
        }
        var formation = this.state.formation;
        if (formation.equips) {
            for (var hid in formation.equips) {
                var he = formation.equips[hid];
                if (he.secret !== undefined && he.accessory1 === undefined) {
                    formation.equips[hid] = { weapon: he.weapon || null, armor: he.armor || null, accessory1: he.accessory || null, accessory2: null };
                }
            }
        }
        if (formation.skills) {
            for (var hid in formation.skills) {
                var hs = formation.skills[hid];
                if (hs.active !== undefined && hs.skill1 === undefined) {
                    formation.skills[hid] = { skill1: hs.active || null, skill2: hs.passive || null, skill3: null, skill4: null };
                }
            }
        }
        this.save();
    },

    newGame() {
        this.state = {
            gold: 2000,
            collection: {},
            formation: {
                slots: [null, null, null, null, null],
                equips: {},
                skills: {}
            },
            formations: [],
            protagonist: {
                level: 1,
                exp: 0,
                equips: { weapon: null, armor: null, accessory1: null, accessory2: null },
                skills: { skill1: null, skill2: null, skill3: null, skill4: null }
            },
            stageProgress: {
                currentChapter: 1,
                currentStage: 1,
                cleared: {}
            },
            firstClearBonus: {},
            firstGachaUsed: false
        };

        this.save();
    },

    save() {
        Storage.save(this.state);
    },

    addGold(amount) {
        this.state.gold += amount;
        this.save();
    },

    spendGold(amount) {
        if (this.state.gold >= amount) {
            this.state.gold -= amount;
            this.save();
            return true;
        }
        return false;
    },

    addCard(cardId, type, rarity) {
        const existing = this.state.collection[cardId];
        var maxLevel;
        if (type === 'hero') {
            maxLevel = 20;
        } else if (type === 'skill') {
            maxLevel = 10;
        } else {
            maxLevel = 5;
        }
        if (existing && existing.rarity === rarity) {
            existing.count += 1;
            if (existing.level < maxLevel) {
                existing.level += 1;
            }
        } else {
            this.state.collection[cardId] = {
                id: cardId,
                type: type,
                rarity: rarity,
                level: 1,
                count: 1
            };
        }
        this.save();
    },

    getHeroStats(heroInstanceId, formationContext) {
        const heroEntry = this.state.collection[heroInstanceId];
        if (!heroEntry || heroEntry.type !== 'hero') return null;

        const cardData = CHARACTER_CARDS.find(c => c.id === heroInstanceId);
        if (!cardData) return null;

        const classData = CLASSES[cardData.classId];
        const rarityData = RARITY[heroEntry.rarity];
        const multiplier = rarityData.multiplier;

        const baseStats = {};
        for (const stat in classData.baseStats) {
            baseStats[stat] = Math.floor(classData.baseStats[stat] * multiplier);
        }

        const statsWithLevel = {};
        for (const stat in baseStats) {
            statsWithLevel[stat] = Math.floor(baseStats[stat] * (1 + (heroEntry.level - 1) * 0.15));
        }

        const equipBonus = { hp: 0, atk: 0, def: 0, spd: 0 };
        const formation = formationContext || this.state.formation;
        if (formation.equips && formation.equips[heroInstanceId]) {
            const heroEquips = formation.equips[heroInstanceId];
            for (const slot in heroEquips) {
                const equipId = heroEquips[slot];
                if (equipId && this.state.collection[equipId]) {
                    const equipEntry = this.state.collection[equipId];
                    const equipData = EQUIPMENT_CARDS.find(e => e.id === equipId);
                    if (equipData && equipData.bonus) {
                        const equipLevelMultiplier = 1 + (equipEntry.level - 1) * 0.20;
                        for (const stat in equipData.bonus) {
                            if (equipBonus.hasOwnProperty(stat)) {
                                equipBonus[stat] += Math.floor(equipData.bonus[stat] * equipLevelMultiplier);
                            }
                        }
                    }
                }
            }
        }

        const synergyBonus = { hp: 0, atk: 0, def: 0, spd: 0 };
        if (formation.slots) {
            const teamElements = formation.slots
                .filter(id => id !== null)
                .map(id => {
                    const c = CHARACTER_CARDS.find(ch => ch.id === id);
                    return c ? c.element : null;
                })
                .filter(e => e !== null);

            const synergyBonuses = hasElementSynergy(teamElements);
            const heroSynergy = synergyBonuses[cardData.element] || 0;
            if (heroSynergy > 0) {
                for (const stat in statsWithLevel) {
                    synergyBonus[stat] = Math.floor(statsWithLevel[stat] * heroSynergy);
                }
            }
        }

        const finalStats = {};
        for (const stat in statsWithLevel) {
            finalStats[stat] = statsWithLevel[stat] + equipBonus[stat] + synergyBonus[stat];
        }

        return {
            ...finalStats,
            element: cardData.element,
            classId: cardData.classId,
            rarity: heroEntry.rarity,
            level: heroEntry.level,
            name: cardData.name
        };
    },

    getCollectionByType(type) {
        return Object.values(this.state.collection).filter(c => c.type === type);
    },

    getCollectionByRarity(rarity) {
        return Object.values(this.state.collection).filter(c => c.rarity === rarity);
    },

    setFormation(formationData) {
        this.state.formation = formationData;
        this.save();
    },

    getFormation() {
        return this.state.formation;
    },

    clearStage(stageId) {
        const stageIndex = LEVELS.findIndex(s => s.id === stageId);
        if (stageIndex === -1) return null;

        const stage = LEVELS[stageIndex];
        const isFirstClear = !this.state.stageProgress.cleared[stageId];

        this.state.stageProgress.cleared[stageId] = true;

        if (isFirstClear) {
            this.state.firstClearBonus[stageId] = true;
        }

        const nextStage = LEVELS[stageIndex + 1];
        if (nextStage) {
            this.state.stageProgress.currentChapter = nextStage.chapter;
            const chapterStages = LEVELS.filter(s => s.chapter === nextStage.chapter);
            const stageInChapter = chapterStages.findIndex(s => s.id === nextStage.id) + 1;
            this.state.stageProgress.currentStage = stageInChapter;
        }

        const reward = {
            gold: stage.baseReward,
            isFirstClear: isFirstClear,
            firstClearGold: isFirstClear ? 200 : 0
        };

        this.addGold(reward.gold + reward.firstClearGold);

        if (stage.taskCardId) {
            const taskCard = TASK_CARDS.find(t => t.id === stage.taskCardId);
            if (taskCard) {
                reward.taskCard = taskCard;
            }
        }

        this.save();
        return reward;
    },

    isStageUnlocked(stageId) {
        const stageIndex = LEVELS.findIndex(s => s.id === stageId);
        if (stageIndex === -1) return false;
        if (stageIndex === 0) return true;

        const prevStage = LEVELS[stageIndex - 1];
        return !!this.state.stageProgress.cleared[prevStage.id];
    },

    resetGame() {
        Storage.clear();
        this.newGame();
    },

    getTeamPower(formationData) {
        const formation = formationData || this.state.formation;
        if (!formation || !formation.slots) return 0;

        let totalPower = 0;
        formation.slots.forEach(heroId => {
            if (heroId) {
                const stats = this.getHeroStats(heroId, formation);
                if (stats) {
                    totalPower += stats.hp + stats.atk + stats.def + stats.spd;
                }
            }
        });

        const protStats = this.getProtagonistStats();
        if (protStats) {
            totalPower += protStats.hp + protStats.atk + protStats.def + protStats.spd;
        }

        return totalPower;
    },

    getProtagonistStats() {
        const p = this.state.protagonist;
        const base = PROTAGONIST.baseStats;
        const levelMultiplier = 1 + (p.level - 1) * 0.15;

        const stats = {
            hp: Math.floor(base.hp * levelMultiplier),
            atk: Math.floor(base.atk * levelMultiplier),
            def: Math.floor(base.def * levelMultiplier),
            spd: Math.floor(base.spd * levelMultiplier)
        };

        const equipBonus = { hp: 0, atk: 0, def: 0, spd: 0 };
        if (p.equips) {
            for (const slot in p.equips) {
                const equipId = p.equips[slot];
                if (equipId && this.state.collection[equipId]) {
                    const equipEntry = this.state.collection[equipId];
                    const equipData = EQUIPMENT_CARDS.find(e => e.id === equipId);
                    if (equipData && equipData.bonus) {
                        const equipLevelMultiplier = 1 + (equipEntry.level - 1) * 0.20;
                        for (const stat in equipData.bonus) {
                            if (equipBonus.hasOwnProperty(stat)) {
                                equipBonus[stat] += Math.floor(equipData.bonus[stat] * equipLevelMultiplier);
                            }
                        }
                    }
                }
            }
        }

        const skillBonus = { hp: 0, atk: 0, def: 0, spd: 0 };
        if (p.skills) {
            for (const slot in p.skills) {
                const skillId = p.skills[slot];
                if (skillId) {
                    const skillData = SKILL_CARDS.find(s => s.id === skillId);
                    if (skillData && skillData.name === '吐纳心法') {
                        skillBonus.spd += 10;
                    }
                }
            }
        }

        const finalStats = {};
        for (const stat in stats) {
            finalStats[stat] = stats[stat] + equipBonus[stat] + skillBonus[stat];
        }

        return {
            ...finalStats,
            element: PROTAGONIST.element,
            classId: 'JIANKE',
            name: PROTAGONIST.name,
            level: p.level,
            isProtagonist: true
        };
    },

    equipProtagonistItem(slotType, equipId) {
        if (!this.state.protagonist.equips) {
            this.state.protagonist.equips = { weapon: null, armor: null, accessory1: null, accessory2: null };
        }
        this.state.protagonist.equips[slotType] = equipId;
        this.save();
    },

    unequipProtagonistItem(slotType) {
        if (this.state.protagonist.equips && this.state.protagonist.equips[slotType]) {
            this.state.protagonist.equips[slotType] = null;
            this.save();
        }
    },

    equipProtagonistSkill(slotType, skillId) {
        if (!this.state.protagonist.skills) {
            this.state.protagonist.skills = { skill1: null, skill2: null, skill3: null, skill4: null };
        }
        this.state.protagonist.skills[slotType] = skillId;
        this.save();
    },

    unequipProtagonistSkill(slotType) {
        if (this.state.protagonist.skills && this.state.protagonist.skills[slotType]) {
            this.state.protagonist.skills[slotType] = null;
            this.save();
        }
    },

    isEquipUsedByProtagonist(equipId) {
        const p = this.state.protagonist;
        if (!p.equips) return false;
        for (const slot in p.equips) {
            if (p.equips[slot] === equipId) return true;
        }
        return false;
    },

    isSkillUsedByProtagonist(skillId) {
        const p = this.state.protagonist;
        if (!p.skills) return false;
        for (const slot in p.skills) {
            if (p.skills[slot] === skillId) return true;
        }
        return false;
    },

    sellCard(cardId) {
        const entry = this.state.collection[cardId];
        if (!entry || entry.count <= 0) return 0;

        const rarityData = RARITY[entry.rarity];
        let basePrice = 50;
        if (entry.rarity === 'FINE') basePrice = 100;
        if (entry.rarity === 'RARE') basePrice = 200;
        if (entry.rarity === 'LEGEND') basePrice = 500;

        const levelBonus = Math.floor(basePrice * (entry.level - 1) * 0.1);
        const totalPrice = basePrice + levelBonus;

        entry.count -= 1;
        if (entry.count <= 0) {
            delete this.state.collection[cardId];
        }

        this.addGold(totalPrice);
        return totalPrice;
    },

    getCardSellPrice(cardId) {
        const entry = this.state.collection[cardId];
        if (!entry) return 0;

        let basePrice = 50;
        if (entry.rarity === 'FINE') basePrice = 100;
        if (entry.rarity === 'RARE') basePrice = 200;
        if (entry.rarity === 'LEGEND') basePrice = 500;

        const levelBonus = Math.floor(basePrice * (entry.level - 1) * 0.1);
        return basePrice + levelBonus;
    },

    isCardEquipped(cardId) {
        const p = this.state.protagonist;
        if (p.equips) {
            for (const slot in p.equips) {
                if (p.equips[slot] === cardId) return true;
            }
        }
        if (p.skills) {
            for (const slot in p.skills) {
                if (p.skills[slot] === cardId) return true;
            }
        }

        const formation = this.state.formation;
        if (formation.equips) {
            for (const heroId in formation.equips) {
                const heroEquips = formation.equips[heroId];
                for (const slot in heroEquips) {
                    if (heroEquips[slot] === cardId) return true;
                }
            }
        }
        if (formation.skills) {
            for (const heroId in formation.skills) {
                const heroSkills = formation.skills[heroId];
                for (const slot in heroSkills) {
                    if (heroSkills[slot] === cardId) return true;
                }
            }
        }

        return false;
    }
};
