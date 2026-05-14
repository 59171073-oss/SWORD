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
        baseStats: { hp: 500, atk: 50, def: 40, agi: 60 },
        description: '府中家丁，忠心耿耿，虽无绝世武功，却有一身蛮力。',
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=young%20chinese%20male%20servant%20in%20blue%20traditional%20clothes%2C%20holding%20broom%2C%20wuxia%20style%2C%20portrait%2C%20honest%20face&image_size=square_hd',
        innateSkill: {
            name: '忠心护主',
            description: '为主人挡刀时，防御提升10%',
            effect: { type: 'defense_boost', value: 0.1, condition: 'ally_near_death' }
        }
    },
    {
        id: 'char_002',
        name: '秦紫薇',
        classId: 'YIZHE',
        element: '木',
        rarity: 'FINE',
        baseStats: { hp: 90, atk: 60, def: 60, agi: 80 },
        description: '主角的侍女，从小跟随主角，温柔体贴，擅长医术。',
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20chinese%20maiden%20in%20green%20traditional%20dress%2C%20holding%20teapot%2C%20wuxia%20style%2C%20portrait%2C%20gentle%20expression%2C%20bamboo%20garden&image_size=square_hd',
        isHealer: true,
        healMultiplier: 0.3,
        innateSkill: {
            name: '侍奉照料',
            description: '每回合开始时，为血量最低的友方回复15点生命',
            effect: { type: 'turn_start_heal', value: 15, target: 'lowest_hp_ally' }
        }
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
        bonus: { atk: 5, agi: 5 },
        description: '铁质戒指，刻有简易纹路，佩戴后拳脚更为利落。'
    },
    {
        id: 'equip_004',
        name: '铜戒指',
        type: 'accessory',
        rarity: 'COMMON',
        bonus: { def: 5, agi: 5 },
        description: '铜质戒指，古朴厚重，佩戴后身法更为稳健。'
    },
    {
        id: 'equip_005',
        name: '青钢剑',
        type: 'weapon',
        rarity: 'FINE',
        bonus: { atk: 20 },
        description: '以青钢锻制而成，剑身泛着寒光，是江湖中人常用的兵器。'
    },
    {
        id: 'equip_006',
        name: '柳叶刀',
        type: 'weapon',
        rarity: 'FINE',
        bonus: { atk: 15, agi: 5 },
        description: '刀身轻盈如柳叶，挥舞起来如行云流水，身法愈加灵活。'
    },
    {
        id: 'equip_007',
        name: '铁骨扇',
        type: 'weapon',
        rarity: 'FINE',
        bonus: { atk: 12, agi: 8 },
        description: '扇骨以精铁打造，开合之间暗藏玄机，攻防兼备。'
    },
    {
        id: 'equip_008',
        name: '精钢护心镜',
        type: 'armor',
        rarity: 'FINE',
        bonus: { def: 20 },
        description: '精钢打造的护心镜，护于心脉要害，能挡致命一击。'
    },
    {
        id: 'equip_009',
        name: '轻罗软甲',
        type: 'armor',
        rarity: 'FINE',
        bonus: { def: 12, agi: 8 },
        description: '以天蚕丝编织而成，轻如无物，身法丝毫不受束缚。'
    },
    {
        id: 'equip_010',
        name: '锁子甲',
        type: 'armor',
        rarity: 'FINE',
        bonus: { def: 18, hp: 20 },
        description: '千锤百炼的铁环锁扣而成，防护周全，更增气血。'
    },
    {
        id: 'equip_011',
        name: '玉佩',
        type: 'accessory',
        rarity: 'FINE',
        bonus: { hp: 30, agi: 5 },
        description: '温润的羊脂白玉佩，佩戴者气血平和，身法轻盈。'
    },
    {
        id: 'equip_012',
        name: '青铜护腕',
        type: 'accessory',
        rarity: 'FINE',
        bonus: { atk: 8, def: 8 },
        description: '护腕以青铜打造，攻防兼备，是江湖武人的常用之物。'
    },
    {
        id: 'equip_013',
        name: '流云靴',
        type: 'accessory',
        rarity: 'FINE',
        bonus: { agi: 15 },
        description: '靴上绣有流云纹，步履如踏云而行，身法大幅提升。'
    },
    {
        id: 'equip_014',
        name: '流星锤',
        type: 'weapon',
        rarity: 'RARE',
        bonus: { atk: 35, agi: 5 },
        description: '链锤上刻有流星纹路，舞动起来如流星坠地，势不可挡。'
    },
    {
        id: 'equip_015',
        name: '真武剑',
        type: 'weapon',
        rarity: 'RARE',
        bonus: { atk: 30, def: 10 },
        description: '传闻为真武大帝所佩之剑的仿制品，刚柔并济，攻守兼备。'
    },
    {
        id: 'equip_016',
        name: '玉笛',
        type: 'weapon',
        rarity: 'RARE',
        bonus: { atk: 25, agi: 12 },
        description: '由千年暖玉雕琢而成，看似乐器，实则为致命的兵器。'
    },
    {
        id: 'equip_017',
        name: '紫金软甲',
        type: 'armor',
        rarity: 'RARE',
        bonus: { def: 30, hp: 40 },
        description: '以混有紫金的天蚕丝编织，防护超凡，更能补益气血。'
    },
    {
        id: 'equip_018',
        name: '八卦道袍',
        type: 'armor',
        rarity: 'RARE',
        bonus: { def: 25, agi: 10, hp: 30 },
        description: '道袍上绣有八卦图案，暗含天地玄机，护佑穿戴者。'
    },
    {
        id: 'equip_019',
        name: '乌金重甲',
        type: 'armor',
        rarity: 'RARE',
        bonus: { def: 40, hp: 50 },
        description: '以稀有乌金打造，重若千斤，却坚不可摧，气血旺盛。'
    },
    {
        id: 'equip_020',
        name: '千年灵芝坠',
        type: 'accessory',
        rarity: 'RARE',
        bonus: { hp: 60, agi: 8 },
        description: '以千年灵芝雕琢而成的吊坠，佩戴者气血充盈，身轻如燕。'
    },
    {
        id: 'equip_021',
        name: '七星护符',
        type: 'accessory',
        rarity: 'RARE',
        bonus: { atk: 12, def: 12, agi: 8 },
        description: '刻有北斗七星的神秘护符，攻防身法全方位提升。'
    },
    {
        id: 'equip_022',
        name: '风火轮',
        type: 'accessory',
        rarity: 'RARE',
        bonus: { agi: 25, atk: 10 },
        description: '传闻为哪吒法宝的仿制品，佩戴者身法如风，攻击如火。'
    },
    {
        id: 'equip_023',
        name: '轩辕剑',
        type: 'weapon',
        rarity: 'LEGEND',
        bonus: { atk: 60, def: 15, agi: 10 },
        description: '上古神兵轩辕剑，剑出则风云变色，乃天下第一剑。'
    },
    {
        id: 'equip_024',
        name: '屠龙刀',
        type: 'weapon',
        rarity: 'LEGEND',
        bonus: { atk: 55, hp: 50 },
        description: '武林至尊宝刀，宝刀一出，谁与争锋，气血亦随之强盛。'
    },
    {
        id: 'equip_025',
        name: '玄武神甲',
        type: 'armor',
        rarity: 'LEGEND',
        bonus: { def: 55, hp: 80, agi: 10 },
        description: '以玄武之鳞炼制，防御力天下无双，更能大幅补益气血。'
    },
    {
        id: 'equip_026',
        name: '凤羽霓裳',
        type: 'armor',
        rarity: 'LEGEND',
        bonus: { def: 45, agi: 25, hp: 60 },
        description: '以凤凰羽毛编织，轻盈如无物，身法超凡，气血充盈。'
    },
    {
        id: 'equip_027',
        name: '东皇钟碎片',
        type: 'accessory',
        rarity: 'LEGEND',
        bonus: { atk: 20, def: 20, hp: 100, agi: 15 },
        description: '上古神器东皇钟的碎片，蕴含无穷力量，全属性大幅提升。'
    },
    {
        id: 'equip_028',
        name: '九转还魂珠',
        type: 'accessory',
        rarity: 'LEGEND',
        bonus: { hp: 150, agi: 20 },
        description: '蕴含九转回魂之力的宝珠，佩戴者气血异常充盈，身轻如羽。'
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
        effect: '身法+10，每回合回复50点生命',
        description: '调息吐纳，以意领气。修习后身轻体健，伤势自愈。',
        targeting: 'self',
        effects: [
            { trigger: 'onBattleStart', type: 'stat_buff', target: 'self', stat: 'agi', value: 10 },
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
    baseStats: { hp: 1000, atk: 100, def: 80, agi: 90 },
    description: '初入江湖的少年侠客，前途无量。',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=young%20chinese%20male%20warrior%20in%20black%20and%20red%20traditional%20armor%2C%20holding%20long%20sword%2C%20wuxia%20style%2C%20portrait%2C%20handsome%2C%20confident%2C%20sunset%20background&image_size=square_hd',
    innateSkill: {
        name: '江湖新秀',
        description: '身法+10，攻击时有15%几率造成暴击',
        effect: { type: 'stat_boost', stat: 'agi', value: 10 },
        passiveEffect: { type: 'crit_chance', value: 0.15 }
    }
};
