// user routes
// /api/users

const {Router} = require("express");
const { check } = require("express-validator");
const { getUsers, createUser, deleteUser } = require("../controllers/users");
const { validateFills } = require("../middlewares/validate-fills");
const { validateJWT } = require("../middlewares/validate-jwt");

const router = Router();
//all petitions use the middleware validat jwt
router.use(validateJWT);
//obtener Users
router.get('/', getUsers);

// create new user
router.post('/',
[
    check('name', ' Title is required').not().isEmpty(),
    check('lastName', 'lastName  is required').not().isEmpty(),
    check('company', 'company is required').not().isEmpty(),
    check('email', 'email is required').not().isEmpty(),
    validateFills
],
 createUser);


//delete user
router.delete('/:id', deleteUser);

module.exports= router;