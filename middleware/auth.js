const jwt = require('jsonwebtoken')
const Register = require('../model/StudentModel')
const Teacher_Register = require('../model/TeacherModel');

const TokenVerification = async (req, resp, next) => {
  const TOKEN = req.cookies.cook;
  const SECRET_KEY = "hi!@jklmno@pqrs@@@%&tuvwx&&yzab**cdefghi@*$%&!@**__jk__//lmnopqrstuvw++!"
  try {
    const checkVerified = jwt.verify(TOKEN, SECRET_KEY);

    console.log(checkVerified);

    if(checkVerified.Profession == "Student"){
      let Suser = await Register.findOne({ Email: checkVerified.Email })
      req.user = Suser;//Student
      req.TOKEN = TOKEN;
    }else{
      let Tuser = await Teacher_Register.findOne({ Email: checkVerified.Email })
      req.user = Tuser;//Teacher
      req.TOKEN = TOKEN;
    }
    
    next();
  } catch (error) {
    // resp.redirect('/signin')
    console.error("Token Verification error : " + error)
  }

}

module.exports = TokenVerification

