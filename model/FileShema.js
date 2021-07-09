const mongoose=require('mongoose');

const fileSchema= new mongoose.Schema({
    name:{
        type:String,
        required: [true,"file name must"]
    }
});

const file=mongoose.model('uploadedFiles',fileSchema);

module.exports=file;