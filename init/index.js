const mongoose = require('mongoose');
const Property = require('../models/property');
const sampleData = require('./data');


async function connect(){
    await mongoose.connect('mongodb://localhost:27017/primestay');
}

connect();

async function fillData(){
    await Property.deleteMany({});
    let newSampleData = [...sampleData];
    newSampleData.forEach(async (data)=>{
        data.owner = '66312316ce6484c4412f4150'
        await Property.insertMany(data);
    });
    console.log('Data inserted');
}

fillData();