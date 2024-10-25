const mongoose = require('mongoose')
const HomeSchema = new mongoose.Schema({
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    createdAt: { type: Date, default: Date.now }
});

const createHomeModel = (db)=>{
    return db.model('HomeCollection',HomeSchema);
}
module.exports= createHomeModel;