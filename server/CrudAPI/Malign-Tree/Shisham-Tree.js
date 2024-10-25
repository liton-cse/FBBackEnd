const express = require('express');
const bodyParser = require('body-parser');
const connectToDatabase = require('../../DatabaseConfig/database');
require('dotenv').config();
const { createShishamTreeModel } = require('../../models/malign-tree/TreeSchema');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const router = express.Router();
const path = require("path");

router.use(cookieParser());

// Connecting to the "ShishamTree" collection in MongoDB
const ShishamTree = connectToDatabase('ShishamTree', process.env.MONGODB_URI_MALIGNTREE);
const ShishamTreeModel = createShishamTreeModel(ShishamTree);

// Middleware
router.use(bodyParser.json());

// Set up Multer for file uploads
const uploadDir = path.resolve(__dirname, '../../uploads/malign-tree/shisham-tree');
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

router.use('/upload/shisham-tree', express.static(uploadDir));

// POST request to create a new ShishamTree post
router.post('/shisham-tree', upload.single('image'), async (req, res) => {
  try {
    const ShishamTreePost = new ShishamTreeModel({
      title: req.body.title,
      description: req.body.description,
      image: req.file ? req.file.filename : '',
    });
    
    const savedPost = await ShishamTreePost.save();
    res.json({ message: "Post saved successfully", ShishamTree: savedPost });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET all posts from the "ShishamTree" collection
router.get('/shisham-tree', async (req, res) => {
  try {
    const posts = await ShishamTreeModel.find();
    res.json(posts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET a specific post by ID
router.get('/shisham-tree/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const post = await ShishamTreeModel.findById(id);
    if (!post) {
      return res.status(404).json({ message: `No post found with ID ${id}` });
    }
    res.json({ message: `Post found with ID ${id}`, post });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT request to update a post by ID
router.put('/shisham-tree/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  try {
    const shishamTreeData = await ShishamTreeModel.findById(id);
    if (!shishamTreeData) {
      return res.status(404).json({ message: `No post found with ID ${id}` });
    }

    shishamTreeData.title = req.body.title || shishamTreeData.title;
    shishamTreeData.description = req.body.description || shishamTreeData.description;
    shishamTreeData.image = req.file ? req.file.filename : shishamTreeData.image;

    const updatedData = await shishamTreeData.save();
    res.json({ message: "Data updated successfully", updatedData });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a post by ID
router.delete('/shisham-tree/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPost = await ShishamTreeModel.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).json({ message: `No post found with ID ${id}` });
    }
    res.json({ message: "Deleted successfully", success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
