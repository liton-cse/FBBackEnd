const mongoose = require('mongoose');
VideoSchema = new mongoose.Schema({
    district:{
        type:String,
        required:true
    },
    subDistrict:{
        type:String,
        required:true
    },
    videoName: String,
    videoUpd:String,
    videoPath: String,
    uploadedAt: { type: Date, default: Date.now }

});

const createVideoModel = (db)=>{
    return db.model('VideoCollection',VideoSchema);
};
module.exports = createVideoModel;