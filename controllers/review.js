/* Models */
const Property = require('../models/property');
const Review = require('../models/review');



module.exports.createReview = async (req,res)=>{
    console.log('To recieve review for listing');
    let id = req.params.id;
    let nreview = new Review({
        comment:req.body.comment,
        rating:req.body.rating,
        creator:req.user._id
    });
    let card = await Property.findById(id)
    if(!card) throw new Error('Property not found');
    card.reviews.push(nreview._id);
    await nreview.save();
    await card.save();
    req.flash('message', 'Review Successfully Added');
    res.redirect(`/listing/${id}`);
};

module.exports.deleteReview = async (req,res)=>{
    console.log('To delete review');
    let pid = req.params.id;
    let rid = req.params.idReview;
    let review = await Review.findById(rid);
    if(review.creator.toString() !== req?.user._id.toString()){
        req.flash('message', 'You are not authorized to delete this review');
        return res.redirect(`/listing/${pid}`);
    }
    await Property.findByIdAndUpdate(pid,{$pull:{reviews:rid}});
    await Review.findByIdAndDelete(rid);
    req.flash('message', 'Review Successfully Deleted');
    res.redirect(`/listing/${pid}`);
};