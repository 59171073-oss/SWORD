(function () {
    var currentPage = 'city';

    var PAGE_MAP = {
        city: 'page-city',
        protagonist: 'page-protagonist',
        formation: 'page-formation',
        stages: 'page-stages',
        gacha: 'page-gacha',
        collection: 'page-collection',
        battle: 'page-battle'
    };

    window.switchPage = function (pageId) {
        var targetPage = PAGE_MAP[pageId];
        if (!targetPage) return;

        var pages = document.querySelectorAll('.page');
        pages.forEach(function (p) {
            p.classList.remove('active');
        });

        var targetEl = document.getElementById(targetPage);
        if (targetEl) {
            targetEl.classList.add('active');
            targetEl.style.animation = 'none';
            targetEl.offsetHeight;
            targetEl.style.animation = 'fadeIn 0.3s ease';
        }

        var navBtns = document.querySelectorAll('.nav-btn');
        navBtns.forEach(function (btn) {
            btn.classList.remove('active');
            if (btn.getAttribute('data-page') === pageId) {
                btn.classList.add('active');
            }
        });

        var statusBar = document.getElementById('status-bar');
        var navBar = document.getElementById('nav-bar');
        var mainContent = document.getElementById('main-content');

        if (pageId === 'battle') {
            statusBar.style.display = 'none';
            navBar.style.display = 'none';
            mainContent.style.marginTop = '0';
            mainContent.style.marginBottom = '0';
        } else {
            statusBar.style.display = '';
            navBar.style.display = '';
            mainContent.style.marginTop = '';
            mainContent.style.marginBottom = '';
        }

        currentPage = pageId;

        if (pageId === 'city') {
            renderCity();
        }
        if (pageId === 'gacha' && typeof window.renderGachaPage === 'function') {
            window.renderGachaPage();
        }
        if (pageId === 'formation' && typeof window.renderFormationPage === 'function') {
            window.renderFormationPage();
        }
        if (pageId === 'stages' && typeof window.renderStagesPage === 'function') {
            window.renderStagesPage();
        }
        if (pageId === 'collection' && typeof window.renderCollectionPage === 'function') {
            window.renderCollectionPage();
        }
        if (pageId === 'protagonist' && typeof window.renderProtagonistPage === 'function') {
            window.renderProtagonistPage();
        }
    };

    window.updateStatusBar = function () {
        if (!GameState.state) return;

        var goldDisplay = document.getElementById('gold-display');
        var chapterDisplay = document.getElementById('chapter-display');
        var stageDisplay = document.getElementById('stage-display');

        if (goldDisplay) {
            var oldGold = parseInt(goldDisplay.textContent) || 0;
            var newGold = GameState.state.gold;
            if (oldGold !== newGold) {
                animateNumber(goldDisplay, oldGold, newGold, 400);
            }
        }

        if (chapterDisplay) {
            chapterDisplay.textContent = GameState.state.stageProgress.currentChapter;
        }
        if (stageDisplay) {
            stageDisplay.textContent = GameState.state.stageProgress.currentStage;
        }
    };

    function animateNumber(el, from, to, duration) {
        var startTime = null;
        var diff = to - from;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = Math.floor(from + diff * eased);
            el.textContent = current;
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = to;
            }
        }

        requestAnimationFrame(step);
    }

    window.renderCity = function () {
        if (!GameState.state) return;

        var playerLevelEl = document.getElementById('player-level');
        var cardCountEl = document.getElementById('card-count');
        var teamPowerEl = document.getElementById('team-power');

        var collectionCount = Object.keys(GameState.state.collection).length;
        var teamPower = GameState.getTeamPower();

        if (playerLevelEl) {
            var maxLevel = 1;
            Object.values(GameState.state.collection).forEach(function (c) {
                if (c.type === 'hero' && c.level > maxLevel) maxLevel = c.level;
            });
            playerLevelEl.textContent = maxLevel;
        }
        if (cardCountEl) cardCountEl.textContent = collectionCount;
        if (teamPowerEl) teamPowerEl.textContent = teamPower;

        renderFormationThumbnails();
        renderDailyQuests();
    };

    function renderFormationThumbnails() {
        var existingThumbs = document.querySelector('.city-formation-thumbs');
        if (existingThumbs) existingThumbs.remove();

        var cityActions = document.querySelector('.city-actions');
        if (!cityActions) return;

        var container = document.createElement('div');
        container.className = 'city-formation-thumbs';
        container.style.cssText = 'display:flex;gap:8px;justify-content:center;margin:16px 0;padding:12px;background:var(--bg-card);border:1px solid var(--border-ancient);border-radius:var(--radius-md);';

        var formation = GameState.state.formation;
        var slotLabels = ['先锋', '左翼', '中军', '右翼', '殿后'];

        var protStats = GameState.getProtagonistStats();
        if (protStats) {
            var protSlot = document.createElement('div');
            protSlot.style.cssText = 'width:56px;text-align:center;cursor:pointer;';
            protSlot.innerHTML =
                '<div style="width:56px;height:56px;border-radius:var(--radius-sm);background:rgba(139,115,85,0.1);border:2px solid var(--gold);display:flex;align-items:center;justify-content:center;font-size:28px;margin-bottom:4px;box-shadow:0 0 8px rgba(212,160,23,0.3);">⚔️</div>' +
                '<div style="font-size:10px;color:var(--gold);white-space:nowrap;">少侠</div>' +
                '<div style="font-size:9px;color:var(--cyan-gray);">Lv.' + protStats.level + '</div>';
            protSlot.addEventListener('click', function () {
                switchPage('protagonist');
            });
            container.appendChild(protSlot);
        }

        formation.slots.forEach(function (heroId, index) {
            var slot = document.createElement('div');
            slot.style.cssText = 'width:56px;text-align:center;cursor:pointer;';

            if (heroId) {
                var cardData = CHARACTER_CARDS.find(function (c) { return c.id === heroId; });
                var heroEntry = GameState.state.collection[heroId];
                if (cardData) {
                    var classInfo = CLASSES[cardData.classId];
                    slot.innerHTML =
                        '<div style="width:56px;height:56px;border-radius:var(--radius-sm);background:rgba(139,115,85,0.1);border:1px solid var(--border-ancient);display:flex;align-items:center;justify-content:center;font-size:28px;margin-bottom:4px;">' +
                        (classInfo ? classInfo.icon : '❓') +
                        '</div>' +
                        '<div style="font-size:10px;color:var(--parchment);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + cardData.name + '</div>' +
                        '<div style="font-size:9px;color:var(--cyan-gray);">Lv.' + (heroEntry ? heroEntry.level : 1) + '</div>';

                    var rarityColors = { COMMON: '#cccccc', FINE: '#2ecc71', RARE: '#3498db', LEGEND: '#9b59b6' };
                    slot.querySelector('div').style.borderColor = rarityColors[cardData.rarity] || 'var(--border-ancient)';
                }
            } else {
                slot.innerHTML =
                    '<div style="width:56px;height:56px;border-radius:var(--radius-sm);border:1px dashed var(--border-ancient);display:flex;align-items:center;justify-content:center;color:var(--cyan-gray);font-size:11px;margin-bottom:4px;">' + slotLabels[index] + '</div>' +
                    '<div style="font-size:10px;color:var(--cyan-gray);">空位</div>';
            }

            slot.addEventListener('click', function () {
                switchPage('formation');
            });
            container.appendChild(slot);
        });

        cityActions.parentNode.insertBefore(container, cityActions);
    }

    function renderDailyQuests() {
        var dailyContainer = document.getElementById('daily-quests');
        if (!dailyContainer) return;

        dailyContainer.innerHTML = '';

        var progress = GameState.state.stageProgress;
        var currentChapter = progress.currentChapter;
        var currentStageIndex = 0;

        var chapterStages = LEVELS.filter(function (s) { return s.chapter === currentChapter; });
        chapterStages.forEach(function (s, i) {
            if (progress.cleared[s.id]) currentStageIndex = i;
        });

        var displayStages = chapterStages.slice(Math.max(0, currentStageIndex), currentStageIndex + 3);

        if (displayStages.length === 0) {
            dailyContainer.innerHTML = '<div class="empty-state" style="padding:20px;">暂无悬赏</div>';
            return;
        }

        displayStages.forEach(function (stage) {
            var isCleared = !!progress.cleared[stage.id];
            var isCurrent = !isCleared;

            var questEl = document.createElement('div');
            questEl.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:10px 12px;margin-bottom:8px;background:rgba(0,0,0,0.2);border-radius:var(--radius-sm);border-left:3px solid ' + (isCleared ? 'var(--jade)' : 'var(--gold)') + ';';

            var stageInChapter = chapterStages.indexOf(stage) + 1;
            questEl.innerHTML =
                '<div>' +
                '<div style="font-size:13px;color:var(--parchment);">' + stage.stageName + '</div>' +
                '<div style="font-size:11px;color:var(--gold);">💰 ' + stage.baseReward + '</div>' +
                '</div>' +
                '<div style="font-size:12px;color:' + (isCleared ? 'var(--jade)' : 'var(--gold)') + ';">' +
                (isCleared ? '✅ 已通关' : '⚔️ 可挑战') +
                '</div>';

            if (isCurrent) {
                questEl.style.cursor = 'pointer';
                questEl.addEventListener('click', function () {
                    switchPage('stages');
                });
            }

            dailyContainer.appendChild(questEl);
        });

        var resetBtn = document.createElement('button');
        resetBtn.className = 'btn-ancient';
        resetBtn.style.cssText = 'width:100%;margin-top:12px;padding:8px;font-size:12px;background:linear-gradient(180deg,#3d1a1a,#2a1010);';
        resetBtn.textContent = '重置江湖';
        resetBtn.addEventListener('click', function () {
            showModal(
                '重置江湖',
                '<div class="confirm-dialog"><p class="confirm-message">少侠确定要重置江湖吗？<br>所有进度、卡牌、金币将全部清除，<br>此操作不可撤销！</p></div>',
                function () {
                    GameState.resetGame();
                    updateStatusBar();
                    renderCity();
                    showToast('江湖已重置，少侠重新出发！');
                }
            );
        });
        dailyContainer.appendChild(resetBtn);
    }

    window.showModal = function (title, content, onConfirm) {
        var overlay = document.getElementById('modal-overlay');
        var modalContent = document.getElementById('modal-content');
        if (!overlay || !modalContent) return;

        var html =
            '<div class="modal-title">' + title + '</div>' +
            '<button class="modal-close" id="modal-close-btn">✕</button>' +
            '<div class="modal-body">' + content + '</div>';

        if (onConfirm) {
            html +=
                '<div class="modal-actions">' +
                '<button class="btn-ancient" id="modal-cancel-btn">取消</button>' +
                '<button class="btn-ancient" id="modal-confirm-btn" style="background:linear-gradient(180deg,#8b1a1a,#5c1010);">确认</button>' +
                '</div>';
        }

        modalContent.innerHTML = html;
        overlay.style.display = 'flex';

        var closeBtn = document.getElementById('modal-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', function () {
                hideModal();
            });
        }

        var cancelBtn = document.getElementById('modal-cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function () {
                hideModal();
            });
        }

        var confirmBtn = document.getElementById('modal-confirm-btn');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', function () {
                if (typeof onConfirm === 'function') onConfirm();
                hideModal();
            });
        }

        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) hideModal();
        });
    };

    window.hideModal = function () {
        var overlay = document.getElementById('modal-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    };

    window.showFloatingText = function (text, type, x, y) {
        var container = document.getElementById('float-text-container');
        if (!container) return;

        var colorMap = {
            damage: 'var(--vermilion)',
            heal: 'var(--jade)',
            gold: 'var(--gold)',
            levelup: 'var(--purple)'
        };

        var el = document.createElement('div');
        el.className = 'float-text';
        el.textContent = text;
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        el.style.color = colorMap[type] || 'var(--parchment)';

        if (type === 'gold') {
            el.style.fontSize = '16px';
        } else if (type === 'levelup') {
            el.style.fontSize = '22px';
        }

        container.appendChild(el);

        setTimeout(function () {
            if (el.parentNode) el.parentNode.removeChild(el);
        }, 1000);
    };

    window.showToast = function (message, duration) {
        var existing = document.querySelector('.toast');
        if (existing) existing.remove();

        var toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;

        document.body.appendChild(toast);

        var dur = duration || 2300;
        setTimeout(function () {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, dur);
    };

    window.initMain = function () {
        var navBtns = document.querySelectorAll('.nav-btn');
        navBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var page = btn.getAttribute('data-page');
                if (page) switchPage(page);
            });
        });

        var actionBtns = document.querySelectorAll('.city-actions .btn-ancient');
        actionBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var nav = btn.getAttribute('data-nav');
                if (nav) switchPage(nav);
            });
        });

        var protActionBtns = document.querySelectorAll('.protagonist-actions .btn-ancient');
        protActionBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var nav = btn.getAttribute('data-nav');
                if (nav) switchPage(nav);
            });
        });

        renderCity();
        updateStatusBar();
    };


})();
