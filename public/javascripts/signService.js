var download_btn = document.getElementById('downloadbtn');
var save_btn = document.getElementById('savebtn');
var sign_btn=document.getElementById('signbutton');
var canvas = document.getElementById('signature-pad');
var img;
var scale = 1.0;
var data;
var size;

// Adjust canvas coordinate space taking into account pixel ratio,
// to make it look crisp on mobile devices.
// This also causes canvas to be cleared.
function resizeCanvas() {
  // When zoomed out to less than 100%, for some very strange reason,
  // some browsers report devicePixelRatio as less than 1
  // and only part of the canvas is cleared then.
  var ratio = Math.max(window.devicePixelRatio || 1, 1);
  canvas.width = canvas.offsetWidth * ratio;
  canvas.height = canvas.offsetHeight * ratio;
  canvas.getContext("2d").scale(ratio, ratio);
}

window.onresize = resizeCanvas;
// resizeCanvas();

var signaturePad = new SignaturePad(canvas, {
  backgroundColor: 'rgb(255, 255, 255,0)', // necessary for saving image as JPEG; can be removed is only saving as PNG or SVG
  penColor: 'rgb(0, 0, 0)'
});


document.getElementById('clear').addEventListener('click', function () {
  signaturePad.clear();
});
var translatePos ;
let which_page = 1;
document.querySelector('.page-container').addEventListener('scroll', () => {
  var top = document.querySelector('.page-container').scrollTop;
  // if(top/744<)
  console.log(document.querySelector('.page-container').scrollTop / 601.5)
  console.log(document.querySelector('.page-container').offsetTop)

  which_page = Math.ceil((top / 785.32))
  console.log(which_page)

})
let sign, signHolder
document.getElementById('apply').addEventListener('click', (event) => {
  translatePos = {
  x: 0,
  y: 0
};  
  sign = document.createElement('img');
  signHolder = document.createElement('div');
  // insideHolder = document.createElement('div');

  signHolder.setAttribute('class', "signHolder")
  data = signaturePad.toDataURL('image/png');
  sign.src = data;
  sign.setAttribute('class', 'sign');
  var tright = document.createElement('div')
  var tleft = document.createElement('div')
  var bleft = document.createElement('div')
  var bright = document.createElement('div')
  var tmiddle = document.createElement('div')
  var ylm = document.createElement('div')
  var yrm = document.createElement('div')
  var bmiddle = document.createElement('div')
  var dicon = document.createElement('i')
  dicon.setAttribute('class', "fa fa-trash");
  tright.setAttribute('class', 'tright');
  tleft.setAttribute('class', 'tleft');
  tmiddle.setAttribute('class', 'tmiddle');
  ylm.setAttribute('class', 'ylm');
  yrm.setAttribute('class', 'yrm');
  bright.setAttribute('class', 'bright');
  bmiddle.setAttribute('class', 'bmidlle');
  bleft.setAttribute('class', 'bleft');
  signHolder.appendChild(tright)
  tright.appendChild(dicon)
  signHolder.appendChild(tleft)
  signHolder.appendChild(tmiddle)
  signHolder.appendChild(bmiddle)
  signHolder.appendChild(bleft)
  signHolder.appendChild(ylm)
  signHolder.appendChild(yrm)
  signHolder.appendChild(bright)
  console.log(`page is${which_page}`)

  let page = document.getElementById(`holder-page-${which_page || 1}`);
  page.classList.add('dragarea');
  signHolder.setAttribute('class', "signdoc")
  signHolder.classList.add('draggable');

  sign.onload = () => {
    console.log('image ready')
    signHolder.appendChild(sign)
    // saveit()
    position.x=0;
    position.y=0;
    translatePos.x=0;
    translatePos=0;
    // signHolder.appendChild(insideHolder)
  }

  page.append(signHolder)
  download_btn.style.display = "none";
  save_btn.style.display = "block";

})

