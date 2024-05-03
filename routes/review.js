const express = require('express');
const router = express.Router({mergeParams:true});

const isLoggedIn = require('../middlewares/isLoggedIn');

/* controllers */
const reviewController = require('../controllers/review');

/* to recieve review for listing */
router.post('/',isLoggedIn,reviewController.createReview);

/* to delete review  */
router.delete('/:idReview',isLoggedIn,reviewController.deleteReview);

module.exports = router;