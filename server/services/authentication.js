const jwt = require('jsonwebtoken');
const secret="liton420$@";

function setUser(user){
    return jwt.sign({user_id:user._id},secret,{expiresIn:'1h'});
}
function getUser(token){
    if (!token) {
        return null;
      }
   try{
    return jwt.verify(token,secret);
   }catch(err){
    return null
   }
}

module.exports={
    setUser,getUser
}