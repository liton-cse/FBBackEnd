const mongoose = require('mongoose')
const ExecutiveSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    designation:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique: true,
        match: [/.+@.+\..+/, "Please enter a valid email address"]
    },
    phoneNumber:{
        type:String,
        required:true,
        
    },
    facebookLink:{
        type:String,
        required:true,
        validate: {
            validator: function (v) {
              return /^https?:\/\/(www\.)?facebook\.com\/[A-Za-z0-9_.-]+\/?$/.test(v); 
            },
            message: props => `${props.value} is not a valid Facebook URL!`
          },
    },
    bloodGroup:{
        type:String,
        required:true,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    image:{
        type:String,
        required:true
    },
    address:{
        state: { type: String, required: true },
        district: { type: String, required: true },
        subDistrict: { type: String, required: true },
        village: { type: String, required: true }
    },
});

const createExecutiveModel = (db)=>{
    return db.model('executiveCollection',ExecutiveSchema);
}
module.exports= createExecutiveModel;