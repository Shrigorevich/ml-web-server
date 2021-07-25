// FOR MAIN
//layerForGrid.destroyChildren();
// if (currentScale >= 2.2) {
//     drawVisibleGrid(stage, layerForGrid, currentScale);
//     layerForGrid.batchDraw();
// }

// layerForSites.destroyChildren();
// drawSites(stage, layerForSites, currentScale, data);
// layerForSites.batchDraw();

// layerForImage.destroyChildren();
// drawImage(stage, layerForImage, currentScale);

// stage.position({
//     x: 1054 * stage.scaleX() * CELL_SIZE + CANVAS_SIZE / 2,
//     y: -509 * stage.scaleY() * CELL_SIZE + CANVAS_SIZE / 2,
// });

//drawImage(stage, layerForImage, stage.scaleX());
//drawVisibleGrid(stage, layerForGrid, stage.scaleX());
//drawSites(stage, layerForSites, currentScale, data);
//layerForGrid.draw();
// FOR MAIN

// async function getDataToStart() {
//     try {
//         const respons = await fetch("/regions/get-regions", {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//         });

//         const data = await respons.json();
//         console.log(data);
//         main(data);
//     } catch (error) {
//         console.log(error);
//     }
// }

// Konva.Image.fromURL("./map.png", function (darthNode) {
//     darthNode.setAttrs({
//         x: offsetX * CELL_SIZE,
//         y: offsetY * CELL_SIZE,
//         scaleX: 2,
//         scaleY: 2,
//     });

//     layerForImage.add(darthNode);
//     layerForImage.batchDraw();
// });

// function drawImage(stage, layerForImage, currentScale) {
//     //const offsetX = -Math.round(stage.x() / (CELL_SIZE * currentScale));
//     //const offsetY = -Math.round(stage.y() / (CELL_SIZE * currentScale));

//     //console.log(offsetX, offsetY);

//     var imageObj = new Image();
//     imageObj.src = "./map.png";
//     imageObj.onload = function () {
//         var image = new Konva.Image({
//             x: -1249 * CELL_SIZE,
//             y: 251 * CELL_SIZE,
//             image: imageObj,
//             scaleX: 2,
//             scaleY: 2,
//         });

//         layerForImage.add(image);
//         layerForImage.batchDraw();
//     };
// }

// rect.on("mouseover", (e) => {
    //     e.target.opacity(1);
    //     layerForSites.batchDraw();
    //     const attrs = e.target.attrs;
    //     document.getElementById("object-data").innerHTML = `<h4>Owner:</h4>
    //     <span>${attrs.details.owner}</span>
    //     <h4>Area size: </h4>
    //     <span>${attrs.width / 2}x${attrs.height / 2} (${
    //         (attrs.width * attrs.height) / 2
    //     } m2)</span>
    //     <h4>Coordinates (Top Left Angle): </h4>
    //     <span><b>X: </b>${attrs.details.tl_coords.x} <b>Y: </b>${
    //         attrs.details.tl_coords.y
    //     }</span>`;
    // });

    // function drawVisibleGrid(layerForGrid, currentScale) {
//     const blocksToDraw = scaleToBlocks(currentScale); //* 3;

//     const offsetX = -Math.round(stage.x() / (CELL_SIZE * currentScale)); //- blocksToDraw / 3;
//     const offsetY = -Math.round(stage.y() / (CELL_SIZE * currentScale)); //- blocksToDraw / 3;

//     for (var block = 0; block < blocksToDraw; ++block) {
//         var x1 = (offsetX + block) * CELL_SIZE;
//         var y1 = (offsetY + 0) * CELL_SIZE;
//         var x2 = (offsetX + 0) * CELL_SIZE;
//         var y2 = (offsetY + block) * CELL_SIZE;

//         var verticalLine = new Konva.Line({
//             points: [x1, y1, x1, blocksToDraw * CELL_SIZE + y1],
//             stroke: "black",
//             strokeWidth: 0.1,
//             opacity: 0.3,
//             perfectDrawEnabled: false,
//         });

