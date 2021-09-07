var download_btn = document.getElementById('downloadbtn');
var save_btn = document.getElementById('savebtn');

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

document.getElementById('save').addEventListener('click', function () {
  if (signaturePad.isEmpty()) {
    return alert("Please provide a signature first.");
  }

  var data = signaturePad.toDataURL('image/png');

  // Send data to server instead... 
  window.open(data);
});
document.getElementById('clear').addEventListener('click', function () {
  signaturePad.clear();
});
var translatePos = {
  x: 0,
  y: 0
};
let sign, signHolder
document.getElementById('apply').addEventListener('click', (event) => {
  // var sign=document.createElement('')

  sign = document.createElement('img');
  signHolder = document.createElement('div');
  data = signaturePad.toDataURL('image/png');
  sign.src = data;
  sign.setAttribute('class', 'sign')
  var tright = document.createElement('div')
  var tleft = document.createElement('div')
  var bleft = document.createElement('div')
  var bright = document.createElement('div')
  tright.setAttribute('class', 'tright');
  tleft.setAttribute('class', 'tleft');
  bright.setAttribute('class', 'bright');
  bleft.setAttribute('class', 'bleft');
  signHolder.appendChild(tright)
  signHolder.appendChild(tleft)
  signHolder.appendChild(bleft)
  signHolder.appendChild(bright)
  // signHolder.setAttribute('class','draggable-sign');
  let page = document.getElementById('holder-page-1');
  page.classList.add('dragarea');
  signHolder.classList.add('draggable');
  sign.onload = () => {
    console.log('image ready')
    signHolder.appendChild(sign)
  }

  page.append(signHolder)

  download_btn.style.display = "none";
  save_btn.style.display = "block";
  const position = { x: 0, y: 0 }

})

save_btn.addEventListener('click', () => {
  document.getElementById('signbutton').style.display = 'none';
  save_btn.style.display = 'none';
  download_btn.style.display = 'block';
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
        console.log(x, y, position.x, position.y)
        Object.assign(event.target.dataset, { x, y })
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

        event.target.style.transform =
          `translate(${position.x}px, ${position.y}px)`
      },
    }
  })

var imgdet = [];
function saveit() {
  imgdet.push({ img: data.toString(), x: position.x || 306, y: position.y || 396, width: width, height: height })
  console.log('saved')
  console.log(JSON.stringify(imgdet))
}
function downloadit() {
  console.log(sign)
  console.log(position)

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