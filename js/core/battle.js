var SkillEffectProcessor = {
    getEffectsByTrigger: function(skill, trigger) {
        if (!skill.effects) return [];
        return skill.effects.filter(function(e) { return e.trigger === trigger; });
    },

    checkCondition: function(unit, condition) {
        if (!condition) return true;
        if (condition.type === 'hpBelow') {
            return unit.currentHp > 0 && unit.currentHp / unit.maxHp < condition.value;
        }
        if (condition.type === 'hpAbove') {
            return unit.currentHp / unit.maxHp > condition.value;
        }
        return true;
    },

    calculateValue: function(unit, effect) {
        if (effect.value !== undefined) {
            return effect.value;
        }
        if (effect.base && effect.multiplier !== undefined) {
            var baseValue = unit[effect.base] || 0;
            return Math.floor(baseValue * effect.multiplier);
        }
        return 0;
    },

    applyStatBuff: function(unit, effect) {
        if (effect.stat && effect.value) {
            unit[effect.stat] = (unit[effect.stat] || 0) + effect.value;
        }
    },

    applyShield: function(unit, effect) {
        var shieldAmount = this.calculateValue(unit, effect);
        unit.shield = (unit.shield || 0) + shieldAmount;
        return shieldAmount;
    },

    applyHeal: function(unit, effect) {
        var healAmount = this.calculateValue(unit, effect);
        var actualHeal = Math.min(healAmount, unit.maxHp - unit.currentHp);
        unit.currentHp += actualHeal;
        return actualHeal;
    },

    getDamageReduction: function(unit, effect, rawDamage) {
        if (!this.checkCondition(unit, effect.condition)) return 0;
        if (effect.multiplier) {
            return rawDamage * effect.multiplier;
        }
        return 0;
    },

    applyLifesteal: function(unit, damageDealt, effect) {
        if (!unit.alive) return 0;
        var healAmount = Math.floor(damageDealt * (effect.multiplier || 0));
        if (healAmount > 0) {
            var actualHeal = Math.min(healAmount, unit.maxHp - unit.currentHp);
            unit.currentHp += actualHeal;
            return actualHeal;
        }
        return 0;
    }
};

