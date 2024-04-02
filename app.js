const exp = require('constants');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const Property = require('./models/property');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

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
        res.render('listings', {properties});
    })
    .catch(err => {
        res.render('error');
    });
});

/* to display individual listing in detail*/
app.get('/listings/:id',(req,res)=>{
    let id = req.params.id;

    Property.findById(id)
    .then(card=>{
        res.render('listing', {card});
    })
    .catch(err => {
        res.render('error');
    }); 
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});