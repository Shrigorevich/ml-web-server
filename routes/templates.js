const { Router } = require("express");
const router = Router();
const TemplateCell = require("../models/TemplateCell");
const Template = require("../models/Template");

router.get("/", async (req, res) => {
    const templates = await Template.find();
    res.status(200).json({ templates });
});

router.get("/:name", async (req, res) => {
    const name = req.params.name;
    const template = await Template.findOne({name});
    return template;
})

router.post("/", async (req, res) => {
    const { template, cells } = req.body;

    console.log(template, cells);
    // const template = new Template({
    //     name: template.name,
    //     dimensionX: template.dimensionX,
    //     dimensionY: template.dimensionY,
    // });

    // cells.array.forEach(element => {
        
    //     const cell = new TemplateCell({
    //         x: element.x,
    //         y: element.y,
    //         templateName: element.templateNama,
            
    //     });
    // });

    //await region.save();
    res.status(201);
});



// router.post("/create-region", async (req, res) => {

//     try {
//         const region = new CivilRegion({
//             number: Number(number),
//             owner,
//             tl_coords: {
//                 x: Number(tl_coords.split(" ")[0].trim()),
//                 y: Number(tl_coords.split(" ")[1].trim()),
//             },
//             tr_coords: {
//                 x: Number(tr_coords.split(" ")[0].trim()),
//                 y: Number(tr_coords.split(" ")[1].trim()),
//             },
//             br_coords: {
//                 x: Number(br_coords.split(" ")[0].trim()),
//                 y: Number(br_coords.split(" ")[1].trim()),
//             },
//             bl_coords: {
//                 x: Number(bl_coords.split(" ")[0].trim()),
//                 y: Number(bl_coords.split(" ")[1].trim()),
//             },
//             for_sale,
//             description,
//         });

//         const doc = await region.save();
//         console.log(doc);
//         res.status(200).json({ status: "Success" });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ status: "Fail" });
//     }
// });

// router.post("/change-region", async (req, res) => {
//     const {
//         number,
//         owner,
//         tl_coords,
//         tr_coords,
//         br_coords,
//         bl_coords,
//         description,
//         for_sale,
//     } = req.body.regionData;
//     console.log(req.body.regionData);
//     try {
//         const doc = await CivilRegion.findOneAndUpdate(
//             { number: Number(number) },
//             {
//                 owner,
//                 tl_coords: {
//                     x: Number(tl_coords.split(" ")[0].trim()),
//                     y: Number(tl_coords.split(" ")[1].trim()),
//                 },
//                 tr_coords: {
//                     x: Number(tr_coords.split(" ")[0].trim()),
//                     y: Number(tr_coords.split(" ")[1].trim()),
//                 },
//                 br_coords: {
//                     x: Number(br_coords.split(" ")[0].trim()),
//                     y: Number(br_coords.split(" ")[1].trim()),
//                 },
//                 bl_coords: {
//                     x: Number(bl_coords.split(" ")[0].trim()),
//                     y: Number(bl_coords.split(" ")[1].trim()),
//                 },
//                 for_sale: for_sale,
//             }
//         );

//         console.log(doc);
//         res.status(200).json({ status: "Success" });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ status: "Fail" });
//     }
// });

// router.post("/delete-region", async (req, res) => {
//     console.log("Delete region");
//     try {
//         const doc = await CivilRegion.findOneAndDelete({
//             number: req.body.regionNumber,
//         });
//         res.status(200).json({ status: "Success" });
//     } catch (error) {
//         res.status(500).json({ status: "Fail" });
//     }
// });

module.exports = router;