import Cell from "../models/Cell.js";

async function applyTemplateToVillageAsync(templateCells, villageName) {

    const promises = [];
    templateCells.forEach((cell) => {
        promises.push(Cell.updateOne(
            {
                villageName,
                "address.i": cell.i,
                "address.j": cell.j
            },
            {
                type: cell.type,
                purpose: cell.purpose
            }
        ));
    });

    return Promise.all(promises);
}

function isDimensionsCompatible(dimX1, dimZ1, dimX2, dimZ2) {
    return dimX1 === dimX2 && dimZ1 === dimZ2;
}

function ApplyingException(message) {
    this.message = message;
}

export { applyTemplateToVillageAsync, isDimensionsCompatible, ApplyingException }