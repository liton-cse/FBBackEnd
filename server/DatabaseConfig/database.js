
const mongoose = require('mongoose');

const connections = {};

const connectToDatabase = (dbName, uri) => {
try{
    if (connections[dbName]) {
        return connections[dbName];
    }
    const connection = mongoose.createConnection(uri); 
    console.log("Connection successful ");
    connections[dbName] = connection;
    console.log(uri+"/"+dbName);
    return connection;   
 }catch(err){
    console.log(`Error:${err.message}`)
}
};

module.exports = connectToDatabase;


