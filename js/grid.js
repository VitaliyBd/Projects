let gridType = "lines"; // Тип сетки по умолчанию
let cellSize = 50; // Размер ячеек
let squareSpacing = 5; // Отступ между квадратами
let lineWidth = 1; // Толщина линий
let gridColor = "#ffffff"; // Цвет сетки (по умолчанию белый)
let shapeColor = "#ffffff"; // Цвет квадратов и кругов
let bgColor = "#000000"; // Цвет фона
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
            p.background(bgColor);
            p.stroke(gridColor);
            p.fill(shapeColor);

            if (gridType === "lines") {
                drawGridLines(p);
            } else if (gridType === "squares") {
                drawGridSquares(p);
            } else if (gridType === "circles") {
                drawGridCircles(p);
            }
        }

        function drawGridLines(p) {
            p.strokeWeight(lineWidth);
            for (let x = 0; x <= p.width; x += cellSize) {
                p.line(x, 0, x, p.height);
            }
            for (let y = 0; y <= p.height; y += cellSize) {
                p.line(0, y, p.width, y);
            }
        }

        function drawGridSquares(p) {
            p.noStroke();
            p.fill(shapeColor);
            for (let x = 0; x < p.width; x += cellSize + squareSpacing) {
                for (let y = 0; y < p.height; y += cellSize + squareSpacing) {
                    p.rect(x, y, cellSize, cellSize);
                }
            }
        }

        function drawGridCircles(p) {
            p.noStroke();
            p.fill(shapeColor);
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
        updateGrid();
        updateControls(container);
    });

    container.appendChild(gridTypeSelect);

    updateControls(container);
}

function updateControls(container) {
    // Удаляем все контроллеры, кроме дропдауна
    container.querySelectorAll("label, input").forEach(el => el.remove());

    // Ползунок для размера ячеек
    createSlider(container, "Размер ячеек:", 10, 100, cellSize, (value) => {
        cellSize = value;
        updateGrid();
    });

    // Ползунок для толщины линий (только для линий)
    if (gridType === "lines") {
        createSlider(container, "Толщина линий:", 1, 50, lineWidth, (value) => {
            lineWidth = value;
            updateGrid();
        });
    }

    // Ползунок для отступов между квадратами (только для квадратов)
    if (gridType === "squares") {
        createSlider(container, "Отступ между квадратами:", 0, 20, squareSpacing, (value) => {
            squareSpacing = value;
            updateGrid();
        });
    }

    // Цвет линий (если выбраны линии)
    if (gridType === "lines") {
        createColorPicker(container, "Цвет линий:", gridColor, (value) => {
            gridColor = value;
            updateGrid();
        });
    }

    // Цвет квадратов и кругов
    if (gridType === "squares" || gridType === "circles") {
        createColorPicker(container, "Цвет фигур:", shapeColor, (value) => {
            shapeColor = value;
            updateGrid();
        });
    }

    // Цвет фона (доступен всегда)
    createColorPicker(container, "Цвет фона:", bgColor, (value) => {
        bgColor = value;
        updateGrid();
    });
}

// Функция создания слайдера
function createSlider(container, label, min, max, value, callback) {
    const sliderLabel = document.createElement("label");
    sliderLabel.textContent = label;
    container.appendChild(sliderLabel);

    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = min;
    slider.max = max;
    slider.value = value;
    slider.classList.add("w-full", "mb-4");

    slider.addEventListener("input", (event) => {
        callback(parseInt(event.target.value));
    });

    container.appendChild(slider);
}

// Функция создания color picker'а
function createColorPicker(container, label, value, callback) {
    const colorLabel = document.createElement("label");
    colorLabel.textContent = label;
    container.appendChild(colorLabel);

    const colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.value = value;
    colorInput.classList.add("w-full", "mb-4");

    colorInput.addEventListener("input", (event) => {
        callback(event.target.value);
    });

    container.appendChild(colorInput);
}
