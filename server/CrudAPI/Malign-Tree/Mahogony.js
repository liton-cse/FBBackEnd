const express = require('express');
const bodyParser = require('body-parser');
const connectToDatabase = require('../../DatabaseConfig/database');
require('dotenv').config();
const { createMahogonyModel } = require('../../models/malign-tree/TreeSchema');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const router = express.Router();
const path = require("path");

router.use(cookieParser());
express().use(bodyParser.json());

// Connecting to the database
const Mahogony = connectToDatabase('Mahogony', process.env.MONGODB_URI_MALIGNTREE);
const MahogonyModel = createMahogonyModel(Mahogony);

// Set up Multer for file uploads
const uploadDir = path.join(__dirname, '../../uploads/malign-tree/mahogony/');
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

// POST route to create and save a new record
router.post('/mahogony', upload.single('image'), async (req, res) => {
  try {
    const mahogonyPost = new MahogonyModel({
      title: req.body.title,
      description: req.body.description,
      image: req.file ? req.file.filename : '',
    });

    const savedPost = await mahogonyPost.save();
    res.json({ mahogonyPost: savedPost });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET route to fetch all data
router.get('/mahogony', async (req, res) => {
  try {
    const mahogonyData = await MahogonyModel.find();
    res.json(mahogonyData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET route to fetch specific data by ID
router.get('/mahogony/:id', async (req, res) => {
  try {
    const post = await MahogonyModel.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json({ message: `Get data by ID: ${req.params.id}`, post });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT route to update a record by ID
router.put('/mahogony/:id', upload.single('image'), async (req, res) => {
  try {
    const mahogonyData = await MahogonyModel.findById(req.params.id);
    if (!mahogonyData) {
      return res.status(404).json({ message: 'Data not found' });
    }

    mahogonyData.title = req.body.title || mahogonyData.title;
    mahogonyData.description = req.body.description || mahogonyData.description;
    mahogonyData.image = req.file ? req.file.filename : mahogonyData.image;

    const updatedData = await mahogonyData.save();
    res.json({ message: "Data updated successfully", updatedData });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE route to remove a record by ID
router.delete('/mahogony/:id', async (req, res) => {
  try {
    const deletedData = await MahogonyModel.findByIdAndDelete(req.params.id);
    if (!deletedData) {
      return res.status(404).json({ message: 'Data not found' });
    }
    res.json({ message: "Deleted successfully", success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
