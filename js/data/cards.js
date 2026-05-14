const RARITY = {
    COMMON: { id: 'COMMON', name: '普通', multiplier: 1.0, color: '#cccccc' },
    FINE: { id: 'FINE', name: '精良', multiplier: 1.3, color: '#2ecc71' },
    RARE: { id: 'RARE', name: '稀有', multiplier: 1.6, color: '#3498db' },
    LEGEND: { id: 'LEGEND', name: '传说', multiplier: 2.0, color: '#9b59b6' }
};

const CHARACTER_CARDS = [
    {
        id: 'char_001',
        name: '家丁',
        classId: 'QUANSHI',
        element: '土',
        rarity: 'COMMON',
        baseStats: { hp: 500, atk: 50, def: 40, spd: 60 },
        description: '府中家丁，忠心耿耿，虽无绝世武功，却有一身蛮力。'
    }
];

const EQUIPMENT_CARDS = [
    {
        id: 'equip_001',
        name: '铁剑',
        type: 'weapon',
        rarity: 'COMMON',
        bonus: { atk: 10 },
        description: '寻常铁匠铺打造的铁剑，虽非名器，却也锋利。'
    },
    {
        id: 'equip_002',
        name: '布甲',
        type: 'armor',
        rarity: 'COMMON',
        bonus: { def: 10 },
        description: '厚实的棉布甲，能挡些轻微的刀剑。'
    },
    {
        id: 'equip_003',
        name: '铁戒指',
        type: 'accessory',
        rarity: 'COMMON',
        bonus: { atk: 5, spd: 5 },
        description: '铁质戒指，刻有简易纹路，佩戴后拳脚更为利落。'
    },
    {
        id: 'equip_004',
        name: '铜戒指',
        type: 'accessory',
        rarity: 'COMMON',
        bonus: { def: 5, spd: 5 },
        description: '铜质戒指，古朴厚重，佩戴后身法更为稳健。'
    }
];

const SKILL_CARDS = [
    {
        id: 'skill_001',
        name: '平沙剑法',
        type: 'active_attack',
        rarity: 'COMMON',
        multiplier: 0.8,
        effect: '对所有敌人造成自身攻击力80%的伤害',
        description: '平沙落雁，剑气横扫。一剑挥出，如大漠风沙席卷四方。',
        targeting: 'all_enemies',
        effects: [
            { trigger: 'onUse', type: 'damage', target: 'enemy', base: 'atk', multiplier: 0.8 }
        ]
    },
    {
        id: 'skill_002',
        name: '吐纳心法',
        type: 'passive_buff',
        rarity: 'COMMON',
        multiplier: 0,
        effect: '速度+10，每回合回复50点生命',
        description: '调息吐纳，以意领气。修习后身轻体健，伤势自愈。',
        targeting: 'self',
        effects: [
            { trigger: 'onBattleStart', type: 'stat_buff', target: 'self', stat: 'spd', value: 10 },
            { trigger: 'onTurnEnd', type: 'heal', target: 'self', value: 50 }
        ]
    },
    {
        id: 'skill_003',
        name: '灵盾',
        type: 'passive_buff',
        rarity: 'FINE',
        multiplier: 0,
        effect: '战斗开始时获得最大生命值20%的护盾',
        description: '灵气护体，形成一道无形的屏障，抵御伤害。',
        targeting: 'self',
        effects: [
            { trigger: 'onBattleStart', type: 'shield', target: 'self', base: 'maxHp', multiplier: 0.2 }
        ]
    },
    {
        id: 'skill_004',
        name: '铁壁',
        type: 'passive_buff',
        rarity: 'FINE',
        multiplier: 0,
        effect: '生命值低于30%时，受到伤害减少50%',
        description: '坚如铁壁，绝境之中爆发更强的防御力。',
        targeting: 'self',
        effects: [
            { 
                trigger: 'onDamageReceived', 
                type: 'damage_reduction', 
                target: 'self', 
                condition: { type: 'hpBelow', value: 0.3 },
                multiplier: 0.5 
            }
        ]
    },
    {
        id: 'skill_005',
        name: '嗜血',
        type: 'passive_buff',
        rarity: 'RARE',
        multiplier: 0,
        effect: '造成伤害时回复伤害值的20%生命',
        description: '嗜血如命，以敌之血补己之身。',
        targeting: 'self',
        effects: [
            { trigger: 'onDamageDealt', type: 'lifesteal', target: 'self', multiplier: 0.2 }
        ]
    },
    {
        id: 'skill_006',
        name: '回春术',
        type: 'heal',
        rarity: 'FINE',
        multiplier: 0.5,
        effect: '为生命值最低的友方回复自身攻击力50%的生命',
        description: '以气运功，为伤者疗伤续命。',
        targeting: 'lowest_hp_ally',
        effects: [
            { trigger: 'onUse', type: 'heal', target: 'ally', base: 'atk', multiplier: 0.5 }
        ]
    },
    {
        id: 'skill_007',
        name: '定身咒',
        type: 'control',
        rarity: 'RARE',
        multiplier: 0,
        effect: '使一名敌人下回合无法行动',
        description: '封穴定身，令敌人动弹不得。',
        targeting: 'random_enemy',
        effects: [
            { trigger: 'onUse', type: 'control', target: 'enemy', duration: 1 }
        ]
    },
    {
        id: 'skill_008',
        name: '烈焰斩',
        type: 'active_attack',
        rarity: 'RARE',
        multiplier: 1.5,
        effect: '对单体敌人造成自身攻击力150%的伤害',
        description: '烈焰附剑，一斩之下，势不可挡。',
        targeting: 'single_enemy',
        effects: [
            { trigger: 'onUse', type: 'damage', target: 'enemy', base: 'atk', multiplier: 1.5 }
        ]
    }
];

const TASK_CARDS = [
    {
        id: 'task_001',
        name: '速战速决',
        condition: '5回合内获胜',
        conditionType: 'turns',
        conditionValue: 5,
        reward: { gold: 200 },
        description: '兵贵神速，速战速决方为上策。'
    },
    {
        id: 'task_002',
        name: '完美通关',
        condition: '无角色阵亡',
        conditionType: 'no_death',
        conditionValue: true,
        reward: { gold: 300 },
        description: '保全己方，方为将才。'
    },
    {
        id: 'task_003',
        name: '以弱胜强',
        condition: '队伍总战力低于敌方',
        conditionType: 'power_lower',
        conditionValue: true,
        reward: { gold: 500 },
        description: '以弱胜强，方显英雄本色。'
    },
    {
        id: 'task_004',
        name: '五行齐全',
        condition: '队伍包含5种五行属性',
        conditionType: 'elements_count',
        conditionValue: 5,
        reward: { cardRarity: 'RARE' },
        description: '五行齐聚，天地归一。'
    },
    {
        id: 'task_005',
        name: '全员存活',
        condition: '所有角色HP大于50%',
        conditionType: 'hp_above',
        conditionValue: 0.5,
        reward: { gold: 250 },
        description: '保全战力，稳扎稳打。'
    }
];

const GACHA_CONFIG = {
    typeProbability: {
        weapon: 0.30,
        armor: 0.30,
        accessory: 0.20,
        skill: 0.12,
        hero: 0.08
    },
    rarityProbability: {
        COMMON: 0.60,
        FINE: 0.25,
        RARE: 0.12,
        LEGEND: 0.03
    }
};

const PROTAGONIST = {
    id: 'protagonist',
    name: '少侠',
    gender: 'male',
    element: '金',
    baseStats: { hp: 1000, atk: 100, def: 80, spd: 90 },
    description: '初入江湖的少年侠客，前途无量。'
};