//         var horizontalLine = new Konva.Line({
//             points: [x2, y2, blocksToDraw * CELL_SIZE + x2, y2],
//             stroke: "black",
//             strokeWidth: 0.1,
//             opacity: 0.3,
//             perfectDrawEnabled: false,
//         });

//         layerForGrid.add(verticalLine, horizontalLine);
//     }
// }

// class Map {
//     // Visible area: CANVAS_SIZE / CELL_SIZE = 400 blocks with scale 1
//     constructor(canvas_size, cell_size, default_scale, scale_by, min_scale) {
//         this.CANVAS_SIZE = canvas_size; // pixels
//         this.CELL_SIZE = cell_size; // pixels
//         this.DEFAULT_SCALE = default_scale;
//         this.SCALE_BY = scale_by;
//         this.MIN_SCALE = min_scale; //CANVAS_SIZE / (CELL_SIZE * 500); // where 150 is width/height of visible area
//         this.MAX_SCALE = canvas_size / (cell_size * 25); // where 25 is width/height of visible area
//     }
// }

// function drawSites(currentScale, data) {
//     console.log("Draw sites: ", data.civilian_sites);
//     const blocksToDraw = scaleToBlocks(currentScale);

//     data.civilian_sites.forEach((item) => {
//         var rect = new Konva.Rect({
//             x: item.tl_coords.x * CELL_SIZE,
//             y: item.tl_coords.y * CELL_SIZE,
//             width: 10 * CELL_SIZE,
//             height: 10 * CELL_SIZE,
//             fill: item.for_sale ? "#ccc" : "#2196f3",
//             details: item,
//             opacity: 0.7,
//             stroke: null,
//             strokeWidth: 0.7,
//             perfectDrawEnabled: false,
//         });

//         var text = new Konva.Text({
//             x: (item.tl_coords.x + 2) * CELL_SIZE,
//             y: (item.tl_coords.y + 4) * CELL_SIZE,
//             text: item.number,
//             fontSize: 8,
//             fontFamily: "Segoe UI",
//             fill: "#000",
//             width: 35,
//             listening: false,
//         });

//         rect.on("mouseover", (e) => {
//             e.target.opacity(1);
//             layerForSites.batchDraw();
//             const attrs = e.target.attrs;
//             document.getElementById("object-data").innerHTML = `<h4>Owner:</h4>
//             <span>${attrs.details.owner}</span>
//             <h4>Area size: </h4>
//             <span>${attrs.width / 2}x${attrs.height / 2} (${
//                 (attrs.width * attrs.height) / 2
//             } m2)</span>
//             <h4>Coordinates (Top Left Angle): </h4>
//             <span><b>X: </b>${attrs.details.tl_coords.x} <b>Y: </b>${
//                 attrs.details.tl_coords.y
//             }</span>`;
//         });

//         rect.on("mouseout", (e) => {
//             e.target.opacity(0.7);
//             layerForSites.batchDraw();
//         });

//         layerForSites.add(rect, text);
//     });

//     data.admin_sites.forEach((item) => {
//         var rect = new Konva.Rect({
//             x: item.tla_coords.x * CELL_SIZE,
//             y: item.tla_coords.y * CELL_SIZE,
//             width: item.width * CELL_SIZE,
//             height: item.height * CELL_SIZE,
//             fill: item.color,
//             details: item,
//             opacity: 0.7,
//             stroke: "black",
//             strokeWidth: 0.4,
//         });

//         var text = new Konva.Text({
//             x: (item.tla_coords.x + item.width / 2 - 6) * CELL_SIZE,
//             y: (item.tla_coords.y + item.height / 2 - 6) * CELL_SIZE,
//             text: item.name,
//             fontSize: 8,
//             fontFamily: "Segoe UI",
//             fill: "#000",
//             width: 30,
//         });

//         rect.on("mouseover", (e) => {
//             e.target.opacity(1);
//             layerForSites.draw();
//         });

//         rect.on("mouseout", (e) => {
//             e.target.opacity(0.7);
//             layerForSites.draw();
//         });

//         layerForSites.add(rect, text);
//     });
// }

// DRAG BOUND FUNCTION
