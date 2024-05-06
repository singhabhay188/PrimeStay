const mongoose = require('mongoose');
const Review = require('./review');
const User = require('./user');

let propertySchema = new mongoose.Schema({
    title: String,
    description: String,
    image: {
        filename: {
            type:String,
        },
        path: {
            type:String,
        }
    },
    price: Number,
    location: String,
    country: String,
    reviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

propertySchema.post('findOneAndDelete',async (property)=>{
    console.log('Deleting reviews of property',property._id);
    if(property.reviews.length){
        for(let review of property.reviews){
            await Review.deleteOne({_id:review._id});
        }
    }
})

let Property = mongoose.model('Property', propertySchema);

module.exports = Property;