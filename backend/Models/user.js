const mongoose=require('mongoose');
const Schema=mongoose.Schema;



const UserSchema=new Schema({
    email:String,
    password:String
},
{ collection: 'register' })

const User=mongoose.model('User',UserSchema);


module.exports=User;