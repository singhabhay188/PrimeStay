const express = require('express');
const router = express.Router();

const wrapAsync = require('../utils/wrapAsync');

/* Models */
const Property = require('../models/property');

/* to display all listing */
router.get('/',wrapAsync(async (req,res)=>{
    console.log('To display all listing');
    let properties = await Property.find({});
    res.render('showListings', {properties});
}));

/* to display add listing form */
router.get('/add',(req,res)=>{
    console.log('To display add listing form');
    res.render('newlisting');
});

/* to display individual listing in detail*/
router.get('/:id',wrapAsync(async (req,res)=>{
    console.log('To display individual listing in detail');
    let id = req.params.id;
    let fullCard = card = await Property.findById(id).populate('reviews');
    if(!fullCard) throw new Error('Property not found');
    res.render('listing', {card:fullCard});
}));

/* to display edit listing form */
router.get('/edit/:id',wrapAsync(async (req,res)=>{
    console.log('To display edit listing form');
    let id = req.params.id;
    let property = await Property.findOne({_id:id})
    if(!property) throw new Error('Property not found');
    res.render('editlisting', {property});
}));

/* to update listing */
router.post('/edit/:id',wrapAsync (async (req,res)=>{
    console.log('To update listing');
    let id = req.params.id;
    await Property.findByIdAndUpdate(id, req.body)
    res.redirect('/listing');
}));

/* to add new listing */
router.post('/add',wrapAsync (async (req,res,next)=>{
    console.log('To add new listing');
    let {title,description,price,location,image,country} = req.body;
    let property = new Property({title,description,price,location,image:[image],country});
    await property.save();
    res.redirect('/listing');
}));

/* to delete listing */
router.delete('/:id',wrapAsync (async (req,res)=>{
    console.log('To delete listing');
    let id = req.params.id;
    await Property.findOneAndDelete({_id:id});
    res.redirect('/listing');
}));

module.exports = router;