const LEVELS = [
    {
        id: 'stage_1_1',
        chapter: 1,
        chapterName: '江湖初入',
        stageName: '山贼来袭',
        enemies: [
            { name: '山贼甲', classId: 'QUANSHI', element: '金', rarity: 'COMMON', level: 1, stats: { hp: 400, atk: 40, def: 30, agi: 50 } },
            { name: '山贼乙', classId: 'QUANSHI', element: '火', rarity: 'COMMON', level: 1, stats: { hp: 350, atk: 35, def: 25, agi: 45 } },
            { name: '山贼丙', classId: 'QUANSHI', element: '土', rarity: 'COMMON', level: 1, stats: { hp: 450, atk: 30, def: 40, agi: 35 } }
        ],
        baseReward: 50,
        taskCardId: 'task_001'
    },
    {
        id: 'stage_1_2',
        chapter: 1,
        chapterName: '江湖初入',
        stageName: '恶霸拦路',
        enemies: [
            { name: '恶霸头目', classId: 'DAOKE', element: '金', rarity: 'COMMON', level: 2, stats: { hp: 600, atk: 55, def: 45, agi: 50 } },
            { name: '恶霸打手', classId: 'QUANSHI', element: '土', rarity: 'COMMON', level: 2, stats: { hp: 700, atk: 45, def: 55, agi: 40 } },
            { name: '恶霸喽啰', classId: 'QUANSHI', element: '火', rarity: 'COMMON', level: 2, stats: { hp: 400, atk: 50, def: 30, agi: 55 } }
        ],
        baseReward: 60
    },
    {
        id: 'stage_1_3',
        chapter: 1,
        chapterName: '江湖初入',
        stageName: '黑风寨',
        enemies: [
            { name: '寨门守卫', classId: 'QUANSHI', element: '土', rarity: 'COMMON', level: 3, stats: { hp: 800, atk: 50, def: 60, agi: 40 } },
            { name: '寨中刀手', classId: 'DAOKE', element: '金', rarity: 'FINE', level: 3, stats: { hp: 750, atk: 75, def: 50, agi: 55 } },
            { name: '寨中剑手', classId: 'JIANKE', element: '水', rarity: 'COMMON', level: 3, stats: { hp: 600, atk: 65, def: 35, agi: 65 } },
            { name: '寨中暗手', classId: 'ANQISHI', element: '火', rarity: 'FINE', level: 3, stats: { hp: 500, atk: 70, def: 30, agi: 80 } }
        ],
        baseReward: 70,
        taskCardId: 'task_005'
    },
    {
        id: 'stage_1_4',
        chapter: 1,
        chapterName: '江湖初入',
        stageName: '毒蛇谷',
        enemies: [
            { name: '蛇谷守卫', classId: 'QUANSHI', element: '土', rarity: 'FINE', level: 4, stats: { hp: 1000, atk: 60, def: 70, agi: 45 } },
            { name: '蛇谷刺客', classId: 'ANQISHI', element: '木', rarity: 'FINE', level: 4, stats: { hp: 650, atk: 80, def: 35, agi: 90 } },
            { name: '蛇谷剑客', classId: 'JIANKE', element: '水', rarity: 'FINE', level: 4, stats: { hp: 800, atk: 85, def: 45, agi: 70 } },
            { name: '蛇谷术士', classId: 'ZHENFASHI', element: '火', rarity: 'FINE', level: 4, stats: { hp: 750, atk: 70, def: 55, agi: 55 } },
            { name: '蛇谷医者', classId: 'YIZHE', element: '木', rarity: 'COMMON', level: 4, stats: { hp: 700, atk: 50, def: 50, agi: 50 } }
        ],
        baseReward: 80
    },
    {
        id: 'stage_1_5',
        chapter: 1,
        chapterName: '江湖初入',
        stageName: '山寨头目',
        enemies: [
            { name: '头目·赤炎', classId: 'DAOKE', element: '火', rarity: 'RARE', level: 5, stats: { hp: 1200, atk: 100, def: 70, agi: 65 } },
            { name: '头目护卫', classId: 'QUANSHI', element: '土', rarity: 'FINE', level: 5, stats: { hp: 1100, atk: 65, def: 80, agi: 50 } },
            { name: '头目剑客', classId: 'JIANKE', element: '金', rarity: 'FINE', level: 5, stats: { hp: 900, atk: 90, def: 50, agi: 75 } },
            { name: '头目暗手', classId: 'ANQISHI', element: '木', rarity: 'FINE', level: 5, stats: { hp: 700, atk: 85, def: 40, agi: 95 } },
            { name: '头目军师', classId: 'ZHENFASHI', element: '水', rarity: 'FINE', level: 5, stats: { hp: 850, atk: 75, def: 65, agi: 60 } }
        ],
        baseReward: 90,
        taskCardId: 'task_002'
    },
    {
        id: 'stage_1_6',
        chapter: 1,
        chapterName: '江湖初入',
        stageName: '荒村鬼影',
        enemies: [
            { name: '游魂剑客', classId: 'JIANKE', element: '水', rarity: 'FINE', level: 5, stats: { hp: 850, atk: 95, def: 45, agi: 80 } },
            { name: '荒村尸傀', classId: 'QUANSHI', element: '土', rarity: 'COMMON', level: 5, stats: { hp: 1200, atk: 55, def: 75, agi: 30 } },
            { name: '怨灵术士', classId: 'ZHENFASHI', element: '火', rarity: 'FINE', level: 5, stats: { hp: 750, atk: 80, def: 50, agi: 65 } },
            { name: '鬼医·冥蝶', classId: 'YIZHE', element: '木', rarity: 'FINE', level: 5, stats: { hp: 900, atk: 60, def: 55, agi: 70 } }
        ],
        baseReward: 95
    },
    {
        id: 'stage_1_7',
        chapter: 1,
        chapterName: '江湖初入',
        stageName: '渡口风云',
        enemies: [
            { name: '水匪首领', classId: 'DAOKE', element: '水', rarity: 'RARE', level: 6, stats: { hp: 1400, atk: 110, def: 75, agi: 70 } },
            { name: '水匪刀手', classId: 'DAOKE', element: '水', rarity: 'FINE', level: 6, stats: { hp: 1000, atk: 85, def: 60, agi: 60 } },
            { name: '水匪暗哨', classId: 'ANQISHI', element: '木', rarity: 'FINE', level: 6, stats: { hp: 750, atk: 90, def: 40, agi: 100 } },
            { name: '水匪拳手', classId: 'QUANSHI', element: '土', rarity: 'FINE', level: 6, stats: { hp: 1300, atk: 70, def: 85, agi: 45 } },
            { name: '水匪军师', classId: 'ZHENFASHI', element: '火', rarity: 'FINE', level: 6, stats: { hp: 900, atk: 80, def: 60, agi: 65 } }
        ],
        baseReward: 100,
        taskCardId: 'task_005'
    },
    {
        id: 'stage_2_1',
        chapter: 2,
        chapterName: '名震一方',
        stageName: '武林大会·初赛',
        enemies: [
            { name: '青云剑客', classId: 'JIANKE', element: '水', rarity: 'FINE', level: 6, stats: { hp: 1000, atk: 100, def: 55, agi: 85 } },
            { name: '烈焰刀客', classId: 'DAOKE', element: '火', rarity: 'FINE', level: 6, stats: { hp: 1100, atk: 90, def: 75, agi: 60 } },
            { name: '铁壁拳师', classId: 'QUANSHI', element: '金', rarity: 'FINE', level: 6, stats: { hp: 1400, atk: 70, def: 90, agi: 50 } },
            { name: '追风暗器', classId: 'ANQISHI', element: '木', rarity: 'FINE', level: 6, stats: { hp: 800, atk: 85, def: 40, agi: 110 } },
            { name: '灵丹医者', classId: 'YIZHE', element: '木', rarity: 'FINE', level: 6, stats: { hp: 1000, atk: 60, def: 60, agi: 65 } }
        ],
        baseReward: 100,
        taskCardId: 'task_001'
    },
    {
        id: 'stage_2_2',
        chapter: 2,
        chapterName: '名震一方',
        stageName: '武林大会·复赛',
        enemies: [
            { name: '紫电剑客', classId: 'JIANKE', element: '金', rarity: 'RARE', level: 7, stats: { hp: 1300, atk: 130, def: 65, agi: 105 } },
            { name: '破军刀客', classId: 'DAOKE', element: '土', rarity: 'FINE', level: 7, stats: { hp: 1200, atk: 100, def: 85, agi: 65 } },
            { name: '金刚拳师', classId: 'QUANSHI', element: '土', rarity: 'RARE', level: 7, stats: { hp: 1800, atk: 90, def: 110, agi: 55 } },
            { name: '幻影暗器', classId: 'ANQISHI', element: '水', rarity: 'FINE', level: 7, stats: { hp: 900, atk: 95, def: 45, agi: 120 } },
            { name: '天机阵师', classId: 'ZHENFASHI', element: '火', rarity: 'FINE', level: 7, stats: { hp: 1100, atk: 85, def: 75, agi: 70 } }
        ],
        baseReward: 110
    },
    {
        id: 'stage_2_3',
        chapter: 2,
        chapterName: '名震一方',
        stageName: '暗夜追杀',
        enemies: [
            { name: '暗夜剑影', classId: 'JIANKE', element: '水', rarity: 'RARE', level: 8, stats: { hp: 1400, atk: 140, def: 70, agi: 115 } },
            { name: '暗夜刀煞', classId: 'DAOKE', element: '金', rarity: 'RARE', level: 8, stats: { hp: 1600, atk: 125, def: 100, agi: 80 } },
            { name: '暗夜铁拳', classId: 'QUANSHI', element: '土', rarity: 'RARE', level: 8, stats: { hp: 2000, atk: 95, def: 120, agi: 60 } },
            { name: '暗夜毒针', classId: 'ANQISHI', element: '木', rarity: 'RARE', level: 8, stats: { hp: 1100, atk: 120, def: 55, agi: 140 } },
            { name: '暗夜咒师', classId: 'ZHENFASHI', element: '火', rarity: 'RARE', level: 8, stats: { hp: 1400, atk: 105, def: 90, agi: 85 } }
        ],
        baseReward: 120,
        taskCardId: 'task_005'
    },
    {
        id: 'stage_2_4',
        chapter: 2,
        chapterName: '名震一方',
        stageName: '邪教分坛',
        enemies: [
            { name: '邪教护法·剑', classId: 'JIANKE', element: '火', rarity: 'RARE', level: 9, stats: { hp: 1500, atk: 150, def: 75, agi: 120 } },
            { name: '邪教护法·刀', classId: 'DAOKE', element: '土', rarity: 'RARE', level: 9, stats: { hp: 1700, atk: 135, def: 110, agi: 85 } },
            { name: '邪教护法·拳', classId: 'QUANSHI', element: '金', rarity: 'RARE', level: 9, stats: { hp: 2200, atk: 100, def: 130, agi: 65 } },
            { name: '邪教暗杀者', classId: 'ANQISHI', element: '水', rarity: 'RARE', level: 9, stats: { hp: 1200, atk: 130, def: 60, agi: 150 } },
            { name: '邪教巫医', classId: 'YIZHE', element: '木', rarity: 'RARE', level: 9, stats: { hp: 1600, atk: 90, def: 90, agi: 95 } }
        ],
        baseReward: 130
    },
    {
        id: 'stage_2_5',
        chapter: 2,
        chapterName: '名震一方',
        stageName: '分坛坛主',
        enemies: [
            { name: '坛主·血手', classId: 'DAOKE', element: '火', rarity: 'LEGEND', level: 10, stats: { hp: 2000, atk: 180, def: 130, agi: 100 } },
            { name: '坛主亲信', classId: 'JIANKE', element: '金', rarity: 'RARE', level: 10, stats: { hp: 1600, atk: 155, def: 80, agi: 125 } },
            { name: '坛主护卫', classId: 'QUANSHI', element: '土', rarity: 'RARE', level: 10, stats: { hp: 2400, atk: 110, def: 150, agi: 70 } },
            { name: '坛主暗卫', classId: 'ANQISHI', element: '木', rarity: 'RARE', level: 10, stats: { hp: 1300, atk: 140, def: 65, agi: 160 } },
            { name: '坛主军师', classId: 'ZHENFASHI', element: '水', rarity: 'RARE', level: 10, stats: { hp: 1700, atk: 120, def: 105, agi: 90 } }
        ],
        baseReward: 140,
        taskCardId: 'task_003'
    },
    {
        id: 'stage_2_6',
        chapter: 2,
        chapterName: '名震一方',
        stageName: '寒潭秘境',
        enemies: [
            { name: '寒潭剑仙', classId: 'JIANKE', element: '水', rarity: 'RARE', level: 10, stats: { hp: 1700, atk: 160, def: 80, agi: 130 } },
            { name: '冰魄阵师', classId: 'ZHENFASHI', element: '水', rarity: 'RARE', level: 10, stats: { hp: 1500, atk: 130, def: 100, agi: 95 } },
            { name: '寒潭守灵', classId: 'QUANSHI', element: '水', rarity: 'RARE', level: 10, stats: { hp: 2500, atk: 105, def: 140, agi: 65 } },
            { name: '霜华医者', classId: 'YIZHE', element: '水', rarity: 'FINE', level: 10, stats: { hp: 1400, atk: 85, def: 80, agi: 80 } }
        ],
        baseReward: 145
    },
    {
        id: 'stage_2_7',
        chapter: 2,
        chapterName: '名震一方',
        stageName: '血衣楼',
        enemies: [
            { name: '楼主·血衣', classId: 'JIANKE', element: '火', rarity: 'LEGEND', level: 11, stats: { hp: 2200, atk: 190, def: 100, agi: 140 } },
            { name: '血衣杀手', classId: 'ANQISHI', element: '火', rarity: 'RARE', level: 11, stats: { hp: 1400, atk: 150, def: 60, agi: 165 } },
            { name: '血衣刀卫', classId: 'DAOKE', element: '金', rarity: 'RARE', level: 11, stats: { hp: 1900, atk: 140, def: 115, agi: 90 } },
            { name: '血衣拳卫', classId: 'QUANSHI', element: '土', rarity: 'RARE', level: 11, stats: { hp: 2600, atk: 110, def: 155, agi: 70 } },
            { name: '血衣毒医', classId: 'YIZHE', element: '木', rarity: 'RARE', level: 11, stats: { hp: 1800, atk: 100, def: 95, agi: 100 } }
        ],
        baseReward: 150,
        taskCardId: 'task_004'
    },
    {
        id: 'stage_3_1',
        chapter: 3,
        chapterName: '天下无双',
        stageName: '魔教总坛·外围',
        enemies: [
            { name: '魔教守卫', classId: 'QUANSHI', element: '土', rarity: 'RARE', level: 11, stats: { hp: 2600, atk: 120, def: 140, agi: 75 } },
            { name: '魔教剑士', classId: 'JIANKE', element: '金', rarity: 'RARE', level: 11, stats: { hp: 1800, atk: 170, def: 85, agi: 130 } },
            { name: '魔教刀客', classId: 'DAOKE', element: '火', rarity: 'RARE', level: 11, stats: { hp: 2000, atk: 155, def: 120, agi: 95 } },
            { name: '魔教暗卫', classId: 'ANQISHI', element: '水', rarity: 'RARE', level: 11, stats: { hp: 1500, atk: 145, def: 70, agi: 170 } },
            { name: '魔教医师', classId: 'YIZHE', element: '木', rarity: 'RARE', level: 11, stats: { hp: 1900, atk: 100, def: 100, agi: 100 } }
        ],
        baseReward: 150,
        taskCardId: 'task_001'
    },
    {
        id: 'stage_3_2',
        chapter: 3,
        chapterName: '天下无双',
        stageName: '魔教总坛·内殿',
        enemies: [
            { name: '内殿守卫', classId: 'QUANSHI', element: '金', rarity: 'LEGEND', level: 12, stats: { hp: 3200, atk: 150, def: 180, agi: 95 } },
            { name: '内殿剑使', classId: 'JIANKE', element: '水', rarity: 'LEGEND', level: 12, stats: { hp: 2200, atk: 200, def: 100, agi: 150 } },
            { name: '内殿刀使', classId: 'DAOKE', element: '土', rarity: 'LEGEND', level: 12, stats: { hp: 2800, atk: 190, def: 160, agi: 110 } },
            { name: '内殿暗使', classId: 'ANQISHI', element: '火', rarity: 'LEGEND', level: 12, stats: { hp: 1800, atk: 170, def: 80, agi: 190 } },
            { name: '内殿阵师', classId: 'ZHENFASHI', element: '土', rarity: 'RARE', level: 12, stats: { hp: 2200, atk: 140, def: 120, agi: 100 } }
        ],
        baseReward: 160
    },
    {
        id: 'stage_3_3',
        chapter: 3,
        chapterName: '天下无双',
        stageName: '四大护法',
        enemies: [
            { name: '护法·青龙', classId: 'JIANKE', element: '木', rarity: 'LEGEND', level: 13, stats: { hp: 2500, atk: 230, def: 110, agi: 170 } },
            { name: '护法·白虎', classId: 'DAOKE', element: '金', rarity: 'LEGEND', level: 13, stats: { hp: 3000, atk: 210, def: 170, agi: 120 } },
            { name: '护法·朱雀', classId: 'ANQISHI', element: '火', rarity: 'LEGEND', level: 13, stats: { hp: 2000, atk: 200, def: 90, agi: 220 } },
            { name: '护法·玄武', classId: 'QUANSHI', element: '水', rarity: 'LEGEND', level: 13, stats: { hp: 3800, atk: 150, def: 200, agi: 90 } },
            { name: '护法·天机', classId: 'ZHENFASHI', element: '土', rarity: 'LEGEND', level: 13, stats: { hp: 2800, atk: 180, def: 160, agi: 130 } }
        ],
        baseReward: 170,
        taskCardId: 'task_004'
    },
    {
        id: 'stage_3_4',
        chapter: 3,
        chapterName: '天下无双',
        stageName: '魔教教主',
        enemies: [
            { name: '教主·天魔', classId: 'JIANKE', element: '火', rarity: 'LEGEND', level: 14, stats: { hp: 3000, atk: 260, def: 130, agi: 180 } },
            { name: '左使·冥王', classId: 'DAOKE', element: '水', rarity: 'LEGEND', level: 14, stats: { hp: 3200, atk: 230, def: 180, agi: 130 } },
            { name: '右使·罗刹', classId: 'ANQISHI', element: '木', rarity: 'LEGEND', level: 14, stats: { hp: 2400, atk: 220, def: 100, agi: 240 } },
            { name: '圣女·幽兰', classId: 'YIZHE', element: '水', rarity: 'LEGEND', level: 14, stats: { hp: 3000, atk: 160, def: 150, agi: 140 } },
            { name: '国师·鬼谷', classId: 'ZHENFASHI', element: '土', rarity: 'LEGEND', level: 14, stats: { hp: 2800, atk: 200, def: 170, agi: 135 } }
        ],
        baseReward: 180,
        taskCardId: 'task_002'
    },
    {
        id: 'stage_3_5',
        chapter: 3,
        chapterName: '天下无双',
        stageName: '天下第一',
        enemies: [
            { name: '剑圣·独孤', classId: 'JIANKE', element: '金', rarity: 'LEGEND', level: 15, stats: { hp: 3500, atk: 300, def: 150, agi: 200 } },
            { name: '刀皇·霸天', classId: 'DAOKE', element: '火', rarity: 'LEGEND', level: 15, stats: { hp: 3800, atk: 270, def: 200, agi: 150 } },
            { name: '拳神·不动', classId: 'QUANSHI', element: '土', rarity: 'LEGEND', level: 15, stats: { hp: 5000, atk: 200, def: 250, agi: 120 } },
            { name: '暗王·无影', classId: 'ANQISHI', element: '木', rarity: 'LEGEND', level: 15, stats: { hp: 2800, atk: 260, def: 120, agi: 260 } },
            { name: '天师·玄清', classId: 'ZHENFASHI', element: '水', rarity: 'LEGEND', level: 15, stats: { hp: 3600, atk: 240, def: 200, agi: 160 } }
        ],
        baseReward: 190,
        taskCardId: 'task_003'
    },
    {
        id: 'stage_3_6',
        chapter: 3,
        chapterName: '天下无双',
        stageName: '万剑归宗',
        enemies: [
            { name: '剑宗宗主', classId: 'JIANKE', element: '金', rarity: 'LEGEND', level: 15, stats: { hp: 3600, atk: 290, def: 140, agi: 210 } },
            { name: '剑宗长老', classId: 'JIANKE', element: '水', rarity: 'LEGEND', level: 15, stats: { hp: 3000, atk: 250, def: 120, agi: 190 } },
            { name: '剑宗护法', classId: 'DAOKE', element: '火', rarity: 'LEGEND', level: 15, stats: { hp: 3200, atk: 230, def: 160, agi: 140 } },
            { name: '剑宗暗卫', classId: 'ANQISHI', element: '木', rarity: 'RARE', level: 15, stats: { hp: 2400, atk: 210, def: 100, agi: 230 } },
            { name: '剑宗医圣', classId: 'YIZHE', element: '水', rarity: 'RARE', level: 15, stats: { hp: 2800, atk: 150, def: 130, agi: 120 } }
        ],
        baseReward: 195
    },
    {
        id: 'stage_3_7',
        chapter: 3,
        chapterName: '天下无双',
        stageName: '武林盟主',
        enemies: [
            { name: '盟主·苍穹', classId: 'ZHENFASHI', element: '土', rarity: 'LEGEND', level: 16, stats: { hp: 4200, atk: 280, def: 200, agi: 170 } },
            { name: '盟主剑侍', classId: 'JIANKE', element: '金', rarity: 'LEGEND', level: 16, stats: { hp: 3200, atk: 270, def: 130, agi: 200 } },
            { name: '盟主刀卫', classId: 'DAOKE', element: '火', rarity: 'LEGEND', level: 16, stats: { hp: 3800, atk: 250, def: 190, agi: 140 } },
            { name: '盟主暗卫', classId: 'ANQISHI', element: '水', rarity: 'LEGEND', level: 16, stats: { hp: 2600, atk: 260, def: 110, agi: 250 } },
            { name: '盟主医官', classId: 'YIZHE', element: '木', rarity: 'LEGEND', level: 16, stats: { hp: 3500, atk: 180, def: 170, agi: 150 } }
        ],
        baseReward: 200,
        taskCardId: 'task_003'
    },
    {
        id: 'stage_4_1',
        chapter: 4,
        chapterName: '龙争虎斗',
        stageName: '塞外烽烟',
        enemies: [
            { name: '铁骑先锋', classId: 'DAOKE', element: '金', rarity: 'LEGEND', level: 16, stats: { hp: 4000, atk: 260, def: 180, agi: 130 } },
            { name: '铁骑弓手', classId: 'ANQISHI', element: '木', rarity: 'LEGEND', level: 16, stats: { hp: 2800, atk: 250, def: 110, agi: 210 } },
            { name: '铁骑力士', classId: 'QUANSHI', element: '土', rarity: 'LEGEND', level: 16, stats: { hp: 5200, atk: 200, def: 240, agi: 90 } },
            { name: '铁骑军师', classId: 'ZHENFASHI', element: '水', rarity: 'RARE', level: 16, stats: { hp: 3200, atk: 210, def: 160, agi: 140 } },
            { name: '铁骑医官', classId: 'YIZHE', element: '木', rarity: 'RARE', level: 16, stats: { hp: 3500, atk: 160, def: 150, agi: 120 } }
        ],
        baseReward: 210
    },
    {
        id: 'stage_4_2',
        chapter: 4,
        chapterName: '龙争虎斗',
        stageName: '大漠孤烟',
        enemies: [
            { name: '沙漠蝎王', classId: 'ANQISHI', element: '火', rarity: 'LEGEND', level: 17, stats: { hp: 3000, atk: 280, def: 120, agi: 220 } },
            { name: '沙漠刀客', classId: 'DAOKE', element: '土', rarity: 'LEGEND', level: 17, stats: { hp: 4200, atk: 260, def: 200, agi: 140 } },
            { name: '沙漠武僧', classId: 'QUANSHI', element: '金', rarity: 'LEGEND', level: 17, stats: { hp: 5500, atk: 210, def: 260, agi: 100 } },
            { name: '沙漠咒师', classId: 'ZHENFASHI', element: '火', rarity: 'LEGEND', level: 17, stats: { hp: 3600, atk: 240, def: 170, agi: 160 } },
            { name: '沙漠灵医', classId: 'YIZHE', element: '水', rarity: 'RARE', level: 17, stats: { hp: 3800, atk: 170, def: 160, agi: 130 } }
        ],
        baseReward: 220
    },
    {
        id: 'stage_4_3',
        chapter: 4,
        chapterName: '龙争虎斗',
        stageName: '天山雪域',
        enemies: [
            { name: '天山剑仙', classId: 'JIANKE', element: '水', rarity: 'LEGEND', level: 17, stats: { hp: 3400, atk: 300, def: 140, agi: 220 } },
            { name: '天山雪女', classId: 'YIZHE', element: '水', rarity: 'LEGEND', level: 17, stats: { hp: 4000, atk: 200, def: 180, agi: 170 } },
            { name: '天山冰卫', classId: 'QUANSHI', element: '水', rarity: 'LEGEND', level: 17, stats: { hp: 5800, atk: 220, def: 270, agi: 95 } },
            { name: '天山暗影', classId: 'ANQISHI', element: '水', rarity: 'LEGEND', level: 17, stats: { hp: 2800, atk: 270, def: 110, agi: 240 } },
            { name: '天山阵师', classId: 'ZHENFASHI', element: '水', rarity: 'LEGEND', level: 17, stats: { hp: 3800, atk: 250, def: 190, agi: 155 } }
        ],
        baseReward: 230,
        taskCardId: 'task_004'
    },
    {
        id: 'stage_4_4',
        chapter: 4,
        chapterName: '龙争虎斗',
        stageName: '南海龙宫',
        enemies: [
            { name: '龙宫太子', classId: 'JIANKE', element: '水', rarity: 'LEGEND', level: 18, stats: { hp: 4000, atk: 310, def: 160, agi: 200 } },
            { name: '龙宫虾将', classId: 'DAOKE', element: '水', rarity: 'LEGEND', level: 18, stats: { hp: 4500, atk: 270, def: 210, agi: 130 } },
            { name: '龙宫蟹将', classId: 'QUANSHI', element: '水', rarity: 'LEGEND', level: 18, stats: { hp: 6000, atk: 230, def: 280, agi: 85 } },
            { name: '龙宫水母', classId: 'ANQISHI', element: '水', rarity: 'LEGEND', level: 18, stats: { hp: 3000, atk: 280, def: 120, agi: 230 } },
            { name: '龙宫龟相', classId: 'ZHENFASHI', element: '水', rarity: 'LEGEND', level: 18, stats: { hp: 4200, atk: 260, def: 220, agi: 140 } }
        ],
        baseReward: 240
    },
    {
        id: 'stage_4_5',
        chapter: 4,
        chapterName: '龙争虎斗',
        stageName: '蜀中唐门',
        enemies: [
            { name: '唐门门主', classId: 'ANQISHI', element: '木', rarity: 'LEGEND', level: 18, stats: { hp: 3500, atk: 320, def: 140, agi: 240 } },
            { name: '唐门暗器·雨', classId: 'ANQISHI', element: '木', rarity: 'LEGEND', level: 18, stats: { hp: 2800, atk: 290, def: 110, agi: 260 } },
            { name: '唐门暗器·雷', classId: 'ANQISHI', element: '金', rarity: 'LEGEND', level: 18, stats: { hp: 3000, atk: 300, def: 120, agi: 250 } },
            { name: '唐门毒医', classId: 'YIZHE', element: '木', rarity: 'LEGEND', level: 18, stats: { hp: 4200, atk: 210, def: 180, agi: 150 } },
            { name: '唐门阵师', classId: 'ZHENFASHI', element: '木', rarity: 'RARE', level: 18, stats: { hp: 3600, atk: 240, def: 170, agi: 145 } }
        ],
        baseReward: 250,
        taskCardId: 'task_002'
    },
    {
        id: 'stage_4_6',
        chapter: 4,
        chapterName: '龙争虎斗',
        stageName: '少林寺',
        enemies: [
            { name: '少林方丈', classId: 'QUANSHI', element: '土', rarity: 'LEGEND', level: 19, stats: { hp: 6500, atk: 250, def: 300, agi: 110 } },
            { name: '达摩院首座', classId: 'JIANKE', element: '金', rarity: 'LEGEND', level: 19, stats: { hp: 4200, atk: 320, def: 170, agi: 200 } },
            { name: '罗汉堂首座', classId: 'QUANSHI', element: '土', rarity: 'LEGEND', level: 19, stats: { hp: 5800, atk: 270, def: 280, agi: 100 } },
            { name: '般若堂首座', classId: 'ZHENFASHI', element: '火', rarity: 'LEGEND', level: 19, stats: { hp: 4500, atk: 290, def: 200, agi: 170 } },
            { name: '药王院首座', classId: 'YIZHE', element: '木', rarity: 'LEGEND', level: 19, stats: { hp: 4800, atk: 220, def: 190, agi: 140 } }
        ],
        baseReward: 260
    },
    {
        id: 'stage_4_7',
        chapter: 4,
        chapterName: '龙争虎斗',
        stageName: '武当巅峰',
        enemies: [
            { name: '武当掌门', classId: 'JIANKE', element: '水', rarity: 'LEGEND', level: 20, stats: { hp: 4800, atk: 340, def: 180, agi: 220 } },
            { name: '太极剑宗', classId: 'JIANKE', element: '水', rarity: 'LEGEND', level: 20, stats: { hp: 4200, atk: 310, def: 160, agi: 210 } },
            { name: '太极刀宗', classId: 'DAOKE', element: '水', rarity: 'LEGEND', level: 20, stats: { hp: 5000, atk: 290, def: 230, agi: 150 } },
            { name: '太极暗宗', classId: 'ANQISHI', element: '水', rarity: 'LEGEND', level: 20, stats: { hp: 3200, atk: 300, def: 130, agi: 270 } },
            { name: '太极医宗', classId: 'YIZHE', element: '木', rarity: 'LEGEND', level: 20, stats: { hp: 5000, atk: 230, def: 200, agi: 160 } }
        ],
        baseReward: 270,
        taskCardId: 'task_003'
    },
    {
        id: 'stage_5_1',
        chapter: 5,
        chapterName: '武林至尊',
        stageName: '华山论剑',
        enemies: [
            { name: '东邪·黄药师', classId: 'ZHENFASHI', element: '木', rarity: 'LEGEND', level: 20, stats: { hp: 5000, atk: 320, def: 200, agi: 200 } },
            { name: '西毒·欧阳锋', classId: 'ANQISHI', element: '火', rarity: 'LEGEND', level: 20, stats: { hp: 4200, atk: 340, def: 150, agi: 240 } },
            { name: '南帝·段智兴', classId: 'YIZHE', element: '水', rarity: 'LEGEND', level: 20, stats: { hp: 5500, atk: 260, def: 220, agi: 170 } },
            { name: '北丐·洪七公', classId: 'DAOKE', element: '金', rarity: 'LEGEND', level: 20, stats: { hp: 5200, atk: 330, def: 210, agi: 180 } },
            { name: '中神通·王重阳', classId: 'JIANKE', element: '土', rarity: 'LEGEND', level: 20, stats: { hp: 5500, atk: 350, def: 230, agi: 210 } }
        ],
        baseReward: 280,
        taskCardId: 'task_004'
    },
    {
        id: 'stage_5_2',
        chapter: 5,
        chapterName: '武林至尊',
        stageName: '九幽冥府',
        enemies: [
            { name: '冥王·阎罗', classId: 'ZHENFASHI', element: '水', rarity: 'LEGEND', level: 21, stats: { hp: 6000, atk: 350, def: 240, agi: 190 } },
            { name: '判官·崔珏', classId: 'JIANKE', element: '水', rarity: 'LEGEND', level: 21, stats: { hp: 5000, atk: 340, def: 190, agi: 230 } },
            { name: '鬼将·无常', classId: 'DAOKE', element: '水', rarity: 'LEGEND', level: 21, stats: { hp: 5800, atk: 320, def: 250, agi: 160 } },
            { name: '幽魂·夜叉', classId: 'ANQISHI', element: '水', rarity: 'LEGEND', level: 21, stats: { hp: 3800, atk: 330, def: 150, agi: 280 } },
            { name: '冥医·孟婆', classId: 'YIZHE', element: '木', rarity: 'LEGEND', level: 21, stats: { hp: 5500, atk: 250, def: 210, agi: 170 } }
        ],
        baseReward: 300
    },
    {
        id: 'stage_5_3',
        chapter: 5,
        chapterName: '武林至尊',
        stageName: '天机阁',
        enemies: [
            { name: '天机阁主', classId: 'ZHENFASHI', element: '土', rarity: 'LEGEND', level: 22, stats: { hp: 6500, atk: 360, def: 260, agi: 210 } },
            { name: '天机·星宿', classId: 'JIANKE', element: '金', rarity: 'LEGEND', level: 22, stats: { hp: 5200, atk: 350, def: 200, agi: 240 } },
            { name: '天机·地煞', classId: 'QUANSHI', element: '土', rarity: 'LEGEND', level: 22, stats: { hp: 7000, atk: 280, def: 300, agi: 120 } },
            { name: '天机·天罡', classId: 'DAOKE', element: '火', rarity: 'LEGEND', level: 22, stats: { hp: 5800, atk: 340, def: 240, agi: 180 } },
            { name: '天机·玄冥', classId: 'ANQISHI', element: '水', rarity: 'LEGEND', level: 22, stats: { hp: 4200, atk: 350, def: 160, agi: 290 } }
        ],
        baseReward: 320
    },
    {
        id: 'stage_5_4',
        chapter: 5,
        chapterName: '武林至尊',
        stageName: '昆仑仙境',
        enemies: [
            { name: '昆仑掌教', classId: 'JIANKE', element: '金', rarity: 'LEGEND', level: 23, stats: { hp: 6000, atk: 380, def: 220, agi: 250 } },
            { name: '昆仑剑仙', classId: 'JIANKE', element: '金', rarity: 'LEGEND', level: 23, stats: { hp: 5500, atk: 370, def: 200, agi: 260 } },
            { name: '昆仑刀仙', classId: 'DAOKE', element: '金', rarity: 'LEGEND', level: 23, stats: { hp: 6200, atk: 350, def: 260, agi: 190 } },
            { name: '昆仑拳仙', classId: 'QUANSHI', element: '金', rarity: 'LEGEND', level: 23, stats: { hp: 7500, atk: 300, def: 320, agi: 130 } },
            { name: '昆仑仙医', classId: 'YIZHE', element: '木', rarity: 'LEGEND', level: 23, stats: { hp: 6000, atk: 270, def: 230, agi: 180 } }
        ],
        baseReward: 340,
        taskCardId: 'task_005'
    },
    {
        id: 'stage_5_5',
        chapter: 5,
        chapterName: '武林至尊',
        stageName: '神魔之井',
        enemies: [
            { name: '魔神·蚩尤', classId: 'DAOKE', element: '火', rarity: 'LEGEND', level: 24, stats: { hp: 8000, atk: 400, def: 280, agi: 200 } },
            { name: '神将·刑天', classId: 'QUANSHI', element: '土', rarity: 'LEGEND', level: 24, stats: { hp: 9000, atk: 350, def: 350, agi: 140 } },
            { name: '妖后·妲己', classId: 'ANQISHI', element: '木', rarity: 'LEGEND', level: 24, stats: { hp: 5500, atk: 380, def: 180, agi: 300 } },
            { name: '仙尊·太上', classId: 'ZHENFASHI', element: '水', rarity: 'LEGEND', level: 24, stats: { hp: 7000, atk: 370, def: 270, agi: 220 } },
            { name: '灵医·神农', classId: 'YIZHE', element: '木', rarity: 'LEGEND', level: 24, stats: { hp: 7500, atk: 300, def: 250, agi: 190 } }
        ],
        baseReward: 360
    },
    {
        id: 'stage_5_6',
        chapter: 5,
        chapterName: '武林至尊',
        stageName: '天道轮回',
        enemies: [
            { name: '天道·轮回', classId: 'ZHENFASHI', element: '土', rarity: 'LEGEND', level: 25, stats: { hp: 8500, atk: 400, def: 300, agi: 230 } },
            { name: '天道·审判', classId: 'JIANKE', element: '金', rarity: 'LEGEND', level: 25, stats: { hp: 7000, atk: 410, def: 230, agi: 270 } },
            { name: '天道·毁灭', classId: 'DAOKE', element: '火', rarity: 'LEGEND', level: 25, stats: { hp: 7500, atk: 390, def: 280, agi: 200 } },
            { name: '天道·虚无', classId: 'ANQISHI', element: '水', rarity: 'LEGEND', level: 25, stats: { hp: 6000, atk: 400, def: 200, agi: 310 } },
            { name: '天道·永恒', classId: 'YIZHE', element: '木', rarity: 'LEGEND', level: 25, stats: { hp: 8000, atk: 320, def: 280, agi: 200 } }
        ],
        baseReward: 380,
        taskCardId: 'task_003'
    },
    {
        id: 'stage_5_7',
        chapter: 5,
        chapterName: '武林至尊',
        stageName: '武林神话',
        enemies: [
            { name: '武神·无极', classId: 'JIANKE', element: '金', rarity: 'LEGEND', level: 26, stats: { hp: 9000, atk: 450, def: 280, agi: 280 } },
            { name: '战神·破天', classId: 'DAOKE', element: '火', rarity: 'LEGEND', level: 26, stats: { hp: 9500, atk: 430, def: 320, agi: 210 } },
            { name: '金刚·不灭', classId: 'QUANSHI', element: '土', rarity: 'LEGEND', level: 26, stats: { hp: 12000, atk: 350, def: 400, agi: 150 } },
            { name: '影神·无踪', classId: 'ANQISHI', element: '木', rarity: 'LEGEND', level: 26, stats: { hp: 7000, atk: 440, def: 220, agi: 330 } },
            { name: '天医·回春', classId: 'YIZHE', element: '水', rarity: 'LEGEND', level: 26, stats: { hp: 9000, atk: 350, def: 300, agi: 220 } }
        ],
        baseReward: 400,
        taskCardId: 'task_004'
    }
];
