import e from 'express';
import mongoose from 'mongoose';
import { connect } from 'mongoose';

const userSchema= new mongoose.Schema({
firstName:{
  type:String,
  required:true
},
lastName:{
  type:String,
  required:true
},
email:{
  type:String,
  required:true,
  unique:true
},
password:{
  type:String,
  required:true
},

userName:{
  type:String,
  required:true,
  unique:true,
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
education:[{
  college:{
    type:String,
  },
  degree:{
    type:String, 
  },
  fieldOfStudy:{
    type:String,
  },
}],
skills:[{
  type:String,
  required:true
}],
location:{
  type:String,
  default:"India"
},
gender:{
  type:String,
  enum:["male","female","other"],
},
experience:[{
  company:{
    type:String,
   
  },
  title:{
    type:String,
    
  },
  description:{
    type:String,
   
  }}],

  connection:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }],

},{timestamps:true});
const User = mongoose.model('User', userSchema);
export default User;