save_btn.addEventListener('click', () => {
  // document.getElementById('signbutton').style.display = 'none';
  // save_btn.style.display = 'none';
  download_btn.style.display = 'block';
  sign_btn.style.display = 'none';
  save_btn.style.display='none';

})

let width = 20, height = 10;
const position = { x: 0, y: 0 }
interact('.draggable')
  .resizable({
    edges: { top: true, left: true, bottom: true, right: true },
    listeners: {
      move: function (event) {
        let { x, y } = event.target.dataset

        x = (parseFloat(x) || 0) + event.deltaRect.left
        y = (parseFloat(y) || 0) + event.deltaRect.top
        width = event.rect.width;
        height = event.rect.height;

        Object.assign(event.target.style, {
          width: `${event.rect.width}px`,
          height: `${event.rect.height}px`,
          transform: `translate(${position.x}px, ${position.y}px)`
        })
        Object.assign(event.target.dataset, { x, y })
        console.log(x, y, position.x, position.y)
        saveit()
      }
    }
  })

  .draggable({
    listeners: {
      start(event) {
        console.log(event.type, event.target)
      },
      move(event) {
        position.x += event.dx
        position.y += event.dy
        saveit();

        event.target.style.transform =
          `translate(${position.x}px, ${position.y}px)`
          console.log(event.target.style.transform)
        },
      }
    })

var imgdet = [];
// setInterval(saveit,500)
function saveit() {
  var is_there = imgdet.findIndex((img_data, index) =>img_data.img=== data.toString()) 
  console.log(is_there)
  if (is_there == -1) {
    imgdet.push({ img: data.toString(), x: position.x || 306, y: position.y || 396, width: width, height: height, page: which_page - 1 })
    console.log('new push')
    console.log(imgdet.length)
    console.log(JSON.stringify(imgdet))

  }
  else if(imgdet.length>0){
    console.log("updated")
    console.log(is_there+ "is updated")
    imgdet[is_there].x=position.x;
    imgdet[is_there].y=position.y;
    imgdet[is_there].width=width;
    imgdet[is_there].height=height;
    // console.log(JSON.stringify(imgdet))
  }
  console.log(`total ${imgdet.length} sign added`)
}
function downloadit() {
  console.log(sign)
  console.log(position)
  console.log(imgdet)

  fetch("/download",
    {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify(imgdet)
    })
    .then(function (res) { console.log(res) })
    .catch(function (res) { console.log(res) })
}

document.querySelector('.page-container').addEventListener('click', (e) => {
  console.log(e.target.className)
  e.stopPropagation()
  e.preventDefault()

  e.bubbles = false;
  console.log(e.target.classList)
  if (e.target.className == 'fa fa-trash') {
    var is_there = imgdet.findIndex((img_data) => img_data.img == e.target.parentNode.parentNode.querySelector('.sign').getAttribute('src'));
    console.log(is_there)
    if (is_there != -1) {
      imgdet.splice(is_there, 1)
      console.log(imgdet.length)
      e.target.parentNode.parentNode.remove();
      (imgdet.length > 0) ? save_btn.style.display = "block" : save_btn.style.display = "none";
      (imgdet.length > 0) ? download_btn.style.display = "block" : download_btn.style.display = "none";
      console.log('deleted')
      console.log(JSON.stringify(imgdet))
    }
    else {
      console.log(imgdet.length);
      (imgdet.length > 0) ? save_btn.style.display = "block" : save_btn.style.display = "none";
      (imgdet.length > 0) ? download_btn.style.display = "block" : download_btn.style.display = "none";
      e.target.parentNode.parentNode.remove();
    }
    return;
  }
  if (e.target.className == 'sign') {
    e.target.parentNode.classList.toggle('active-sign');
  }
  if(document.querySelectorAll(".sign")!=undefined){
    document.querySelectorAll(".sign").forEach(item=>{item.classList.remove('active-sign')})
  }
})
document.getElementById('closebtn').onclick=()=>{
  document.getElementById('close-form').submit();
}