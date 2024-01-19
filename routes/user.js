require('dotenv').config();
// const {accesscontroller} = require('../middleware/accessController');
const {Deleteaccount,forgotPass,signin,signup} = require('../controllers/postControls');
const TokenVerification = require('../middleware/auth');
const {signoutfromalldevice,signout} = require('../controllers/getControls');

const router = require('express').Router();

router.post('/signin',signin)
router.post('/signup',signup);
router.put('/forgotPass',forgotPass)
router.delete('/signoutfromalldevice',TokenVerification,signoutfromalldevice)
router.get('/signout', TokenVerification,signout)
router.delete('/accountDelete', TokenVerification,Deleteaccount)

module.exports = router