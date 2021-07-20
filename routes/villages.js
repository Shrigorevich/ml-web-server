import { Router } from "express";
import VillageCell from "../models/VillageCell";
import { find } from "../models/Village";
const router = Router();

router.get("/", async (req, res) => {
    const villages = await find();
    res.status(200).json({ villages })
});

router.put("/:name", async (req, res) => {

})

export default router;