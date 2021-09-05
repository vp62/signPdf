const app=require('./app');
const mongoose=require('mongoose');

let URI="mongodb+srv://vpvillain:vpvillain@signpdf.0vtno.mongodb.net/uploadedFile?retryWrites=true&w=majority";
// let URI="mongodb://127.0.0.1:27017/uploadedFile"
mongoose.connect(URI,{
    useCreateIndex: true,
    useFindAndModify: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
  }).then(()=> console.log("Db connected at successfully"));



app.listen(3000,()=>console.log("http://localhost:3000/"));