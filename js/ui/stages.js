
(function () {
    var currentChapter = 1;

    window.renderStagesPage = function () {
        renderChapterList();
        renderStageMap();
    };

    function renderChapterList() {
        var container = document.getElementById('chapter-list');
        if (!container) return;

        var chapters = [];
        var seen = {};
        for (var i = 0; i < LEVELS.length; i++) {
            var level = LEVELS[i];
            if (!seen[level.chapter]) {
                seen[level.chapter] = true;
                chapters.push({ id: level.chapter, name: level.chapterName || ('第' + level.chapter + '章') });
            }
        }

        var progress = GameState.state.stageProgress;
        if (progress.currentChapter) {
            currentChapter = progress.currentChapter;
        }

        var html = '';
        for (var i = 0; i < chapters.length; i++) {
            var ch = chapters[i];
            var isActive = ch.id === currentChapter;
            html += '<button class="filter-btn' + (isActive ? ' active' : '') + '" data-chapter="' + ch.id + '">' + ch.name + '</button>';
        }
        container.innerHTML = html;

        var btns = container.querySelectorAll('.filter-btn');
        for (var i = 0; i < btns.length; i++) {
            btns[i].onclick = function () {
                currentChapter = parseInt(this.getAttribute('data-chapter'));
                for (var j = 0; j < btns.length; j++) btns[j].classList.remove('active');
                this.classList.add('active');
                renderStageMap();
            };
        }
    }

    function renderStageMap() {
        var container = document.getElementById('stage-map');
        if (!container) return;

        var stages = LEVELS.filter(function (s) { return s.chapter === currentChapter; });
        var cleared = GameState.state.stageProgress.cleared;

        if (stages.length === 0) {
            container.innerHTML = '<div style="text-align:center;color:#8b9dab;padding:40px;">暂无关卡</div>';
            return;
        }

        var html = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;padding:8px;">';

        for (var i = 0; i < stages.length; i++) {
            var stage = stages[i];
            var isCleared = !!cleared[stage.id];
            var isUnlocked = GameState.isStageUnlocked(stage.id);
            var enemies = stage.enemies || [];
            var bossName = enemies.length > 0 ? enemies[0].name : '未知';

            html += '<div class="stage-card" data-stage-id="' + stage.id + '" style="background:linear-gradient(180deg,#2a1a10,#1a0a05);border:2px solid ' + (isCleared ? '#2ecc71' : (isUnlocked ? '#d4a017' : '#555')) + ';border-radius:12px;padding:16px;cursor:' + (isUnlocked ? 'pointer' : 'default') + ';' + (!isUnlocked ? 'opacity:0.5;' : '') + '">';

            html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">';
            html += '<div style="color:#f5e6c8;font-weight:bold;">' + stage.stageName + '</div>';
            if (isCleared) {
                html += '<span style="color:#2ecc71;font-size:12px;">✅ 已通关</span>';
            } else if (isUnlocked) {
                html += '<span style="color:#d4a017;font-size:12px;">🔓 可挑战</span>';
            } else {
                html += '<span style="color:#555;font-size:12px;">🔒 未解锁</span>';
            }
            html += '</div>';

            html += '<div style="color:#8b9dab;font-size:12px;margin-bottom:4px;">首领：' + bossName + '</div>';
            html += '<div style="color:#d4a017;font-size:12px;margin-bottom:4px;">💰 ' + stage.baseReward + ' 金币</div>';

            if (isCleared) {
                html += '<button class="btn-ancient quick-clear-btn" data-stage-id="' + stage.id + '" style="padding:4px 12px;font-size:11px;background:linear-gradient(180deg,#1a3d1a,#0a2a0a);margin-top:8px;">⚡ 快速通关</button>';
            }

            html += '</div>';
        }

        html += '</div>';
        container.innerHTML = html;

        var stageCards = container.querySelectorAll('.stage-card');
        for (var i = 0; i < stageCards.length; i++) {
            stageCards[i].onclick = function (e) {
                if (e.target.tagName === 'BUTTON') return;
                var stageId = this.getAttribute('data-stage-id');
                var isUnlocked = GameState.isStageUnlocked(stageId);
                if (isUnlocked) {
                    showStageDetail(stageId);
                }
            };
        }

        var quickClearBtns = container.querySelectorAll('.quick-clear-btn');
        for (var i = 0; i < quickClearBtns.length; i++) {
            quickClearBtns[i].onclick = function (e) {
                e.stopPropagation();
                var stageId = this.getAttribute('data-stage-id');
                var result = GameState.quickClearStage(stageId);
                if (result.success) {
                    window.showToast('快速通关成功！获得 ' + result.reward.gold + ' 金币');
                    renderStageMap();
                    window.updateStatusBar();
                } else {
                    window.showToast(result.message);
                }
            };
        }
    }

    function showStageDetail(stageId) {
        var stage = LEVELS.find(function (s) { return s.id === stageId; });
        if (!stage) return;

        var isCleared = !!GameState.state.stageProgress.cleared[stageId];
        var enemies = stage.enemies || [];

        var html = '<div style="margin-bottom:16px;">';
        html += '<div style="font-size:20px;font-weight:bold;color:#f5e6c8;margin-bottom:8px;">' + stage.chapterName + ' · ' + stage.stageName + '</div>';
        html += '<div style="color:#d4a017;margin-bottom:8px;">💰 通关奖励：' + stage.baseReward + ' 金币</div>';
        if (isCleared) {
            html += '<div style="color:#2ecc71;margin-bottom:8px;">✅ 已通关 · 首通奖励已领取</div>';
        }
        html += '</div>';

        html += '<div style="margin-bottom:16px;">';
        html += '<div style="color:#8b9dab;font-size:14px;margin-bottom:8px;">敌方阵容：</div>';
        for (var i = 0; i < enemies.length; i++) {
            var enemy = enemies[i];
            var classData = CLASSES[enemy.classId];
            html += '<div style="display:flex;align-items:center;gap:8px;padding:6px;background:rgba(0,0,0,0.2);border-radius:6px;margin-bottom:4px;">';
            html += '<span style="font-size:20px;">' + (classData ? classData.icon : '?') + '</span>';
            html += '<span style="color:#f5e6c8;">' + enemy.name + '</span>';
            html += '<span style="color:#8b9dab;font-size:12px;">Lv.' + enemy.level + '</span>';
            html += '</div>';
        }
        html += '</div>';

        html += '<div style="display:flex;gap:8px;">';
        html += '<button class="btn-ancient" id="btn-start-battle" style="flex:1;">⚔️ 挑战</button>';
        if (isCleared) {
            html += '<button class="btn-ancient" id="btn-quick-clear" style="flex:1;background:linear-gradient(180deg,#1a3d1a,#0a2a0a);">⚡ 快速通关</button>';
        }
        html += '</div>';

        window.showModal(stage.chapterName + ' · ' + stage.stageName, html, null);

        setTimeout(function () {
            var battleBtn = document.getElementById('btn-start-battle');
            if (battleBtn) {
                battleBtn.onclick = function () {
                    window.hideModal();
                    window.startBattle(stageId);
                };
            }

            var quickBtn = document.getElementById('btn-quick-clear');
            if (quickBtn) {
                quickBtn.onclick = function () {
                    var result = GameState.quickClearStage(stageId);
                    if (result.success) {
                        window.hideModal();
                        window.showToast('快速通关成功！获得 ' + result.reward.gold + ' 金币');
                        renderStageMap();
                        window.updateStatusBar();
                    } else {
                        window.showToast(result.message);
                    }
                };
            }
        }, 50);
    }
})();
