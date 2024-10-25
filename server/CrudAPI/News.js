const express= require('express');
const bodyParser = require('body-parser');
const connectToDatabase = require('../DatabaseConfig/database');
require('dotenv').config();
const createNewsModel = require('../models/NewsSchema');
const multer = require('multer');
const cookiePerser =require('cookie-parser');
const router = express.Router();
const path = require("path");
router.use(cookiePerser());

//Connecting to database.. "Slide-Collection"....
const NewsCollection = connectToDatabase('NewsCollection',process.env.MONGODB_URI_NEWSDB);
const NewsModel= createNewsModel(NewsCollection);
//middleware .......
express().use(bodyParser.json());

// Set up Multer for file uploads
const uploadDir = path.join(__dirname, '../uploads/news-image/');
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

  //router.use('/uploads/news-image', express.static(uploadDir));

  // creating a collection in mongodb and store data,,,,,,,,

router.post('/news', upload.single('image'), (req, res) => {
    const News = new NewsModel({
      title: req.body.title,
      description:req.body.description,
      image: req.file ? req.file.filename: '',
    });
    News.save()
      .then(News=> res.json({mesaage:"Post Save successfully",News})
    )
      .catch(err => res.status(400).json({ error: err.message }));
  });

  //get All data from mongodb collection "NewsCollection",,,,

router.get('/news', (req, res) => {
    NewsModel.find()
      .then(news => res.json(news))
      .catch(err => res.status(400).json({ error: err.message }));
  });

    //Get lateast Three Events....

    router.get('/limited-news',async (req, res) => {
      try {
        const latestInputs = await NewsModel.find().sort({ createdAt: -1 }).limit(4);
        res.json(latestInputs);
      } catch (err) {
        res.status(500).send('Server Error');
      }
    });

  
  //Get Event by Id....
  router.get('/news/:id', async (req, res) => {
    try {
      const news = await NewsModel.findById(req.params.id); // Assuming you have a mongoose model
  
      if (!news) {
        return res.status(404).json({ message: 'News is not found' });
      }
      
      res.json(news); // Send the event details as a response
    } catch (error) {
      console.error('Error fetching News:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

   // Updating the news over its id....
 router.put('/news/:id', upload.single('image'), (req, res) => {
    NewsModel.findById(req.params.id)
      .then(news => {
        news.title = req.body.title || news.title;
        news.description= req.body.description || news.description;
        news.image = req.file ? req.file.filename : news.image;
        news.save()
          .then(updatedNews => res.json({message:"Data Update Successfully",updatedNews}))
          .catch(err => res.status(400).json({ error: err.message }));
      })
      .catch(err => res.status(400).json({ error: err.message }));
  });

  router.delete('/news/:id', (req, res) => {
    NewsModel.findByIdAndDelete(req.params.id)
      .then(() => res.json({message:"Deleted successfully", success: true }))
      .catch(err => res.status(400).json({ error: err.message }));
  });


  module.exports= router;