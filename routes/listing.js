const express = require('express');
const router = express.Router();

/* Middlewares */
const isOwner = require('../middlewares/isOwner');
const isLoggedIn = require('../middlewares/isLoggedIn');
const wrapAsync = require('../utils/wrapAsync');

/* Controllers */
const listingController = require('../controllers/listing');


/* to display all listing */
router.get('/',wrapAsync(listingController.displayAllListings));

/* to display add listing form and add new listing*/
router.route('/add')
    .get(isLoggedIn,listingController.displayAddListingForm)
    .post(isLoggedIn,wrapAsync(listingController.addNewListing));

/* to display individual listing in detail and delete listing*/
router.route('/:id')
    .get(wrapAsync(listingController.displayListingDetail))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));

/* to display edit listing form and update listing*/
router.route('/edit/:id')
    .get(isLoggedIn,isOwner,listingController.displayEditListingForm)
    .post(isLoggedIn,isOwner,listingController.updateListing);

module.exports = router;