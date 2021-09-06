const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path=require('path');
const { log } = require('console');


async function embedImages(pdfData) {
    var {imgdet,pdfUrl}=pdfData
    console.log(imgdet);
    console.log("from embed");
console.log(pdfUrl)
const pdfDoc = await PDFDocument.load(fs.readFileSync(pdfUrl));
const pngImage = await pdfDoc.embedPng(imgdet.img)
console.log(pngImage)

// // Get the width/height of the PNG image scaled down to 50% of its original size
const pngDims = pngImage.scale(1)
// // Add a blank page to the document
console.log(imgdet.x,imgdet.y,pngDims,imgdet.width,imgdet.height)
const pages = pdfDoc.getPages()
const firstPage = pages[0]
// firstPage.setWidth(632)
// firstPage.setHeight(792);
console.log(firstPage.getWidth(),firstPage.getHeight())
console.log(firstPage.getX(),firstPage.getY())
console.log(firstPage.getPosition(),firstPage.getArtBox())
console.log((firstPage.getHeight()-792)-imgdet.height)
// // Draw the PNG image near the lower right corner of the JPG image
firstPage.drawImage(pngImage, {
x:imgdet.x,
y:firstPage.getHeight()-imgdet.y-imgdet.height/2-125,
width: imgdet.width,
height: imgdet.height,
})

// // Serialize the PDFDocument to bytes (a Uint8Array)
fs.writeFileSync(pdfUrl, await pdfDoc.save());

}

module.exports={download:embedImages}