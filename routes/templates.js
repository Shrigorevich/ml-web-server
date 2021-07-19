const { Router } = require("express");
const router = Router();
const TemplateCell = require("../models/TemplateCell");
const Template = require("../models/Template");
const templateService = require("../services/TemplateService");

router.get("/", async (req, res) => {
    const templates = await Template.find().select("-_id");
    const cells = await TemplateCell.find().select("-_id");
    res.status(200).json({ templates, cells });
});

router.get("/:name", async (req, res) => {
    const name = req.params.name;
    const template = await Template.findOne({name});
    return template;
})

router.post("/", async (req, res) => {
    const { template, cells } = req.body;

    const existingTemplate = await Template.findOne({name: template.name});

    if (existingTemplate) {
        await TemplateCell.deleteMany({templateName: template.name});
        templateService.getCellAsyncTaskList(cells, template.name)
            .then((values) => {
                res.status(201).json({message: "Success"});
            })
            .catch(async (error) => {
                console.log("Cell: ", error);
                res.status(500).json({message: error});
            })
    } else {
        const newTemplate = new Template({
            name: template.name,
            dimensionX: template.dimensionX,
            dimensionY: template.dimensionY,
        });
        newTemplate.save()
        .then(() => {
            templateService.getCellAsyncTaskList(cells, template.name)
            .then((values) => {
                res.status(201).json({message: "Success"});
            })
            .catch(async (error) => {
                console.log("Cell: ", error);
                await Template.deleteOne({name: template.name});
                res.status(500).json({message: error});
            })
        })
        .catch((error) => {
            console.log("Template: ", error)
            res.status(500).json({message: error});
        })
    }
});

module.exports = router;