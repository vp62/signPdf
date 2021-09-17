var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var { download } = require('./download')

var express = require('express');
var path = require('path');
const fileModel = require('./model/FileShema');
const multer = require('multer');
const fs = require('fs')

const ejs = require('ejs');
const s = require('./public/javascripts/Show');

const { Document } = require('mongoose');

const bg = require('./public/javascripts/Show');
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const multerStorage = multer.diskStorage({
  //upload conf...
  //create multer storage configuration
  //create multerFilter for filter a file
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '/Files'));
  },
  filename: (req, file, cb) => {
    let ext = file.mimetype.split('/')[1];
    cb(null, `admin-${file.originalname}`)
  }
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[1] === "pdf") {
    console.log(req.file)
    cb(null, true);
  }
  else if(file.size>12582912){
    console.log("heree come")
    cb(new Error("size exeed!"), false);
  }
  else {

    cb(new Error("Not a PDF File!!"), false);
  }
};
let upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});



//index
app.get('/', function (req, res, next) {
  console.log(req.body);
  res.render('layout', {file:"upload" ,title: 'SignPdf',error:undefined });
});

let file, file_name;
let  pdf=undefined;
function sizeExeed(req,res,next){if(req.file.size>12582912)throw new Error("size exeeds")}

//upload
function cb(err,req,res){
  if(err)
  {console.log("err");console.log(err)}
}
app.post('/api/upload', (req,res,next)=>{
  var uploading=upload.single('uploadFile');
    uploading(req,res,(err)=>{
      try{
            if(err)throw new Error("You can only upload Pdf files. Please go back and upload again.");
      else
        next()

    }
    catch(err){
      // console.log(err);
      next(err);
    }
   
  })
}, async (req, res,next) => {
  console.log("Inpost");
  try {
    file_name = req.file.originalname;
    console.log(":" + req.file.size);
    fs.readFile(req.file.path, (err, data) => {
      if(err) throw new Error("pdf crashed");
      console.log(data);
      file = data.toString();
      pdf = data.toString('base64');
      res.redirect('/show');
    });
  }
  catch (err) { 
    console.log("api upload error")
    // console.log(err);
    next(err) }
});

// get show
app.get('/show', (req,res,next) => {
 try{
   res.render('layout', { url: pdf, pdf: file ,file:"show-model",title:"Add sign Here",error:undefined},(err,htm)=>{
     if(err)throw new Error("Your pdf seamed to be crashed upload proper one");
    res.send(htm)
   });
  }catch(err){
    console.log('from show')
    console.log(err.message)
    next(err)
  }

});
app.post('/download', async (req, res, next) => {
  try {
    console.log(req.body)
    console.log(req.body.x)
    await download({ imgdet: req.body, pdfUrl: path.join(__dirname, `Files/admin-${file_name}`) },);
    req.body.forEach(element => {
      element = {}
    });
    res.end()
  }

  catch (err) {
    next(err)
  }
})
app.get('/down', (req, res,) => {


    res.download( path.join(__dirname,`Files/admin-${file_name}`));
    // res.redirect('/')
},(req,res)=>{console.log("comes");res.redirect('/')})


app.use(function (err,req, res, next) {
  console.log("1st err router")
  next(err);
  // res.status(404)
});

// error handlerxxxxxxxx`
app.use((err, req, res, next) => {
  console.log("error")
  if (err.status != 404) {
    res.locals.status=err.status;
    res.locals.message=err.message;
  return res.render('error',{error:err})
  // res.redirect('/')
  }
  // console.log(res.locals.list)
  // res.render('layout', {
  //   error:undefined,file:'upload'
  // })
})


module.exports = app;
