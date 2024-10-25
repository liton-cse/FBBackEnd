const express = require('express');
const bodyParser = require('body-parser');
const connectToDatabase = require('../../DatabaseConfig/database');
require('dotenv').config();
const { createAkashMoniModel } = require('../../models/malign-tree/TreeSchema');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const router = express.Router();
const path = require("path");

router.use(cookieParser());

// Connecting to the "AkashMoni" collection in MongoDB
const AkashMoni = connectToDatabase('AkashMoni', process.env.MONGODB_URI_MALIGNTREE);
const AkashMoniModel = createAkashMoniModel(AkashMoni);

// Middleware
router.use(bodyParser.json());

// Set up Multer for file uploads
const uploadDir = path.join(__dirname, '../../uploads/malign-tree/akash-moni');
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

// POST request to create a new AkashMoni post
router.post('/akash-moni', upload.single('image'), async (req, res) => {
  try {
    const AkashMoniPost = new AkashMoniModel({
      title: req.body.title,
      description: req.body.description,
      image: req.file ? req.file.filename : '',
    });
    
    const savedPost = await AkashMoniPost.save();
    res.json({ message: "Post saved successfully", akashmoni: savedPost });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET all posts from the "AkashMoni" collection
router.get('/akash-moni', async (req, res) => {
  try {
    const posts = await AkashMoniModel.find();
    res.json(posts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET a specific post by ID
router.get('/akash-moni/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const post = await AkashMoniModel.findById(id);
    if (!post) {
      return res.status(404).json({ message: `No post found with ID ${id}` });
    }
    res.json({ message: `Post found with ID ${id}`, post });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT request to update a post by ID
router.put('/akash-moni/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  try {
    const akashmoniData = await AkashMoniModel.findById(id);
    if (!akashmoniData) {
      return res.status(404).json({ message: `No post found with ID ${id}` });
    }

    akashmoniData.title = req.body.title || akashmoniData.title;
    akashmoniData.description = req.body.description || akashmoniData.description;
    akashmoniData.image = req.file ? req.file.filename : akashmoniData.image;

    const updatedData = await akashmoniData.save();
    res.json({ message: "Data updated successfully", updatedData });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a post by ID
router.delete('/akash-moni/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPost = await AkashMoniModel.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).json({ message: `No post found with ID ${id}` });
    }
    res.json({ message: "Deleted successfully", success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
