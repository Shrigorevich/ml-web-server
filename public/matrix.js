const CANVAS_SIZE = 900; // pixels
const CELL_SIZE = 10; // pixels

const DEFAULT_SCALE = 2;
const SCALE_BY = 0.95;
const MIN_SCALE = 0.7; //CANVAS_SIZE / (CELL_SIZE * 500); // where 150 is width/height of visible area
const MAX_SCALE = 10 //CANVAS_SIZE / (CELL_SIZE * 25); // where 10 is width/height of visible area

const palette = {
    default: "#909090",
    selected: "#388D0D",
    guildhall: "#CF0404",
    wall: "#0445CF",
    arena: "#6C00C1",
    warehouse: "#DAD300",
    smithy: "#000526"
}

class Cell {
    x;
    y;
    type = "";
    purpose = "";

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Template {
    dimensionX;
    dimensionY;
    name;

    constructor(dimensionX, dimensionY, name) {
        this.dimensionX = dimensionX;
        this.dimensionY = dimensionY;
        this.name = name;
    }
}

var layerForSites;
var stage;
var currentScale = DEFAULT_SCALE;
var activeTemplate;
const selectedCells = new Map();
const selectedRects = new Map();
const savedCells = new Map();
const allRects = new Map();

window.onload = () => {
    localStorage.clear();
    Konva.dragButtons = [2];
    stage = new Konva.Stage({
        container: "container",
        width: CANVAS_SIZE,
        height: CANVAS_SIZE,
        draggable: true,
        // dragBoundFunc: function (pos) {
        //     //const blocksToDraw = scaleToBlocks(currentScale);
        //     var x = -Math.floor(pos.x / (CELL_SIZE * currentScale));
        //     var y = -Math.floor(pos.y / (CELL_SIZE * currentScale));
        //     //console.log(y, x);
        //     let newX = pos.x;
        //     let newY = pos.y;
        //     if (x < 0) {
        //         console.log("left");
        //         newX = 1249 * stage.scaleX() * CELL_SIZE;
        //     }
        //     if (y < 0) {
        //         console.log("top");
        //         newY = -251 * stage.scaleY() * CELL_SIZE;
        //     }
        //     return {
        //         x: newX,
        //         y: newY,
        //     };
        // },
        scaleX: currentScale,
        scaleY: currentScale,
    });

    layerForSites = new Konva.Layer();
    layerForSites.setZIndex(2);
    stage.add(layerForSites);
    setupStageEvents();
    setupLayerEvents();

    fetchTemplates();
}

function setupLayerEvents() {
    layerForSites.on("mouseover", (e) => {
        let box = e.target;
        box.opacity(1);
        box.draw();

        if (e.evt.shiftKey && e.evt.buttons === 1) {
            changeCellStatus(e.target)
        }
    });

    layerForSites.on("mouseout", (e) => {
        let box = e.target;
        box.opacity(0.5);
        box.draw();
    });

    layerForSites.on("click", (e) => {

        showCellData(e.target);

        if (e.evt.shiftKey) {
            changeCellStatus(e.target);
        }
    })
}

function changeCellStatus(target) {
    let x = target.getX() / CELL_SIZE;
    let y = target.getY() / CELL_SIZE;
    let key = getKey(x, y);
    if (!selectedCells.has(key)) {
        selectedCells.set(key, new Cell(x, y));
    } else {
        selectedCells.delete(key);
    }
    if (!selectedRects.has(key)) {
        target.fill(palette.selected);
        selectedRects.set(key, target);
    } else {
        if (savedCells.has(key)) {
            target.fill(palette[savedCells.get(key).purpose]);
        } else {
            target.fill(palette.default);
        }
        selectedRects.delete(key);
    }
    target.draw();
}

function setupStageEvents() {
    stage.on("wheel", (e) => {
        console.log("ScaleX: ", stage.scaleX());
        e.evt.preventDefault();

        var oldScale = stage.scaleX();
        var pointer = stage.getPointerPosition();

        var newScale =
            e.evt.deltaY > 0 ? oldScale * SCALE_BY : oldScale / SCALE_BY;

        var mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };

        if (newScale > MAX_SCALE || newScale < MIN_SCALE) return;

        currentScale = newScale;

        stage.scale({ x: currentScale, y: currentScale });

        var newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };
        stage.position(newPos);
        stage.batchDraw();
    });

    stage.on("dragend", (e) => {
    });

    stage.on("click", (e) => {
        //console.log(stage.x(), stage.y());
    });

    stage.on("mousemove", (e) => {
        var coord = stage.getPointerPosition();

        const offsetX = -stage.x() / (CELL_SIZE * currentScale);
        const offsetY = -stage.y() / (CELL_SIZE * currentScale);

        var x = Math.floor(coord.x / (CELL_SIZE * currentScale) + offsetX);
        var y = Math.floor(coord.y / (CELL_SIZE * currentScale) + offsetY);

        document.getElementById(
            "pointer-position"
        ).innerHTML = `X: ${x}; Y: ${y}`;
    });
}

