const LEVELS = [
    {
        id: 'stage_1_1',
        chapter: 1,
        chapterName: '江湖初入',
        stageName: '山贼来袭',
        enemies: [
            { name: '山贼甲', classId: 'QUANSHI', element: '金', rarity: 'COMMON', level: 1, stats: { hp: 400, atk: 40, def: 30, spd: 50 } },
            { name: '山贼乙', classId: 'QUANSHI', element: '火', rarity: 'COMMON', level: 1, stats: { hp: 350, atk: 35, def: 25, spd: 45 } },
            { name: '山贼丙', classId: 'QUANSHI', element: '土', rarity: 'COMMON', level: 1, stats: { hp: 450, atk: 30, def: 40, spd: 35 } }
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
            { name: '恶霸头目', classId: 'DAOKE', element: '金', rarity: 'COMMON', level: 2, stats: { hp: 600, atk: 55, def: 45, spd: 50 } },
            { name: '恶霸打手', classId: 'QUANSHI', element: '土', rarity: 'COMMON', level: 2, stats: { hp: 700, atk: 45, def: 55, spd: 40 } },
            { name: '恶霸喽啰', classId: 'QUANSHI', element: '火', rarity: 'COMMON', level: 2, stats: { hp: 400, atk: 50, def: 30, spd: 55 } }
        ],
        baseReward: 60
    },
    {
        id: 'stage_1_3',
        chapter: 1,
        chapterName: '江湖初入',
        stageName: '黑风寨',
        enemies: [
            { name: '寨门守卫', classId: 'QUANSHI', element: '土', rarity: 'COMMON', level: 3, stats: { hp: 800, atk: 50, def: 60, spd: 40 } },
            { name: '寨中刀手', classId: 'DAOKE', element: '金', rarity: 'FINE', level: 3, stats: { hp: 750, atk: 75, def: 50, spd: 55 } },
            { name: '寨中剑手', classId: 'JIANKE', element: '水', rarity: 'COMMON', level: 3, stats: { hp: 600, atk: 65, def: 35, spd: 65 } },
            { name: '寨中暗手', classId: 'ANQISHI', element: '火', rarity: 'FINE', level: 3, stats: { hp: 500, atk: 70, def: 30, spd: 80 } }
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
            { name: '蛇谷守卫', classId: 'QUANSHI', element: '土', rarity: 'FINE', level: 4, stats: { hp: 1000, atk: 60, def: 70, spd: 45 } },
            { name: '蛇谷刺客', classId: 'ANQISHI', element: '木', rarity: 'FINE', level: 4, stats: { hp: 650, atk: 80, def: 35, spd: 90 } },
            { name: '蛇谷剑客', classId: 'JIANKE', element: '水', rarity: 'FINE', level: 4, stats: { hp: 800, atk: 85, def: 45, spd: 70 } },
            { name: '蛇谷术士', classId: 'ZHENFASHI', element: '火', rarity: 'FINE', level: 4, stats: { hp: 750, atk: 70, def: 55, spd: 55 } },
            { name: '蛇谷医者', classId: 'YIZHE', element: '木', rarity: 'COMMON', level: 4, stats: { hp: 700, atk: 50, def: 50, spd: 50 } }
        ],
        baseReward: 80
    },
    {
        id: 'stage_1_5',
        chapter: 1,
        chapterName: '江湖初入',
        stageName: '山寨头目',
        enemies: [
            { name: '头目·赤炎', classId: 'DAOKE', element: '火', rarity: 'RARE', level: 5, stats: { hp: 1200, atk: 100, def: 70, spd: 65 } },
            { name: '头目护卫', classId: 'QUANSHI', element: '土', rarity: 'FINE', level: 5, stats: { hp: 1100, atk: 65, def: 80, spd: 50 } },
            { name: '头目剑客', classId: 'JIANKE', element: '金', rarity: 'FINE', level: 5, stats: { hp: 900, atk: 90, def: 50, spd: 75 } },
            { name: '头目暗手', classId: 'ANQISHI', element: '木', rarity: 'FINE', level: 5, stats: { hp: 700, atk: 85, def: 40, spd: 95 } },
            { name: '头目军师', classId: 'ZHENFASHI', element: '水', rarity: 'FINE', level: 5, stats: { hp: 850, atk: 75, def: 65, spd: 60 } }
        ],
        baseReward: 90,
        taskCardId: 'task_002'
    },
    {
        id: 'stage_2_1',
        chapter: 2,
        chapterName: '名震一方',
        stageName: '武林大会·初赛',
        enemies: [
            { name: '青云剑客', classId: 'JIANKE', element: '水', rarity: 'FINE', level: 6, stats: { hp: 1000, atk: 100, def: 55, spd: 85 } },
            { name: '烈焰刀客', classId: 'DAOKE', element: '火', rarity: 'FINE', level: 6, stats: { hp: 1100, atk: 90, def: 75, spd: 60 } },
            { name: '铁壁拳师', classId: 'QUANSHI', element: '金', rarity: 'FINE', level: 6, stats: { hp: 1400, atk: 70, def: 90, spd: 50 } },
            { name: '追风暗器', classId: 'ANQISHI', element: '木', rarity: 'FINE', level: 6, stats: { hp: 800, atk: 85, def: 40, spd: 110 } },
            { name: '灵丹医者', classId: 'YIZHE', element: '木', rarity: 'FINE', level: 6, stats: { hp: 1000, atk: 60, def: 60, spd: 65 } }
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
            { name: '紫电剑客', classId: 'JIANKE', element: '金', rarity: 'RARE', level: 7, stats: { hp: 1300, atk: 130, def: 65, spd: 105 } },
            { name: '破军刀客', classId: 'DAOKE', element: '土', rarity: 'FINE', level: 7, stats: { hp: 1200, atk: 100, def: 85, spd: 65 } },
            { name: '金刚拳师', classId: 'QUANSHI', element: '土', rarity: 'RARE', level: 7, stats: { hp: 1800, atk: 90, def: 110, spd: 55 } },
            { name: '幻影暗器', classId: 'ANQISHI', element: '水', rarity: 'FINE', level: 7, stats: { hp: 900, atk: 95, def: 45, spd: 120 } },
            { name: '天机阵师', classId: 'ZHENFASHI', element: '火', rarity: 'FINE', level: 7, stats: { hp: 1100, atk: 85, def: 75, spd: 70 } }
        ],
        baseReward: 110
    },
    {
        id: 'stage_2_3',
        chapter: 2,
        chapterName: '名震一方',
        stageName: '暗夜追杀',
        enemies: [
            { name: '暗夜剑影', classId: 'JIANKE', element: '水', rarity: 'RARE', level: 8, stats: { hp: 1400, atk: 140, def: 70, spd: 115 } },
            { name: '暗夜刀煞', classId: 'DAOKE', element: '金', rarity: 'RARE', level: 8, stats: { hp: 1600, atk: 125, def: 100, spd: 80 } },
            { name: '暗夜铁拳', classId: 'QUANSHI', element: '土', rarity: 'RARE', level: 8, stats: { hp: 2000, atk: 95, def: 120, spd: 60 } },
            { name: '暗夜毒针', classId: 'ANQISHI', element: '木', rarity: 'RARE', level: 8, stats: { hp: 1100, atk: 120, def: 55, spd: 140 } },
            { name: '暗夜咒师', classId: 'ZHENFASHI', element: '火', rarity: 'RARE', level: 8, stats: { hp: 1400, atk: 105, def: 90, spd: 85 } }
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
            { name: '邪教护法·剑', classId: 'JIANKE', element: '火', rarity: 'RARE', level: 9, stats: { hp: 1500, atk: 150, def: 75, spd: 120 } },
            { name: '邪教护法·刀', classId: 'DAOKE', element: '土', rarity: 'RARE', level: 9, stats: { hp: 1700, atk: 135, def: 110, spd: 85 } },
            { name: '邪教护法·拳', classId: 'QUANSHI', element: '金', rarity: 'RARE', level: 9, stats: { hp: 2200, atk: 100, def: 130, spd: 65 } },
            { name: '邪教暗杀者', classId: 'ANQISHI', element: '水', rarity: 'RARE', level: 9, stats: { hp: 1200, atk: 130, def: 60, spd: 150 } },
            { name: '邪教巫医', classId: 'YIZHE', element: '木', rarity: 'RARE', level: 9, stats: { hp: 1600, atk: 90, def: 90, spd: 95 } }
        ],
        baseReward: 130
    },
    {
        id: 'stage_2_5',
        chapter: 2,
        chapterName: '名震一方',
        stageName: '分坛坛主',
        enemies: [
            { name: '坛主·血手', classId: 'DAOKE', element: '火', rarity: 'LEGEND', level: 10, stats: { hp: 2000, atk: 180, def: 130, spd: 100 } },
            { name: '坛主亲信', classId: 'JIANKE', element: '金', rarity: 'RARE', level: 10, stats: { hp: 1600, atk: 155, def: 80, spd: 125 } },
            { name: '坛主护卫', classId: 'QUANSHI', element: '土', rarity: 'RARE', level: 10, stats: { hp: 2400, atk: 110, def: 150, spd: 70 } },
            { name: '坛主暗卫', classId: 'ANQISHI', element: '木', rarity: 'RARE', level: 10, stats: { hp: 1300, atk: 140, def: 65, spd: 160 } },
            { name: '坛主军师', classId: 'ZHENFASHI', element: '水', rarity: 'RARE', level: 10, stats: { hp: 1700, atk: 120, def: 105, spd: 90 } }
        ],
        baseReward: 140,
        taskCardId: 'task_003'
    },
    {
        id: 'stage_3_1',
        chapter: 3,
        chapterName: '天下无双',
        stageName: '魔教总坛·外围',
        enemies: [
            { name: '魔教守卫', classId: 'QUANSHI', element: '土', rarity: 'RARE', level: 11, stats: { hp: 2600, atk: 120, def: 140, spd: 75 } },
            { name: '魔教剑士', classId: 'JIANKE', element: '金', rarity: 'RARE', level: 11, stats: { hp: 1800, atk: 170, def: 85, spd: 130 } },
            { name: '魔教刀客', classId: 'DAOKE', element: '火', rarity: 'RARE', level: 11, stats: { hp: 2000, atk: 155, def: 120, spd: 95 } },
            { name: '魔教暗卫', classId: 'ANQISHI', element: '水', rarity: 'RARE', level: 11, stats: { hp: 1500, atk: 145, def: 70, spd: 170 } },
            { name: '魔教医师', classId: 'YIZHE', element: '木', rarity: 'RARE', level: 11, stats: { hp: 1900, atk: 100, def: 100, spd: 100 } }
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
            { name: '内殿守卫', classId: 'QUANSHI', element: '金', rarity: 'LEGEND', level: 12, stats: { hp: 3200, atk: 150, def: 180, spd: 95 } },
            { name: '内殿剑使', classId: 'JIANKE', element: '水', rarity: 'LEGEND', level: 12, stats: { hp: 2200, atk: 200, def: 100, spd: 150 } },
            { name: '内殿刀使', classId: 'DAOKE', element: '土', rarity: 'LEGEND', level: 12, stats: { hp: 2800, atk: 190, def: 160, spd: 110 } },
            { name: '内殿暗使', classId: 'ANQISHI', element: '火', rarity: 'LEGEND', level: 12, stats: { hp: 1800, atk: 170, def: 80, spd: 190 } },
            { name: '内殿阵师', classId: 'ZHENFASHI', element: '土', rarity: 'RARE', level: 12, stats: { hp: 2200, atk: 140, def: 120, spd: 100 } }
        ],
        baseReward: 160
    },
    {
        id: 'stage_3_3',
        chapter: 3,
        chapterName: '天下无双',
        stageName: '四大护法',
        enemies: [
            { name: '护法·青龙', classId: 'JIANKE', element: '木', rarity: 'LEGEND', level: 13, stats: { hp: 2500, atk: 230, def: 110, spd: 170 } },
            { name: '护法·白虎', classId: 'DAOKE', element: '金', rarity: 'LEGEND', level: 13, stats: { hp: 3000, atk: 210, def: 170, spd: 120 } },
            { name: '护法·朱雀', classId: 'ANQISHI', element: '火', rarity: 'LEGEND', level: 13, stats: { hp: 2000, atk: 200, def: 90, spd: 220 } },
            { name: '护法·玄武', classId: 'QUANSHI', element: '水', rarity: 'LEGEND', level: 13, stats: { hp: 3800, atk: 150, def: 200, spd: 90 } },
            { name: '护法·天机', classId: 'ZHENFASHI', element: '土', rarity: 'LEGEND', level: 13, stats: { hp: 2800, atk: 180, def: 160, spd: 130 } }
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
            { name: '教主·天魔', classId: 'JIANKE', element: '火', rarity: 'LEGEND', level: 14, stats: { hp: 3000, atk: 260, def: 130, spd: 180 } },
            { name: '左使·冥王', classId: 'DAOKE', element: '水', rarity: 'LEGEND', level: 14, stats: { hp: 3200, atk: 230, def: 180, spd: 130 } },
            { name: '右使·罗刹', classId: 'ANQISHI', element: '木', rarity: 'LEGEND', level: 14, stats: { hp: 2400, atk: 220, def: 100, spd: 240 } },
            { name: '圣女·幽兰', classId: 'YIZHE', element: '水', rarity: 'LEGEND', level: 14, stats: { hp: 3000, atk: 160, def: 150, spd: 140 } },
            { name: '国师·鬼谷', classId: 'ZHENFASHI', element: '土', rarity: 'LEGEND', level: 14, stats: { hp: 2800, atk: 200, def: 170, spd: 135 } }
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
            { name: '剑圣·独孤', classId: 'JIANKE', element: '金', rarity: 'LEGEND', level: 15, stats: { hp: 3500, atk: 300, def: 150, spd: 200 } },
            { name: '刀皇·霸天', classId: 'DAOKE', element: '火', rarity: 'LEGEND', level: 15, stats: { hp: 3800, atk: 270, def: 200, spd: 150 } },
            { name: '拳神·不动', classId: 'QUANSHI', element: '土', rarity: 'LEGEND', level: 15, stats: { hp: 5000, atk: 200, def: 250, spd: 120 } },
            { name: '暗王·无影', classId: 'ANQISHI', element: '木', rarity: 'LEGEND', level: 15, stats: { hp: 2800, atk: 260, def: 120, spd: 260 } },
            { name: '天师·玄清', classId: 'ZHENFASHI', element: '水', rarity: 'LEGEND', level: 15, stats: { hp: 3600, atk: 240, def: 200, spd: 160 } }
        ],
        baseReward: 190,
        taskCardId: 'task_003'
    }
];
