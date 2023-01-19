const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces.js');

const auth = require('../middleware/auth.js');
const multer = require('../middleware/multer-config');

router.post('/', auth, multer, saucesCtrl.createSauce);
router.get('/', auth, saucesCtrl.getAllSauce);
router.get('/:id', auth, saucesCtrl.getOneSauce);
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
router.delete('/:id', auth, saucesCtrl.deleteSauce);
router.post('/:id/like', saucesCtrl.likeSauce);


module.exports = router;
