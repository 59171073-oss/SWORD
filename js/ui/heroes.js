
(function () {
    window.renderHeroes = function () {
        const container = document.getElementById('heroes-list');
        if (!container) return;

        container.innerHTML = renderHeroCards();
        bindCardEvents();
    };

    function renderHeroCards() {
        const heroes = GameState.getCollectionByType('hero');
        if (heroes.length === 0) {
            return '&lt;div style="text-align:center;color:var(--cyan-gray);padding:40px;"&gt;暂无侠客，去酒馆招募吧！&lt;/div&gt;';
        }

        return `
            &lt;div class="heroes-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:16px;padding:16px;"&gt;
                ${heroes.map(hero =&gt; {
                    const cardData = CHARACTER_CARDS.find(c =&gt; c.id === hero.id);
                    const rarityData = cardData ? RARITY[cardData.rarity] : null;
                    const classData = cardData ? CLASSES[cardData.classId] : null;

                    return `
                        &lt;div class="hero-card" data-hero-id="${hero.id}" 
                             style="background:linear-gradient(180deg,#2a1a10,#1a0a05);border:2px solid ${rarityData ? rarityData.color : 'var(--border-ancient)'} ;border-radius:12px;padding:12px;cursor:pointer;transition:transform 0.3s,box-shadow 0.3s;"
                             onmouseover="this.style.transform='translateY(-4px) scale(1.02)';this.style.boxShadow='0 8px 24px ${rarityData ? rarityData.color : 'var(--gold)'}40';"
                             onmouseout="this.style.transform='';this.style.boxShadow='';"&gt;
                            &lt;div class="hero-image-container" style="width:100%;height:160px;background:rgba(0,0,0,0.3);border-radius:8px;overflow:hidden;margin-bottom:12px;"&gt;
                                ${cardData &amp;&amp; cardData.imageUrl ? 
                                    `&lt;img src="${cardData.imageUrl}" alt="${cardData.name}" 
                                          style="width:100%;height:100%;object-fit:cover;display:block;"
                                          onerror="this.style.display='none'";this.parentElement.innerHTML='&lt;div style=\\'width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:var(--cyan-gray);font-size:48px;\\'&gt;${classData ? classData.icon : '?'}&lt;/div&gt;';"&gt;` :
                                    `&lt;div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:var(--cyan-gray);font-size:48px;"&gt;${classData ? classData.icon : '?'}&lt;/div&gt;`
                                }
                            &lt;/div&gt;
                            &lt;div class="card-rarity" style="color:${rarityData ? rarityData.color : 'var(--cyan-gray)'} ;font-size:12px;font-weight:bold;text-align:center;margin-bottom:4px;"&gt;${rarityData ? rarityData.name : ''}&lt;/div&gt;
                            &lt;div class="card-name" style="color:var(--parchment);font-size:16px;font-weight:bold;text-align:center;margin-bottom:4px;"&gt;${cardData ? cardData.name : hero.id}&lt;/div&gt;
                            &lt;div class="card-level" style="color:var(--cyan-gray);font-size:12px;text-align:center;"&gt;Lv.${hero.level}&lt;/div&gt;
                            &lt;div class="card-count" style="color:var(--gold);font-size:11px;text-align:center;margin-top:4px;"&gt;x${hero.count}&lt;/div&gt;
                        &lt;/div&gt;
                    `;
                }).join('')}
            &lt;/div&gt;
        `;
    }

    function bindCardEvents() {
        const cards = document.querySelectorAll('.hero-card');
        cards.forEach(card =&gt; {
            card.addEventListener('click', function () {
                const heroId = this.getAttribute('data-hero-id');
                showHeroDetail(heroId);
            });
        });
    }

    function showHeroDetail(heroId) {
        const heroEntry = GameState.state.collection[heroId];
        const cardData = CHARACTER_CARDS.find(c =&gt; c.id === heroId);
        if (!cardData) return;

        const rarityData = RARITY[cardData.rarity];
        const classData = CLASSES[cardData.classId];
        const stats = GameState.getHeroStats(heroId, GameState.state.formation);

        const overlay = document.createElement('div');
        overlay.className = 'hero-detail-overlay';
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.95);display:flex;align-items:center;justify-content:center;z-index:2000;padding:20px;';

        let cgImageUrl = cardData.imageUrl;
        if (!cgImageUrl) {
            const prompt = cardData.isHealer ? 
                `beautiful%20chinese%20maiden%20healer%20in%20traditional%20robes%2C%20wuxia%20style%2C%20full%20body%2C%20elegant%20pose` :
                `chinese%20wuxia%20warrior%20in%20traditional%20armor%2C%20heroic%20pose%2C%20full%20body%20portrait`;
            cgImageUrl = `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${prompt}&amp;image_size=portrait_16_9`;
        }

        overlay.innerHTML = `
            &lt;div class="hero-detail-modal" style="background:linear-gradient(180deg,#2a1a10,#1a0a05);border:2px solid ${rarityData.color};border-radius:16px;max-width:900px;width:100%;max-height:90vh;overflow:auto;padding:0;position:relative;"&gt;
                &lt;button class="detail-close-btn" id="detail-close-btn" style="position:absolute;top:12px;right:12px;width:40px;height:40px;border-radius:50%;background:rgba(0,0,0,0.5);border:2px solid var(--cyan-gray);color:var(--cyan-gray);font-size:20px;cursor:pointer;z-index:10;"&gt;✕&lt;/button&gt;
                
                &lt;div class="hero-cg-container" style="width:100%;height:400px;background:linear-gradient(180deg,#1a0a05,#0a0503);position:relative;overflow:hidden;"&gt;
                    &lt;div class="hero-cg-image" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;"&gt;
                        &lt;img src="${cgImageUrl}" alt="${cardData.name}" 
                             style="max-width:100%;max-height:100%;object-fit:contain;display:block;"
                             onerror="this.style.display='none';this.parentElement.innerHTML='&lt;div style=\\'font-size:120px;color:${rarityData.color};\\'&gt;${classData ? classData.icon : '?'}&lt;/div&gt;';"&gt;
                    &lt;/div&gt;
                    &lt;div class="hero-cg-overlay" style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,#0a0503);height:150px;pointer-events:none;"&gt;&lt;/div&gt;
                &lt;/div&gt;

                &lt;div class="hero-detail-content" style="padding:24px;"&gt;
                    &lt;div class="hero-header" style="display:flex;align-items:center;gap:16px;margin-bottom:24px;"&gt;
                        &lt;div class="hero-rarity-badge" style="width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,${rarityData.color},${rarityData.color}60);display:flex;align-items:center;justify-content:center;font-size:32px;box-shadow:0 0 20px ${rarityData.color}60;"&gt;
                            ${classData ? classData.icon : '?'}
                        &lt;/div&gt;
                        &lt;div class="hero-info"&gt;
                            &lt;div class="hero-name" style="font-size:28px;font-weight:bold;color:var(--parchment);margin-bottom:4px;"&gt;${cardData.name}&lt;/div&gt;
                            &lt;div class="hero-meta" style="display:flex;gap:12px;color:var(--cyan-gray);font-size:14px;"&gt;
                                &lt;span style="color:${rarityData.color};"&gt;${rarityData.name}&lt;/span&gt;
                                &lt;span&gt;${classData ? classData.name : '未知'}&lt;/span&gt;
                                &lt;span&gt;Lv.${heroEntry.level}&lt;/span&gt;
                                &lt;span&gt;${cardData.element}属性&lt;/span&gt;
                            &lt;/div&gt;
                        &lt;/div&gt;
                    &lt;/div&gt;

                    &lt;div class="hero-description" style="background:rgba(0,0,0,0.3);padding:16px;border-radius:8px;margin-bottom:24px;"&gt;
                        &lt;div style="color:var(--gold);font-size:14px;margin-bottom:8px;"&gt;📜 人物故事&lt;/div&gt;
                        &lt;div style="color:var(--cyan-gray);line-height:1.6;"&gt;${cardData.description}&lt;/div&gt;
                    &lt;/div&gt;

                    &lt;div class="hero-stats" style="display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-bottom:24px;"&gt;
                        &lt;div class="stat-box" style="background:rgba(0,0,0,0.3);padding:16px;border-radius:8px;border-left:3px solid var(--vermilion);"&gt;
                            &lt;div style="color:var(--cyan-gray);font-size:12px;margin-bottom:4px;"&gt;❤️ 生命&lt;/div&gt;
                            &lt;div style="color:var(--parchment);font-size:24px;font-weight:bold;"&gt;${stats.hp}&lt;/div&gt;
                        &lt;/div&gt;
                        &lt;div class="stat-box" style="background:rgba(0,0,0,0.3);padding:16px;border-radius:8px;border-left:3px solid var(--azure);"&gt;
                            &lt;div style="color:var(--cyan-gray);font-size:12px;margin-bottom:4px;"&gt;⚔️ 攻击&lt;/div&gt;
                            &lt;div style="color:var(--parchment);font-size:24px;font-weight:bold;"&gt;${stats.atk}&lt;/div&gt;
                        &lt;/div&gt;
                        &lt;div class="stat-box" style="background:rgba(0,0,0,0.3);padding:16px;border-radius:8px;border-left:3px solid var(--jade);"&gt;
                            &lt;div style="color:var(--cyan-gray);font-size:12px;margin-bottom:4px;"&gt;🛡️ 防御&lt;/div&gt;
                            &lt;div style="color:var(--parchment);font-size:24px;font-weight:bold;"&gt;${stats.def}&lt;/div&gt;
                        &lt;/div&gt;
                        &lt;div class="stat-box" style="background:rgba(0,0,0,0.3);padding:16px;border-radius:8px;border-left:3px solid var(--purple);"&gt;
                            &lt;div style="color:var(--cyan-gray);font-size:12px;margin-bottom:4px;"&gt;💨 身法&lt;/div&gt;
                            &lt;div style="color:var(--parchment);font-size:24px;font-weight:bold;"&gt;${stats.agi}&lt;/div&gt;
                        &lt;/div&gt;
                    &lt;/div&gt;

                    ${cardData.innateSkill ? `
                    &lt;div class="hero-innate" style="background:linear-gradient(135deg,rgba(155,89,182,0.2),rgba(155,89,182,0.05));padding:20px;border-radius:12px;border:1px solid rgba(155,89,182,0.3);"&gt;
                        &lt;div style="color:var(--purple);font-size:14px;margin-bottom:12px;display:flex;align-items:center;gap:8px;"&gt;
                            &lt;span style="font-size:20px;"&gt;✨&lt;/span&gt;
                            &lt;span style="font-weight:bold;"&gt;先天技能&lt;/span&gt;
                        &lt;/div&gt;
                        &lt;div style="color:var(--parchment);font-size:18px;font-weight:bold;margin-bottom:8px;"&gt;${cardData.innateSkill.name}&lt;/div&gt;
                        &lt;div style="color:var(--cyan-gray);line-height:1.6;"&gt;${cardData.innateSkill.description}&lt;/div&gt;
                    &lt;/div&gt;
                    ` : ''}
                &lt;/div&gt;
            &lt;/div&gt;
        `;

        document.body.appendChild(overlay);

        document.getElementById('detail-close-btn').addEventListener('click', function () {
            overlay.remove();
        });

        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) overlay.remove();
        });
    }
})();
