require('dotenv').config();
const Register = require('../model/StudentModel');//ForStudentModel
const Teacher_Register = require('../model/TeacherModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')


const signin =  async (req, resp) => {

    let Email = req.body.Email
    let password = req.body.Password
    let Profession = req.body.Profession

    try {

        if (Profession == 'Student') {

            const userData = await Register.findOne({ Email: Email })

            const isMatch = await bcrypt.compare(password, userData.Password)

            let token = await userData.generateAuthToken();

            if (isMatch) {
                resp.cookie('cook', token, {
                    expires: new Date(Date.now() + 3500000),
                    httpOnly: true
                })

            }

            if (isMatch) {

                
                // resp.status(201).redirect('/home')
                resp.status(200).json("login successfull")


            } else {
                resp.status(500).json("Authentication failed..!")
            }

        } else {

            const userData = await Teacher_Register.findOne({ Email: Email })

            const isMatch = await bcrypt.compare(password, userData.Password)

            let token = await userData.generateAuthToken();

            if (isMatch) {
                resp.cookie('cook', token, {
                    expires: new Date(Date.now() + 500000),
                    httpOnly: true
                })

            }

            if (isMatch) {

                resp.status(201).json('welcome to home page')


            } else {
                resp.status(400).json("Authentication failed..!")
            }
        }



    } catch (error) {

        resp.status(500).json("Authentication failed..!")

    }
}

const signup = async (req, resp) => {
        try {
            const { FirstName, LastName, Email, Profession, Phone, Password, cpassword } = req.body;
    
            if (!Email || !FirstName || !LastName || !Password || !cpassword || !Profession) {
                return resp.status(400).json("All fields are required");
            }
    
            if (Password !== cpassword) {
                return resp.status(400).json("Password not Matched with Confirm Password");
            }
    
            const existinguser = await Register.findOne({ Email });
    
            if (existinguser) {
                return resp.status(400).json("Email already exists, please use a different email.");
            }
    
            const hashPassword = await bcrypt.hash(Password, 12);
    
            if (Profession == "Student") {
    
    
                const registerDoc = new Register({
                    FirstName,
                    LastName,
                    Email,
                    Profession,
                    Phone,
                    Password: hashPassword,
                });
    
                let token = await registerDoc.generateAuthToken();
    
                resp.cookie('cook', token, {
                    expires: new Date(Date.now() + 500000),
                    httpOnly: true
                })
    
                await registerDoc.save();
            } else {
    
                const registerDoc = new Teacher_Register({
                    FirstName,
                    LastName,
                    Email,
                    Profession,
                    Phone,
                    Password: hashPassword,
                });
    
                let token = await registerDoc.generateAuthToken();
    
                resp.cookie('cook', token, {
                    expires: new Date(Date.now() + 500000),
                    httpOnly: true
                })
    
                await registerDoc.save();
            }
    
            // return resp.status(201).redirect("/home");
            return resp.status(201).json("Signup successfully..")
        } catch (error) {
            console.error("Error find at insert time : " + error);
            return resp.status(500).json("Error occurred during signup");
        }
    }

const forgotPass = async (req, resp) => {

    const { Email, Password, cpassword } = req.body
    console.log(Email,Password,cpassword);

    const TOKEN = req.cookies.cook;
    console.log("Token"+TOKEN);
    const SECRET_KEY = process.env.SECRET;

    const checkVerified = jwt.verify(TOKEN, SECRET_KEY);

    let Profession = checkVerified.Profession;

    try {

        if (Profession == "Student") {

            const userData = await Register.findOne({ Email });

            if (userData.Email == checkVerified.Email) {

                const isMatch = await bcrypt.compare(Password, userData.Password)

                if (isMatch) {

                    let userEmail = checkVerified.Email
                    const hashPassword = await bcrypt.hash(cpassword, 12);

                    await Register.updateOne({ Email: userEmail },
                        { $set: { Password: hashPassword } })

                        
                } else {
                    resp.status(500).json('please try again with Enter valid email and your old password !!');
                }

            } else {
                resp.status(500).json('Enter your valid login Email and password..');
            }


        } else {

            const userData = await Teacher_Register.findOne({ Email });

            if (userData.Email == checkVerified.Email) {

                const isMatch = await bcrypt.compare(password, userData.Password)

                if (isMatch) {

                    let userEmail = checkVerified.Email
                    const hashPassword = await bcrypt.hash(cpassword, 12);


                    await Teacher_Register.updateOne({ Email: userEmail },
                        { $set: { Password: hashPassword } })
                } else {
                    resp.status(500).json('please try again with Enter valid email and your old password !!');
                }

            } else {
                resp.status(500).json('Enter your valid login Email and password..');
            }

        }


        resp.clearCookie('cook');
        resp.status(200).json("password update successfully")
        // resp.redirect('/signin')

    } catch (error) {
        resp.status(500).json("error at forgotpassword : " + error);
    }

}

const Deleteaccount = async (req, resp) => {

    const { Email, Password } = req.body
    TOKEN = await req.TOKEN

    const checkVerified = jwt.verify(TOKEN, SECRET_KEY);

    try {

        if (checkVerified.Profession == "Student") {

            const userData = await Register.findOne({ Email });


            if (userData.Email == checkVerified.Email) {

                const hashPassword = await bcrypt.compare(req.body.Password, userData.Password)

                if (hashPassword) {

                    await Register.deleteOne({ Email: userData.Email })
                    resp.status(200).json("deleted successsfully")

                } else {
                    resp.status(500).json("Authentication failed..!")
                }

            }

        }else{

            const userData = await Teacher_Register.findOne({ Email });

            if (userData.Email == checkVerified.Email) {

                const hashPassword = await bcrypt.compare(req.body.Password, userData.Password)

                if (hashPassword) {

                    await Register.deleteOne({ Email: userData.Email })
                    resp.status(200).json("deleted successsfully")

                } else {
                    resp.status(500).json("Authentication failed..!")
                }

            }

        }

        // const TOKEN = req.cookies.cook;
        // const SECRET_KEY = "hi!@jklmno@pqrs@@@%&tuvwx&&yzab**cdefghi@*$%&!@**__jk__//lmnopqrstuvw++!"
        // const checkVerified = jwt.verify(TOKEN, SECRET_KEY);

    } catch (error) {

        resp.status(500).json("Error in deleteAccount : " + error)
    }

}

module.exports = {Deleteaccount,forgotPass,signin,signup}
