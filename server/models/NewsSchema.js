const mongoose = require('mongoose')
const NewsSchema = new mongoose.Schema({
    title:{
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
    },
    createdAt: { type: Date, default: Date.now }
});

const createNewsModel = (db)=>{
    return db.model('NewsCollection',NewsSchema);
};

module.exports= createNewsModel;