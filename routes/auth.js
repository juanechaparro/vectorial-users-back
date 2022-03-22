// rutas de usuarios / AUth
// host +/api/auth

const express = require('express');
const router = express.Router();
const{check}= require('express-validator');
const{createAdmin, loginAdmin, revalidateToken} = require('../controllers/auth');
const { validateFills } = require('../middlewares/validate-fills');
const { validateJWT } = require('../middlewares/validate-jwt');

router.post(
    '/new',
    [ //[] midelwares collection
        check('userName', 'userName required').not().isEmpty(),
        check('password', 'Required password, more than 4 characters').isLength({min: 4}),
        validateFills
    ],
     createAdmin);
router.post(
    '/',
    [ //[] midelwares collection
        check('userName', 'userName required').not().isEmpty(),
        check('password', 'Required password, more than 4 characters').isLength({min: 4}),
        validateFills
    ],
     loginAdmin);

router.get('/renew',validateJWT, revalidateToken);

 module.exports = router;