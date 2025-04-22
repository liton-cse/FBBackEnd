const express = require('express');
const bodyParser = require('body-parser');
const connectToDatabase = require('../DatabaseConfig/database');
require('dotenv').config();
const createHomeModel = require('../models/HomeSchema');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const router = express.Router();
const path = require("path");
router.use(cookieParser());

// Connecting to database "NewsCollection"
const HomeCollection = connectToDatabase('HomeCollection', process.env.MONGODB_URI_NEWSDB);
const HomeModel = createHomeModel(HomeCollection);

// Middleware
express().use(bodyParser.json());

// Set up Multer for file uploads
const uploadDir = path.join(__dirname, '../uploads/home-image/');
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // 1MB limit
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

router.use('/uploads', express.static("uploads"));

// Creating a collection in MongoDB and storing data
router.post('/home', upload.single('image'), async (req, res) => {
    try {
        const newHome = new HomeModel({
            description: req.body.description,
            image: req.file ? req.file.filename : ''
        });
        const savedHome = await newHome.save();
        res.json({ message: "Post saved successfully", savedHome });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all data from MongoDB collection "NewsCollection"
router.get('/homes', async (req, res) => {
    try {
        const allHome = await HomeModel.find();
        res.json(allHome);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/home', async (req, res) => {
    try {
        const latestHome = await HomeModel.findOne().sort({ createdAt: -1 });
        res.json(latestHome);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get specific data by ID
router.get('/home/:id', async (req, res) => {
    try {
        const post = await HomeModel.findById(req.params.id);
        res.json(post);
    } catch (err) {
        res.status(400).json({ message: "ID not valid", error: err.message });
    }
});

// Update data by ID
router.put('/home/:id', upload.single('image'), async (req, res) => {
    try {
        const post = await HomeModel.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });
        
        post.description = req.body.description || post.description;
        post.image = req.file ? req.file.filename : post.image;
        const updatedPost = await post.save();
        
        res.json({ message: "Data updated successfully", updatedPost });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete data by ID
router.delete('/home/:id', async (req, res) => {
    try {
        await HomeModel.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully", success: true });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
