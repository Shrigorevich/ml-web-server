import Cell from "../models/Cell.mjs";
import TemplateModel from "../models/Template.mjs";
import purposes from "./purposes.mjs";
import getKey from "./keyGen.mjs";

class Matrix {
    CANVAS_SIZE; // pixels
    CELL_SIZE; // pixels
    DEFAULT_SCALE;
    SCALE_BY;
    MIN_SCALE;
    MAX_SCALE;

    stage;
    layer;
    activeTemplate;
    selectedCells = new Map();
    savedCells = new Map();
    allCells = new Map();
    palette = new Map();

    constructor(canvasSize, cellSize) {
        this.CANVAS_SIZE = canvasSize;
        this.CELL_SIZE = cellSize;
        this.SCALE_BY = 0.95;
        this.MIN_SCALE = 0.7;
        this.MAX_SCALE = 10;
        this.DEFAULT_SCALE = 2;

        this.palette.set(purposes.default, "#909090");
        this.palette.set(purposes.guildhall, "#CF0404");
        this.palette.set(purposes.wall, "#0445CF");
        this.palette.set(purposes.selected, "#388D0D");
        this.palette.set(purposes.arena, "#6C00C1");
        this.palette.set(purposes.warehouse, "#DAD300");
        this.palette.set(purposes.smithy, "#000526");
    }

    initMatrix(cntr) {
        this.stage = new Konva.Stage({
            container: cntr,
            width: this.CANVAS_SIZE,
            height: this.CANVAS_SIZE,
            draggable: true,
            scaleX: this.DEFAULT_SCALE,
            scaleY: this.DEFAULT_SCALE,
        });
        this.initLayer();
    }

    initLayer() {
        this.layer = new Konva.Layer();
        this.stage.add(this.layer);
    }

    createCell(i, j, type, purpose) {
        let color = this.palette.get(purpose);
        let cell = new Cell(
            {
                x: i * this.CELL_SIZE,
                y: j * this.CELL_SIZE,
                width: this.CELL_SIZE,
                height: this.CELL_SIZE,
                fill: color !== undefined ? color : this.palette.get(purposes.default),
                opacity: 0.5,
                stroke: "#000",
                strokeWidth: 0.7,
                perfectDrawEnabled: false,
            },
            i, j,
            type,
            purpose
        );

        this.layer.add(cell);
        return cell;
    }

    setScale(scale) {
        this.stage.scale({ x: scale, y: scale });
    }

    stageSetDefault(dimensionX, dimensionY) {
        this.stage.position({ x: 0, y: 0 });
        this.stage.scale({
            x: this.CANVAS_SIZE / this.CELL_SIZE / dimensionX,
            y: this.CANVAS_SIZE / this.CELL_SIZE / dimensionY
        });
        this.stage.clear();
        this.stage.draw();
    }

    initTemplate(x, y, name) {
        this.clearSpace();
        if (!x || !y || !name) {
            alert("Enter all data");
        } else {
            for (let i = 0; i < x; i++) {
                for (let j = 0; j < y; j++) {
                    const cell = this.createCell(i, j, null, null);
                    this.allCells.set(getKey(i, j), cell);
                }
            }

            this.activeTemplate = new TemplateModel(x, y, name);
            this.storeTemplateCredential(this.activeTemplate);
            let newScale = this.CANVAS_SIZE / x / this.CELL_SIZE;
            this.setScale(newScale);
            this.layer.draw();
            localStorage.setItem("activeTemplate", this.activeTemplate.name);
        }
    }

    loadTemplate(selectedTemplate) {
        if (selectedTemplate) {
            this.clearSpace()
            const { instance, cells } = JSON.parse(localStorage.getItem(selectedTemplate));

            let newScale = this.CANVAS_SIZE / instance.dimensionX / this.CELL_SIZE;
            this.setScale(newScale);

            for (let i = 0; i < instance.dimensionX; i++) {
                for (let j = 0; j < instance.dimensionY; j++) {
                    const key = getKey(i, j);
                    const cell = cells.find((value) => value.i == i && value.j == j);
                    let newCell;
                    if (cell) {
                        newCell = this.createCell(cell.i, cell.j, cell.type, cell.purpose);
                        this.savedCells.set(key, cell);
                    } else {
                        newCell = this.createCell(i, j, null, null);
                    }
                    this.allCells.set(key, newCell);
                }
            }

            this.activeTemplate = new TemplateModel(instance.dimensionX, instance.dimensionY, instance.name);
            this.layer.draw();
            localStorage.setItem("activeTemplate", this.activeTemplate.name)
        }
    }

    clearSpace() {
        this.layer.destroyChildren();
        this.selectedCells.clear();
        this.savedCells.clear();
    }

    showCellData(target) {
        let i = target.getX() / this.CELL_SIZE;
        let j = target.getY() / this.CELL_SIZE;
        let key = getKey(i, j);

        if (this.savedCells.has(key)) {
            const cell = this.savedCells.get(key);
            $("#cell_address").html(`Address: ${x} : ${y}`);
            $("#cell_purpose").html(`Purpose: ${cell.purpose}`);
            $("#cell_type").html(`Type: ${cell.type}`);
        } else {
            $("#cell_address").html(`Address: `);
            $("#cell_purpose").html(`Purpose: `);
            $("#cell_type").html(`Type: `);
        }
    }

