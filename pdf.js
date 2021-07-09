
var Canvas = require('canvas');
let pdfjs=require('./node_modules/pdfjs-dist/legacy/build/pdf')
let fs = require('fs');


pdfjs.PDFWorker = false;
var path = process.argv[2] || '/home/vp/Project/SignPdf/Files/admin-MissionVationnull.pdf';


let rendering = async function render(path) {
 try {
   const pdf = await pdfjs.getDocument(path);
     let page=(await pdf.promise).getPage(1);
     return page;
     
     
    }
  catch(err){
    console.log(err);
  }   
     
  
}//EOF_RENDER

// rendering(path);
module.exports = {  rendering};