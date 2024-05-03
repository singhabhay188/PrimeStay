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

/* to display add listing form */
router.get('/add',isLoggedIn,listingController.displayAddListingForm);

/* to display individual listing in detail*/
router.get('/:id',wrapAsync(listingController.displayListingDetail));

/* to display edit listing form */
router.get('/edit/:id',isLoggedIn,isOwner,wrapAsync(listingController.displayEditListingForm));

/* to update listing */
router.post('/edit/:id',isLoggedIn,isOwner,wrapAsync (listingController.updateListing));

/* to add new listing */
router.post('/add',isLoggedIn,wrapAsync (listingController.addNewListing));

/* to delete listing */
router.delete('/:id',isLoggedIn,isOwner,wrapAsync (listingController.deleteListing));

module.exports = router;