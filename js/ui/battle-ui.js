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
        const overlay = document.createElement('div');
        overlay.className = 'battle-overlay';

        const isVictory = result.winner === 'player';
        const title = isVictory ? '胜利！' : '失败...';

        let unitStatsHtml = '';
        if (isVictory && result.playerUnits) {
            unitStatsHtml = '<div class="battle-stats-panel"><h4>战斗数据</h4>';
            result.playerUnits.forEach(unit => {
                unitStatsHtml += `
                    <div class="unit-stats-row">
                        <span class="unit-stats-name">${unit.name}</span>
                        <div class="unit-stats-details">
                            <span>伤害: ${unit.damageDealt || 0}</span>
                            <span>治疗: ${unit.healDone || 0}</span>
                        </div>
                    </div>
                `;
            });
            unitStatsHtml += '</div>';
        }

        overlay.innerHTML = `
            <div class="battle-result">
                <h2 class="result-title ${isVictory ? 'victory' : 'defeat'}">${title}</h2>
                <div class="result-info">
                    <p>存活队友: ${result.playerSurvivors}</p>
                    <p>战斗回合: ${result.rounds}</p>
                </div>
                ${unitStatsHtml}
                <button class="result-btn" onclick="this.closest('.battle-overlay').remove(); UIManager.closePanel();">返回</button>
            </div>
        `;

        this.container.appendChild(overlay);
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
