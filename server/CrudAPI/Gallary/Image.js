const express= require('express');
const bodyParser = require('body-parser');
const connectToDatabase = require('../../DatabaseConfig/database');
require('dotenv').config();
const createImageModel = require('../../models/gallary/ImageSchema');
const multer = require('multer');
const cookiePerser =require('cookie-parser');
const router = express.Router();
const path = require("path");
router.use(cookiePerser());
const fs = require('fs');

//Connecting to database.. "Slide-Collection"....
const ImageCollection = connectToDatabase('ImageCollection',process.env.MONGODB_URI_GALLARY);
const ImageModel= createImageModel(ImageCollection);
//middleware .......
express().use(bodyParser.json());

// Configure multer storage
const storageEngine = multer.memoryStorage(); 
const upload = multer({ storage: storageEngine,
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

// Set up a POST route to handle image uploads
router.post('/images', upload.array('images', 100), async (req, res) => {
    const { district, subDistrict } = req.body;

    if (!district || !subDistrict) {
        return res.status(400).send('District and Sub-District names are required');
    }
    const folderDir= '../../uploadsGallary/images';
    const directoryFolder = path.join(__dirname, folderDir);
    try {
        // Convert district and subDistrict to lowercase before storing
        const lowerDistrict = district.toLowerCase();
        const lowerSubDistrict = subDistrict.toLowerCase();

        // Save each image to MongoDB
        const savedImages = await Promise.all(req.files.map(file => {
            const newImage = new ImageModel({
                district: lowerDistrict,
                subDistrict: lowerSubDistrict,
                imageName: file.originalname,
                imageUpd:`${Date.now()}-${file.originalname}`,
                imagePath: `${directoryFolder}/${lowerDistrict}/${lowerSubDistrict}/${Date.now()}-${file.originalname}`,
            });

            // Save the image to the file system
            const dir = `${directoryFolder}/${lowerDistrict}/${lowerSubDistrict}`;
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(newImage.imagePath, file.buffer);

            return newImage.save();
        }));

        res.send({
            message: 'Images uploaded successfully',
            images: savedImages
        });
    } catch (error) {
        res.status(500).send('Error uploading images');
    }
    
});

router.get('/images',async(req,res)=>{
    try{
        const posts = await ImageModel.find();
        res.status(200).json(posts);
    }catch(err){
        res.status(500).json({error:"Failed to load data"});
    }
});

/*router.put('/images/:id', upload.array('images',10), async (req, res) => {
    const { id } = req.params;
    const { district, subDistrict } = req.body;

    if (!district || !subDistrict) {
        return res.status(400).send('District and Sub-District names are required');
    }

    try {
        const image = await ImageModel.findById(id);
        if (!image) {
            return res.status(404).send('Image not found');
        }

        // Update the district and subDistrict fields
        image.district = district.toLowerCase();
        image.subDistrict = subDistrict.toLowerCase();

        // If a new image file is uploaded, update it
        if (req.file) {
            const folderDir = '../../uploadsGallary/images';
            const directoryFolder = path.join(__dirname, folderDir);

            const dir = `${directoryFolder}/${image.district}/${image.subDistrict}`;
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            const newImagePath = `${dir}/${Date.now()}-${req.file.originalname}`;
            fs.writeFileSync(newImagePath, req.file.buffer);

            // Delete the old image file
            fs.unlinkSync(image.imagePath);

            // Update the image path and name in the database
            image.imageName = req.file.originalname;
            image.imageUpd = `${Date.now()}-${req.file.originalname}`;
            image.imagePath = newImagePath;
        }

        await image.save();

        res.status(200).json({ message: 'Image updated successfully', image });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update image' });
    }
});*/


router.delete('/images/:id',async(req,res)=>{
    const id= req.params.id;
    try{
        const image=await ImageModel.findByIdAndDelete(id);
        if (image) {
            fs.unlinkSync(image.imagePath); 
            res.status(200).json({ message: 'Image deleted successfully' });
        } else {
            res.status(404).json({ error: 'Image not found' });
        }

    }catch(error){
        res.status(500).json({error:"Failed to delete data"});
    }
});


// Set up a GET route to search images by district or subDistrict
// Set up a GET route to search images by district or subDistrict (case-insensitive)
router.get('/search-images/:name', async (req, res) => {
    const name = req.params.name.trim().toLowerCase();

    // Ensure at least some valid input is provided for searching
    if (!name) {
        return res.status(400).send('A search string (district or subDistrict) is required');
    }

    try {

        const query = {
            $or: [
                { district: { $regex: name, $options: 'i' } }, 
                { subDistrict: { $regex: name, $options: 'i' } } 
            ]
        };

        // Fetch the images based on the query
        const images = await ImageModel.find(query);

        if (images.length === 0) {
            return res.status(404).send('No images found matching the specified district or subDistrict');
        }

        res.json(images);
    } catch (error) {
        res.status(500).send('Error retrieving images');
    }
});



module.exports=router;

