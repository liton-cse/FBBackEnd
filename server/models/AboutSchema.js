const mongoose = require('mongoose');

const AboutSchema = new mongoose.Schema({
  objective: {
    type: String,
    required: true
  },
  mission: {
    type: String,
    required: true
  },
  vision: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },

});

const createAboutModel = (db) => {
  return db.model('AboutCollection', AboutSchema);
};

module.exports = createAboutModel;
