const exp = require('constants');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const Property = require('./models/property');

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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));


//Main Code
app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});