const bcrypt = require('bcryptjs');
const {response} = require('express');

const {validationResult} = require('express-validator');
const { generateJWT } = require('../helpers/jwt');
const Admin = require('../models/Admin');

const createAdmin= async(req, res = response)=>{
    const{email, password} = req.body;
    try{
        let admin = await Admin.findOne({email});
        if (admin){
            return res.status(400).json({
                ok:false,
                msg: 'an Admin already registerd whith this emial'
            })
        }
        
        admin = new Admin(req.body);
        // crypt password
        const salt = bcrypt.genSaltSync();
        admin.password= bcrypt.hashSync(password, salt);
        await admin.save();
        //jwt
        const token = await generateJWT(admin.id, admin.name);
        
       
        res.status(201).json({
           ok: true,
           uid: admin.id,
           name: admin.name,
           token
     });
    }catch(error){
        res.status(500).json({
            ok:false,
            msg:'Please talk to the admin'
        })
    }
   
}

const loginAdmin =  async (req, res = response)=>{
    
    const{ userName, password}  = req.body;
    try{
        const admin = await Admin.findOne({userName});
        if (!admin){
            return res.status(400).json({
                ok:false,
                msg: 'admin does not exist'
            })
        }
    // Confirm passwords
    const validPassword = bcrypt.compareSync(password, admin.password);
     if ( !validPassword){
         return res.status(400).json({
             ok:false,
             msg:'invalid password'
         });
     }
     //jsw
     const token = await generateJWT(admin.id, admin.userName);
     res.json({
        ok:true,
        uid: admin.id,
        userName,
        token
        
     })
    }
    catch (error){
        console.log(error)
        res.status(500).json({
            ok:false,
            msg:'Please talk to the admin'
        })
    }

    
}
const revalidateToken =  async(req, res = response)=>{
     const {uid, userName }= req;
     const token = await generateJWT(uid, userName);
    res.json({
       ok: true,
       uid, 
       userName :userName,
       token
      
 })
}
 module.exports = {
    createAdmin,
    loginAdmin,
    revalidateToken

 }