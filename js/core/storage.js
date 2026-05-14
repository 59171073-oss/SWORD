const Storage = {
    KEY: 'wuxia_card_game_save',

    save(data) {
        try {
            localStorage.setItem(this.KEY, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('保存失败:', e);
            return false;
        }
    },

    load() {
        try {
            const data = localStorage.getItem(this.KEY);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('加载失败:', e);
            return null;
        }
    },

    clear() {
        localStorage.removeItem(this.KEY);
    }
};
