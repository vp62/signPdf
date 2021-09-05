function renderPDF(data, canvasContainer){
    function renderPage(page) {
    var viewport = page.getViewport({scale:1});
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var renderContext = {
    canvasContext: ctx,
    viewport: viewport
    };
    
    canvas.height = viewport.height;
    canvas.width = viewport.width;


    // console.log(pageIndex)
    // console.log(numPages)
    console.log(page);
    canvas.setAttribute('id',"page-"+(page._pageIndex+1));
    var pageHolder=document.createElement('div');
    pageHolder.setAttribute('id','holder-page-'+(page._pageIndex+1));
    pageHolder.appendChild(canvas);

    canvasContainer.appendChild(pageHolder);
    
    page.render(renderContext)
   
}

function renderPages(pdfDoc) {
    for(var num = 1; num <= pdfDoc.numPages; num++)
        pdfDoc.getPage(num).then(renderPage);
}



pdfjsLib.disableWorker = true;
pdfjsLib.getDocument(data).promise.then(renderPages);

}   

console.log('hey hoo!');