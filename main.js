document.addEventListener("DOMContentLoaded", () => {
    const effectDropdown = document.getElementById("effect-selector");
    const controlsContainer = document.getElementById("effect-controls");

    if (!effectDropdown) {
        console.error("Ошибка: не найден элемент с id='effect-selector'");
        return;
    }

    // Загружаем эффект при выборе
    effectDropdown.addEventListener("change", (event) => {
        loadEffect(event.target.value);
    });

    // Загружаем грид сразу при старте
    loadEffect("grid");

    function loadEffect(effectName) {
        clearCanvas();
        clearControls();

        if (effectName === "grid") {
            import("./js/grid.js").then((module) => {
                module.initGrid(controlsContainer);
            }).catch((err) => console.error("Ошибка загрузки эффекта:", err));
        }
    }

    function clearCanvas() {
        const canvasContainer = document.getElementById("canvas-panel");
        if (canvasContainer) {
            canvasContainer.innerHTML = ""; // Удаляем предыдущий Canvas
        } else {
            console.error("Ошибка: не найден элемент с id='canvas-panel'");
        }
    }

    function clearControls() {
        controlsContainer.innerHTML = ""; // Очищаем контроллеры
    }
});
