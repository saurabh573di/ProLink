/*
  models/user.model.js - User Database Schema
  =================================================================================
  FIELDS:
  - firstName, lastName: User's name (required)
  - userName: Unique username for public profiles
  - email: Unique email for login and notifications
  - password: Hashed password (bcrypt in auth controller)
  - profileImage, coverImage: URLs from Cloudinary
  - headline: Job title or bio (e.g., "Senior Developer")
  - skills: Array of skill tags
  - education: Array of school/degree/field info
  - location: City/region (default: "India")
  - gender: "male" | "female" | "other"
  - experience: Array of job history (title, company, description)
  - connection: Array of user IDs (who this user is connected to)
  - timestamps: createdAt, updatedAt auto fields
  
  INDEXES:
  - userName, email: Single-field indexes for fast lookups
  - Full-text search: firstName, lastName, userName, skills for search feature
  
  IMPORTANT:
  - All user data should be validated in the controller before saving
  - Passwords should NEVER be returned to frontend; exclude in queries: .select("-password")
  - Connection array stores ObjectIds; use .populate("connection") to get full user objects
=================================================================================
*/
import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    userName:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        match:/^[a-zA-Z0-9._-]+$/ // Only alphanumeric, dots, dashes, underscores (no spaces)
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    profileImage:{
        type:String,
        default:""
    },
    coverImage:{
        type:String,
        default:""
    },
    headline:{
        type:String,
        default:""
    },
    skills:[ {type:String}],
    education:[
        {
           college:{type:String},
           degree:{type:String},
           fieldOfStudy:{type:String}

        }
    ],
    location:{
        type:String,
        default:"India"
    },
    gender:{
        type:String,
        enum:["male","female","other"]
    },
    experience:[
        {
            title:{type:String},
            company:{type:String},
            description:{type:String}
        }
    ],
    connection:[
       { type:mongoose.Schema.Types.ObjectId,
        ref:"User"
       }
    ],
    resetOtp:{
        type:String,
        default:undefined
    },
    otpExpires:{
        type:Date,
        default:undefined
    },
    isOtpVerified:{
        type:Boolean,
        default:false
    }

},{timestamps:true})

// Add full-text search index
// Note: userName and email already have indexes from unique: true in schema
userSchema.index({ firstName: "text", lastName: "text", userName: "text", skills: "text" })

const User=mongoose.model("User",userSchema)
export default User