function createDefaultRect(x, y) {
    var rect = new Konva.Rect({
        x: x * CELL_SIZE,
        y: y * CELL_SIZE,
        width: CELL_SIZE,
        height: CELL_SIZE,
        fill: palette.default,
        opacity: 0.5,
        stroke: "#000",
        strokeWidth: 0.7,
        perfectDrawEnabled: false,
    });

    layerForSites.add(rect);
    return rect;
}

function createCustomRect(x, y, purpose) {
    var rect = new Konva.Rect({
        x: x * CELL_SIZE,
        y: y * CELL_SIZE,
        width: CELL_SIZE,
        height: CELL_SIZE,
        fill: palette[purpose],
        opacity: 0.5,
        stroke: "#000",
        strokeWidth: 0.7,
        perfectDrawEnabled: false,
    });

    layerForSites.add(rect);
    return rect;
}

function initTemplate() {
    stage.clear();
    selectedCells.clear();
    savedCells.clear();

    let x = $("#x").val();
    let y = $("#y").val();
    let name = $("#tname").val();

    if (!x || !y || !name) {
        alert("Enter all data");
    } else {
        layerForSites.destroyChildren();

        for (let i = 0; i < x; i++) {
            for (let j = 0; j < y; j++) {
                const rect = createDefaultRect(i, j);
                allRects.set(getKey(i, j), rect);
            }
        }

        activeTemplate = new Template(x, y, name);
        storeTemplateCredential(activeTemplate);
        currentScale = CANVAS_SIZE / x / CELL_SIZE;
        stage.scale({ x: currentScale, y: currentScale });
        stage.draw();
        localStorage.setItem("activeTemplate", activeTemplate.name);
    }
}

function storeTemplateCredential(template) {
    let savedTemplate = JSON.parse(localStorage.getItem(template.name));
    if (savedTemplate) {
        savedTemplate.template = template;
    } else {
        localStorage.setItem(template.name, JSON.stringify({ template, cells: [] }));
    }
}

function clearCells() {
    if (!activeTemplate) {
        alert("Create template first");
    } else {
        selectedCells.forEach((cell) => {
            const key = getKey(cell.x, cell.y);
            savedCells.delete(key);
            selectedRects.get(key).destroy();
            const newRect = createDefaultRect(cell.x, cell.y);
            allRects.set(key, newRect);
            newRect.draw();
        });
        selectedRects.clear();
        selectedCells.clear();

        storeCells();
    }
}

function applyChangesToCells() {
    let type = $("#type").val();
    let purpose = $("#purpose").val();

    if (!activeTemplate) {
        alert("Create template first");
    } else if (!type || !purpose) {
        alert("Enter all data");
    } else {
        selectedCells.forEach((cell) => {
            cell.type = type;
            cell.purpose = purpose;
            const key = getKey(cell.x, cell.y);
            savedCells.set(key, cell);
            const rect = selectedRects.get(key);
            rect.destroy();
            const newRect = createCustomRect(cell.x, cell.y, purpose);
            allRects.set(key, newRect);
            newRect.draw();
        });
        selectedRects.clear();
        selectedCells.clear();

        storeCells();
    }
}

