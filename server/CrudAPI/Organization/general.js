const express= require('express');
const bodyParser = require('body-parser');
const connectToDatabase = require('../../DatabaseConfig/database');
require('dotenv').config();
const createExecutive= require('../../models/organization/GeneralSchema');
const multer = require('multer');
const cookiePerser =require('cookie-parser');
const router = express.Router();
const path = require("path");
router.use(cookiePerser());

//Connecting to database.. "GeneralCollection....
const generalCollection = connectToDatabase('generalCollection',process.env.MONGODB_URI_ORGANIZATION);
const GeneralModel= createExecutive(generalCollection);
//middleware .......
express().use(bodyParser.json());

// Set up Multer for file uploads
const uploadDir = path.join(__dirname, '../../uploadsOrganization/general');
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });

  const upload = multer({ storage: storage,
    limits: { fileSize: 10*1024*1024 }, // 10MB limit
    fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
    }
   });

      // Check File Type.......
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
  }


  router.post('/general', upload.single('image'), async (req, res) => {
    const { name, email, phoneNumber,facebookLink, bloodGroup,reference, address } = req.body;
  
    try {
      const newUser = new GeneralModel({
        name,
        image: req.file ? req.file.filename : '', 
        email,
        phoneNumber,
        facebookLink,
        bloodGroup,
        reference,
        address: JSON.parse(address)
      });
      await newUser.save();
      res.status(200).json(newUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get all users
router.get('/general', async (req, res) => {
    try {
      const users = await GeneralModel.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });


  // Update a user
router.put('/general/:id', upload.single('image'), async (req, res) => {
    const { name,email, phoneNumber,facebookLink, bloodGroup,reference, address } = req.body;
  
    try {
      const updatedUser = await GeneralModel.findByIdAndUpdate(
        req.params.id,
        {
          name,
          image: req.file ? req.file.filename : req.body.image, 
          email,
          phoneNumber,
          facebookLink,
          bloodGroup,
          reference,
          address: JSON.parse(address)
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });


  // Delete a user
router.delete('/general/:id', async (req, res) => {
    try {
      await GeneralModel.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });


  router.get('/general/search/:name', async (req, res) => {
    const { name } = req.params; 

    try {
        // Use case-insensitive regex search for the name
        const users = await GeneralModel.find({ name: { $regex: new RegExp(name, 'i') } });
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
  module.exports= router;
  
