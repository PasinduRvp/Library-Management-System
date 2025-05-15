const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');


async function userSignInController(req,res) {

    try{
        const{email,password} = req.body

        if(!email){
            throw new Error("Please provide email")
        }
        if(!password){
            throw new Error("Please provide password")
        }

        const user = await userModel.findOne({email})

        if(!user){
        throw new Error("User Not Found")
        }

        const checkPassword = await bcrypt.compare(password,user.password)

        console.log("checkPassword",checkPassword)

        if(checkPassword){
            const tokenData = {
                _id : user._id,
                email : user.email,
                
            }
            const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY , {expiresIn : 60 * 60 })

            const tokenOption = {
                httpOnly : true,
                secure : true,
                
            }


            res.cookie("token",token,tokenOption).json({
                message : "Login Successfully",
                data : token,
                success : true,
                error : false,
            })
            
        }else{
           throw new Error("Please Check Password")
        }




    }catch(err){
        res.json({
            message : err.message || "An unexpected error occurred",
            error : true,
            success : false,
            
        })
    }

    
}

module.exports = userSignInController