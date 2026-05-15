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
        imageUrl: '',
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
        imageUrl: '',
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
    },
    {
        id: 'skill_009',
        name: '金刚掌',
        type: 'active_attack',
        rarity: 'COMMON',
        multiplier: 1.0,
        effect: '对单体敌人造成自身攻击力100%的伤害',
        description: '少林入门掌法，看似平淡无奇，实则刚猛有力。',
        targeting: 'single_enemy',
        effects: [
            { trigger: 'onUse', type: 'damage', target: 'enemy', base: 'atk', multiplier: 1.0 }
        ]
    },
    {
        id: 'skill_010',
        name: '轻功水上飘',
        type: 'passive_buff',
        rarity: 'COMMON',
        multiplier: 0,
        effect: '身法+8，闪避率提升5%',
        description: '习得轻功要诀，身轻如燕，步履如风。',
        targeting: 'self',
        effects: [
            { trigger: 'onBattleStart', type: 'stat_buff', target: 'self', stat: 'agi', value: 8 }
        ]
    },
    {
        id: 'skill_011',
        name: '金钟罩',
        type: 'passive_buff',
        rarity: 'FINE',
        multiplier: 0,
        effect: '战斗开始时获得最大生命值30%的护盾',
        description: '佛门护体神功，罩门一现，金钟即破。罩门坚固时，刀枪不入。',
        targeting: 'self',
        effects: [
            { trigger: 'onBattleStart', type: 'shield', target: 'self', base: 'maxHp', multiplier: 0.3 }
        ]
    },
    {
        id: 'skill_012',
        name: '九阴真经',
        type: 'passive_buff',
        rarity: 'RARE',
        multiplier: 0,
        effect: '攻击+15，生命值低于50%时攻击提升30%',
        description: '武林至高心法，阴柔狠辣，练至大成，天下无敌。',
        targeting: 'self',
        effects: [
            { trigger: 'onBattleStart', type: 'stat_buff', target: 'self', stat: 'atk', value: 15 }
        ]
    },
    {
        id: 'skill_013',
        name: '九阳神功',
        type: 'passive_buff',
        rarity: 'RARE',
        multiplier: 0,
        effect: '生命+80，每回合回复40点生命',
        description: '少林至高内功，阳刚醇厚，练至大成，百毒不侵。',
        targeting: 'self',
        effects: [
            { trigger: 'onBattleStart', type: 'stat_buff', target: 'self', stat: 'hp', value: 80 },
            { trigger: 'onTurnEnd', type: 'heal', target: 'self', value: 40 }
        ]
    },
    {
        id: 'skill_014',
        name: '太极拳',
        type: 'active_attack',
        rarity: 'FINE',
        multiplier: 0.6,
        effect: '对单体敌人造成60%伤害，附带借力打力的反击效果',
        description: '以柔克刚，四两拨千斤。后发制人，借力打力。',
        targeting: 'single_enemy',
        effects: [
            { trigger: 'onUse', type: 'damage', target: 'enemy', base: 'atk', multiplier: 0.6 }
        ]
    },
    {
        id: 'skill_015',
        name: '降龙十八掌',
        type: 'active_attack',
        rarity: 'LEGEND',
        multiplier: 2.5,
        effect: '对单体敌人造成250%攻击力的伤害，无视敌人20%防御',
        description: '丐帮镇帮绝学，掌力刚猛天下第一，一掌既出，有若排山倒海。',
        targeting: 'single_enemy',
        effects: [
            { trigger: 'onUse', type: 'damage', target: 'enemy', base: 'atk', multiplier: 2.5 }
        ]
    },
    {
        id: 'skill_016',
        name: '打狗棒法',
        type: 'active_attack',
        rarity: 'RARE',
        multiplier: 1.2,
        effect: '对单体敌人造成120%攻击力的伤害，30%几率使敌人中毒',
        description: '丐帮另一绝学，棒法精妙绝伦，专克武林高手。',
        targeting: 'single_enemy',
        effects: [
            { trigger: 'onUse', type: 'damage', target: 'enemy', base: 'atk', multiplier: 1.2 }
        ]
    },
    {
        id: 'skill_017',
        name: '六脉神剑',
        type: 'active_attack',
        rarity: 'LEGEND',
        multiplier: 2.0,
        effect: '对单体敌人造成200%攻击力的伤害，附带剑气封锁',
        description: '大理段氏绝学，以深厚内力催动六脉剑气，无形无相，杀人于无形。',
        targeting: 'single_enemy',
        effects: [
            { trigger: 'onUse', type: 'damage', target: 'enemy', base: 'atk', multiplier: 2.0 }
        ]
    },
    {
        id: 'skill_018',
        name: '凌波微步',
        type: 'passive_buff',
        rarity: 'RARE',
        multiplier: 0,
        effect: '身法+20，闪避率提升15%',
        description: '逍遥派绝学，踏奇门，循八卦，步履轻盈，来去如风。',
        targeting: 'self',
        effects: [
            { trigger: 'onBattleStart', type: 'stat_buff', target: 'self', stat: 'agi', value: 20 }
        ]
    },
    {
        id: 'skill_019',
        name: '北冥神功',
        type: 'passive_buff',
        rarity: 'LEGEND',
        multiplier: 0,
        effect: '攻击+25，身法+15，吸取敌人10%攻击力',
        description: '逍遥派至高内功，吸人内力化为己用，海纳百川，有容乃大。',
        targeting: 'self',
        effects: [
            { trigger: 'onBattleStart', type: 'stat_buff', target: 'self', stat: 'atk', value: 25 },
            { trigger: 'onBattleStart', type: 'stat_buff', target: 'self', stat: 'agi', value: 15 }
        ]
    },
    {
        id: 'skill_020',
        name: '独孤九剑',
        type: 'active_attack',
        rarity: 'LEGEND',
        multiplier: 2.2,
        effect: '对单体敌人造成220%攻击力的伤害，忽视敌人50%防御',
        description: '剑魔独孤求败所创，破尽天下武功，无招胜有招。',
        targeting: 'single_enemy',
        effects: [
            { trigger: 'onUse', type: 'damage', target: 'enemy', base: 'atk', multiplier: 2.2 }
        ]
    },
    {
        id: 'skill_021',
        name: '化骨绵掌',
        type: 'active_attack',
        rarity: 'RARE',
        multiplier: 0.9,
        effect: '对单体敌人造成90%攻击力的伤害，使其中毒3回合',
        description: '武当派阴毒掌法，掌力绵软，中者骨软筋麻，生不如死。',
        targeting: 'single_enemy',
        effects: [
            { trigger: 'onUse', type: 'damage', target: 'enemy', base: 'atk', multiplier: 0.9 }
        ]
    },
    {
        id: 'skill_022',
        name: '一阳指',
        type: 'active_attack',
        rarity: 'FINE',
        multiplier: 1.1,
        effect: '对单体敌人造成110%攻击力的伤害，附带10%生命偷取',
        description: '大理段氏入门绝学，以纯阳指力点穴制敌，可攻可守。',
        targeting: 'single_enemy',
        effects: [
            { trigger: 'onUse', type: 'damage', target: 'enemy', base: 'atk', multiplier: 1.1 },
            { trigger: 'onDamageDealt', type: 'lifesteal', target: 'self', multiplier: 0.1 }
        ]
    },
    {
        id: 'skill_023',
        name: '吸星大法',
        type: 'passive_buff',
        rarity: 'RARE',
        multiplier: 0,
        effect: '每次攻击时吸取敌人15%攻击力',
        description: '日月神教镇教之宝，吸取他人内力，化为己用。',
        targeting: 'self',
        effects: [
            { trigger: 'onDamageDealt', type: 'lifesteal', target: 'self', multiplier: 0.15 }
        ]
    },
    {
        id: 'skill_024',
        name: '寒冰真气',
        type: 'passive_buff',
        rarity: 'FINE',
        multiplier: 0,
        effect: '攻击+10，攻击时有20%几率冻结敌人1回合',
        description: '嵩山派至高内功，寒气逼人，中者血液凝固，动弹不得。',
        targeting: 'self',
        effects: [
            { trigger: 'onBattleStart', type: 'stat_buff', target: 'self', stat: 'atk', value: 10 }
        ]
    },
    {
        id: 'skill_025',
        name: '易筋经',
        type: 'passive_buff',
        rarity: 'LEGEND',
        multiplier: 0,
        effect: '生命+200，防御+30，每回合回复30点生命',
        description: '少林寺镇寺之宝，洗髓伐毛，易筋锻骨，练至大成，金刚不坏。',
        targeting: 'self',
        effects: [
            { trigger: 'onBattleStart', type: 'stat_buff', target: 'self', stat: 'hp', value: 200 },
            { trigger: 'onBattleStart', type: 'stat_buff', target: 'self', stat: 'def', value: 30 },
            { trigger: 'onTurnEnd', type: 'heal', target: 'self', value: 30 }
        ]
    },
    {
        id: 'skill_026',
        name: '金蛇剑法',
        type: 'active_attack',
        rarity: 'RARE',
        multiplier: 1.3,
        effect: '对单体敌人造成130%攻击力的伤害，连击2次',
        description: '金蛇郎君夏雪宜所创，剑走偏锋，诡异难防，迅捷如蛇。',
        targeting: 'single_enemy',
        effects: [
            { trigger: 'onUse', type: 'damage', target: 'enemy', base: 'atk', multiplier: 1.3 }
        ]
    },
    {
        id: 'skill_027',
        name: '玄冥神掌',
        type: 'active_attack',
        rarity: 'RARE',
        multiplier: 1.4,
        effect: '对单体敌人造成140%攻击力的伤害，使敌人防御降低20%持续2回合',
        description: '玄冥二老独门掌法，掌力阴毒，中者寒入骨髓，生机渐失。',
        targeting: 'single_enemy',
        effects: [
            { trigger: 'onUse', type: 'damage', target: 'enemy', base: 'atk', multiplier: 1.4 }
        ]
    },
    {
        id: 'skill_028',
        name: '玉女剑法',
        type: 'active_attack',
        rarity: 'FINE',
        multiplier: 0.9,
        effect: '对单体敌人造成90%攻击力的伤害，30%几率回复自身30点生命',
        description: '古墓派剑法，轻柔飘逸，优美如仙，攻守兼备。',
        targeting: 'single_enemy',
        effects: [
            { trigger: 'onUse', type: 'damage', target: 'enemy', base: 'atk', multiplier: 0.9 },
            { trigger: 'onTurnEnd', type: 'heal', target: 'self', value: 30 }
        ]
    },
    {
        id: 'skill_029',
        name: '万剑归宗',
        type: 'active_attack',
        rarity: 'LEGEND',
        multiplier: 1.8,
        effect: '对所有敌人造成180%攻击力的伤害',
        description: '剑道至高境界，万剑齐发，剑气纵横，天下无敌。',
        targeting: 'all_enemies',
        effects: [
            { trigger: 'onUse', type: 'damage', target: 'enemy', base: 'atk', multiplier: 1.8 }
        ]
    },
    {
        id: 'skill_030',
        name: '兰花拂穴手',
        type: 'control',
        rarity: 'FINE',
        multiplier: 0,
        effect: '使一名敌人定身1回合，攻击时有50%几率使敌人眩晕',
        description: '桃花岛绝学，姿势优雅，却暗藏杀机，点穴制敌于无形。',
        targeting: 'random_enemy',
        effects: [
            { trigger: 'onUse', type: 'control', target: 'enemy', duration: 1 }
        ]
    },
    {
        id: 'skill_031',
        name: '蛤蟆功',
        type: 'active_attack',
        rarity: 'RARE',
        multiplier: 1.6,
        effect: '对单体敌人造成160%攻击力的伤害，若自身生命低于30%则伤害提升50%',
        description: '西毒欧阳锋独门绝学，蓄力一击，势若雷霆，凶猛无比。',
        targeting: 'single_enemy',
        effects: [
            { trigger: 'onUse', type: 'damage', target: 'enemy', base: 'atk', multiplier: 1.6 }
        ]
    },
    {
        id: 'skill_032',
        name: '左右互搏术',
        type: 'passive_buff',
        rarity: 'LEGEND',
        multiplier: 0,
        effect: '攻击+30，暴击率+20%，每回合攻击两次',
        description: '老顽童周伯通所创，一心二用，左右开弓，威力倍增。',
        targeting: 'self',
        effects: [
            { trigger: 'onBattleStart', type: 'stat_buff', target: 'self', stat: 'atk', value: 30 }
        ]
    },
    {
        id: 'skill_033',
        name: '天女散花',
        type: 'active_attack',
        rarity: 'FINE',
        multiplier: 0.7,
        effect: '对所有敌人造成70%攻击力的伤害',
        description: '以深厚内力将花瓣如暗器般射出，如天女散花，范围广大。',
        targeting: 'all_enemies',
        effects: [
            { trigger: 'onUse', type: 'damage', target: 'enemy', base: 'atk', multiplier: 0.7 }
        ]
    },
    {
        id: 'skill_034',
        name: '圣火令',
        type: 'active_attack',
        rarity: 'LEGEND',
        multiplier: 1.5,
        effect: '对单体敌人造成150%攻击力的伤害，30%几率使敌人灼烧3回合',
        description: '波斯圣火教镇教之宝，令出如山，掌法诡异，火焰缠身。',
        targeting: 'single_enemy',
        effects: [
            { trigger: 'onUse', type: 'damage', target: 'enemy', base: 'atk', multiplier: 1.5 }
        ]
    },
    {
        id: 'skill_035',
        name: '神照经',
        type: 'heal',
        rarity: 'RARE',
        multiplier: 0.8,
        effect: '为生命值最低的友方回复自身攻击力80%的生命',
        description: '铁骨扇传人独有内功，起死回生，疗伤续命，妙手回春。',
        targeting: 'lowest_hp_ally',
        effects: [
            { trigger: 'onUse', type: 'heal', target: 'ally', base: 'atk', multiplier: 0.8 }
        ]
    },
    {
        id: 'skill_036',
        name: '先天功',
        type: 'passive_buff',
        rarity: 'LEGEND',
        multiplier: 0,
        effect: '生命+150，防御+25，身法+20，每回合回复50点生命',
        description: '全真教至高内功，返璞归真，先天之境，天人合一。',
        targeting: 'self',
        effects: [
            { trigger: 'onBattleStart', type: 'stat_buff', target: 'self', stat: 'hp', value: 150 },
            { trigger: 'onBattleStart', type: 'stat_buff', target: 'self', stat: 'def', value: 25 },
            { trigger: 'onBattleStart', type: 'stat_buff', target: 'self', stat: 'agi', value: 20 },
            { trigger: 'onTurnEnd', type: 'heal', target: 'self', value: 50 }
        ]
    },
    {
        id: 'skill_037',
        name: '九阴白骨爪',
        type: 'active_attack',
        rarity: 'RARE',
        multiplier: 1.25,
        effect: '对单体敌人造成125%攻击力的伤害无视20%防御',
        description: '九阴真经中的阴毒招式，爪利如钩，破颅夺命。',
        targeting: 'single_enemy',
        effects: [
            { trigger: 'onUse', type: 'damage', target: 'enemy', base: 'atk', multiplier: 1.25 }
        ]
    },
    {
        id: 'skill_038',
        name: '黯然销魂掌',
        type: 'active_attack',
        rarity: 'LEGEND',
        multiplier: 2.3,
        effect: '对单体敌人造成230%攻击力的伤害，生命值越低伤害越高',
        description: '杨过自创绝学，心伤神伤，掌力随情绪而动，悲痛之时，威力无穷。',
        targeting: 'single_enemy',
        effects: [
            { trigger: 'onUse', type: 'damage', target: 'enemy', base: 'atk', multiplier: 2.3 }
        ]
    },
    {
        id: 'skill_039',
        name: '七伤拳',
        type: 'active_attack',
        rarity: 'FINE',
        multiplier: 1.15,
        effect: '对单体敌人造成115%攻击力的伤害，但自身损失10%当前生命',
        description: '崆峒派绝学，一练七伤，伤人伤己，凶险万分。',
        targeting: 'single_enemy',
        effects: [
            { trigger: 'onUse', type: 'damage', target: 'enemy', base: 'atk', multiplier: 1.15 }
        ]
    },
    {
        id: 'skill_040',
        name: '拈花微笑',
        type: 'heal',
        rarity: 'FINE',
        multiplier: 0.6,
        effect: '为所有友方回复自身攻击力60%的生命',
        description: '少林寺至高佛法，以慈悲之心疗伤救世，普度众生。',
        targeting: 'all_allies',
        effects: [
            { trigger: 'onUse', type: 'heal', target: 'ally', base: 'atk', multiplier: 0.6 }
        ]
    },
    {
        id: 'skill_041',
        name: '吸劲锁脉',
        type: 'control',
        rarity: 'FINE',
        multiplier: 0,
        effect: '使一名敌人定身2回合',
        description: '星宿派阴毒手法，封人穴道，令人全身劲力尽失。',
        targeting: 'random_enemy',
        effects: [
            { trigger: 'onUse', type: 'control', target: 'enemy', duration: 2 }
        ]
    },
    {
        id: 'skill_042',
        name: '天山折梅手',
        type: 'active_attack',
        rarity: 'RARE',
        multiplier: 1.1,
        effect: '对单体敌人造成110%攻击力的伤害，有40%几率使敌人眩晕1回合',
        description: '天山童姥绝学，能将敌人兵器夺下，化解天下任何招式。',
        targeting: 'single_enemy',
        effects: [
            { trigger: 'onUse', type: 'damage', target: 'enemy', base: 'atk', multiplier: 1.1 }
        ]
    },
    {
        id: 'skill_043',
        name: '八荒六合唯我独尊',
        type: 'passive_buff',
        rarity: 'LEGEND',
        multiplier: 0,
        effect: '生命+300，攻击+40，防御+35，但每回合损失20点生命',
        description: '天山童姥独门神功，威力惊天，却需以鲜血为引。',
        targeting: 'self',
        effects: [
            { trigger: 'onBattleStart', type: 'stat_buff', target: 'self', stat: 'hp', value: 300 },
            { trigger: 'onBattleStart', type: 'stat_buff', target: 'self', stat: 'atk', value: 40 },
            { trigger: 'onBattleStart', type: 'stat_buff', target: 'self', stat: 'def', value: 35 }
        ]
    },
    {
        id: 'skill_044',
        name: '无相神功',
        type: 'passive_buff',
        rarity: 'FINE',
        multiplier: 0,
        effect: '防御+15，生命值低于30%时获得30%伤害减免',
        description: '少林七十二绝技之一，无相无形，防御天下至刚。',
        targeting: 'self',
        effects: [
            { trigger: 'onBattleStart', type: 'stat_buff', target: 'self', stat: 'def', value: 15 }
        ]
    },
    {
        id: 'skill_045',
        name: '龙象般若功',
        type: 'passive_buff',
        rarity: 'RARE',
        multiplier: 0,
        effect: '攻击+20，生命+50',
        description: '密宗至高护法神功，力近龙象，共分十三层，每层力量倍增。',
        targeting: 'self',
        effects: [
            { trigger: 'onBattleStart', type: 'stat_buff', target: 'self', stat: 'atk', value: 20 },
            { trigger: 'onBattleStart', type: 'stat_buff', target: 'self', stat: 'hp', value: 50 }
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
    imageUrl: '',
    innateSkill: {
        name: '江湖新秀',
        description: '身法+10，攻击时有15%几率造成暴击',
        effect: { type: 'stat_boost', stat: 'agi', value: 10 },
        passiveEffect: { type: 'crit_chance', value: 0.15 }
    }
};
