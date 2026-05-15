var ENEMY_IMAGES = {
    '山贼甲': 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=rugged%20chinese%20bandit%20with%20scar%20on%20face%2C%20wearing%20brown%20rags%2C%20holding%20club%2C%20wuxia%20style%2C%20portrait%2C%20menacing&image_size=square_hd',
    '山贼乙': 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=thin%20chinese%20bandit%20with%20sneaky%20grin%2C%20wearing%20torn%20gray%20clothes%2C%20holding%20dagger%2C%20wuxia%20style%2C%20portrait&image_size=square_hd',
    '山贼丙': 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=burly%20chinese%20bandit%20with%20thick%20beard%2C%20wearing%20dark%20leather%20armor%2C%20holding%20spear%2C%20wuxia%20style%2C%20portrait&image_size=square_hd',
    '恶霸头目': 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cruel%20chinese%20gang%20leader%20with%20topknot%2C%20wearing%20red%20and%20black%20robes%2C%20holding%20dao%20blade%2C%20wuxia%20style%2C%20portrait&image_size=square_hd',
    '恶霸打手': 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=muscular%20chinese%20thug%20with%20tattoos%2C%20wearing%20sleeveless%20shirt%2C%20bare%20fists%2C%20wuxia%20style%2C%20portrait&image_size=square_hd',
    '恶霸喽啰': 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sneaky%20chinese%20minion%20with%20thin%20mustache%2C%20wearing%20dirty%20green%20clothes%2C%20holding%20short%20sword%2C%20wuxia%20style%2C%20portrait&image_size=square_hd',
    '寨门守卫': 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=armored%20chinese%20gate%20guard%2C%20wearing%20iron%20helmet%20and%20scale%20armor%2C%20holding%20halberd%2C%20wuxia%20style%2C%20portrait&image_size=square_hd',
    '寨中刀手': 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20swordsman%20in%20black%20outfit%2C%20dual%20wielding%20dao%20blades%2C%20wuxia%20style%2C%20portrait%2C%20fierce%20eyes&image_size=square_hd',
    '寨中剑手': 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20chinese%20swordsman%20in%20white%20robe%2C%20holding%20slender%20jian%20sword%2C%20wuxia%20style%2C%20portrait&image_size=square_hd',
    '寨中暗手': 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=shadowy%20chinese%20assassin%20in%20dark%20hood%2C%20holding%20hidden%20needles%2C%20wuxia%20style%2C%20portrait%2C%20mysterious&image_size=square_hd',
    '蛇谷守卫': 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20snake%20valley%20guard%20with%20snake%20motif%20armor%2C%20holding%20snake%20spear%2C%20wuxia%20style%2C%20portrait&image_size=square_hd',
    '蛇谷刺客': 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20snake%20assassin%20with%20green%20veil%2C%20holding%20poison%20daggers%2C%20wuxia%20style%2C%20portrait%2C%20venomous&image_size=square_hd',
    '蛇谷剑客': 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20snake%20swordsman%20with%20serpent%20sword%2C%20wearing%20emerald%20robes%2C%20wuxia%20style%2C%20portrait&image_size=square_hd',
    '蛇谷术士': 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20snake%20sorcerer%20with%20staff%2C%20wearing%20dark%20purple%20robes%2C%20wuxia%20style%2C%20portrait%2C%20mystical&image_size=square_hd',
    '蛇谷医者': 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20snake%20healer%20with%20medicine%20bag%2C%20wearing%20olive%20green%20robes%2C%20wuxia%20style%2C%20portrait&image_size=square_hd',
    '头目·赤炎': 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fearsome%20chinese%20bandit%20chief%20with%20flaming%20dao%2C%20wearing%20crimson%20battle%20armor%2C%20wuxia%20style%2C%20portrait%2C%20powerful&image_size=square_hd',
    '头目护卫': 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20elite%20bodyguard%20in%20heavy%20iron%20armor%2C%20holding%20shield%20and%20mace%2C%20wuxia%20style%2C%20portrait&image_size=square_hd',
    '头目剑客': 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20elite%20swordsman%20with%20golden%20jian%2C%20wearing%20blue%20battle%20robes%2C%20wuxia%20style%2C%20portrait&image_size=square_hd',
    '头目暗手': 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20elite%20assassin%20with%20twin%20needles%2C%20wearing%20shadow%20cloak%2C%20wuxia%20style%2C%20portrait&image_size=square_hd',
    '头目军师': 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20strategist%20with%20fan%2C%20wearing%20dark%20blue%20scholar%20robes%2C%20wuxia%20style%2C%20portrait%2C%20cunning&image_size=square_hd',
    'default_enemy': 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20martial%20artist%20enemy%2C%20wuxia%20style%2C%20portrait%2C%20determined&image_size=square_hd'
};

