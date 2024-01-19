require('dotenv').config();

const mongoose = require('mongoose');
const jwt = require("jsonwebtoken")


const userRegisterSchema = new mongoose.Schema({
    FirstName: {
        type: String,
        required: true
    },
    LastName: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true,
        unique: true
    },
    Profession: {
        type: String,
        required: true
    },
    Phone: {
        type: Number,
        required: true,
    },
    Password: {
        type: String,
        required: true

    },

    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]

})

userRegisterSchema.methods.generateAuthToken = async function () {
  const SECRET_KEY=process.env.SECRET;
    try {

        const token = jwt.sign({ Email: this.Email,Profession: this.Profession },SECRET_KEY)

        console.log(token);
        this.tokens = this.tokens.concat({token})

        await this.save();
        return token

    } catch (error) {
        console.log("token generate error : " + error)
    }
}


const Register = new mongoose.model("student_Signup", userRegisterSchema)

module.exports = Register