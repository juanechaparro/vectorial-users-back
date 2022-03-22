const {response} = require('express');
const User = require('../models/User');
const getUsers = async(req, res = response)=>{
    //fill de user info with populate
    const users = await User.find();
    res.json({
        ok :true,
        users
    })
}

const createUser = async(req, res = response)=>{
     const user = new User(req.body);
     try{
       const savedUser=  await user.save()
        res.json({
            ok:true,
            user: savedUser
        })
     }catch(error){
       console.log(error)
       res.status(500).json({
           ok:false,
           msg: 'Talk to the admin'
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

module.exports= {
    getUsers,
    createUser,
    deleteUser
}