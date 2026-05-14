const App = {
    init() {
        GameState.init();
        initMain();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
