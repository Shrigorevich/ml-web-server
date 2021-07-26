import { Router } from "express";
const router = Router();
import TemplateCell from "../models/TemplateCell.js";
import Template from "../models/Template.js";
import { saveTemplateCellsAsync } from "../services/templateService.js";

router.get("/", async (req, res) => {
    const templates = await Template.find().select("-_id");
    const cells = await TemplateCell.find().select("-_id");
    res.status(200).json({ templates, cells });
});

router.get("/:name", async (req, res) => {
    const name = req.params.name;
    const template = await Template.findOne({ name });
    return template;
})

router.post("/", async (req, res) => {
    const { template, cells } = req.body;

    const existingTemplate = await Template.findOne({ name: template.name });

    if (existingTemplate) {
        await TemplateCell.deleteMany({ templateName: template.name });
        saveTemplateCellsAsync(cells, template.name)
            .then((values) => {
                res.status(201).json({ message: "Success" });
            })
            .catch(async (error) => {
                console.log("Cell: ", error);
                res.status(500).json({ message: error });
            })
    } else {
        const newTemplate = new Template({
            name: template.name,
            dimensionX: template.dimensionX,
            dimensionY: template.dimensionY,
        });
        newTemplate.save()
            .then(() => {
                saveTemplateCellsAsync(cells, template.name)
                    .then((values) => {
                        res.status(201).json({ message: "Success" });
                    })
                    .catch(async (error) => {
                        console.log("Cell: ", error);
                        await deleteOne({ name: template.name });
                        res.status(500).json({ message: error });
                    })
            })
            .catch((error) => {
                console.log("Template: ", error)
                res.status(500).json({ message: error });
            })
    }
});

router.delete("/:name", async (req, res) => {
    const name = req.params.name;

    await Template.deleteOne({ name });
    await TemplateCell.deleteMany({ templateName: name });

    res.sendStatus(204);
});

export default router;