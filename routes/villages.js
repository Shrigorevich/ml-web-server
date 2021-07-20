import { Router } from "express";
import VillageCell from "../models/VillageCell.js";
import Village from "../models/Village.js";
const router = Router();

router.get("/", async (req, res) => {
    const villages = await Village.find();
    res.status(200).json({ villages })
});

router.put("/", async (req, res) => {

    const { template } = req.body;
    const cells = await VillageCell.find();
})

export default router;