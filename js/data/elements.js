const ELEMENTS = {
    METAL: '金',
    WOOD: '木',
    WATER: '水',
    FIRE: '火',
    EARTH: '土'
};

const ELEMENT_OVERCOME = {
    '金': '木',
    '木': '土',
    '土': '水',
    '水': '火',
    '火': '金'
};

const ELEMENT_GENERATE = {
    '金': '水',
    '水': '木',
    '木': '火',
    '火': '土',
    '土': '金'
};

const ELEMENT_ICONS = {
    '金': '⚔',
    '木': '🌿',
    '水': '💧',
    '火': '🔥',
    '土': '🪨'
};

function getElementModifier(atkElement, defElement) {
    if (ELEMENT_OVERCOME[atkElement] === defElement) return 1.3;
    if (ELEMENT_OVERCOME[defElement] === atkElement) return 0.8;
    return 1.0;
}

function hasElementSynergy(teamElements) {
    const bonuses = {};
    for (let i = 0; i < teamElements.length; i++) {
        for (let j = 0; j < teamElements.length; j++) {
            if (i !== j && ELEMENT_GENERATE[teamElements[i]] === teamElements[j]) {
                bonuses[teamElements[i]] = (bonuses[teamElements[i]] || 0) + 0.1;
            }
        }
    }
    return bonuses;
}
