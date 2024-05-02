const mongoose = require('mongoose');
const Property = require('../models/property');
const sampleData = require('./data');


async function connect(){
    await mongoose.connect('mongodb://localhost:27017/primestay');
}

connect();

async function fillData(){
    await Property.deleteMany({});
    let newSampleData = sampleData.map((property)=>{
        property.owner = '66312316ce6484c4412f4150';
    });
    await Property.insertMany(sampleData);
    console.log('Data inserted');
}

fillData();