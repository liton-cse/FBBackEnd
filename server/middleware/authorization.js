//middleware.....
const {getUser}=require('../services/authentication');


async function restricToLoginUserOnly(req,res,next){
    token = req.cookies;
    console.log(token);
  

    const user = getUser(token);
    req.user=user;
    next();

 } 
 module.exports={
    restricToLoginUserOnly,
 }