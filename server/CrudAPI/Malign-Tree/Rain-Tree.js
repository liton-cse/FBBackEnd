const express = require('express');
const bodyParser = require('body-parser');
const connectToDatabase = require('../../DatabaseConfig/database');
require('dotenv').config();
const { createRainTreeModel } = require('../../models/malign-tree/TreeSchema');
const multer = require('multer');
const cookiePerser = require('cookie-parser');
const router = express.Router();
const path = require("path");

router.use(cookiePerser());

// Connecting to the "RainTree" collection in MongoDB
const RainTree = connectToDatabase('RainTree', process.env.MONGODB_URI_MALIGNTREE);
const RainTreeModel = createRainTreeModel(RainTree);

// Middleware
router.use(bodyParser.json());

// Set up Multer for file uploads
const uploadDir = path.join(__dirname, '../../uploads/malign-tree/rain-tree');
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
  // Allowed file extensions
  const filetypes = /jpeg|jpg|png|gif/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

router.use('/upload/rain-tree', express.static(uploadDir));

// POST request to create a new Raintree post
router.post('/rain-tree', upload.single('image'), async (req, res) => {
  try {
    const RainTreePost = new RainTreeModel({
      title: req.body.title,
      description: req.body.description,
      image: req.file ? req.file.filename : '',
    });
    
    const savedPost = await RainTreePost.save();
    res.json({ message: "Post saved successfully", RainTreePost: savedPost });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET all posts from the "RainTree" collection
router.get('/rain-tree', async (req, res) => {
  try {
    const posts = await RainTreeModel.find();
    res.json(posts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET a specific post by ID
router.get('/rain-tree/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const post = await RainTreeModel.findById(id);
    if (!post) {
      return res.status(404).json({ message: `No post found with ID ${id}` });
    }
    res.json({ message: `Post found with ID ${id}`, post });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT request to update a post by ID
router.put('/rain-tree/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  try {
    const rainTreeData = await RainTreeModel.findById(id);
    if (!rainTreeData) {
      return res.status(404).json({ message: `No post found with ID ${id}` });
    }

    rainTreeData.title = req.body.title || rainTreeData.title;
    rainTreeData.description = req.body.description || rainTreeData.description;
    rainTreeData.image = req.file ? req.file.filename : rainTreeData.image;

    const updatedData = await rainTreeData.save();
    res.json({ message: "Data updated successfully", updatedData });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a post by ID
router.delete('/rain-tree/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPost = await RainTreeModel.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).json({ message: `No post found with ID ${id}` });
    }
    res.json({ message: "Deleted successfully", success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
