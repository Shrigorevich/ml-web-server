import TemplateCell from "../models/TemplateCell.js";

function saveTemplateCellsAsync(cells, templateName) {

    const promises = [];

    cells.forEach((cell) => {
        const newCell = new TemplateCell({
            i: cell.i,
            j: cell.j,
            purpose: cell.purpose,
            type: cell.type,
            templateName,
        });
        promises.push(newCell.save());
    });

    return Promise.all(promises);
}

export { saveTemplateCellsAsync }