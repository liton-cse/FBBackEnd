const mongoose = require('mongoose')
const TreeSchema = new mongoose.Schema({
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
    }
});

const createMahogonyModel = (db)=>{
    return db.model('Mahogony',TreeSchema);
};
const createRainTreeModel = (db)=>{
    return db.model('Rain-tree',TreeSchema);
};
const createShishamTreeModel = (db)=>{
    return db.model('Shisham-tree',TreeSchema);
};
const createAkashMoniModel = (db)=>{
    return db.model('AkashMoni',TreeSchema);
};
const createEucalyptusModel = (db)=>{
    return db.model('Eucalyptus',TreeSchema);
};

module.exports={createMahogonyModel,createRainTreeModel,createAkashMoniModel,createShishamTreeModel,createEucalyptusModel};