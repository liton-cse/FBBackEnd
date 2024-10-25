const express = require('express');
const bodyParser = require('body-parser');
const connectToDatabase = require('../DatabaseConfig/database');
require('dotenv').config();
const createAboutModel = require('../models/AboutSchema');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const router = express.Router();
const path = require('path');
router.use(cookieParser());

// Connecting to the "AboutCollection" database
const AboutCollection = connectToDatabase('AboutCollection', process.env.MONGODB_URI_NEWSDB);
const AboutModel = createAboutModel(AboutCollection);

// Middleware
router.use(bodyParser.json());

// Set up Multer for file uploads (supports a single image upload)
const uploadDir = path.join(__dirname, '../uploads/about-image/');
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 10000000 }, // 50MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Check File Type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// POST route to create a new document in the AboutCollection
router.post('/about', upload.single('image'), async (req, res) => {
  try {
    console.log('Uploaded file:', req.file); // Debugging log

    const newAbout = new AboutModel({
      objective: req.body.objective,
      mission: req.body.mission,
      vision: req.body.vision,
      image: req.file ? req.file.filename : undefined, // Save the uploaded file's filename
    });

    const savedAbout = await newAbout.save();
    res.json({ message: 'Post Saved Successfully', savedAbout });
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(400).json({ error: err.message });
  }
});

// GET route to fetch all data from AboutCollection
router.get('/about', async (req, res) => {
  try {
    const abouts = await AboutModel.find();
    res.json(abouts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET route to fetch a specific document by ID
router.get('/about/:id', async (req, res) => {
  try {
    const about = await AboutModel.findById(req.params.id);
    if (!about) {
      return res.status(404).json({ message: 'Data not found' });
    }
    res.json({ message: `Get data by ID ${req.params.id}`, about });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT route to update a document by ID
router.put('/about/:id', upload.single('image'), async (req, res) => {
  try {
    const about = await AboutModel.findById(req.params.id);
    if (!about) {
      return res.status(404).json({ message: 'Data not found' });
    }

    // Update fields conditionally
    about.objective = req.body.objective || about.objective;
    about.mission = req.body.mission || about.mission;
    about.vision = req.body.vision || about.vision;
    about.image = req.file ? req.file.filename : about.image; // Update only if a new file is uploaded

    const updatedAbout = await about.save();
    res.json({ message: 'Data Updated Successfully', updatedAbout });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE route to remove a document by ID
router.delete('/about/:id', async (req, res) => {
  try {
    const about = await AboutModel.findByIdAndDelete(req.params.id);
    if (!about) {
      return res.status(404).json({ message: 'Data not found' });
    }
    res.json({ message: 'Deleted Successfully', success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
