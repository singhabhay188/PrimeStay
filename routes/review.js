const express = require('express');
const router = express.Router({mergeParams:true});

/* Models */
const Property = require('../models/property');
const Review = require('../models/review');



/* to recieve review for listing */
router.post('/',async (req,res)=>{
    console.log('To recieve review for listing');
    let id = req.params.id;
    let comment = req.body.comment;
    let rating = Number(req.body.rating);

    let nreview = new Review({comment,rating});

    let card = await Property.findById(id)
    if(!card) throw new Error('Property not found');

    card.reviews.push(nreview._id);

    await nreview.save();
    await card.save();
    
    res.redirect(`/listing/${id}`);
});

/* to delete review  */
router.delete('/:idReview',async (req,res)=>{
    let pid = req.params.id;
    let rid = req.params.idReview;
    await Property.findByIdAndUpdate(pid,{$pull:{reviews:rid}});
    await Review.findByIdAndDelete(rid);
    res.redirect(`/listing/${pid}`);
});

module.exports = router;