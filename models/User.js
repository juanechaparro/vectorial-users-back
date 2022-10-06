const { Schema, model } = require("mongoose");

const UserSchema = Schema({
  name: {
      type:String,
      required :true
  },
  lastName:{
    type:String,
    required :true
  },
  company:{
    type:String,
    required :true
  },
  email:{
    type:String,
      required :true
 },
 password:{
  type:String,
  required:true
},
userType:{
  type:String,
  required:true
}
});
UserSchema.method('toJSON', function(){
   const {__v, _id, ...object} =this.toObject();
   object.id = _id;
   return object;
})

 module.exports = model('User', UserSchema);