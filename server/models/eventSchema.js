//Defining user schema for News......
const mongoose= require('mongoose');
const eventSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    date:
    {
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    createdAt: { type: Date, default: Date.now }
});

const createEventModel=(db)=>{
return db.model('EventCollection',eventSchema);
}


 module.exports=createEventModel;