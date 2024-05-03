import mongoose from "mongoose";

import crypto from "crypto";
import validator from "validator";
import jwt from "jsonwebtoken";
//ES6
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({

        name:{
            type:String,
            required:[true,"Please enter your Name"],
            maxLength:[30,"Name cannot exceed more than 30 characters"],
            minLength:[6,"Name cannot be less than 6 characters"]
        },
        email:{
            type:String,
            required:[true,"Please enter your email address"],
            unique:true,
            validate:[validator.isEmail,"Please enter a valid Email"]
        },
        password:{
            type:String,
            required:[true,"Please enter your Password"],
            minLength:[8,"Password must be more than 8 characters"],
            select:false
        },
        avatar:{
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                reuired:true
            }
        },
        role:{
            type:String,
            default:"user"
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        resetPasswordToken:String,
        resetPasswordExpire:Date,
});

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();    
    }
    this.password  = await bcrypt.hash(this.password,10);
});

//yeh bhi thoda samaj nahi aaya hai...
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_EXPIRE
    });
}

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.getResetPasswordToken = function () {

    const resetToken = crypto.randomBytes(20).toString("hex");
  
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
  
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  
    return resetToken;
  };



export const User = mongoose.model("User",userSchema);