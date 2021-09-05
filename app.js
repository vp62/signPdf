var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var express = require('express');
var path = require('path');
const fileModel=require('./model/FileShema');
const multer=require('multer');
const fs=require('fs')

const ejs=require('ejs');
const s=require('./public/javascripts/Show');

const { Document } = require('mongoose');

const bg=require('./public/javascripts/Show');
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const multerStorage=multer.diskStorage({
  //upload conf...
  //create multer storage configuration
  //create multerFilter for filter a file
  destination:(req,file,cb)=>{
    cb(null,path.join(__dirname,'/Files'));
  },  
  filename:(req,file,cb)=>{
    let ext=file.mimetype.split('/')[1];
    cb(null,`admin-${file.originalname}`)
  }  
});  

const multerFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[1] === "pdf") {
    cb(null, true);
  }   
  else {
    cb(new Error("Not a PDF File!!"), false);
  } 
};   
const upload=multer({  
  storage:multerStorage,
  fileFilter:multerFilter,
});  



//index
app.get('/', function(req, res, next) {
  console.log(req.body);
  res.render('index', { title: 'SignPdf' });
});  

let file,pdf;
//upload
app.post('/api/upload',upload.single('uploadFile'),async(req,res)=>{
  console.log("Inpost");
  try {
    
    console.log(":"+req.file);
          fs.readFile(req.file.path,(err,data)=>{
            console.log(data);
            pdf=data.toString('base64');
            res.redirect('/show');
          });

        //   let insert= new fileModel({
          //   name:req.file.filename
          // });  
        //  await insert.save().then(console.log("inserted"));
        
      }
      catch(err){console.log(err);}
    });   
    
// get show
app.get('/show',(req,res)=>{
//  console.log(pdf);
 res.render('shows',{url:pdf});
});

app.use(function(req, res, next) {
  next(createError(404));
});

// error handlerxxxxxxxx`
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
