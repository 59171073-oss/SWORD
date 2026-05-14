(function () {

    var _currentStageId = null;
    var _isSpedUp = false;
    var _battleEnded = false;

    var styleEl = document.createElement('style');
    styleEl.textContent =
        '@keyframes victoryPulse{0%,100%{text-shadow:0 0 12px rgba(212,160,23,0.5)}50%{text-shadow:0 0 24px rgba(212,160,23,0.8),0 0 48px rgba(212,160,23,0.4)}}' +
        '@keyframes defeatShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}' +
        '@keyframes attackAnim{0%{transform:scale(1)}30%{transform:scale(1.15) translateY(-4px)}100%{transform:scale(1)}}' +
        '@keyframes hurtAnim{0%{transform:translateX(0)}20%{transform:translateX(-5px);filter:brightness(2)}40%{transform:translateX(5px)}60%{transform:translateX(-3px)}80%{transform:translateX(3px)}100%{transform:translateX(0)}}' +
        '.attack-anim{animation:attackAnim 0.3s ease!important;z-index:5}' +
        '.hurt-anim{animation:hurtAnim 0.3s ease!important}';
    document.head.appendChild(styleEl);

    window.startBattle = function (stageId) {
        var stage = LEVELS.find(function (s) { return s.id === stageId; });
        if (!stage) return;

        _currentStageId = stageId;
        _isSpedUp = false;
        _battleEnded = false;

        var playerFormation = GameState.getFormation();

        if (!playerFormation || !playerFormation.slots || playerFormation.slots.every(function (id) { return !id; })) {
            window.showToast('编队中无可用侠客');
            return;
        }

        var enemyTeam = stage.enemies.map(function (e, i) {
            return {
                id: 'enemy_' + i,
                name: e.name,
                classId: e.classId,
                element: e.element,
                rarity: e.rarity,
                level: e.level,
                stats: { hp: e.stats.hp, atk: e.stats.atk, def: e.stats.def, spd: e.stats.spd }
            };
        });

        BattleEngine.init(playerFormation, enemyTeam, stageId, onAction, onEnd);

        switchPage('battle');

        var titleEl = document.getElementById('battle-title');
        if (titleEl) titleEl.textContent = stage.chapterName + '·' + stage.stageName;

        var logEl = document.getElementById('battle-log');
        if (logEl) logEl.innerHTML = '';

        var actionsEl = document.getElementById('battle-actions');
        if (actionsEl) actionsEl.style.display = 'flex';

        var speedBtn = document.getElementById('btn-battle-speed');
        if (speedBtn) speedBtn.textContent = '加速';

        var state = BattleEngine.getState();
        renderBattleField(state);

        BattleEngine.start();
    };

    window.renderBattleField = function (state) {
        if (!state) return;

        var roundEl = document.getElementById('battle-round');
        if (roundEl) roundEl.textContent = state.round || 1;

        renderBattleOrder(state);
        renderBattleCards(state);
    };

    function renderBattleOrder(state) {
        var orderEl = document.getElementById('battle-order');
        if (!orderEl) return;

        orderEl.innerHTML = '';

        var units = state.units || [];
        var actionOrder = state.actionOrder || [];

        actionOrder.forEach(function (unitId) {
            var unit = null;
            for (var i = 0; i < units.length; i++) {
                if (units[i].id === unitId) { unit = units[i]; break; }
            }
            if (!unit) return;

            var classData = CLASSES[unit.classId];
            var orderUnit = document.createElement('div');
            orderUnit.className = 'order-unit';
            orderUnit.setAttribute('data-unit-id', unitId);

            if (unit.side === 'player') {
                orderUnit.classList.add('player-unit');
            } else {
                orderUnit.classList.add('enemy-unit');
            }

            if (!unit.alive) {
                orderUnit.classList.add('dead-unit');
            }

            orderUnit.textContent = classData ? classData.icon : '?';
            orderUnit.title = unit.name;
            orderEl.appendChild(orderUnit);
        });
    }

    function renderBattleCards(state) {
        var enemyCardsEl = document.getElementById('battle-enemy-cards');
        var playerCardsEl = document.getElementById('battle-player-cards');
        if (!enemyCardsEl || !playerCardsEl) return;

        var units = state.units || [];
        var enemyHtml = '';
        var playerHtml = '';

        for (var i = 0; i < units.length; i++) {
            if (units[i].side === 'enemy') {
                enemyHtml += renderBattleCard(units[i]);
            } else {
                playerHtml += renderBattleCard(units[i]);
            }
        }

        enemyCardsEl.innerHTML = enemyHtml;
        playerCardsEl.innerHTML = playerHtml;
    }

    window.renderBattleCard = function (unit) {
        var classData = CLASSES[unit.classId];
        var elementIcon = ELEMENT_ICONS[unit.element] || '';
        var hpPct = unit.maxHp > 0 ? Math.max(0, Math.min(100, (unit.currentHp / unit.maxHp) * 100)) : 0;
        var hpColor = hpPct > 60 ? '#2ecc71' : (hpPct > 30 ? '#f1c40f' : '#e74c3c');
        var sideClass = unit.side === 'player' ? 'player-unit' : 'enemy-unit';
        var deadClass = !unit.alive ? ' dead' : '';

        var html = '<div class="battle-unit ' + sideClass + deadClass + '" data-unit-id="' + unit.id + '">';
        html += '<div class="unit-icon">' + (classData ? classData.icon : '❓') + '</div>';
        html += '<div class="unit-name">' + unit.name + '</div>';

        if (unit.controlled && unit.controlled > 0) {
            html += '<div style="font-size:10px;line-height:1;">🔒</div>';
        }

        if (unit.shield && unit.shield > 0) {
            var shieldPct = unit.maxHp > 0 ? Math.min(100, (unit.shield / unit.maxHp) * 100) : 0;
            html += '<div style="width:100%;height:2px;background:rgba(0,0,0,0.5);border-radius:1px;margin-top:2px;overflow:hidden;">';
            html += '<div style="width:' + shieldPct + '%;height:100%;background:#3498db;border-radius:1px;transition:width 0.3s;"></div>';
            html += '</div>';
        }

        html += '<div class="unit-hp-bar">';
        html += '<div class="unit-hp-fill" style="width:' + hpPct + '%;background:' + hpColor + ';"></div>';
        html += '</div>';
        html += '<div style="font-size:7px;color:var(--cyan-gray);line-height:1.2;">' + Math.max(0, Math.floor(unit.currentHp)) + '/' + unit.maxHp + '</div>';
        html += '<div style="font-size:8px;color:var(--cyan-gray);margin-top:1px;line-height:1.2;">' + elementIcon + ' Lv.' + (unit.level || 1) + '</div>';
        html += '</div>';

        return html;
    };

    function onAction(actionInfo) {
        if (_battleEnded) return;

        var state = BattleEngine.getState();
        renderBattleField(state);

        if (actionInfo.actor) {
            var actorOrderEl = document.querySelector('.order-unit[data-unit-id="' + actionInfo.actor.id + '"]');
            if (actorOrderEl) actorOrderEl.classList.add('active-unit');

            var actorCardEl = document.querySelector('.battle-unit[data-unit-id="' + actionInfo.actor.id + '"]');
            if (actorCardEl) {
                actorCardEl.classList.add('attack-anim');
                setTimeout(function () { actorCardEl.classList.remove('attack-anim'); }, 300);
            }
        }

        if (actionInfo.target) {
            var targetCardEl = document.querySelector('.battle-unit[data-unit-id="' + actionInfo.target.id + '"]');
            if (targetCardEl) {
                targetCardEl.classList.add('hurt-anim');
                setTimeout(function () { targetCardEl.classList.remove('hurt-anim'); }, 300);
            }
        }

        if (actionInfo.damage && actionInfo.target) {
            var floatEl = document.querySelector('.battle-unit[data-unit-id="' + actionInfo.target.id + '"]');
            if (floatEl) {
                var rect = floatEl.getBoundingClientRect();
                var x = rect.left + rect.width / 2;
                var y = rect.top;
                if (actionInfo.isCrit) {
                    showFloatingText('暴击 ' + actionInfo.damage, 'damage', x, y);
                } else {
                    showFloatingText('-' + actionInfo.damage, 'damage', x, y);
                }
            }
        }

        if (actionInfo.heal) {
            var healTargetEl = null;
            if (actionInfo.target) {
                healTargetEl = document.querySelector('.battle-unit[data-unit-id="' + actionInfo.target.id + '"]');
            }
            if (!healTargetEl && actionInfo.actor) {
                healTargetEl = document.querySelector('.battle-unit[data-unit-id="' + actionInfo.actor.id + '"]');
            }
            if (healTargetEl) {
                var healRect = healTargetEl.getBoundingClientRect();
                showFloatingText('+' + actionInfo.heal, 'heal', healRect.left + healRect.width / 2, healRect.top);
            }
        }

        if (actionInfo.elementModifier && actionInfo.elementModifier !== 1.0 && actionInfo.target) {
            var elemEl = document.querySelector('.battle-unit[data-unit-id="' + actionInfo.target.id + '"]');
            if (elemEl) {
                var elemRect = elemEl.getBoundingClientRect();
                var elemText = actionInfo.elementModifier > 1.0 ? '克制!' : '被克!';
                showFloatingText(elemText, 'gold', elemRect.left + elemRect.width / 2, elemRect.top + 20);
            }
        }

        var logMsg = buildActionLog(actionInfo);
        addBattleLog(logMsg, actionInfo.type);
    }

    function buildActionLog(actionInfo) {
        var actorName = actionInfo.actor ? actionInfo.actor.name : '???';
        var targetName = actionInfo.target ? actionInfo.target.name : '???';
        var msg = '';

        switch (actionInfo.type) {
            case 'normal_attack':
                msg = '<span class="log-actor">' + actorName + '</span> 攻击 <span class="log-actor">' + targetName + '</span>';
                if (actionInfo.damage) msg += '，造成 <span class="log-damage">' + actionInfo.damage + '</span> 点伤害';
                if (actionInfo.isCrit) msg += '（暴击！）';
                if (actionInfo.elementModifier > 1.0) msg += ' <span class="log-element" style="color:var(--gold);">克制!</span>';
                else if (actionInfo.elementModifier < 1.0) msg += ' <span class="log-element" style="color:var(--cyan-gray);">被克!</span>';
                break;
            case 'skill':
                var skillType = actionInfo.skill ? actionInfo.skill.type : '';
                if (skillType === 'heal') {
                    msg = '<span class="log-actor">' + actorName + '</span> 治疗 <span class="log-actor">' + targetName + '</span>';
                    if (actionInfo.heal) msg += '，恢复 <span class="log-heal">' + actionInfo.heal + '</span> 点生命';
                    if (actionInfo.skill && actionInfo.skill.name) msg += '（' + actionInfo.skill.name + '）';
                } else if (skillType === 'control') {
                    msg = '<span class="log-actor">' + actorName + '</span> 对 <span class="log-actor">' + targetName + '</span> 施放 <span style="color:var(--azure);">' + (actionInfo.skill ? actionInfo.skill.name : '控制术') + '</span>';
                } else {
                    msg = '<span class="log-actor">' + actorName + '</span> 施放 <span style="color:var(--azure);">' + (actionInfo.skill ? actionInfo.skill.name : '技能') + '</span>';
                    if (actionInfo.target) msg += ' 对 <span class="log-actor">' + targetName + '</span>';
                    if (actionInfo.damage) msg += '，造成 <span class="log-damage">' + actionInfo.damage + '</span> 点伤害';
                    if (actionInfo.heal) msg += '，恢复 <span class="log-heal">' + actionInfo.heal + '</span> 点生命';
                    if (actionInfo.isCrit) msg += '（暴击！）';
                }
                break;
            case 'controlled':
                msg = '<span class="log-actor">' + actorName + '</span> 被控制，无法行动';
                break;
            default:
                msg = '<span class="log-actor">' + actorName + '</span> 行动';
        }

        return msg;
    }

    function onEnd(result) {
        _battleEnded = true;

        var actionsEl = document.getElementById('battle-actions');
        if (actionsEl) actionsEl.style.display = 'none';

        setTimeout(function () {
            showBattleResult(result, _currentStageId);
        }, 1000);
    }

    window.showBattleResult = function (result, stageId) {
        var existingOverlay = document.querySelector('.battle-result-overlay');
        if (existingOverlay && existingOverlay.parentNode) {
            existingOverlay.parentNode.removeChild(existingOverlay);
        }

        var stage = LEVELS.find(function (s) { return s.id === stageId; });
        var isVictory = result.winner === 'player';

        var html = '';

        if (isVictory) {
            html += '<div class="result-title victory" style="animation:victoryPulse 1.5s ease infinite;">大获全胜！</div>';
            html += '<div class="result-rewards">';

            if (stage) {
                html += '<div style="margin-bottom:8px;">通关：' + stage.chapterName + '·' + stage.stageName + '</div>';
            }

            html += '<div>战斗回合：' + result.rounds + '</div>';
            html += '<div>存活角色：' + (result.playerSurvivors || 0) + '</div>';

            html += '<div class="player-stats-section" style="margin-top:12px;padding-top:8px;border-top:1px solid rgba(212,160,23,0.2);">';
            html += '<div style="font-size:13px;color:var(--gold);margin-bottom:8px;text-align:center;">📊 我方战斗数据</div>';
            html += '<div style="display:flex;flex-direction:column;gap:6px;max-height:200px;overflow-y:auto;padding-right:4px;">';

            var playerUnits = result.playerUnits || [];
            playerUnits.forEach(function(unit) {
                var hpPct = unit.maxHp > 0 ? Math.round((unit.currentHp / unit.maxHp) * 100) : 0;
                var hpColor = hpPct > 60 ? 'var(--jade)' : (hpPct > 30 ? 'var(--gold)' : 'var(--vermilion)');
                var statusIcon = unit.alive ? '✅' : '❌';
                var classData = CLASSES[unit.classId];

                html += '<div style="background:rgba(0,0,0,0.2);padding:8px;border-radius:4px;font-size:11px;">';
                html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">';
                html += '<span style="font-size:12px;">' + (classData ? classData.icon : '?') + ' ' + unit.name + '</span>';
                html += '<span style="color:' + hpColor + ';">' + statusIcon + ' ' + hpPct + '%</span>';
                html += '</div>';
                html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px;">';
                html += '<span style="color:var(--vermilion);">❤️ ' + Math.max(0, Math.floor(unit.currentHp)) + '/' + unit.maxHp + '</span>';
                html += '<span style="font-size:10px;color:var(--cyan-gray);">Lv.' + (unit.level || 1) + '</span>';
                html += '</div>';
                html += '<div style="display:flex;justify-content:space-between;gap:8px;font-size:10px;">';
                if (unit.damageDealt > 0) {
                    html += '<span style="color:var(--azure);">⚔ 伤害 ' + unit.damageDealt + '</span>';
                } else {
                    html += '<span style="color:rgba(52,152,219,0.5);">⚔ 伤害 0</span>';
                }
                if (unit.healDone > 0) {
                    html += '<span style="color:var(--jade);">💚 治疗 ' + unit.healDone + '</span>';
                }
                html += '</div>';
                html += '</div>';
            });

            html += '</div>';
            html += '</div>';

            var reward = GameState.clearStage(stageId);
            if (reward) {
                html += '<div class="reward-gold" style="margin-top:12px;">💰 ' + reward.gold + '</div>';
                if (reward.isFirstClear) {
                    html += '<span class="reward-first">🎉 首次通关额外奖励：💰 ' + reward.firstClearGold + '</span>';
                }
            }

            var taskResults = checkTaskCard(stageId, result);
            if (taskResults.length > 0) {
                html += '<div style="margin-top:12px;padding-top:8px;border-top:1px solid rgba(212,160,23,0.2);">';
                taskResults.forEach(function (task) {
                    html += '<div style="color:var(--jade);font-size:13px;margin-top:4px;">🏆 ' + task.name + ' - ' + task.condition;
                    if (task.reward.gold) {
                        html += ' 💰' + task.reward.gold;
                        GameState.addGold(task.reward.gold);
                    }
                    if (task.reward.cardRarity) {
                        html += ' 🎴' + RARITY[task.reward.cardRarity].name + '卡牌';
                    }
                    html += '</div>';
                });
                html += '</div>';
            }

            html += '</div>';
            html += '<div class="result-actions">';
            html += '<button class="btn-ancient" id="btn-result-confirm">确认</button>';
            html += '</div>';
        } else {
            html += '<div class="result-title defeat" style="animation:defeatShake 0.5s ease;">战败...</div>';
            html += '<div class="result-rewards">';

            html += '<div style="margin-bottom:12px;">战斗回合：' + result.rounds + '</div>';

            html += '<div class="player-stats-section" style="margin-bottom:12px;">';
            html += '<div style="font-size:13px;color:var(--gold);margin-bottom:8px;text-align:center;">📊 我方战斗数据</div>';
            html += '<div style="display:flex;flex-direction:column;gap:6px;max-height:200px;overflow-y:auto;padding-right:4px;">';

            var playerUnitsLoss = result.playerUnits || [];
            playerUnitsLoss.forEach(function(unit) {
                var hpPct = unit.maxHp > 0 ? Math.round((unit.currentHp / unit.maxHp) * 100) : 0;
                var hpColor = hpPct > 60 ? 'var(--jade)' : (hpPct > 30 ? 'var(--gold)' : 'var(--vermilion)');
                var statusIcon = unit.alive ? '✅' : '❌';
                var classData = CLASSES[unit.classId];

                html += '<div style="background:rgba(0,0,0,0.2);padding:8px;border-radius:4px;font-size:11px;">';
                html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">';
                html += '<span style="font-size:12px;">' + (classData ? classData.icon : '?') + ' ' + unit.name + '</span>';
                html += '<span style="color:' + hpColor + ';">' + statusIcon + ' ' + hpPct + '%</span>';
                html += '</div>';
                html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px;">';
                html += '<span style="color:var(--vermilion);">❤️ ' + Math.max(0, Math.floor(unit.currentHp)) + '/' + unit.maxHp + '</span>';
                html += '<span style="font-size:10px;color:var(--cyan-gray);">Lv.' + (unit.level || 1) + '</span>';
                html += '</div>';
                html += '<div style="display:flex;justify-content:space-between;gap:8px;font-size:10px;">';
                if (unit.damageDealt > 0) {
                    html += '<span style="color:var(--azure);">⚔ 伤害 ' + unit.damageDealt + '</span>';
                } else {
                    html += '<span style="color:rgba(52,152,219,0.5);">⚔ 伤害 0</span>';
                }
                if (unit.healDone > 0) {
                    html += '<span style="color:var(--jade);">💚 治疗 ' + unit.healDone + '</span>';
                }
                html += '</div>';
                html += '</div>';
            });

            html += '</div>';
            html += '</div>';

            html += '<div style="color:var(--cyan-gray);line-height:1.8;">胜败乃兵家常事<br>调整编队再战</div>';
            html += '</div>';
            html += '<div class="result-actions">';
            html += '<button class="btn-ancient" id="btn-result-retry">重新挑战</button>';
            html += '<button class="btn-ancient" id="btn-result-formation" style="background:linear-gradient(180deg,#2c2c4a,#1a1a2e);border-color:var(--border-ancient);">调整编队</button>';
            html += '</div>';
        }

        var overlay = document.createElement('div');
        overlay.className = 'battle-result-overlay';
        overlay.innerHTML = '<div class="battle-result">' + html + '</div>';
        document.body.appendChild(overlay);

        setTimeout(function () {
            var confirmBtn = document.getElementById('btn-result-confirm');
            if (confirmBtn) {
                confirmBtn.addEventListener('click', function () {
                    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
                    switchPage('stages');
                    updateStatusBar();
                });
            }

            var retryBtn = document.getElementById('btn-result-retry');
            if (retryBtn) {
                retryBtn.addEventListener('click', function () {
                    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
                    startBattle(stageId);
                });
            }

            var formationBtn = document.getElementById('btn-result-formation');
            if (formationBtn) {
                formationBtn.addEventListener('click', function () {
                    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
                    switchPage('formation');
                });
            }
        }, 50);
    };

    window.checkTaskCard = function (stageId, result) {
        var stage = LEVELS.find(function (s) { return s.id === stageId; });
        if (!stage || !stage.taskCardId) return [];

        var taskCard = TASK_CARDS.find(function (t) { return t.id === stage.taskCardId; });
        if (!taskCard) return [];

        var satisfied = false;

        switch (taskCard.conditionType) {
            case 'turns':
                satisfied = result.rounds <= taskCard.conditionValue;
                break;
            case 'no_death':
                var playerUnits = result.playerUnits || [];
                if (playerUnits.length === 0) {
                    satisfied = false;
                } else {
                    satisfied = true;
                    for (var i = 0; i < playerUnits.length; i++) {
                        if (playerUnits[i].alive === false) { satisfied = false; break; }
                    }
                }
                break;
            case 'power_lower':
                satisfied = true;
                break;
            case 'elements_count':
                var formation = GameState.getFormation();
                var elements = [];
                if (formation.slots) {
                    for (var j = 0; j < formation.slots.length; j++) {
                        var heroId = formation.slots[j];
                        if (heroId) {
                            var cardData = CHARACTER_CARDS.find(function (c) { return c.id === heroId; });
                            if (cardData && elements.indexOf(cardData.element) === -1) {
                                elements.push(cardData.element);
                            }
                        }
                    }
                }
                satisfied = elements.length >= taskCard.conditionValue;
                break;
            case 'hp_above':
                var pUnits = result.playerUnits || [];
                if (pUnits.length === 0) {
                    satisfied = false;
                } else {
                    satisfied = true;
                    for (var k = 0; k < pUnits.length; k++) {
                        if (!pUnits[k].alive || pUnits[k].currentHp <= pUnits[k].maxHp * taskCard.conditionValue) {
                            satisfied = false;
                            break;
                        }
                    }
                }
                break;
        }

        return satisfied ? [taskCard] : [];
    };

    window.addBattleLog = function (message, type) {
        var logEl = document.getElementById('battle-log');
        if (!logEl) return;

        var entry = document.createElement('div');
        entry.className = 'log-entry';

        var typeColors = {
            attack: 'var(--vermilion)',
            heal: 'var(--jade)',
            control: 'var(--azure)',
            skill: 'var(--gold)'
        };

        entry.style.borderLeft = '3px solid ' + (typeColors[type] || typeColors.attack);
        entry.style.paddingLeft = '6px';
        entry.innerHTML = message;
        logEl.appendChild(entry);
        logEl.scrollTop = logEl.scrollHeight;
    };

    function bindBattleEvents() {
        var backBtn = document.getElementById('btn-battle-back');
        if (backBtn) {
            backBtn.addEventListener('click', function () {
                showModal(
                    '撤退',
                    '<div class="confirm-dialog"><p class="confirm-message">确定要撤退吗？<br>本次战斗进度将不会保存。</p></div>',
                    function () {
                        _battleEnded = true;
                        BattleEngine.skip();
                        switchPage('stages');
                    }
                );
            });
        }

        var speedBtn = document.getElementById('btn-battle-speed');
        if (speedBtn) {
            speedBtn.addEventListener('click', function () {
                _isSpedUp = !_isSpedUp;
                if (_isSpedUp) {
                    BattleEngine.setSpeed(200);
                    speedBtn.textContent = '正常';
                } else {
                    BattleEngine.setSpeed(500);
                    speedBtn.textContent = '加速';
                }
            });
        }

        var skipBtn = document.getElementById('btn-battle-skip');
        if (skipBtn) {
            skipBtn.addEventListener('click', function () {
                BattleEngine.skip();
            });
        }
    }

    bindBattleEvents();

})();
