const express = require('express');
const router = express.Router();

/* Middlewares */
const isOwner = require('../middlewares/isOwner');
const isLoggedIn = require('../middlewares/isLoggedIn');
const wrapAsync = require('../utils/wrapAsync');

/* Models */
const Property = require('../models/property');

/* to display all listing */
router.get('/',wrapAsync(async (req,res)=>{
    console.log('To display all listing');
    let properties = await Property.find({});
    res.render('showListings', {properties,message:req.flash('message')});
}));

/* to display add listing form */
router.get('/add',isLoggedIn,(req,res)=>{
    console.log('To display add listing form');
    res.render('newlisting');
});

/* to display individual listing in detail*/
router.get('/:id',wrapAsync(async (req,res)=>{
    console.log('To display individual listing in detail');
    let id = req.params.id;
    let fullCard = card = await Property.findById(id).populate('reviews').populate('owner');
    console.log('Full Card:',fullCard);
    if(!fullCard) throw new Error('Property not found');
    res.render('listing', {card:fullCard,message:req.flash('message')});
}));

/* to display edit listing form */
router.get('/edit/:id',isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
    console.log('To display edit listing form');
    let id = req.params.id;
    let property = await Property.findOne({_id:id})
    if(!property) throw new Error('Property not found');
    res.render('editlisting', {property});
}));

/* to update listing */
router.post('/edit/:id',isLoggedIn,isOwner,wrapAsync (async (req,res)=>{
    console.log('To update listing');
    let id = req.params.id;
    //we have to set up authentication first find by id and then check if current user is owner of the listing then update
    let cproperty = await Property.findById(id);
    if(cproperty.owner.toString() !== req?.user._id.toString()){
        req.flash('message', 'You are not authorized to update this listing');
        return res.redirect('/listing');
    }
    await Property.updateOne({_id:id},req.body);
    req.flash('message', 'Property Successfully Updated');
    res.redirect('/listing');
}));

/* to add new listing */
router.post('/add',isLoggedIn,wrapAsync (async (req,res,next)=>{
    console.log('To add new listing');
    let {title,description,price,location,image,country} = req.body;
    let property = new Property({title,description,price,location,image:[image],country});
    property.owner = req.user._id;
    await property.save();
    req.flash('message', 'Listing Successfully Created');
    res.redirect('/listing');
}));

/* to delete listing */
router.delete('/:id',isLoggedIn,isOwner,wrapAsync (async (req,res)=>{
    console.log('To delete listing');
    let id = req.params.id;
    await Property.findOneAndDelete({_id:id});
    req.flash('message', 'Listing Successfully Deleted');
    res.redirect('/listing');
}));

module.exports = router;