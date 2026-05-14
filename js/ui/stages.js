const StagesUI = {
    container: null,
    currentChapter: 1,

    init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        this.render();
    },

    render() {
        if (!this.container) return;

        const chapters = this.getChapters();

        this.container.innerHTML = `
            <div class="stages-container">
                <div class="stages-header">
                    <h2>关卡</h2>
                    <div class="chapter-tabs" id="chapter-tabs"></div>
                </div>
                <div class="stages-grid" id="stages-grid"></div>
            </div>
        `;

        this.renderChapterTabs(chapters);
        this.renderStages();
    },

    getChapters() {
        const chapters = [];
        const progress = GameState.state.stageProgress;

        LEVELS.forEach(level => {
            if (!chapters.find(c => c.id === level.chapter)) {
                chapters.push({
                    id: level.chapter,
                    name: `第${level.chapter}章`
                });
            }
        });

        if (progress.currentChapter) {
            this.currentChapter = progress.currentChapter;
        }

        return chapters;
    },

    renderChapterTabs(chapters) {
        const tabsContainer = document.getElementById('chapter-tabs');
        if (!tabsContainer) return;

        tabsContainer.innerHTML = chapters.map(chapter => `
            <button class="chapter-tab ${chapter.id === this.currentChapter ? 'active' : ''}" data-chapter="${chapter.id}">
                ${chapter.name}
            </button>
        `).join('');

        tabsContainer.querySelectorAll('.chapter-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                tabsContainer.querySelectorAll('.chapter-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.currentChapter = parseInt(tab.dataset.chapter);
                this.renderStages();
            });
        });
    },

    renderStages() {
        const grid = document.getElementById('stages-grid');
        if (!grid) return;

        const chapterLevels = LEVELS.filter(l => l.chapter === this.currentChapter);

        grid.innerHTML = chapterLevels.map(level => {
            const isUnlocked = GameState.isStageUnlocked(level.id);
            const isCleared = GameState.state.stageProgress.cleared[level.id];
            const isFirstClear = GameState.state.firstClearBonus[level.id];

            let statusClass = 'locked';
            if (isCleared) statusClass = 'cleared';
            else if (isUnlocked) statusClass = 'available';

            let statusText = '未解锁';
            if (isCleared) statusText = '已通关';
            else if (isUnlocked) statusText = '可挑战';

            let stageName = level.name || level.id;
            if (level.story) {
                stageName = level.story;
            }

            return `
                <div class="stage-card ${statusClass}" data-stage-id="${level.id}">
                    <div class="stage-header">
                        <div class="stage-number">${level.id}</div>
                        <div class="stage-status">${statusText}</div>
                    </div>
                    <div class="stage-name">${stageName}</div>
                    <div class="stage-info">
                        <div class="enemy-preview">
                            ${level.enemies ? level.enemies.slice(0, 3).map(e => `<span class="enemy-icon">敌</span>`).join('') : ''}
                        </div>
                        <div class="stage-reward">
                            <span class="reward-icon">金</span>
                            <span class="reward-value">${level.baseReward}${isFirstClear ? '+200' : ''}</span>
                        </div>
                    </div>
                    ${isCleared ? `<button class="quick-clear-btn" data-stage-id="${level.id}">快速通关</button>` : ''}
                    ${isUnlocked && !isCleared ? `<button class="start-btn" data-stage-id="${level.id}">挑战</button>` : ''}
                </div>
            `;
        }).join('');

        grid.querySelectorAll('.start-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const stageId = btn.dataset.stageId;
                this.startStage(stageId);
            });
        });

        grid.querySelectorAll('.quick-clear-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const stageId = btn.dataset.stageId;
                this.quickClearStage(stageId);
            });
        });
    },

    startStage(stageId) {
        const stage = LEVELS.find(s => s.id === stageId);
        if (!stage) return;

        const formation = GameState.getFormation();
        if (!this.validateFormation(formation)) {
            alert('请先配置阵型，至少需要上阵一名英雄或主角');
            UIManager.showPanel('formation');
            return;
        }

        BattleUI.init('battle-panel');
        BattleUI.startBattle(formation, stage.enemies, stageId);
        UIManager.showPanel('battle');
    },

    quickClearStage(stageId) {
        const result = GameState.quickClearStage(stageId);
        if (!result.success) {
            alert(result.message);
            return;
        }

        const stage = LEVELS.find(s => s.id === stageId);
        let message = `快速通关成功！\n获得金币: ${result.reward.gold}`;
        if (stage && stage.taskCardId) {
            message += `\n获得任务卡: ${stage.taskCardId}`;
        }
        alert(message);
        this.renderStages();
    },

    validateFormation(formation) {
        if (!formation || !formation.slots) return false;

        const hasHero = formation.slots.some(id => id !== null);
        return true;
    }
};

window.StagesUI = StagesUI;
