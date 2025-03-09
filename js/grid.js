let gridType = "lines"; // Тип сетки по умолчанию
let cellSize = 50; // Размер ячеек
let squareSpacing = 5; // Отступ между квадратами
let p5Instance; // Переменная для хранения экземпляра p5.js

export function initGrid(controlsContainer) {
    // Очищаем панель перед добавлением контроллеров
    controlsContainer.innerHTML = "";

    setupControls(controlsContainer);

    const canvasContainer = document.getElementById("canvas-panel");

    // Если `p5Instance` уже существует, удаляем его перед созданием нового
    if (p5Instance) {
        p5Instance.remove();
    }

    p5Instance = new p5((p) => {
        p.setup = function () {
            let canvas = p.createCanvas(canvasContainer.clientWidth, canvasContainer.clientHeight);
            canvas.parent(canvasContainer);

            // Убираем max-width, чтобы Canvas растягивался на всю ширину
            canvas.elt.style.maxWidth = "none";
            canvas.elt.style.width = "100%";

            p.noLoop();

            // Рисуем сетку сразу при загрузке
            drawGrid(p);
        };

        function drawGrid(p) {
            p.clear();
            p.background(0);
            p.stroke(255);
            p.fill(255, 50);

            if (gridType === "lines") {
                drawGridLines(p);
            } else if (gridType === "squares") {
                drawGridSquares(p);
            } else if (gridType === "circles") {
                drawGridCircles(p);
            }
        }

        function drawGridLines(p) {
            for (let x = 0; x <= p.width; x += cellSize) {
                p.line(x, 0, x, p.height);
            }
            for (let y = 0; y <= p.height; y += cellSize) {
                p.line(0, y, p.width, y);
            }
        }

        function drawGridSquares(p) {
            p.noStroke();
            p.fill(255, 100);
            for (let x = 0; x < p.width; x += cellSize + squareSpacing) {
                for (let y = 0; y < p.height; y += cellSize + squareSpacing) {
                    p.rect(x, y, cellSize, cellSize);
                }
            }
        }

        function drawGridCircles(p) {
            p.noStroke();
            p.fill(255, 100);
            for (let x = 0; x < p.width; x += cellSize) {
                for (let y = 0; y < p.height; y += cellSize) {
                    p.ellipse(x + cellSize / 2, y + cellSize / 2, cellSize * 0.8);
                }
            }
        }

        // Функция обновления грида без пересоздания p5.js
        window.updateGrid = function () {
            drawGrid(p);
        };
    });
}

function setupControls(container) {
    // Дропдаун для выбора типа грида
    const gridTypeLabel = document.createElement("label");
    gridTypeLabel.textContent = "Тип сетки:";
    container.appendChild(gridTypeLabel);

    const gridTypeSelect = document.createElement("select");
    gridTypeSelect.classList.add("w-full", "p-2", "mb-4", "bg-gray-700", "text-white", "rounded");

    const options = [
        { value: "lines", text: "Линии" },
        { value: "squares", text: "Квадраты" },
        { value: "circles", text: "Круги" }
    ];

    options.forEach(opt => {
        const option = document.createElement("option");
        option.value = opt.value;
        option.textContent = opt.text;
        gridTypeSelect.appendChild(option);
    });

    gridTypeSelect.value = gridType;
    gridTypeSelect.addEventListener("change", (event) => {
        gridType = event.target.value;
        updateGrid(); // Перерисовка без создания нового Canvas
        updateControls(container);
    });

    container.appendChild(gridTypeSelect);

    updateControls(container);
}

function updateControls(container) {
    // Удаляем все контроллеры, кроме дропдауна
    container.querySelectorAll("label, input").forEach(el => el.remove());

    // Ползунок для размера ячеек
    const sizeLabel = document.createElement("label");
    sizeLabel.textContent = "Размер ячеек:";
    container.appendChild(sizeLabel);

    const sizeInput = document.createElement("input");
    sizeInput.type = "range";
    sizeInput.min = "10";
    sizeInput.max = "100";
    sizeInput.value = cellSize;
    sizeInput.classList.add("w-full", "mb-4");

    sizeInput.addEventListener("input", (event) => {
        cellSize = parseInt(event.target.value);
        updateGrid(); // Перерисовка без удаления Canvas
    });

    container.appendChild(sizeInput);

    // Добавляем контроллер для отступов между квадратами, если выбраны квадраты
    if (gridType === "squares") {
        const spacingLabel = document.createElement("label");
        spacingLabel.textContent = "Отступ между квадратами:";
        container.appendChild(spacingLabel);

        const spacingInput = document.createElement("input");
        spacingInput.type = "range";
        spacingInput.min = "0";
        spacingInput.max = "20";
        spacingInput.value = squareSpacing;
        spacingInput.classList.add("w-full", "mb-4");

        spacingInput.addEventListener("input", (event) => {
            squareSpacing = parseInt(event.target.value);
            updateGrid(); // Перерисовка без удаления Canvas
        });

        container.appendChild(spacingInput);
    }
}