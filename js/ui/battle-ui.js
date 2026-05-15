const BattleUI = {
    container: null,
    battleEngine: null,
    state: null,
    actionQueue: [],
    isRunning: false,
    isSkipping: false,
    currentActionIndex: 0,

    init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.battleEngine = BattleEngine;
        this.render();
    },

    render() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="battle-container">
                <div class="battle-header">
                    <div class="battle-title">战斗</div>
                    <div class="battle-round">回合: <span id="battle-round">0</span></div>
                </div>
                <div class="battle-arena">
                    <div class="enemy-zone" id="enemy-zone"></div>
                    <div class="vs-indicator">VS</div>
                    <div class="player-zone" id="player-zone"></div>
                </div>
                <div class="battle-log" id="battle-log"></div>
                <div class="battle-controls">
                    <button id="btn-speed-up" class="battle-btn">加速</button>
                    <button id="btn-skip" class="battle-btn">跳过</button>
                </div>
            </div>
        `;

        document.getElementById('btn-speed-up').addEventListener('click', () => this.toggleSpeed());
        document.getElementById('btn-skip').addEventListener('click', () => this.skipBattle());
    },

    startBattle(playerFormation, enemyTeam, stageId) {
        this.battleEngine.init(
            playerFormation,
            enemyTeam,
            stageId,
            (action) => this.onAction(action),
            (result) => this.onBattleEnd(result)
        );

        this.updateDisplay();
        this.battleEngine.start();
    },

    updateDisplay() {
        this.state = this.battleEngine.getState();
        if (!this.state) return;

        document.getElementById('battle-round').textContent = this.state.round;

        this.renderUnits('player-zone', this.state.units.filter(u => u.side === 'player'));
        this.renderUnits('enemy-zone', this.state.units.filter(u => u.side === 'enemy'));
    },

    renderUnits(zoneId, units) {
        const zone = document.getElementById(zoneId);
        if (!zone) return;

        zone.innerHTML = units.map(unit => `
            <div class="battle-unit ${unit.side} ${unit.alive ? '' : 'dead'}" id="unit-${unit.id}">
                <div class="unit-name">${unit.name}</div>
                <div class="unit-hp-bar">
                    <div class="hp-fill" style="width: ${(unit.currentHp / unit.maxHp) * 100}%"></div>
                </div>
                <div class="unit-hp-text">${unit.currentHp}/${unit.maxHp}</div>
                ${unit.shield > 0 ? `<div class="unit-shield">护盾: ${unit.shield}</div>` : ''}
                ${unit.controlled > 0 ? `<div class="unit-controlled">定身</div>` : ''}
                <div class="unit-element">${unit.element}</div>
                ${unit.isProtagonist ? '<div class="unit-badge">主角</div>' : ''}
            </div>
        `).join('');
    },

    onAction(action) {
        this.logAction(action);
        this.updateDisplay();

        if (action.target) {
            const targetEl = document.getElementById(`unit-${action.target.id}`);
            if (targetEl) {
                targetEl.classList.add('hit');
                setTimeout(() => targetEl.classList.remove('hit'), 300);
            }
        }
    },

    logAction(action) {
        const log = document.getElementById('battle-log');
        if (!log) return;

        let logText = '';

        if (action.actor) {
            logText += `<span class="actor-name">${action.actor.name}</span>`;
        }

        switch (action.type) {
            case 'normal_attack':
                if (action.dodged) {
                    logText += ' 的攻击被闪避了！';
                } else {
                    logText += ` 攻击了 <span class="target-name">${action.target?.name || '未知'}</span>`;
                    if (action.damage > 0) {
                        logText += `，造成 <span class="damage">${action.damage}</span> 点伤害`;
                        if (action.isCrit) {
                            logText += ' <span class="crit">暴击！</span>';
                        }
                    }
                }
                break;
            case 'skill':
                logText += ` 使用了 <span class="skill-name">${action.skill?.name || '技能'}</span>`;
                if (action.damage > 0) {
                    logText += `，造成 <span class="damage">${action.damage}</span> 点伤害`;
                }
                if (action.heal > 0) {
                    logText += `，回复了 <span class="heal">${action.heal}</span> 点生命`;
                }
                break;
            case 'heal':
                logText += ` 治疗了 <span class="target-name">${action.target?.name || '未知'}</span>`;
                if (action.heal > 0) {
                    logText += `，回复了 <span class="heal">${action.heal}</span> 点生命`;
                }
                break;
            case 'controlled':
                logText += ' 被定身了！';
                break;
        }

        if (log.children.length >= 5) {
            log.removeChild(log.firstChild);
        }

        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.innerHTML = logText;
        log.appendChild(logEntry);
        log.scrollTop = log.scrollHeight;
    },

    onBattleEnd(result) {
        this.showResult(result);
    },

    showResult(result) {
        var stageId = this.battleEngine._state.stageId;
        var isVictory = result.winner === 'player';

        var overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);display:flex;align-items:center;justify-content:center;z-index:2000;padding:20px;box-sizing:border-box;';

        var html = '<div style="text-align:center;max-width:600px;width:100%;background:linear-gradient(180deg,#2a1a10,#1a0a05);border:2px solid ' + (isVictory ? '#d4a017' : '#e74c3c') + ';border-radius:16px;padding:32px;">';

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

        setTimeout(function () {
            var btn = document.getElementById('battle-result-btn');
            if (btn) {
                btn.onclick = function () {
                    overlay.remove();
                    if (window.switchPage) window.switchPage('stages');
                    if (window.updateStatusBar) window.updateStatusBar();
                };
            }
        }, 50);
    },

    toggleSpeed() {
        const currentSpeed = this.battleEngine._speed;
        if (currentSpeed === 500) {
            this.battleEngine.setSpeed(100);
        } else if (currentSpeed === 100) {
            this.battleEngine.setSpeed(10);
        } else {
            this.battleEngine.setSpeed(500);
        }
    },

    skipBattle() {
        this.battleEngine.skip();
    }
};

window.BattleUI = BattleUI;

window.startBattle = function (stageId) {
    var stage = LEVELS.find(function (s) { return s.id === stageId; });
    if (!stage) return;

    var formation = GameState.state.formation;
    var enemyTeam = stage.enemies;

    BattleUI.startBattle(formation, enemyTeam, stageId);
};
