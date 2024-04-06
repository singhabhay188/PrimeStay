const exp = require('constants');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const Property = require('./models/property');
const methodOverride = require('method-override')

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
    await mongoose.connect('mongodb://localhost:27017/primestay');
}



/* to display home page */
app.get('/', (req, res) => {
    res.render('index');
});

/* to display all listing */
app.get('/listings',(req,res)=>{
    Property.find({})
    .then((properties)=>{
        res.render('showListings', {properties});
    })
    .catch(err => {
        res.render('error');
    });
});

/* to display individual listing in detail*/
app.get('/listings/:id',(req,res)=>{
    console.log('To display individual listing in detail');
    let id = req.params.id;

    Property.findById(id)
    .then(card=>{
        res.render('listing', {card});
    })
    .catch(err => {
        res.render('error');
    }); 
});

/* to display edit listing form */
app.get('/listing/edit/:id',(req,res)=>{
    console.log('To display edit listing form');
    let id = req.params.id;
    Property.findOne({_id:id})
    .then((properties)=>{
        res.render('editlisting', {properties});
    })
    .catch(err => {
        res.render('error');
    });
});

/* to update listing */
app.post('/listing/edit/:id',(req,res)=>{
    console.log('To update listing');
    let id = req.params.id;
    Property.findByIdAndUpdate(id, req.body)
    .then(()=>{
        res.redirect('/listings');
    })
    .catch(err => {
        res.render('error');
    });
});

/* to display add listing form */
app.get('/listing/add',(req,res)=>{
    console.log('To display add listing form');
    res.render('newlisting');
});

/* to add new listing */
app.post('/listing/add',(req,res)=>{
    console.log('To add new listing');
    let {title,description,price,location,image,country} = req.body;
    let property = new Property({title,description,price,location,image:[image],country});
    property.save()
    .then(()=>{
        res.redirect('/listings');
    })
    .catch(err => {
        res.render('error');
    });
});

app.get('/listing/delete/:id',(req,res)=>{
    let id = req.params.id;
    Property.findByIdAndDelete(id)
    .then(()=>{
        res.redirect('/listings');
    })
    .catch(err => {
        res.render('error');
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});