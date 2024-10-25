const express= require('express');
const bodyParser = require('body-parser');
const connectToDatabase = require('../DatabaseConfig/database');
require('dotenv').config();
const createHomeModel = require('../models/HomeSchema');
const multer = require('multer');
const cookiePerser =require('cookie-parser');
const router = express.Router();
const path = require("path");
router.use(cookiePerser());

//Connecting to database.. "NewsCollection"....
const HomeCollection = connectToDatabase('HomeCollection',process.env.MONGODB_URI_NEWSDB);
const HomeModel= createHomeModel(HomeCollection);
//middleware .......
express().use(bodyParser.json());


// Set up Multer for file uploads
const uploadDir =  path.join(__dirname,'../uploads/home-image/');
//const uploadDir = '../uploads/Home/Image/';
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

router.use('/uploads', express.static("uploads"));

// creating a collection in mongodb and store data,,,,,,,,

router.post('/home', upload.single('image'), (req, res) => {
    const newHome = new HomeModel({
    description: req.body.description,
    image: req.file ? req.file.filename : ''
    });
    newHome.save()
      .then(newHome => res.json({mesaage:"Post Save successfully",newHome})
    )
      .catch(err => res.status(400).json({ error: err.message }));
  });

  //get All data from mongodb collection "NewsCollection",,,,
  router.get('/homes', (req, res) => {
    HomeModel.find()
      .then(allHome => res.json(allHome))
      .catch(err => res.status(400).json({ error: err.message }));
  });

router.get('/home', (req, res) => {
    HomeModel.findOne().sort({ createdAt: -1 })
      .then(allHome => res.json(allHome))
      .catch(err => res.status(400).json({ error: err.message }));
  });

   // get specific data by Id.......
 router.get('/home/:id', (req, res) => {
    const _id=req.params.id;
      HomeModel.findById(_id)
        .then(post => res.json(post))
        .catch(err => res.status(400).json({message:"id not valid", error: err.message }));
    });
  
    
 // Updating the news over its id....
 router.put('/home/:id', upload.single('image'), (req, res) => {
    HomeModel.findById(req.params.id)
      .then(post => {
        post.description = req.body.description || post.description;
        post.image = req.file ? req.file.filename : post.image;
        post.save()
          .then(updatedPost => res.json({message:"Data Update Successfully",updatedPost}))
          .catch(err => res.status(400).json({ error: err.message }));
      })
      .catch(err => res.status(400).json({message:"id not valid", error: err.message }));
  });

    // deleting news over its id.......

    router.delete('/home/:id', (req, res) => {
        HomeModel.findByIdAndDelete(req.params.id)
          .then(() => res.json({message:"Deleted sucessfully", success: true }))
          .catch(err => res.status(400).json({ error: err.message }));
      });


      module.exports= router;
