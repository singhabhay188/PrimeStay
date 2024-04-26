const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session')

app.use(session({secret:'verysecretkeythisis',resave:false,saveUninitialized:true}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

const listingRoute = require('./routes/listing');
const reviewRoute = require('./routes/review');


async function connect(){
    try{
        await mongoose.connect('mongodb://localhost:27017/primestay');
        console.log('Connected to database');
    }
    catch(err){
        console.log('Error connecting to database', err);
    }
}

connect();

/* to display home page */
app.get('/', (req, res) => {
    res.render('index');
});

/* to display about */
app.get('/aboutus', (req, res) => {
    res.render('about');
});

/* to display contact */
app.get('/contactus', (req, res) => {
    res.render('contactus');
});

/* listing routes */
app.use('/listing',listingRoute);

/* review routes */
app.use('/listing/:id/review',reviewRoute);



/* unncessary routes */
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