function getEnemyImageUrl(name) {
    return ENEMY_IMAGES[name] || ENEMY_IMAGES['default_enemy'];
}

function getUnitImageUrl(unit) {
    if (unit.side === 'player') {
        if (unit.isProtagonist) {
            return PROTAGONIST.imageUrl || '';
        }
        var cardData = CHARACTER_CARDS.find(function (c) { return c.id === unit.heroId; });
        return cardData ? (cardData.imageUrl || '') : '';
    }
    return getEnemyImageUrl(unit.name);
}

var BattleUI = {
    battleEngine: null,
    state: null,
    overlay: null,

    startBattle: function(playerFormation, enemyTeam, stageId) {
        try {
            this.battleEngine = BattleEngine;

            this.overlay = document.createElement('div');
            this.overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#0a0503;z-index:3000;display:flex;flex-direction:column;overflow:hidden;';

            this.overlay.innerHTML =
                '<div style="flex:1;display:flex;flex-direction:column;padding:12px;box-sizing:border-box;overflow:hidden;">' +
                    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-shrink:0;">' +
                        '<div style="color:#d4a017;font-size:16px;font-weight:bold;">⚔️ 战斗</div>' +
                        '<div style="color:#8b9dab;font-size:13px;">回合: <span id="battle-round">0</span></div>' +
                    '</div>' +
                    '<div style="display:flex;gap:8px;flex:1;min-height:0;">' +
                        '<div style="flex:1;display:flex;flex-direction:column;gap:6px;overflow-y:auto;" id="enemy-zone"></div>' +
                        '<div style="display:flex;align-items:center;color:#d4a017;font-size:20px;font-weight:bold;flex-shrink:0;">VS</div>' +
                        '<div style="flex:1;display:flex;flex-direction:column;gap:6px;overflow-y:auto;" id="player-zone"></div>' +
                    '</div>' +
                    '<div id="battle-log" style="height:120px;overflow-y:auto;background:rgba(0,0,0,0.4);border-radius:8px;padding:8px;margin-top:8px;font-size:12px;color:#8b9dab;border:1px solid rgba(212,160,23,0.2);flex-shrink:0;"></div>' +
                    '<div style="display:flex;gap:8px;justify-content:center;margin-top:8px;flex-shrink:0;">' +
                        '<button class="btn-ancient" id="btn-speed-up" style="padding:6px 16px;font-size:12px;">加速</button>' +
                        '<button class="btn-ancient" id="btn-skip" style="padding:6px 16px;font-size:12px;">跳过</button>' +
                    '</div>' +
                '</div>';

            document.body.appendChild(this.overlay);

            var self = this;
            document.getElementById('btn-speed-up').onclick = function() { self.toggleSpeed(); };
            document.getElementById('btn-skip').onclick = function() { self.skipBattle(); };

            this.battleEngine.init(
                playerFormation,
                enemyTeam,
                stageId,
                function(action) { self.onAction(action); },
                function(result) { self.onBattleEnd(result); }
            );

            this.updateDisplay();
            this.logSystem('战斗开始！');
            this.battleEngine.start();
        } catch (e) {
            console.error('BattleUI.startBattle error:', e);
            if (this.overlay) {
                this.overlay.remove();
                this.overlay = null;
            }
            window.showToast('战斗初始化失败：' + e.message);
        }
    },

    updateDisplay: function() {
        this.state = this.battleEngine.getState();
        if (!this.state) return;

        var roundEl = document.getElementById('battle-round');
        if (roundEl) roundEl.textContent = this.state.round;

        this.renderUnits('player-zone', this.state.units.filter(function(u) { return u.side === 'player'; }));
        this.renderUnits('enemy-zone', this.state.units.filter(function(u) { return u.side === 'enemy'; }));
    },

    renderUnits: function(zoneId, units) {
        var zone = document.getElementById(zoneId);
        if (!zone) return;

        var html = '';
        for (var i = 0; i < units.length; i++) {
            var unit = units[i];
            var hpPct = unit.maxHp > 0 ? Math.round((unit.currentHp / unit.maxHp) * 100) : 0;
            var hpColor = hpPct > 60 ? '#2ecc71' : (hpPct > 30 ? '#d4a017' : '#e74c3c');
            var classData = CLASSES[unit.classId];
            var imageUrl = getUnitImageUrl(unit);

            html += '<div style="background:rgba(0,0,0,0.3);padding:6px;border-radius:8px;border-left:3px solid ' + (unit.side === 'player' ? '#3498db' : '#e74c3c') + ';' + (!unit.alive ? 'opacity:0.4;' : '') + '">';
            html += '<div style="display:flex;align-items:center;gap:8px;">';

            if (imageUrl) {
                html += '<img src="' + imageUrl + '" style="width:40px;height:40px;object-fit:cover;border-radius:6px;border:1px solid ' + (unit.side === 'player' ? '#3498db' : '#e74c3c') + ';flex-shrink:0;" onerror="this.style.display=\'none\'">';
            } else {
                html += '<div style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;font-size:20px;background:rgba(0,0,0,0.3);border-radius:6px;flex-shrink:0;">' + (classData ? classData.icon : '?') + '</div>';
            }

            html += '<div style="flex:1;min-width:0;">';
            html += '<div style="display:flex;justify-content:space-between;align-items:center;">';
            html += '<span style="color:#f5e6c8;font-size:12px;font-weight:bold;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + unit.name + '</span>';
            if (unit.isProtagonist) {
                html += '<span style="color:#d4a017;font-size:9px;flex-shrink:0;">主角</span>';
            }
            html += '</div>';
            html += '<div style="background:rgba(0,0,0,0.3);height:6px;border-radius:3px;margin:3px 0;overflow:hidden;">';
            html += '<div style="height:100%;width:' + hpPct + '%;background:' + hpColor + ';border-radius:3px;transition:width 0.3s;"></div>';
            html += '</div>';
            html += '<div style="display:flex;justify-content:space-between;font-size:9px;color:#8b9dab;">';
            html += '<span>' + Math.max(0, Math.floor(unit.currentHp)) + '/' + unit.maxHp + '</span>';
            html += '<span>' + unit.element + '</span>';
            html += '</div>';
            if (unit.shield > 0) {
                html += '<div style="color:#3498db;font-size:9px;">🛡' + unit.shield + '</div>';
            }
            if (unit.controlled > 0) {
                html += '<div style="color:#9b59b6;font-size:9px;">🔒定身</div>';
            }
            html += '</div>';
            html += '</div>';
            html += '</div>';
        }
        zone.innerHTML = html;
    },

    onAction: function(action) {
        this.logAction(action);
        this.updateDisplay();
    },

    logSystem: function(text) {
        var log = document.getElementById('battle-log');
        if (!log) return;
        var entry = document.createElement('div');
        entry.style.cssText = 'color:#d4a017;font-weight:bold;padding:2px 0;border-bottom:1px solid rgba(212,160,23,0.1);';
        entry.textContent = text;
        log.appendChild(entry);
        log.scrollTop = log.scrollHeight;
    },

    logAction: function(action) {
        var log = document.getElementById('battle-log');
        if (!log) return;

        var logText = '';
        var actorName = action.actor ? action.actor.name : '???';

        if (action.type === 'normal_attack') {
            if (action.dodged) {
                logText = '<span style="color:#f5e6c8;">' + actorName + '</span> 发起攻击，但 <span style="color:#3498db;">' + (action.target ? action.target.name : '???') + '</span> <span style="color:#d4a017;">身法灵动，闪避了攻击！</span>';
            } else {
                logText = '<span style="color:#f5e6c8;">' + actorName + '</span> 攻击 <span style="color:#e74c3c;">' + (action.target ? action.target.name : '???') + '</span>';
                if (action.damage > 0) {
                    logText += '，造成 <span style="color:#e74c3c;font-weight:bold;">' + action.damage + '</span> 点伤害';
                    if (action.isCrit) logText += ' <span style="color:#d4a017;font-weight:bold;">💥暴击！</span>';
                }
                if (action.elementModifier && action.elementModifier > 1) {
                    logText += ' <span style="color:#3498db;">（属性克制）</span>';
                }
            }
        } else if (action.type === 'skill') {
            logText = '<span style="color:#f5e6c8;">' + actorName + '</span> 施展 <span style="color:#9b59b6;font-weight:bold;">' + (action.skill ? action.skill.name : '武技') + '</span>';
            if (action.target) {
                logText += ' → <span style="color:#e74c3c;">' + action.target.name + '</span>';
            }
            if (action.damage > 0) {
                logText += '，造成 <span style="color:#e74c3c;font-weight:bold;">' + action.damage + '</span> 点伤害';
                if (action.isCrit) logText += ' <span style="color:#d4a017;font-weight:bold;">💥暴击！</span>';
            }
            if (action.heal > 0) {
                logText += '，回复 <span style="color:#2ecc71;font-weight:bold;">' + action.heal + '</span> 点生命';
            }
        } else if (action.type === 'heal') {
            logText = '<span style="color:#f5e6c8;">' + actorName + '</span> 治疗了 <span style="color:#2ecc71;">' + (action.target ? action.target.name : '???') + '</span>';
            if (action.heal > 0) {
                logText += '，回复 <span style="color:#2ecc71;font-weight:bold;">' + action.heal + '</span> 点生命';
            }
        } else if (action.type === 'controlled') {
            logText = '<span style="color:#f5e6c8;">' + actorName + '</span> <span style="color:#9b59b6;">被定身，无法行动！</span>';
        }

        if (!logText) return;

        var entry = document.createElement('div');
        entry.style.cssText = 'padding:3px 0;border-bottom:1px solid rgba(255,255,255,0.05);line-height:1.4;';
        entry.innerHTML = logText;
        log.appendChild(entry);
        log.scrollTop = log.scrollHeight;

        while (log.children.length > 30) {
            log.removeChild(log.firstChild);
        }
    },

    onBattleEnd: function(result) {
        this.logSystem(result.winner === 'player' ? '🎉 大获全胜！' : '💀 战败...');
        this.showResult(result);
    },

    showResult: function(result) {
        var stageId = this.battleEngine._state.stageId;
        var isVictory = result.winner === 'player';

        if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;
        }

        var overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.95);display:flex;align-items:center;justify-content:center;z-index:3000;padding:20px;box-sizing:border-box;';

        var html = '<div style="text-align:center;max-width:600px;width:100%;background:linear-gradient(180deg,#2a1a10,#1a0a05);border:2px solid ' + (isVictory ? '#d4a017' : '#e74c3c') + ';border-radius:16px;padding:32px;max-height:90vh;overflow-y:auto;">';

        html += '<h2 style="color:' + (isVictory ? '#d4a017' : '#e74c3c') + ';font-size:32px;margin-bottom:16px;">' + (isVictory ? '大获全胜！' : '战败...') + '</h2>';

        html += '<div style="color:#8b9dab;margin-bottom:16px;">';
        html += '<div>战斗回合：' + result.rounds + '</div>';
        html += '<div>存活队友：' + (result.playerSurvivors || 0) + '</div>';
        html += '</div>';

        if (result.playerUnits && result.playerUnits.length > 0) {
            html += '<div style="margin-bottom:16px;">';
            html += '<div style="color:#d4a017;font-size:14px;margin-bottom:8px;">📊 我方战斗数据</div>';
            for (var i = 0; i < result.playerUnits.length; i++) {
                var unit = result.playerUnits[i];
                var classData = CLASSES[unit.classId];
                var hpPct = unit.maxHp > 0 ? Math.round((unit.currentHp / unit.maxHp) * 100) : 0;
                var hpColor = hpPct > 60 ? '#2ecc71' : (hpPct > 30 ? '#d4a017' : '#e74c3c');
                var imageUrl = getUnitImageUrl(unit);

                html += '<div style="background:rgba(0,0,0,0.3);padding:8px;border-radius:6px;margin-bottom:6px;text-align:left;display:flex;align-items:center;gap:8px;">';

                if (imageUrl) {
                    html += '<img src="' + imageUrl + '" style="width:40px;height:40px;object-fit:cover;border-radius:6px;border:1px solid #d4a017;" onerror="this.style.display=\'none\'">';
                }

                html += '<div style="flex:1;">';
                html += '<div style="display:flex;justify-content:space-between;align-items:center;">';
                html += '<span style="color:#f5e6c8;font-size:13px;">' + (classData ? classData.icon : '') + ' ' + unit.name + '</span>';
                html += '<span style="color:' + hpColor + ';font-size:12px;">' + (unit.alive ? '✅' : '❌') + ' ' + hpPct + '%</span>';
                html += '</div>';
                html += '<div style="display:flex;gap:12px;font-size:11px;margin-top:4px;">';
                html += '<span style="color:#e74c3c;">⚔ 造成伤害 ' + (unit.damageDealt || 0) + '</span>';
                html += '<span style="color:#e74c3c;">🛡 承受伤害 ' + (unit.damageTaken || 0) + '</span>';
                if (unit.healDone > 0) {
                    html += '<span style="color:#2ecc71;">💚 治疗 ' + unit.healDone + '</span>';
                }
                if (unit.healReceived > 0) {
                    html += '<span style="color:#2ecc71;">❤ 受疗 ' + unit.healReceived + '</span>';
                }
                html += '</div>';
                html += '</div>';
                html += '</div>';
            }
            html += '</div>';
        }

        if (isVictory && stageId) {
            var reward = GameState.clearStage(stageId);
            if (reward) {
                html += '<div style="color:#d4a017;margin-bottom:16px;">';
                html += '<div>💰 获得 ' + reward.gold + ' 金币</div>';
                if (reward.isFirstClear) {
                    html += '<div style="color:#2ecc71;">🎉 首次通关额外奖励：💰 ' + reward.firstClearGold + '</div>';
                }
                html += '</div>';
            }
        }

        html += '<button class="btn-ancient" id="battle-result-btn" style="padding:12px 32px;font-size:16px;">' + (isVictory ? '确认' : '返回') + '</button>';
        html += '</div>';

        overlay.innerHTML = html;
        document.body.appendChild(overlay);

        setTimeout(function() {
            var btn = document.getElementById('battle-result-btn');
            if (btn) {
                btn.onclick = function() {
                    overlay.remove();
                    if (window.switchPage) window.switchPage('stages');
                    if (window.updateStatusBar) window.updateStatusBar();
                    if (window.renderStagesPage) window.renderStagesPage();
                };
            }
        }, 50);
    },

    toggleSpeed: function() {
        var currentSpeed = this.battleEngine._speed;
        if (currentSpeed === 500) {
            this.battleEngine.setSpeed(100);
        } else if (currentSpeed === 100) {
            this.battleEngine.setSpeed(10);
        } else {
            this.battleEngine.setSpeed(500);
        }
    },

    skipBattle: function() {
        this.battleEngine.skip();
    }
};

window.BattleUI = BattleUI;

window.startBattle = function(stageId) {
    try {
        var stage = LEVELS.find(function(s) { return s.id === stageId; });
        if (!stage) {
            window.showToast('未找到关卡数据');
            return;
        }
        var formation = GameState.state.formation;
        if (!formation || !formation.slots) {
            window.showToast('编队数据异常');
            return;
        }
        var enemyTeam = stage.enemies;
        if (!enemyTeam || enemyTeam.length === 0) {
            window.showToast('敌方阵容为空');
            return;
        }
        BattleUI.startBattle(formation, enemyTeam, stageId);
    } catch (e) {
        console.error('startBattle error:', e);
        window.showToast('战斗启动失败：' + e.message);
    }
};
