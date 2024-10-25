const mongose = require('mongoose');

SliderSchema = new mongose.Schema({
    title:{
        type:String,
        required:true
    },
    subTitle:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    }
});

const createSliderModel = (db)=>{
    return db.model('SlideCollection',SliderSchema);
}
module.exports=createSliderModel;