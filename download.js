const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const { log } = require('console');


async function embedImages(pdfData) {
    var { imgdet, pdfUrl } = pdfData
    // console.log(imgdet);
    console.log("from embed");
    console.log(pdfUrl)
    const pdfDoc = await PDFDocument.load(fs.readFileSync(pdfUrl));
    const pages = pdfDoc.getPages()
    const firstPage = pages[0]
    imgdet.forEach(async (img_data) => {
        // console.log(img_data)
        const pngImage = await pdfDoc.embedPng(img_data.img)
        // // // Add a blank page to the document
        console.log(img_data.x, img_data.y, img_data.width, img_data.height)
        console.log(firstPage.getWidth(), firstPage.getHeight())
        console.log(firstPage.getX(), firstPage.getY())
        console.log(firstPage.getPosition(), firstPage.getArtBox())
        console.log((firstPage.getHeight() - 792) - img_data.height)
        // // // Draw the PNG image near the lower right corner of the JPG image
        firstPage.drawImage(pngImage, {
            x: img_data.x,
            y: firstPage.getHeight() - img_data.y - img_data.height / 2 - 123.54,
            width: img_data.width,
            height: img_data.height,
        })
        fs.writeFileSync(pdfUrl, await pdfDoc.save());
        log('finished')

        // // // Serialize the PDFDocument to bytes (a Uint8Array)
    })

}

module.exports = { download: embedImages }