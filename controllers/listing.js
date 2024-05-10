/* Models */
const Property = require('../models/property');

module.exports.displayAllListings = async (req,res)=>{
    console.log('To display all listing');
    let properties = await Property.find({});
    res.render('showListings', {properties,message:req.flash('message')});
};

module.exports.displayCategoryListings = async (req,res)=>{
    console.log('To display all listing based on category');
    let category = req.params.category;
    let properties = '';
    if(category=='all') properties = await Property.find({});
    else    properties = await Property.find({category});
    res.json(properties);
};

module.exports.displayAddListingForm = async (req,res)=>{
    console.log('To display add listing form');
    res.render('newlisting');
};

module.exports.displayListingDetail = async (req,res)=>{
    console.log('To display individual listing in detail');
    let id = req.params.id;
    let fullCard = card = await Property.findById(id).populate({path:'reviews',populate:'creator'}).populate({path:'owner'});
    console.log('Full Card:',fullCard.reviews);
    if(!fullCard) throw new Error('Property not found');
    res.render('listing', {card:fullCard,message:req.flash('message')});
};

module.exports.displayEditListingForm = async (req,res)=>{
    console.log('To display edit listing form');
    let id = req.params.id;
    let property = await Property.findOne({_id:id})
    if(!property) throw new Error('Property not found');
    res.render('editlisting', {property});
};

module.exports.updateListing = async (req,res)=>{
    console.log('To update listing');
    let id = req.params.id;
    //we have to set up authentication first find by id and then check if current user is owner of the listing then update
    let cproperty = await Property.findById(id);
    if(cproperty.owner.toString() !== req?.user._id.toString()){
        req.flash('message', 'You are not authorized to update this listing');
        return res.redirect('/listing');
    }
    let path = req.file ? req.file.path : cproperty.image.path;
    let filename = req.file ? req.file.filename : cproperty.image.filename;
    req.body.image = {path,filename};
    await Property.updateOne({_id:id},req.body);
    req.flash('message', 'Property Successfully Updated');
    res.redirect('/listing');
};

module.exports.addNewListing = async (req,res)=>{
    console.log('To add new listing');
    let path = req.file ? req.file.path : 'https://via.placeholder.com/500';
    let filename = req.file ? req.file.filename : 'DefaultFileName';
    let property = new Property({...req.body,image:{path,filename}});
    property.owner = req.user._id;
    await property.save();
    req.flash('message', 'Listing Successfully Created');
    res.redirect('/listing');
};

module.exports.deleteListing = async (req,res)=>{
    console.log('To delete listing');
    let id = req.params.id;
    await Property.findOneAndDelete({_id:id});
    req.flash('message', 'Listing Successfully Deleted');
    res.redirect('/listing');
};