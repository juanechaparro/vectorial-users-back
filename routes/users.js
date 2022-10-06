// user routes
// /api/users

const {Router} = require("express");
const { check } = require("express-validator");
const { getUsers, createUser, deleteUser, loginUser, revalidateToken, editUser } = require("../controllers/users");
const { validateFills } = require("../middlewares/validate-fills");
const { validateJWT } = require("../middlewares/validate-jwt");

const router = Router();
//all petitions use the middleware validat jwt
// router.use(validateJWT);
//obtener Users
router.get('/', getUsers);

// create new user
router.post('/',
[
    check('name', ' Title is required').not().isEmpty(),
    check('lastName', 'lastName  is required').not().isEmpty(),
    check('company', 'company is required').not().isEmpty(),
    check('email', 'email is required').not().isEmpty(),
    check('password', 'Required password, more than 4 characters').isLength({min: 4}),
    check('userType', 'userType is required').not().isEmpty(),
    validateFills
]
,
validateJWT,
 createUser);
 router.put('/',
 [
     check('name', ' Title is required').not().isEmpty(),
     check('lastName', 'lastName  is required').not().isEmpty(),
     check('company', 'company is required').not().isEmpty(),
     check('email', 'email is required').not().isEmpty(),
     check('userType', 'userType is required').not().isEmpty(),
     validateFills
 ]
 ,
 validateJWT,
  editUser);

 router.post(
    '/login',
    [ //[] midelwares collection
        check('email', 'email required').not().isEmpty(),
        check('password', 'Required password, more than 4 characters').isLength({min: 4}),
        validateFills
    ],
     loginUser);
//delete user
router.delete('/:id',validateJWT, deleteUser);
router.get('/renew',validateJWT, revalidateToken);

module.exports= router;