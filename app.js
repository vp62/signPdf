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
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});



//index
app.get('/', function (req, res, next) {
  console.log(req.body);
  res.render('layout', {file:"upload" ,title: 'SignPdf' });
});

let file, pdf, file_name;
function sizeExeed(req,res,next){if(req.file.size>12582912)throw new Error("size exeeds")}

//upload
app.post('/api/upload', upload.single('uploadFile'), async (req, res,next) => {
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

    //   let insert= new fileModel({
    //   name:req.file.filename
    // });  
    //  await insert.save().then(console.log("inserted"));

  }
  catch (err) { 
    console.log("api upload error")
    console.log(err);
    next(err) }
});

// get show
app.get('/show', (req,res,next) => {
 try{
   res.render('layout', { url: pdf, pdf: file ,file:"shows",title:"Add sign Here"},(err,htm)=>{
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


app.use(function (req, res, next) {
  next(createError(404));
});

// error handlerxxxxxxxx`
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  console.log('from error\n',err.status,err.message)
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