    changeCellStatus(target) {
        let x = target.getX() / this.CELL_SIZE;
        let y = target.getY() / this.CELL_SIZE;
        let key = getKey(x, y);
        let cell = this.allCells.get(key);
        if (!this.selectedCells.has(key)) {
            cell.fill(this.palette.get(purposes.selected));
            this.selectedCells.set(key, cell);
        } else {
            if (this.savedCells.has(key)) {
                cell.fill(this.palette.get(cell.purpose));
            } else {
                cell.fill(this.palette.get(purposes.default));
            }
            cell.draw();
            this.selectedCells.delete(key);
        }
    }

    storeCells() {
        const cells = [];
        this.savedCells.forEach((cell) => cells.push({
            i: cell.i,
            j: cell.j,
            type: cell.type,
            purpose: cell.purpose
        }));

        let savedTemplate = JSON.parse(localStorage.getItem(this.activeTemplate.name));
        savedTemplate.cells = cells;
        localStorage.setItem(this.activeTemplate.name, JSON.stringify(savedTemplate));
    }

    applyChangesToCells(type, purpose) {
        if (!this.activeTemplate) {
            alert("Create template first");
        } else if (!type || !purpose) {
            alert("Enter all data");
        } else {
            this.selectedCells.forEach((cell) => {
                const key = getKey(cell.i, cell.j);
                cell.type = type;
                cell.purpose = purpose;
                cell.fill(this.palette.get(purpose));
                cell.draw();
                this.savedCells.set(key, cell);
            });
            this.selectedCells.clear();
            this.storeCells();
        }
    }

    storeTemplateCredential(template) {
        let savedTemplate = JSON.parse(localStorage.getItem(template.name));
        if (savedTemplate) {
            savedTemplate.instance = template;
        } else {
            localStorage.setItem(template.name, JSON.stringify({ instance: template, cells: [] }));
        }
    }

    clearCells() {
        if (!this.activeTemplate) {
            alert("Create template first");
        } else {
            this.selectedCells.forEach((cell) => {
                cell.purpose = null;
                cell.type = null;
                cell.fill(this.palette.get(purposes.default));
                cell.draw();
                this.savedCells.delete(getKey(cell.i, cell.j));
            });
            this.selectedCells.clear();
            this.storeCells();
        }
    }

    setupMatrixEvents() {
        this.layerClick();
        this.layerMouseOut();
        this.layerMouseOver();
        this.stageWheel();
        this.stageMouseOver();
    }

    layerMouseOver() {
        this.layer.on("mouseover", (e) => {
            let box = e.target;
            box.opacity(1);
            box.draw();
            if (e.evt.shiftKey && e.evt.buttons === 1) {
                this.changeCellStatus(e.target)
            }
        });
    }

    layerMouseOut() {
        this.layer.on("mouseout", (e) => {
            let box = e.target;
            box.opacity(0.5);
            box.draw();
        });
    }

    layerClick() {
        this.layer.on("click", (e) => {
            //this.showCellData(e.target);
            if (e.evt.shiftKey) {
                this.changeCellStatus(e.target);
            }
        })
    }

    stageWheel() {
        this.stage.on("wheel", (e) => {
            console.log("ScaleX: ", this.stage.scaleX());
            e.evt.preventDefault();

            let oldScale = this.stage.scaleX();
            let pointer = this.stage.getPointerPosition();

            let newScale =
                e.evt.deltaY > 0 ? oldScale * this.SCALE_BY : oldScale / this.SCALE_BY;

            let mousePointTo = {
                x: (pointer.x - this.stage.x()) / oldScale,
                y: (pointer.y - this.stage.y()) / oldScale,
            };

            if (newScale > this.MAX_SCALE || newScale < this.MIN_SCALE) return;

            this.stage.scale({ x: newScale, y: newScale });

            let newPos = {
                x: pointer.x - mousePointTo.x * newScale,
                y: pointer.y - mousePointTo.y * newScale,
            };
            this.stage.position(newPos);
            this.stage.batchDraw();
        });
    }

    stageMouseOver() {
        this.stage.on("mousemove", (e) => {
            let coord = this.stage.getPointerPosition();

            const offsetX = -this.stage.x() / (this.CELL_SIZE * this.stage.scaleX());
            const offsetY = -this.stage.y() / (this.CELL_SIZE * this.stage.scaleY());

            let x = Math.floor(coord.x / (this.CELL_SIZE * this.stage.scaleX()) + offsetX);
            let y = Math.floor(coord.y / (this.CELL_SIZE * this.stage.scaleY()) + offsetY);

            document.getElementById(
                "pointer-position"
            ).innerHTML = `X: ${x}; Y: ${y}`;
        });
    }
}

export default Matrix;
