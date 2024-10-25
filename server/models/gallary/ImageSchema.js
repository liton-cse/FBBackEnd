const mongoose = require('mongoose');
ImageSchema = new mongoose.Schema({
    district:{
        type:String,
        required:true
    },
    subDistrict:{
        type:String,
        required:true
    },
    imageName: String,
    imageUpd:String,
    imagePath: String,
    
    uploadedAt: { type: Date, default: Date.now }

});

const createImageModel = (db)=>{
    return db.model('ImageCollection',ImageSchema);
};
module.exports = createImageModel;