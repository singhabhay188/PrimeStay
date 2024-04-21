const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const methodOverride = require('method-override');
const wrapAsync = require('./utils/wrapAsync');

/* Models */
const Property = require('./models/property');
const Review = require('./models/review');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(methodOverride('_method'))
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

connect()
.then(() => {
    console.log('Connected to database');
})
.catch((err) => {
    console.log('Error connecting to database', err);
});

async function connect(){
    try{
        await mongoose.connect('mongodb://localhost:27017/primestay');
    }
    catch(err){
        console.log('Error connecting to database', err);
    }
}

/* to display home page */
app.get('/', (req, res) => {
    res.render('index');
});

/* to display all listing */
app.get('/listings',wrapAsync(async (req,res)=>{
    let properties = await Property.find({});
    res.render('showListings', {properties});
}));

/* to display about */
app.get('/aboutus', (req, res) => {
    res.render('about');
});

/* to display contact */
app.get('/contactus', (req, res) => {
    res.render('contactus');
});

/* to display individual listing in detail*/
app.get('/listings/:id',wrapAsync(async (req,res)=>{
    console.log('To display individual listing in detail');
    let id = req.params.id;
    let fullCard = card = await Property.findById(id).populate('reviews');
    if(!fullCard) throw new Error('Property not found');
    console.log(fullCard);
    res.render('listing', {card:fullCard});
}));

/* to recieve review for listing */
app.post('/listings/:id/review',async (req,res)=>{
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
    
    res.redirect(`/listings/${id}`);
});

/* to delete review  */
app.delete('/listings/:id/review/:idReview',async (req,res)=>{
    let pid = req.params.id;
    let rid = req.params.idReview;
    await Property.findByIdAndUpdate(pid,{$pull:{reviews:rid}});
    await Review.findByIdAndDelete(rid);
    res.redirect(`/listings/${pid}`);
});

/* to display edit listing form */
app.get('/listing/edit/:id',wrapAsync(async (req,res)=>{
    console.log('To display edit listing form');
    let id = req.params.id;
    let property = await Property.findOne({_id:id})
    if(!property) throw new Error('Property not found');
    res.render('editlisting', {property});
}));

/* to update listing */
app.post('/listing/edit/:id',wrapAsync (async (req,res)=>{
    console.log('To update listing');
    let id = req.params.id;
    await Property.findByIdAndUpdate(id, req.body)
    res.redirect('/listings');
}));

/* to display add listing form */
app.get('/listing/add',(req,res)=>{
    console.log('To display add listing form');
    res.render('newlisting');
});

/* to add new listing */
app.post('/listing/add',wrapAsync (async (req,res,next)=>{
    console.log('To add new listing');
    let {title,description,price,location,image,country} = req.body;
    let property = new Property({title,description,price,location,image:[image],country});
    await property.save();
    res.redirect('/listings');
}));

/* to delete listing */
app.delete('/listing/:id',wrapAsync (async (req,res)=>{
    console.log('To delete listing');
    let id = req.params.id;
    await Property.findOneAndDelete({_id:id});
    res.redirect('/listings');
}));

app.get( '*', (req, res) => {
    throw new Error('Page not found');
});

/* to handle error */
app.use((err,req,res,next)=>{
    const message = err.message || 'Something went wrong';
    const status = err.status || 500;
    res.status(status).render('error',{message,status});
})


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});