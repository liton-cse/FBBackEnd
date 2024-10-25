const express= require('express');
const bodyParser = require('body-parser');
const connectToDatabase = require('../DatabaseConfig/database');
require('dotenv').config();
const createSliderModel = require('../models/SlideSchema');
const multer = require('multer');
const cookiePerser =require('cookie-parser');
const router = express.Router();
const path = require("path");
router.use(cookiePerser());

//Connecting to database.. "Slide-Collection"....
const SlideCollection = connectToDatabase('SlideCollection',process.env.MONGODB_URI_NEWSDB);
const SlideModel= createSliderModel(SlideCollection);
//middleware .......
express().use(bodyParser.json());

// Set up Multer for file uploads
const uploadDir = path.join(__dirname, '../uploads/slider-image');
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });

  const upload = multer({ storage: storage,
    limits: { fileSize: 100000000 }, // 1MB limit
    fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
    }
   });

      // Check File Type
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

  

  // creating a collection in mongodb and store data,,,,,,,,

router.post('/slider', upload.single('image'), (req, res) => {
    const newSlide = new SlideModel({
      title: req.body.title,
      subTitle:req.body.subTitle,
      image: req.file ? req.file.filename : '',
    });
    console.log(newSlide.title);
    newSlide.save()
      .then(newSlide => res.json({mesaage:"Post Save successfully",newSlide})
    )
      .catch(err => res.status(400).json({ error: err.message }));
  });

  //get All data from mongodb collection "NewsCollection",,,,

router.get('/slider', (req, res) => {
    SlideModel.find()
      .then(slides => res.json(slides))
      .catch(err => res.status(400).json({ error: err.message }));
  });

  
 // get specific data by Id.....
 router.get('/slider/:id', (req, res) => {
    const _id = req.params.id;
    SlideModel.findById(_id)
      .then(slide => res.json({message:`get data id ${_id}`,slide}))
      .catch(err => res.status(400).json({ error: err.message }));
  });

   // Updating the news over its id....
 router.put('/slider/:id', upload.single('image'), (req, res) => {
    SlideModel.findById(req.params.id)
      .then(slide => {
        slide.title = req.body.title || slide.title;
        slide.subTitle = req.body.subTitle || slide.subTitle;
        slide.image = req.file ? req.file.filename: slide.image;
        slide.save()
          .then(updatedSlide => res.json({message:"Data Update Successfully",updatedSlide}))
          .catch(err => res.status(400).json({ error: err.message }));
      })
      .catch(err => res.status(400).json({ error: err.message }));
  });

  router.delete('/slider/:id', (req, res) => {
    SlideModel.findByIdAndDelete(req.params.id)
      .then(() => res.json({ success: true }))
      .catch(err => res.status(400).json({ error: err.message }));
  });


  module.exports= router;