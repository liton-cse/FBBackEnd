const express= require('express');
const bodyParser = require('body-parser');
const connectToDatabase = require('../DatabaseConfig/database');
require('dotenv').config();
const createActiviseModel = require('../models/ActiviseSchema');
const multer = require('multer');
const cookiePerser =require('cookie-parser');
const router = express.Router();
const path = require("path");
router.use(cookiePerser());

//Connecting to database.. "NewsCollection"....
const ActiviseCollection = connectToDatabase('ActiviseCollection',process.env.MONGODB_URI_NEWSDB);
const ActiviseModel= createActiviseModel(ActiviseCollection);
//middleware .......
express().use(bodyParser.json());


// Set up Multer for file uploads
const uploadDir = path.join(__dirname, '../uploads/activitise-image');
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

//router.use('/uploads/activitiseImage', express.static(uploadDir));


// creating a collection in mongodb and store data,,,,,,,,

router.post('/activitise', upload.single('image'), (req, res) => {
    const newActivise = new ActiviseModel({
      title: req.body.title,
      image: req.file ? req.file.filename : '',
      author: req.body.author,
      description: req.body.description
    });
    
    newActivise.save()
      .then(newActivise => res.json({mesaage:"Post Save successfully",newActivise})
    )
      .catch(err => res.status(400).json({ error: err.message }));
  })

//get All data from mongodb collection "NewsCollection",,,,

router.get('/activitise', (req, res) => {
    ActiviseModel.find()
      .then(activises => res.json(activises))
      .catch(err => res.status(400).json({ error: err.message }));
  });


 // get specific data by Id.......
 router.get('/activitise/:id', (req, res) => {
  const _id=req.params.id;
    ActiviseModel.findById(_id)
      .then(post => res.json(post))
      .catch(err => res.status(400).json({message:"id not valid", error: err.message }));
  });

    //Get lateast Three Events....

    router.get('/limited-activitise',async (req, res) => {
      try {
        const latestInputs = await ActiviseModel.find().sort({ createdAt: -1 }).limit(3);
        res.json(latestInputs);
      } catch (err) {
        res.status(500).send('Server Error');
      }
    });


 // Updating the news over its id....
 router.put('/activitise/:id', upload.single('image'), (req, res) => {
    ActiviseModel.findById(req.params.id)
      .then(post => {
        post.title = req.body.title || post.title;
        post.image = req.file ? req.file.filename : post.image;
        post.author = req.body.author || post.author;
        post.description = req.body.description || post.description;
  
        post.save()
          .then(updatedPost => res.json({message:"Data Update Successfully",updatedPost}))
          .catch(err => res.status(400).json({ error: err.message }));
      })
      .catch(err => res.status(400).json({message:"id not valid", error: err.message }));
  });

    // deleting news over its id.......

    router.delete('/activitise/:id', (req, res) => {
        ActiviseModel.findByIdAndDelete(req.params.id)
          .then(() => res.json({ success: true }))
          .catch(err => res.status(400).json({ error: err.message }));
      });


      module.exports= router;


