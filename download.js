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
    imgdet.forEach(async (img_data) => {
        const writePage = pages[img_data.page]
        console.log(img_data.page)
        // console.log(img_data)
        const pngImage = await pdfDoc.embedPng(img_data.img)
        // // // Add a blank page to the document
        console.log(img_data.x, img_data.y, img_data.width, img_data.height)
        console.log(writePage.getWidth(), writePage.getHeight())
        console.log(writePage.getX(), writePage.getY())
        console.log(writePage.getPosition(), writePage.getArtBox())
        console.log((writePage.getHeight() -img_data.y) - img_data.height/2)
        // // // Draw the PNG image near the lower right corner of the JPG image
        writePage.drawImage(pngImage, {
            x: img_data.x,

            y: writePage.getHeight() -(img_data.y+img_data.height/2+127.534),
            width: img_data.width,
            height: img_data.height,
        })
        fs.writeFileSync(pdfUrl, await pdfDoc.save());
        log('finished')

        // // // Serialize the PDFDocument to bytes (a Uint8Array)
    })

}

module.exports = { download: embedImages }