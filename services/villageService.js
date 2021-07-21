import TemplateCell from "../models/TemplateCell.js";
import Cell from "../models/Cell.js";

function applyTemplateToVillageAsync(villageCells, templateCells, villageName) {

    const promises = [];

    templateCells.forEach((cell) => {
        promises.push(Cell.updateOne(
            { villageName },
            {
                type: cell.type,
                purpose: cell.purpose
            },
            [
                { "address.i": { $eq: cell.x } },
                { "address.j": { $eq: cell.y } }
            ]
        ));
    });

    return Promise.all(promises);
}

function isDimensionsCompatible(dimX1, dimZ1, dimX2, dimZ2) {
    return dimX1 === dimX2 && dimZ1 === dimZ2;
}

export { applyTemplateToVillageAsync, isDimensionsCompatible }