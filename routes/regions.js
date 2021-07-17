const { Router } = require("express");
const router = Router();
const AdminRegion = require("../models/AdminRegion");
const CivilRegion = require("../models/CivilRegion");

const data_set = require("../data-set");

router.get("/get-regions", async (req, res) => {
    console.log("get regions");
    const civilian_sites = await CivilRegion.find({});
    const admin_sites = await AdminRegion.find({});

    res.status(200).json({ civilian_sites, admin_sites });
});

router.post("/create-region", async (req, res) => {
    const {
        number,
        owner,
        tl_coords,
        tr_coords,
        br_coords,
        bl_coords,
        description,
        for_sale,
    } = req.body.regionData;

    try {
        const region = new CivilRegion({
            number: Number(number),
            owner,
            tl_coords: {
                x: Number(tl_coords.split(" ")[0].trim()),
                y: Number(tl_coords.split(" ")[1].trim()),
            },
            tr_coords: {
                x: Number(tr_coords.split(" ")[0].trim()),
                y: Number(tr_coords.split(" ")[1].trim()),
            },
            br_coords: {
                x: Number(br_coords.split(" ")[0].trim()),
                y: Number(br_coords.split(" ")[1].trim()),
            },
            bl_coords: {
                x: Number(bl_coords.split(" ")[0].trim()),
                y: Number(bl_coords.split(" ")[1].trim()),
            },
            for_sale,
            description,
        });

        const doc = await region.save();
        console.log(doc);
        res.status(200).json({ status: "Success" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Fail" });
    }
});

router.post("/change-region", async (req, res) => {
    const {
        number,
        owner,
        tl_coords,
        tr_coords,
        br_coords,
        bl_coords,
        description,
        for_sale,
    } = req.body.regionData;
    console.log(req.body.regionData);
    try {
        const doc = await CivilRegion.findOneAndUpdate(
            { number: Number(number) },
            {
                owner,
                tl_coords: {
                    x: Number(tl_coords.split(" ")[0].trim()),
                    y: Number(tl_coords.split(" ")[1].trim()),
                },
                tr_coords: {
                    x: Number(tr_coords.split(" ")[0].trim()),
                    y: Number(tr_coords.split(" ")[1].trim()),
                },
                br_coords: {
                    x: Number(br_coords.split(" ")[0].trim()),
                    y: Number(br_coords.split(" ")[1].trim()),
                },
                bl_coords: {
                    x: Number(bl_coords.split(" ")[0].trim()),
                    y: Number(bl_coords.split(" ")[1].trim()),
                },
                for_sale: for_sale,
            }
        );

        console.log(doc);
        res.status(200).json({ status: "Success" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Fail" });
    }
});

router.post("/delete-region", async (req, res) => {
    console.log("Delete region");
    try {
        const doc = await CivilRegion.findOneAndDelete({
            number: req.body.regionNumber,
        });
        res.status(200).json({ status: "Success" });
    } catch (error) {
        res.status(500).json({ status: "Fail" });
    }
});