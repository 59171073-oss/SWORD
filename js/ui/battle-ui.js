var BattleUI = {
    battleEngine: null,
    state: null,
    overlay: null,

    startBattle: function(playerFormation, enemyTeam, stageId) {
        try {
            this.battleEngine = BattleEngine;

            this.overlay = document.createElement('div');
            this.overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#0a0503;z-index:3000;display:flex;flex-direction:column;overflow:hidden;';

            this.overlay.innerHTML = '<div style="flex:1;display:flex;flex-direction:column;padding:16px;box-sizing:border-box;">' +
                '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">' +
                '<div style="color:#d4a017;font-size:18px;font-weight:bold;">⚔️ 战斗</div>' +
                '<div style="color:#8b9dab;font-size:14px;">回合: <span id="battle-round">0</span></div>' +
                '</div>' +
                '<div style="display:flex;gap:16px;flex:1;min-height:0;">' +
                '<div style="flex:1;display:flex;flex-direction:column;gap:8px;overflow-y:auto;" id="enemy-zone"></div>' +
                '<div style="display:flex;align-items:center;color:#d4a017;font-size:24px;font-weight:bold;">VS</div>' +
                '<div style="flex:1;display:flex;flex-direction:column;gap:8px;overflow-y:auto;" id="player-zone"></div>' +
                '</div>' +
                '<div id="battle-log" style="height:100px;overflow-y:auto;background:rgba(0,0,0,0.3);border-radius:8px;padding:8px;margin-top:12px;font-size:12px;color:#8b9dab;"></div>' +
                '<div style="display:flex;gap:8px;justify-content:center;margin-top:12px;">' +
                '<button class="btn-ancient" id="btn-speed-up" style="padding:8px 20px;">加速</button>' +
                '<button class="btn-ancient" id="btn-skip" style="padding:8px 20px;">跳过</button>' +
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

            html += '<div style="background:rgba(0,0,0,0.3);padding:8px;border-radius:8px;border-left:3px solid ' + (unit.side === 'player' ? '#3498db' : '#e74c3c') + ';' + (!unit.alive ? 'opacity:0.4;' : '') + '">';
            html += '<div style="display:flex;justify-content:space-between;align-items:center;">';
            html += '<span style="color:#f5e6c8;font-size:13px;font-weight:bold;">' + (classData ? classData.icon : '') + ' ' + unit.name + '</span>';
            if (unit.isProtagonist) {
                html += '<span style="color:#d4a017;font-size:10px;">主角</span>';
            }
            html += '</div>';
            html += '<div style="background:rgba(0,0,0,0.3);height:8px;border-radius:4px;margin:4px 0;overflow:hidden;">';
            html += '<div style="height:100%;width:' + hpPct + '%;background:' + hpColor + ';border-radius:4px;transition:width 0.3s;"></div>';
            html += '</div>';
            html += '<div style="display:flex;justify-content:space-between;font-size:10px;color:#8b9dab;">';
            html += '<span>' + Math.max(0, Math.floor(unit.currentHp)) + '/' + unit.maxHp + '</span>';
            html += '<span>' + unit.element + '</span>';
            html += '</div>';
            if (unit.shield > 0) {
                html += '<div style="color:#3498db;font-size:10px;">🛡 护盾: ' + unit.shield + '</div>';
            }
            if (unit.controlled > 0) {
                html += '<div style="color:#9b59b6;font-size:10px;">🔒 定身</div>';
            }
            html += '</div>';
        }
        zone.innerHTML = html;
    },

    onAction: function(action) {
        this.logAction(action);
        this.updateDisplay();
    },

    logAction: function(action) {
        var log = document.getElementById('battle-log');
        if (!log) return;

        var logText = '';
        if (action.actor) {
            logText += '<span style="color:#f5e6c8;">' + action.actor.name + '</span>';
        }

        if (action.type === 'normal_attack') {
            if (action.dodged) {
                logText += ' 的攻击被闪避了！';
            } else {
                logText += ' 攻击了 <span style="color:#e74c3c;">' + (action.target ? action.target.name : '未知') + '</span>';
                if (action.damage > 0) {
                    logText += '，造成 <span style="color:#e74c3c;">' + action.damage + '</span> 点伤害';
                    if (action.isCrit) logText += ' <span style="color:#d4a017;">暴击！</span>';
                }
            }
        } else if (action.type === 'skill') {
            logText += ' 使用了 <span style="color:#9b59b6;">' + (action.skill ? action.skill.name : '技能') + '</span>';
            if (action.damage > 0) logText += '，造成 <span style="color:#e74c3c;">' + action.damage + '</span> 点伤害';
            if (action.heal > 0) logText += '，回复了 <span style="color:#2ecc71;">' + action.heal + '</span> 点生命';
        } else if (action.type === 'heal') {
            logText += ' 治疗了 <span style="color:#2ecc71;">' + (action.target ? action.target.name : '未知') + '</span>';
            if (action.heal > 0) logText += '，回复了 <span style="color:#2ecc71;">' + action.heal + '</span> 点生命';
        } else if (action.type === 'controlled') {
            logText += ' 被定身了！';
        }

        while (log.children.length >= 5) {
            log.removeChild(log.firstChild);
        }

        var entry = document.createElement('div');
        entry.innerHTML = logText;
        log.appendChild(entry);
        log.scrollTop = log.scrollHeight;
    },

    onBattleEnd: function(result) {
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

                html += '<div style="background:rgba(0,0,0,0.3);padding:8px;border-radius:6px;margin-bottom:6px;text-align:left;">';
                html += '<div style="display:flex;justify-content:space-between;align-items:center;">';
                html += '<span style="color:#f5e6c8;font-size:13px;">' + (classData ? classData.icon : '') + ' ' + unit.name + '</span>';
                html += '<span style="color:' + hpColor + ';font-size:12px;">' + (unit.alive ? '✅' : '❌') + ' ' + hpPct + '%</span>';
                html += '</div>';
                html += '<div style="display:flex;gap:12px;font-size:11px;margin-top:4px;">';
                html += '<span style="color:#3498db;">⚔ 伤害 ' + (unit.damageDealt || 0) + '</span>';
                if (unit.healDone > 0) {
                    html += '<span style="color:#2ecc71;">💚 治疗 ' + unit.healDone + '</span>';
                }
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
