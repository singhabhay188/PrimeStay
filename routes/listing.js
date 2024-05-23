const express = require('express');
const router = express.Router();
const multer  = require('multer');
const storage = require('../cloudConfig');
const upload = multer(storage);

/* Middlewares */
const isOwner = require('../middlewares/isOwner');
const isLoggedIn = require('../middlewares/isLoggedIn');
const wrapAsync = require('../utils/wrapAsync');

/* Controllers */
const listingController = require('../controllers/listing');


/* to display all listing */
router.get('/',wrapAsync(listingController.displayAllListings));

/* to search for listing */
router.get('/search/:value',wrapAsync(listingController.searchListings));

/* to display all listing based on category */
router.get('/category/:category',wrapAsync(listingController.displayCategoryListings));

/* to display add listing form and add new listing*/
router.route('/add')
    .get(isLoggedIn,listingController.displayAddListingForm)
    .post(isLoggedIn,upload.single('image'),wrapAsync(listingController.addNewListing));

/* to display individual listing in detail and delete listing*/
router.route('/:id')
    .get(wrapAsync(listingController.displayListingDetail))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));

/* to display edit listing form and update listing*/
router.route('/edit/:id')
    .get(isLoggedIn,isOwner,listingController.displayEditListingForm)
    //.post(isLoggedIn,isOwner,upload.single('image'),wrapAsync(listingController.updateListing));
    .post(isLoggedIn,upload.single('image'),wrapAsync(listingController.updateListing));

module.exports = router;