const jwt = require('jsonwebtoken');

const accesscontroller = async(req, resp,next) => {

        try {
    
            const TOKEN = req.cookies.cook;
            const SECRET_KEY = "hi!@jklmno@pqrs@@@%&tuvwx&&yzab**cdefghi@*$%&!@**__jk__//lmnopqrstuvw++!";
    
            const checkVerified = jwt.verify(TOKEN, SECRET_KEY);
            const user = await Register.findOne({ Email: checkVerified.Email })
    
            if (checkVerified.Email !== user.Email) {
    
                resp.status(500).json('login access expiered try to login again..')
            }else{
                resp.status(200).json('already loggedin');
                next();
            }
        } catch (error){
            // resp.redirect('/signin');
            console.log("Get login Auth failed : "+error);
    
        }
    }

    module.exports = {accesscontroller}
    