var BattleEngine = {
    _state: null,
    _onAction: null,
    _onEnd: null,
    _speed: 500,
    _running: false,
    _skipping: false,
    _timerId: null,
    _actionIndex: 0,

    init: function(playerFormation, enemyTeam, stageId, onAction, onEnd) {
        this._state = {
            stageId: stageId,
            round: 0,
            units: [],
            actionOrder: [],
            ended: false,
            winner: null
        };
        this._onAction = onAction;
        this._onEnd = onEnd;
        this._running = false;
        this._skipping = false;
        this._actionIndex = 0;
        if (this._timerId) {
            clearTimeout(this._timerId);
            this._timerId = null;
        }

        var uid = 0;
        var self = this;

        if (playerFormation && playerFormation.slots) {
            playerFormation.slots.forEach(function(heroId) {
                if (!heroId) return;
                var stats = GameState.getHeroStats(heroId, playerFormation);
                if (!stats) return;

                uid++;
                var unit = {
                    id: 'p' + uid,
                    heroId: heroId,
                    name: stats.name,
                    side: 'player',
                    classId: stats.classId,
                    element: stats.element,
                    rarity: stats.rarity,
                    level: stats.level,
                    maxHp: stats.hp,
                    currentHp: stats.hp,
                    atk: stats.atk,
                    def: stats.def,
                    spd: stats.spd,
                    skills: [],
                    shield: 0,
                    controlled: 0,
                    alive: true
                };

                if (playerFormation.skills && playerFormation.skills[heroId]) {
                    var heroSkills = playerFormation.skills[heroId];
                    for (var slot in heroSkills) {
                        if (heroSkills[slot]) {
                            var skillData = SKILL_CARDS.find(function(s) { return s.id === heroSkills[slot]; });
                            if (skillData) {
                                unit.skills.push(skillData);
                            }
                        }
                    }
                }

                self._applyBattleStartEffects(unit);
                self._state.units.push(unit);
            });
        }

        var protStats = GameState.getProtagonistStats();
        if (protStats) {
            uid++;
            var protUnit = {
                id: 'p_protagonist',
                heroId: 'protagonist',
                name: protStats.name,
                side: 'player',
                classId: protStats.classId,
                element: protStats.element,
                rarity: 'FINE',
                level: protStats.level,
                maxHp: protStats.hp,
                currentHp: protStats.hp,
                atk: protStats.atk,
                def: protStats.def,
                spd: protStats.spd,
                skills: [],
                shield: 0,
                controlled: 0,
                alive: true,
                isProtagonist: true
            };

            var prot = GameState.state.protagonist;
            if (prot.skills) {
                for (var slot in prot.skills) {
                    if (prot.skills[slot]) {
                        var skillData = SKILL_CARDS.find(function(s) { return s.id === prot.skills[slot]; });
                        if (skillData) {
                            protUnit.skills.push(skillData);
                        }
                    }
                }
            }

            self._applyBattleStartEffects(protUnit);
            self._state.units.push(protUnit);
        }

        if (enemyTeam) {
            enemyTeam.forEach(function(enemy) {
                uid++;
                var unit = {
                    id: 'e' + uid,
                    heroId: null,
                    name: enemy.name,
                    side: 'enemy',
                    classId: enemy.classId,
                    element: enemy.element,
                    rarity: enemy.rarity,
                    level: enemy.level,
                    maxHp: enemy.stats.hp,
                    currentHp: enemy.stats.hp,
                    atk: enemy.stats.atk,
                    def: enemy.stats.def,
                    spd: enemy.stats.spd,
                    skills: [],
                    shield: 0,
                    controlled: 0,
                    alive: true
                };
                self._state.units.push(unit);
            });
        }

        this._state.actionOrder = this._state.units.slice().sort(function(a, b) {
            if (b.spd !== a.spd) return b.spd - a.spd;
            return Math.random() - 0.5;
        });
    },

    _applyBattleStartEffects: function(unit) {
        var self = this;
        unit.skills.forEach(function(skill) {
            var effects = SkillEffectProcessor.getEffectsByTrigger(skill, 'onBattleStart');
            effects.forEach(function(effect) {
                if (effect.type === 'stat_buff' && effect.target === 'self') {
                    SkillEffectProcessor.applyStatBuff(unit, effect);
                } else if (effect.type === 'shield' && effect.target === 'self') {
                    SkillEffectProcessor.applyShield(unit, effect);
                }
            });
        });
    },

    start: function() {
        if (this._state.ended) return;
        this._running = true;
        this._skipping = false;

        var result = this._checkBattleEnd();
        if (result) {
            this._finishBattle(result);
            return;
        }

        this._executeRound();
    },

    _executeRound: function() {
        if (!this._running || this._state.ended) return;
        this._state.round++;
        this._actionIndex = 0;
        this._processNextAction();
    },

    _processNextAction: function() {
        if (this._state.ended) return;

        var self = this;

        while (this._actionIndex < this._state.actionOrder.length) {
            var unit = this._state.actionOrder[this._actionIndex];
            this._actionIndex++;

            if (!unit.alive) continue;

            var actionInfo;
            if (unit.controlled > 0) {
                unit.controlled--;
                actionInfo = {
                    type: 'controlled',
                    actor: { id: unit.id, name: unit.name, side: unit.side }
                };
            } else {
                actionInfo = this._executeAction(unit);
            }

            if (!this._skipping && this._onAction) {
                this._onAction(actionInfo);
            }

            this._applyTurnEndEffects(unit);

            var result = this._checkBattleEnd();
            if (result) {
                this._finishBattle(result);
                return;
            }

            if (!this._skipping) {
                this._timerId = setTimeout(function() {
                    self._processNextAction();
                }, this._speed);
                return;
            }
        }

        var endResult = this._checkBattleEnd();
        if (endResult) {
            this._finishBattle(endResult);
            return;
        }

        var playerAlive = this._state.units.some(function(u) { return u.side === 'player' && u.alive; });
        var enemyAlive = this._state.units.some(function(u) { return u.side === 'enemy' && u.alive; });

        if (playerAlive && enemyAlive) {
            if (this._skipping) {
                this._executeRound();
            } else {
                this._timerId = setTimeout(function() {
                    self._executeRound();
                }, this._speed);
            }
        }
    },

    _applyTurnEndEffects: function(unit) {
        if (!unit.alive) return;
        var self = this;
        unit.skills.forEach(function(skill) {
            var effects = SkillEffectProcessor.getEffectsByTrigger(skill, 'onTurnEnd');
            effects.forEach(function(effect) {
                if (effect.type === 'heal' && effect.target === 'self') {
                    SkillEffectProcessor.applyHeal(unit, effect);
                }
            });
        });
    },

    _executeAction: function(unit) {
        var actionInfo = {
            type: 'normal_attack',
            actor: { id: unit.id, name: unit.name, side: unit.side, element: unit.element },
            target: null,
            skill: null,
            damage: 0,
            heal: 0,
            elementModifier: 1.0,
            isCrit: false,
            results: []
        };

        var self = this;
        var totalDamageDealt = 0;

        var activeSkill = this._selectActiveSkill(unit);

        if (activeSkill) {
            var skill = activeSkill;
            var finalMultiplier = skill.multiplier || 1.0;
            var targeting = skill.targeting || 'single_enemy';

            actionInfo.type = 'skill';
            actionInfo.skill = { id: skill.id, name: skill.name, type: skill.type };

            if (skill.type === 'active_attack') {
                var targets = this._getTargets(unit, targeting, false);
                targets.forEach(function(target) {
                    var dmgResult = self._calculateDamage(unit, target, finalMultiplier);
                    self._applyDamageToUnit(target, dmgResult.damage);
                    totalDamageDealt += dmgResult.damage;
                    actionInfo.damage += dmgResult.damage;
                    actionInfo.results.push({
                        target: { id: target.id, name: target.name, side: target.side },
                        damage: dmgResult.damage,
                        elementModifier: dmgResult.elementModifier,
                        isCrit: dmgResult.isCrit
                    });
                });

                if (targets.length > 0) {
                    actionInfo.target = { id: targets[0].id, name: targets[0].name, side: targets[0].side };
                }

                if (totalDamageDealt > 0) {
                    this._applyOnDamageDealtEffects(unit, totalDamageDealt);
                }

            } else if (skill.type === 'heal') {
                var targets = this._getTargets(unit, targeting, true);
                targets.forEach(function(target) {
                    var healAmount = Math.floor(unit.atk * finalMultiplier);
                    var actualHeal = Math.min(healAmount, target.maxHp - target.currentHp);
                    target.currentHp += actualHeal;
                    actionInfo.heal += actualHeal;
                    actionInfo.results.push({
                        target: { id: target.id, name: target.name, side: target.side },
                        heal: actualHeal
                    });
                });

                if (targets.length > 0) {
                    actionInfo.target = { id: targets[0].id, name: targets[0].name, side: targets[0].side };
                }

            } else if (skill.type === 'control') {
                var targets = this._getTargets(unit, targeting, false);
                targets = targets.filter(function(t) { return t.controlled === 0; });
                if (targets.length > 0) {
                    var target = targets[0];
                    var duration = 1;
                    skill.effects.forEach(function(effect) {
                        if (effect.type === 'control' && effect.duration) {
                            duration = effect.duration;
                        }
                    });
                    target.controlled = duration;
                    actionInfo.target = { id: target.id, name: target.name, side: target.side };
                    actionInfo.results.push({
                        target: actionInfo.target,
                        controlled: duration
                    });
                }
            }

        } else {
            var target = this._selectTarget(unit, false);
            if (target) {
                var dmgResult = this._calculateDamage(unit, target, 1.0);
                this._applyDamageToUnit(target, dmgResult.damage);
                totalDamageDealt = dmgResult.damage;
                actionInfo.target = { id: target.id, name: target.name, side: target.side };
                actionInfo.damage = dmgResult.damage;
                actionInfo.elementModifier = dmgResult.elementModifier;
                actionInfo.isCrit = dmgResult.isCrit;
                actionInfo.results.push({
                    target: actionInfo.target,
                    damage: dmgResult.damage,
                    elementModifier: dmgResult.elementModifier,
                    isCrit: dmgResult.isCrit
                });

                this._applyOnDamageDealtEffects(unit, totalDamageDealt);
            }
        }

        return actionInfo;
    },

    _selectActiveSkill: function(unit) {
        for (var i = 0; i < unit.skills.length; i++) {
            var s = unit.skills[i];
            if (s.type === 'active_attack' || s.type === 'heal' || s.type === 'control') {
                return s;
            }
        }
        return null;
    },

    _getTargets: function(actor, targeting, isHeal) {
        var self = this;
        
        if (targeting === 'all_enemies') {
            return this._state.units.filter(function(u) {
                return u.side !== actor.side && u.alive;
            });
        }
        
        if (targeting === 'all_allies') {
            return this._state.units.filter(function(u) {
                return u.side === actor.side && u.alive;
            });
        }
        
        if (targeting === 'single_enemy') {
            var target = this._selectTarget(actor, false);
            return target ? [target] : [];
        }
        
        if (targeting === 'lowest_hp_ally') {
            var allies = this._state.units.filter(function(u) {
                return u.side === actor.side && u.alive;
            });
            if (allies.length === 0) return [];
            var minHp = allies[0].currentHp;
            allies.forEach(function(a) {
                if (a.currentHp < minHp) minHp = a.currentHp;
            });
            var lowest = allies.filter(function(a) { return a.currentHp === minHp; });
            return [lowest[Math.floor(Math.random() * lowest.length)]];
        }
        
        if (targeting === 'random_enemy') {
            var enemies = this._state.units.filter(function(u) {
                return u.side !== actor.side && u.alive;
            });
            if (enemies.length === 0) return [];
            return [enemies[Math.floor(Math.random() * enemies.length)]];
        }
        
        if (targeting === 'self') {
            return [actor];
        }

        var target = this._selectTarget(actor, isHeal);
        return target ? [target] : [];
    },

    _calculateDamage: function(attacker, defender, skillMultiplier) {
        var multiplier = skillMultiplier || 1.0;
        var elementModifier = getElementModifier(attacker.element, defender.element);

        var rawDamage = attacker.atk * (1 - defender.def / (defender.def + 100)) * elementModifier * multiplier;

        var totalReduction = 0;
        var self = this;
        defender.skills.forEach(function(skill) {
            var effects = SkillEffectProcessor.getEffectsByTrigger(skill, 'onDamageReceived');
            effects.forEach(function(effect) {
                if (effect.type === 'damage_reduction') {
                    var reduction = SkillEffectProcessor.getDamageReduction(defender, effect, rawDamage);
                    totalReduction += reduction;
                }
            });
        });
        rawDamage = rawDamage - totalReduction;

        var isCrit = false;
        if (attacker.spd > 120) {
            isCrit = Math.random() < 0.2;
        }
        if (isCrit) {
            rawDamage = rawDamage * 1.5;
        }

        rawDamage = Math.max(1, Math.floor(rawDamage));

        return {
            damage: rawDamage,
            elementModifier: elementModifier,
            isCrit: isCrit
        };
    },

    _applyDamageToUnit: function(defender, damage) {
        var remainingDamage = damage;

        if (defender.shield > 0) {
            if (defender.shield >= remainingDamage) {
                defender.shield -= remainingDamage;
                return;
            } else {
                remainingDamage -= defender.shield;
                defender.shield = 0;
            }
        }

        defender.currentHp -= remainingDamage;
        if (defender.currentHp <= 0) {
            defender.currentHp = 0;
            defender.alive = false;
        }
    },

    _applyOnDamageDealtEffects: function(unit, damageDealt) {
        var self = this;
        unit.skills.forEach(function(skill) {
            var effects = SkillEffectProcessor.getEffectsByTrigger(skill, 'onDamageDealt');
            effects.forEach(function(effect) {
                if (effect.type === 'lifesteal') {
                    SkillEffectProcessor.applyLifesteal(unit, damageDealt, effect);
                }
            });
        });
    },

    _selectTarget: function(actor, isHeal) {
        var targetSide = isHeal ? actor.side : (actor.side === 'player' ? 'enemy' : 'player');
        var candidates = this._state.units.filter(function(u) {
            return u.side === targetSide && u.alive;
        });

        if (candidates.length === 0) return null;

        var minHp = candidates[0].currentHp;
        for (var i = 1; i < candidates.length; i++) {
            if (candidates[i].currentHp < minHp) {
                minHp = candidates[i].currentHp;
            }
        }

        var lowest = candidates.filter(function(u) {
            return u.currentHp === minHp;
        });

        return lowest[Math.floor(Math.random() * lowest.length)];
    },

    _checkBattleEnd: function() {
        var playerAlive = this._state.units.some(function(u) { return u.side === 'player' && u.alive; });
        var enemyAlive = this._state.units.some(function(u) { return u.side === 'enemy' && u.alive; });

        if (!playerAlive) return 'lose';
        if (!enemyAlive) return 'win';
        return null;
    },

    _finishBattle: function(result) {
        this._state.ended = true;
        this._running = false;
        this._state.winner = result === 'win' ? 'player' : 'enemy';

        if (this._timerId) {
            clearTimeout(this._timerId);
            this._timerId = null;
        }

        if (this._onEnd) {
            this._onEnd(this.getResult());
        }
    },

    getResult: function() {
        var playerSurvivors = 0;
        var enemySurvivors = 0;
        var playerUnits = [];

        for (var i = 0; i < this._state.units.length; i++) {
            var u = this._state.units[i];
            if (u.side === 'player') {
                playerUnits.push(u);
                if (u.alive) playerSurvivors++;
            } else {
                if (u.alive) enemySurvivors++;
            }
        }

        return {
            winner: this._state.winner,
            rounds: this._state.round,
            playerSurvivors: playerSurvivors,
            enemySurvivors: enemySurvivors,
            playerUnits: playerUnits
        };
    },

    setSpeed: function(ms) {
        this._speed = ms;
    },

    skip: function() {
        if (this._state.ended) return;
        if (this._timerId) {
            clearTimeout(this._timerId);
            this._timerId = null;
        }
        this._skipping = true;
        this._processNextAction();
    },

    getState: function() {
        var unitsSnapshot = [];
        for (var i = 0; i < this._state.units.length; i++) {
            var u = this._state.units[i];
            var skillSnapshots = [];
            for (var j = 0; j < u.skills.length; j++) {
                skillSnapshots.push({ id: u.skills[j].id, name: u.skills[j].name, type: u.skills[j].type });
            }
            unitsSnapshot.push({
                id: u.id,
                name: u.name,
                side: u.side,
                classId: u.classId,
                element: u.element,
                rarity: u.rarity,
                level: u.level,
                maxHp: u.maxHp,
                currentHp: u.currentHp,
                atk: u.atk,
                def: u.def,
                spd: u.spd,
                shield: u.shield,
                controlled: u.controlled,
                alive: u.alive,
                skills: skillSnapshots,
                isProtagonist: u.isProtagonist || false
            });
        }

        var actionOrderIds = [];
        for (var j = 0; j < this._state.actionOrder.length; j++) {
            actionOrderIds.push(this._state.actionOrder[j].id);
        }

        return {
            stageId: this._state.stageId,
            round: this._state.round,
            ended: this._state.ended,
            winner: this._state.winner,
            units: unitsSnapshot,
            actionOrder: actionOrderIds
        };
    }
};

window.BattleEngine = BattleEngine;
window.SkillEffectProcessor = SkillEffectProcessor;
