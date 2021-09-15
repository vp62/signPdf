function renderPDF(data, canvasContainer){
     async function  renderPage(page) {
    var viewport = page.getViewport({scale:1});
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var renderContext = {
    canvasContext: ctx,
    viewport: viewport
    };
    
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    console.log("from show js")
    console.log(canvas.height)
    console.log(canvas.width)


    // console.log(pageIndex)
    // console.log(numPages)
    console.log(page);
    canvas.setAttribute('id',"page-"+(page._pageIndex+1));
    var pageHolder=document.createElement('div');
    pageHolder.setAttribute('id','holder-page-'+(page._pageIndex+1));
    pageHolder.appendChild(canvas);
    canvasContainer.appendChild(pageHolder);    
  await page.render(renderContext);
}
async function renderPages(pdfDoc) {
    for(var num = 1; num <= await pdfDoc.numPages; num++)
        pdfDoc.getPage(num).then(renderPage).then(data=>{console.log("data");console.log(data)});
}



pdfjsLib.disableWorker = true;
pdfjsLib.getDocument(data).promise.then(renderPages);

}   

console.log('hey hoo!');