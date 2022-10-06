const {response} = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt');
const getUsers = async(req, res = response)=>{
    //fill de user info with populate
    const users = await User.find();
    res.json({
        ok :true,
        users
    })
}

const createUser = async(req, res = response)=>{
     const{email, password} = req.body;
     try{
        let userF = await User.findOne({email});
        if (userF){
            return res.status(400).json({
                ok:false,
                msg: 'an user already registerd whith this email'
            })
        }
       const user = new User(req.body);
       const salt = bcrypt.genSaltSync();
        user.password= bcrypt.hashSync(password, salt);
       const savedUser=  await user.save()
       //token
       const token = await generateJWT(savedUser.id, savedUser.name,savedUser.email, savedUser.userType);
       res.status(201).json({
        ok: true,
        uid: user.id,
        name: user.name,
        token,
        userType : user.userType
     })
    }catch(error){
       console.log(error)
       res.status(500).json({
           ok:false,
           msg: 'Talk to the user'
       })  
     }
    
}
const editUser = async(req, res = response)=>{
    const{email , uid} = req.body;
 
    try{
       let userF = await User.findOne({uid});
       if (!userF){
           return res.status(500).json({
               ok:false,
               msg: 'user does not exist'
           })
       }
      
       const newUser ={
        ...req.body,
        id:uid
    }
    const userUpdated = await User.findByIdAndUpdate(uid,newUser,{new:true} );
     
      res.status(201).json({
       ok: true,
       user: userUpdated
    })
   }catch(error){
      console.log(error)
      res.status(500).json({
          ok:false,
          msg: 'Talk to the user'
      })  
    }
   
}



const deleteUser = async(req, res = response)=>{
    const userId= req.params.id;
    
    try{
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                ok:false,
                msg:'The user does not exist'
            })
        }
       
       
        await User.findByIdAndDelete(userId);
        res.json({
           ok:true,
           user: "deleted"
        })
    }catch(error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: "Talk to the admin"
        });
    }
}

const loginUser =  async (req, res = response)=>{
    
    const{ email, password}  = req.body;
    try{
        const user = await User.findOne({email});
        if (!user){
            return res.status(400).json({
                ok:false,
                msg: 'user does not exist'
            })
        }
    // Confirm passwords
    const validPassword = bcrypt.compareSync(password, user.password);
     if ( !validPassword){
         return res.status(400).json({
             ok:false,
             msg:'invalid password'
         });
     }
     //jsw
     const token = await generateJWT(user.id, user.name,user.email, user.userType);
     res.json({
        ok:true,
        uid: user.id,
        email,
        token,
        userType : user.userType
        
     })
    }
    catch (error){
        console.log(error)
        res.status(500).json({
            ok:false,
            msg:'Please talk to the user'
        })
    }
    
}
const revalidateToken =  async(req, res = response)=>{
    const {uid,name, email, userType }= req;
    const token = await  generateJWT(uid, name,email, userType);
   res.json({
      ok: true,
      uid, 
      email,
      userType,
      token
     
})
}

module.exports= {
    getUsers,
    createUser,
    deleteUser,
    loginUser,
    revalidateToken,
    editUser
}