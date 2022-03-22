
const  {Schema, model} = require('mongoose');

const AdminSchema = Schema({
    userName:{
        type: String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

module.exports= model('Admin',AdminSchema );