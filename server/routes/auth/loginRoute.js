const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
require('dotenv').config();
const connectToDatabase =require('..//..//DatabaseConfig/database');
const createUserModel = require('..//..//models/User');
const { setUser } = require('../../services/authentication');
const{restricToLoginUserOnly}=require('..//..//middleware/authorization');
const cookiePerser =require('cookie-parser');
router.use(cookiePerser());

//Database connection and User model.......
const db1 = connectToDatabase('admin', process.env.MONGODB_URI);
const User = createUserModel(db1);

router.post('/login',async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  console.log(user);

 if(!user){
  return res.status(400).send('User not found');
 }
 const isPasswordValid = await bcrypt.compare(password,user.password);

 if(!isPasswordValid){
  return res.status(400).send("Invalid password");
 }
 const token = setUser(user);


 res.set("Access-token",token);

res.cookie('rememberme', '1', { maxAge: 900000, httpOnly: true })
 
//res.cookie();

res.json({token});

 //return res.cookie("Access-token",token,{httpOnly: true,
//  secure: false, sameSite: 'None'}).status(200).json({token,message:"login successful"});

 
});

router.post('/register',async (req,res)=>{
  
  const {email,password} = req.body;
  try{
    
    const hashedPassword = await bcrypt.hash(password,10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).send('User registered');
  } catch (err) {
    res.status(500).send('Error registering user');
  }
  });

module.exports = router;