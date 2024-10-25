const mongoose= require('mongoose');
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true,unique: true },
  });

  const createUserModel = (db) => {
    return db.model('admin', UserSchema);
  };
  
  module.exports = createUserModel ;