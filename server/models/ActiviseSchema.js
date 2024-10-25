//Defining user schema for News......
const mongoose= require('mongoose');
const activitiseSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    image:
    {
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    createdAt: { type: Date, default: Date.now },
    description:{
        type:String,
        required:true
    }
});

const createActiviseModel=(db)=>{
return db.model('ActiviseCollection',activitiseSchema);
}


 module.exports=createActiviseModel;