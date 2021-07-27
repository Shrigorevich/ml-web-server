import Matrix from "./matrix.mjs";
import { fetchTemplates, fetchVillages, applyTemplate, createVillage, saveTemplate, deleteTemplate, deleteVillage } from "../services/httpService.mjs";

var matrix;

window.onload = () => {
    localStorage.clear();
    Konva.dragButtons = [2];
    matrix = new Matrix(900, 10);
    matrix.initMatrix("container");
    matrix.setupMatrixEvents();
    fetchTemplates();
    fetchVillages();
}

window.initTemplate = () => {
    let x = $("#x").val();
    let y = $("#y").val();
    let name = $("#tname").val();
    matrix.initTemplate(x, y, name);
}

window.stageSetDefault = () => {
    matrix.stageSetDefault();
}

window.loadTemplate = () => {
    const selectedTemplate = $("#existing_templates").val();
    matrix.loadTemplate(selectedTemplate);
}

window.applyChangesToCells = () => {
    let type = $("#type").val();
    let purpose = $("#purpose").val();
    matrix.applyChangesToCells(type, purpose);
}

window.clearCells = () => {
    matrix.clearCells();
}

window.drawOneCell = () => {
    matrix.drawOneCell();
}

window.applyTemplate = () => {
    applyTemplate();
}

window.createVillage = () => {
    createVillage();
}

window.saveTemplate = () => {
    saveTemplate();
}

window.deleteTemplate = () => {
    deleteTemplate();
}

window.deleteVillage = () => {
    deleteVillage();
}