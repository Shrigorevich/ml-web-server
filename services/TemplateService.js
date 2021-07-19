const TemplateCell = require("../models/TemplateCell");

function getCellAsyncTaskList(cells, templateName) {

    const promises = [];

    cells.forEach((cell) => {
        const newCell = new TemplateCell({
            x: cell.x,
            y: cell.y,
            purpose: cell.purpose,
            type: cell.type,
            templateName,
        });
        promises.push(newCell.save());
    });

    return Promise.all(promises);
}

module.exports = {getCellAsyncTaskList}