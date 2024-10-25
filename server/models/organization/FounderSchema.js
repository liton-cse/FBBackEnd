const mongoose = require('mongoose')
const FounderSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    }
});

const createFounderModel = (db)=>{
    return db.model('FounderCollection',FounderSchema);
}
module.exports= createFounderModel;