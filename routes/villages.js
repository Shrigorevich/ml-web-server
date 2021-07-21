import { Router } from "express";
import Village from "../models/Village.js";
import { applyTemplateToVillageAsync, isDimensionsCompatible } from "../services/villageService.js";
const router = Router();

router.get("/", async (req, res) => {
    const villages = await Village.find({ status: "LOCATED" });
    res.status(200).json({ villages })
});

router.put("/", async (req, res) => {

    const { template, villageName } = req.body;
    const village = await Village.findOne({ name: villageName });

    if (village.status === "LOCATED") {
        const isCompatible = isDimensionsCompatible(
            template.dimensionX, template.dimensionY,
            village.dimensionX, village.dimensionZ
        );

        applyTemplateToVillageAsync(template.cells)
            .then(() => {
                Village.updateOne({ name: villageName }, { status: "ACTIVE" });
            });
        console.log(cells);
    }
})

router.post("/", async (req, res) => {
    const { villageName } = req.body;

    const village = new Village({
        name: villageName,
    });
})

export default router;