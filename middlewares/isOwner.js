const Property = require('../models/property');

async function isOwner  (req, res, next) {
  let id = req.params.id;
  let property = await Property.findOne({_id:id})
  if(!property){
    req.flash('message', 'No Such Property not found');
    return res.redirect('/listing');
  }
  if(property.owner._id.toString() !== req?.user._id.toString()){
    req.flash('message', 'You are not authorized to make changes in listing');
    return res.redirect('/listing');
  }

  next();
}

module.exports = isOwner;