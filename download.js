const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path=require('path');
const { log } = require('console');


async function embedImages(img_det) {
    var {imgdet}=img_det
    console.log(imgdet);
    console.log("from embed");

const pdfDoc = await PDFDocument.load(fs.readFileSync('./Files/admin-sample.pdf'));
const pngImage = await pdfDoc.embedPng(imgdet.img)
console.log(pngImage)

// // Get the width/height of the PNG image scaled down to 50% of its original size
const pngDims = pngImage.scale(imgdet.scale/4)
// // Add a blank page to the document
console.log(imgdet.x,imgdet.y,imgdet.scale,pngDims,imgdet.size)
const pages = pdfDoc.getPages()
const firstPage = pages[0]
// firstPage.setWidth(632)
// firstPage.setHeight(792);
console.log(firstPage.getWidth(),firstPage.getHeight())
// // Draw the PNG image near the lower right corner of the JPG image
firstPage.drawImage(pngImage, {
x:imgdet.x+7,
y:firstPage.getHeight()-imgdet.y-32,
width: pngDims.width/1.5,
height: pngDims.height/1.5,
})

// // Serialize the PDFDocument to bytes (a Uint8Array)
fs.writeFileSync('./test.pdf', await pdfDoc.save());

//     // Trigger the browser to download the PDF document
// download(pdfBytes, "pdf-lib_image_embedding_example.pdf", "application/pdf");
}

module.exports={download:embedImages}