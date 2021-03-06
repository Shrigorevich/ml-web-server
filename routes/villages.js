import { Router } from "express";
import Village from "../models/Village.js";
import Cell from "../models/Cell.js";
import { applyTemplateToVillageAsync, isDimensionsCompatible, ApplyingException } from "../services/villageService.js";
const router = Router();

router.get("/", async (req, res) => {
    const villages = await Village.find();
    res.status(200).json({ villages })
});

router.put("/", async (req, res) => {
    try {
        const { template, villageName } = req.body;
        const village = await Village.findOne({ name: villageName });

        if (village.status === "LOCATED") {
            const isCompatible = isDimensionsCompatible(
                template.instance.dimensionX, template.instance.dimensionY,
                village.dimensionX, village.dimensionZ
            );

            if (isCompatible) {
                applyTemplateToVillageAsync(template.cells, villageName)
                    .then(async () => {
                        await Village.updateOne({ name: villageName }, { status: "ACTIVE" });
                    })
                    .catch((error) => {
                        throw new ApplyingException(error)
                    });
            }
            res.sendStatus(204);
        } else {
            res.sendStatus(400);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

router.post("/", async (req, res) => {
    const { villageName } = req.body;

    const village = new Village({
        name: villageName,
    });

    await village.save()
        .then(() => res.status(201).json({ message: "Successfully created" }))
        .catch((error) => {
            console.log(error);
            res.status(500).json({ message: "Something went wrong" })
        })
})

router.delete("/:name", async (req, res) => {
    const name = req.params.name;

    await Village.deleteOne({ name });
    await Cell.deleteMany({ villageName: name });

    res.sendStatus(204);
})

export default router;