(function () {
    var _currentChapter = GameState.state ? GameState.state.stageProgress.currentChapter : 1;

    function calculateEnemyPower(enemies) {
        var total = 0;
        for (var i = 0; i < enemies.length; i++) {
            var s = enemies[i].stats;
            total += s.hp + s.atk + s.def + s.spd;
        }
        return total;
    }

    function getChapters() {
        var map = {};
        var list = [];
        for (var i = 0; i < LEVELS.length; i++) {
            var lv = LEVELS[i];
            if (!map[lv.chapter]) {
                map[lv.chapter] = true;
                list.push({ chapter: lv.chapter, chapterName: lv.chapterName });
            }
        }
        return list;
    }

    function isChapterCleared(chapter) {
        var stages = LEVELS.filter(function (s) { return s.chapter === chapter; });
        for (var i = 0; i < stages.length; i++) {
            if (!GameState.state.stageProgress.cleared[stages[i].id]) return false;
        }
        return true;
    }

    function renderChapterList() {
        var container = document.getElementById('chapter-list');
        if (!container) return;
        container.innerHTML = '';

        var chapters = getChapters();
        for (var i = 0; i < chapters.length; i++) {
            var ch = chapters[i];
            var btn = document.createElement('button');
            btn.className = 'chapter-btn';
            if (ch.chapter === _currentChapter) btn.classList.add('active');

            var cleared = isChapterCleared(ch.chapter);
            var label = '第' + ch.chapter + '章 · ' + ch.chapterName;
            if (cleared) label += ' ✓';
            btn.textContent = label;

            btn.addEventListener('click', (function (chapterNum) {
                return function () {
                    _currentChapter = chapterNum;
                    renderChapterList();
                    renderStageMap(chapterNum);
                };
            })(ch.chapter));

            container.appendChild(btn);
        }
    }

    function renderStageMap(chapter) {
        var container = document.getElementById('stage-map');
        if (!container) return;
        container.innerHTML = '';

        var stages = LEVELS.filter(function (s) { return s.chapter === chapter; });
        if (stages.length === 0) {
            container.innerHTML = '<div class="empty-state">暂无关卡</div>';
            return;
        }

        for (var i = 0; i < stages.length; i++) {
            var stage = stages[i];
            var isCleared = !!GameState.state.stageProgress.cleared[stage.id];
            var isUnlocked = GameState.isStageUnlocked(stage.id);
            var isCurrent = isUnlocked && !isCleared;

            var node = document.createElement('div');
            node.className = 'stage-node';
            if (isCleared) node.classList.add('cleared');
            else if (isCurrent) node.classList.add('current');
            else if (!isUnlocked) node.classList.add('locked');

            var stageNum = i + 1;
            var numberDiv = document.createElement('div');
            numberDiv.className = 'stage-number';
            if (isCleared) numberDiv.textContent = '✓';
            else if (!isUnlocked) numberDiv.textContent = '🔒';
            else numberDiv.textContent = stageNum;

            var infoDiv = document.createElement('div');
            infoDiv.className = 'stage-info';

            var nameDiv = document.createElement('div');
            nameDiv.className = 'stage-name';
            nameDiv.textContent = stage.stageName;

            var rewardDiv = document.createElement('div');
            rewardDiv.className = 'stage-reward';
            var enemyPower = calculateEnemyPower(stage.enemies);
            rewardDiv.textContent = '💰 ' + stage.baseReward + '  ⚔ 战力 ' + enemyPower;

            infoDiv.appendChild(nameDiv);
            infoDiv.appendChild(rewardDiv);

            var statusDiv = document.createElement('div');
            statusDiv.className = 'stage-status';
            if (isCleared) statusDiv.textContent = '已通关';
            else if (isCurrent) statusDiv.textContent = '可挑战';
            else statusDiv.textContent = '未解锁';

            node.appendChild(numberDiv);
            node.appendChild(infoDiv);
            node.appendChild(statusDiv);

            if (isCurrent) {
                node.addEventListener('click', (function (sid) {
                    return function () {
                        showStageDetail(sid);
                    };
                })(stage.id));
            } else if (isCleared) {
                node.addEventListener('click', (function (sid) {
                    return function () {
                        showStageDetail(sid);
                    };
                })(stage.id));
            }

            container.appendChild(node);
        }
    }

    function showStageDetail(stageId) {
        var stage = LEVELS.find(function (s) { return s.id === stageId; });
        if (!stage) return;

        var isCleared = !!GameState.state.stageProgress.cleared[stageId];
        var isUnlocked = GameState.isStageUnlocked(stageId);
        var isFirstClear = !GameState.state.firstClearBonus[stageId];
        var enemyPower = calculateEnemyPower(stage.enemies);
        var myPower = GameState.getTeamPower();

        var html = '<div class="stage-detail">';

        html += '<div class="detail-section" style="margin-bottom:16px;">';
        html += '<div style="font-size:14px;color:var(--gold);letter-spacing:2px;margin-bottom:10px;text-align:center;">敌方阵容</div>';

        html += '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;">';
        for (var i = 0; i < stage.enemies.length; i++) {
            var e = stage.enemies[i];
            var classInfo = CLASSES[e.classId];
            var rarityInfo = RARITY[e.rarity];
            var elementIcon = ELEMENT_ICONS[e.element] || '';

            html += '<div style="width:70px;text-align:center;padding:6px 4px;background:rgba(0,0,0,0.3);border:1px solid ' + (rarityInfo ? rarityInfo.color : 'var(--border-ancient)') + ';border-radius:var(--radius-sm);">';
            html += '<div style="font-size:20px;margin-bottom:2px;">' + (classInfo ? classInfo.icon : '❓') + '</div>';
            html += '<div style="font-size:10px;color:var(--parchment);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + e.name + '</div>';
            html += '<div style="font-size:9px;color:var(--cyan-gray);">' + (classInfo ? classInfo.name : '') + '</div>';
            html += '<div style="font-size:9px;">' + elementIcon + ' ' + e.element + '</div>';
            html += '<div style="font-size:9px;color:var(--gold);">Lv.' + e.level + '</div>';
            html += '</div>';
        }
        html += '</div>';
        html += '</div>';

        html += '<div style="display:flex;justify-content:space-between;padding:10px 12px;background:rgba(0,0,0,0.2);border-radius:var(--radius-sm);margin-bottom:12px;">';
        html += '<div style="font-size:13px;"><span style="color:var(--vermilion);">敌方战力</span> <span style="color:var(--parchment);font-weight:bold;">' + enemyPower + '</span></div>';
        html += '<div style="font-size:13px;"><span style="color:var(--jade);">我方战力</span> <span style="color:var(--parchment);font-weight:bold;">' + myPower + '</span></div>';
        html += '</div>';

        var powerCompare = myPower >= enemyPower;
        html += '<div style="text-align:center;font-size:12px;margin-bottom:12px;color:' + (powerCompare ? 'var(--jade)' : 'var(--vermilion)') + ';">';
        html += powerCompare ? '✦ 战力占优，胜算在握' : '⚠ 战力不足，谨慎出征';
        html += '</div>';

        html += '<div style="display:flex;justify-content:space-between;padding:8px 12px;background:rgba(212,160,23,0.08);border:1px solid rgba(212,160,23,0.2);border-radius:var(--radius-sm);margin-bottom:8px;">';
        html += '<span style="font-size:12px;color:var(--cyan-gray);">通关奖励</span>';
        html += '<span style="font-size:12px;color:var(--gold);">💰 ' + stage.baseReward + '</span>';
        html += '</div>';

        if (isFirstClear && !isCleared) {
            html += '<div style="display:flex;justify-content:space-between;padding:8px 12px;background:rgba(46,204,113,0.08);border:1px solid rgba(46,204,113,0.2);border-radius:var(--radius-sm);margin-bottom:8px;">';
            html += '<span style="font-size:12px;color:var(--jade);">🌟 首次通关</span>';
            html += '<span style="font-size:12px;color:var(--jade);">💰 +' + stage.baseReward + '</span>';
            html += '</div>';
        }

        if (stage.taskCardId) {
            var taskCard = TASK_CARDS.find(function (t) { return t.id === stage.taskCardId; });
            if (taskCard) {
                html += '<div style="padding:10px 12px;background:rgba(155,89,182,0.08);border:1px solid rgba(155,89,182,0.2);border-radius:var(--radius-sm);margin-bottom:8px;">';
                html += '<div style="font-size:12px;color:var(--purple);margin-bottom:4px;">📜 任务卡 · ' + taskCard.name + '</div>';
                html += '<div style="font-size:11px;color:var(--cyan-gray);margin-bottom:4px;">条件：' + taskCard.condition + '</div>';
                html += '<div style="font-size:11px;color:var(--gold);">奖励：';
                if (taskCard.reward.gold) html += '💰 ' + taskCard.reward.gold;
                if (taskCard.reward.cardRarity) html += '🎁 ' + RARITY[taskCard.reward.cardRarity].name + '卡牌';
                html += '</div>';
                html += '</div>';
            }
        }

        if (isCleared) {
            html += '<div style="text-align:center;font-size:13px;color:var(--jade);margin-top:8px;letter-spacing:2px;">✅ 已通关</div>';
        }

        html += '</div>';

        var onConfirm = null;
        if (isUnlocked && !isCleared) {
            onConfirm = function () {
                if (typeof startBattle === 'function') {
                    startBattle(stageId);
                }
            };
        } else if (isCleared) {
            onConfirm = function () {
                if (typeof startBattle === 'function') {
                    startBattle(stageId);
                }
            };
        }

        var confirmText = isCleared ? '再战' : '出征';
        showModal(stage.stageName, html, onConfirm ? function () { onConfirm(); } : null);

        if (onConfirm) {
            var confirmBtn = document.getElementById('modal-confirm-btn');
            if (confirmBtn) confirmBtn.textContent = confirmText;
        }
    }

    function renderStages() {
        if (!GameState.state) return;
        _currentChapter = GameState.state.stageProgress.currentChapter;
        renderChapterList();
        renderStageMap(_currentChapter);
    }

    window._currentChapter = _currentChapter;
    window.renderStages = renderStages;
    window.renderStagesPage = renderStages;
    window.renderChapterList = renderChapterList;
    window.renderStageMap = renderStageMap;
    window.showStageDetail = showStageDetail;
    window.calculateEnemyPower = calculateEnemyPower;
})();
