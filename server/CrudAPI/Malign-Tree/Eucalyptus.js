const express = require('express');
const bodyParser = require('body-parser');
const connectToDatabase = require('../../DatabaseConfig/database');
require('dotenv').config();
const { createEucalyptusModel } = require('../../models/malign-tree/TreeSchema');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const router = express.Router();
const path = require("path");

router.use(cookieParser());

// Connecting to the "Eucalyptus" collection in MongoDB
const Eucalyptus = connectToDatabase('Eucalyptus', process.env.MONGODB_URI_MALIGNTREE);
const EucalyptusModel = createEucalyptusModel(Eucalyptus);

// Middleware
router.use(bodyParser.json());

// Set up Multer for file uploads
const uploadDir = path.resolve(__dirname, '../../uploads/malign-tree/eucalyptus');
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100000000 }, // 100MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
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

// POST request to create a new Eucalyptus post
router.post('/eucalyptus', upload.single('image'), async (req, res) => {
  try {
    const eucalyptusPost = new EucalyptusModel({
      title: req.body.title,
      description: req.body.description,
      image: req.file ? req.file.filename : '',
    });
    
    const savedPost = await eucalyptusPost.save();
    res.json({ message: "Post saved successfully", eucalyptusPost: savedPost });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET all posts from the "Eucalyptus" collection
router.get('/eucalyptus', async (req, res) => {
  try {
    const posts = await EucalyptusModel.find();
    res.json(posts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET a specific post by ID
router.get('/eucalyptus/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const post = await EucalyptusModel.findById(id);
    if (!post) {
      return res.status(404).json({ message: `No post found with ID ${id}` });
    }
    res.json({ message: `Post found with ID ${id}`, post });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT request to update a post by ID
router.put('/eucalyptus/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  try {
    const eucalyptusData = await EucalyptusModel.findById(id);
    if (!eucalyptusData) {
      return res.status(404).json({ message: `No post found with ID ${id}` });
    }

    eucalyptusData.title = req.body.title || eucalyptusData.title;
    eucalyptusData.description = req.body.description || eucalyptusData.description;
    eucalyptusData.image = req.file ? req.file.filename : eucalyptusData.image;

    const updatedData = await eucalyptusData.save();
    res.json({ message: "Data updated successfully", updatedData });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a post by ID
router.delete('/eucalyptus/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPost = await EucalyptusModel.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).json({ message: `No post found with ID ${id}` });
    }
    res.json({ message: "Deleted successfully", success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
