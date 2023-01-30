const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const userController = require('../controllers/userController');




router.get('/register', userController.register);
router.post('/register', userController.createAccount);
router.get('/login', userController.login);
router.post('/auth', userController.auth);
router.get('/logout', userController.logout);

router.get('/', contactController.view);
router.get('/adduser', contactController.form);
router.post('/adduser', contactController.create);
router.get('/edituser/:id', contactController.edit);
router.post('/edituser/:id', contactController.update);
router.get('/viewuser/:id', contactController.viewall);
router.get('/:id',contactController.delete);


module.exports = router;