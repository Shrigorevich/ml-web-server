const CANVAS_SIZE = 700; // pixels
const CELL_SIZE = 10; // pixels

const DEFAULT_SCALE = 2;
const SCALE_BY = 0.95;
const MIN_SCALE = 0.7; //CANVAS_SIZE / (CELL_SIZE * 500); // where 150 is width/height of visible area
const MAX_SCALE = 10 //CANVAS_SIZE / (CELL_SIZE * 25); // where 10 is width/height of visible area

const palette = {
    default: "#909090",
    selected: "#388D0D",
}

class Cell {
    x;
    y;
    type = "";
    sign = "";

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

var layerForSites;
var stage;
var currentScale = DEFAULT_SCALE;
var mDimensionX;
var mDimensionY;
const selectedCells = new Map();


window.onload = () => {
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
}

function setupLayerEvents() {
    layerForSites.on("mouseover", (e) => {
        let box = e.target;
        box.opacity(1);
        box.draw();

        if(e.evt.shiftKey && e.evt.buttons === 1) {
            changeCellStatus(e.target)
            console.log(selectedCells.size);
        }
    });

    layerForSites.on("mouseout", (e) => {
        let box = e.target;
        box.opacity(0.5);
        box.draw();
    });

    layerForSites.on("click", (e) => {
        if(e.evt.shiftKey) {
            changeCellStatus(e.target);
        }
    })
}

function changeCellStatus(target) {
    let x = target.getX() / CELL_SIZE;
    let y = target.getY() / CELL_SIZE;
    let key = x.toString() + y.toString()
    if(!selectedCells.has(key)) {
        selectedCells.set(key, new Cell(x, y));
        target.fill(palette.selected);
        target.draw();
    } else {
        selectedCells.delete(key);
        target.fill(palette.default);
        target.draw();
    }
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

function createSite(x, y, number) {
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
}

function createMatrix() {
    stage.clear();
    selectedCells.clear();
    let x = $("#x").val();
    let y = $("#y").val();
    mDimensionX = x;
    mDimensionY = y;
    layerForSites.destroyChildren();
    for(let i = 0; i < x; i++) {
        for(let j = 0; j < y; j++) {
            createSite(i, j, i*j);
        }
    }
    currentScale = CANVAS_SIZE / x / CELL_SIZE;
    stage.scale({ x: currentScale, y: currentScale });
    stage.draw();
}

function applyChangesToCells() {

}

function stageSetDefault() {
    stage.position({x: 0, y: 0});
    stage.scale({
        x: CANVAS_SIZE / CELL_SIZE / mDimensionX,
        y: CANVAS_SIZE / CELL_SIZE / mDimensionY
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