function storeCells() {
    const cells = [];
    savedCells.forEach((cell) => cells.push(cell));

    let savedTemplate = JSON.parse(localStorage.getItem(activeTemplate.name));
    savedTemplate.cells = cells;
    localStorage.setItem(activeTemplate.name, JSON.stringify(savedTemplate));
}

function stageSetDefault() {
    stage.position({ x: 0, y: 0 });
    stage.scale({
        x: CANVAS_SIZE / CELL_SIZE / activeTemplate.dimensionX,
        y: CANVAS_SIZE / CELL_SIZE / activeTemplate.dimensionY
    });
    stage.clear();
    stage.draw();
}

function scaleToBlocks(scale) {
    return Math.round(CANVAS_SIZE / (CELL_SIZE * scale));
}

function moveToPoint(stage, x, y) {
    const offsetToCenterX = CANVAS_SIZE / stage.scaleX() / CELL_SIZE / 2;
    const offsetToCenterY = CANVAS_SIZE / stage.scaleY() / CELL_SIZE / 2;
    stage.to({
        x: (-x + offsetToCenterX) * stage.scaleX() * CELL_SIZE,
        y: (-y + offsetToCenterY) * stage.scaleY() * CELL_SIZE,
        duration: 0.2,
    });
}

function getKey(x, y) {
    return x.toString() + y.toString();
}

function showCellData(target) {
    let x = target.getX() / CELL_SIZE;
    let y = target.getY() / CELL_SIZE;
    let key = getKey(x, y);



    if (savedCells.has(key)) {
        const cell = savedCells.get(key);
        $("#cell_address").html(`Address: ${x} : ${y}`);
        $("#cell_purpose").html(`Purpose: ${cell.purpose}`);
        $("#cell_type").html(`Type: ${cell.type}`);
    } else {
        $("#cell_address").html(`Address: `);
        $("#cell_purpose").html(`Purpose: `);
        $("#cell_type").html(`Type: `);
    }
}

function loadTemplate() {
    layerForSites.destroyChildren();
    selectedCells.clear();
    savedCells.clear();
    const selectedTemplate = $("#existing_templates").val();

    if (selectedTemplate) {
        const { template, cells } = JSON.parse(localStorage.getItem(selectedTemplate));

        currentScale = CANVAS_SIZE / template.dimensionX / CELL_SIZE;
        stage.scale({ x: currentScale, y: currentScale });

        for (let i = 0; i < template.dimensionX; i++) {
            for (let j = 0; j < template.dimensionY; j++) {
                const key = getKey(i, j);
                const cell = cells.find((value) => value.x == i && value.y == j);
                let rect;
                if (cell) {
                    rect = createCustomRect(cell.x, cell.y, cell.purpose);
                    savedCells.set(key, cell);
                } else {
                    rect = createDefaultRect(i, j);
                }
                allRects.set(key, rect);
                rect.draw();
            }
        }

        activeTemplate = new Template(template.dimensionX, template.dimensionY, template.name);
        //layerForSites.draw();
        localStorage.setItem("activeTemplate", activeTemplate.name)
    }
}

async function fetchTemplates() {
    try {
        const response = await fetch("/api/templates", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        if (data.templates && data.templates.length > 0) {

            data.templates.forEach((template) => {

                const cells = data.cells.filter((cell) => cell.templateName === template.name);
                const templateToSave = { template, cells };
                localStorage.setItem(template.name, JSON.stringify(templateToSave));
            })
        }

        let dropDownOptions = $("#existing_templates").html();
        data.templates.forEach(template => {
            dropDownOptions += `<option>${template.name}</option>`
        });

        $("#existing_templates").html(dropDownOptions);
        $("template_dropdown").html(dropDownOptions);

    } catch (error) {
        console.log(error);
    }
}

function clearCache() {
    localStorage.removeItem("cells");
    localStorage.removeItem("currentTemplate");
}
