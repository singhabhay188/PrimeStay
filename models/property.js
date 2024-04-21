const mongoose = require('mongoose');
const Review = require('./review');

let propertySchema = new mongoose.Schema({
    title: String,
    description: String,
    image: {
        type:Array,
        default: [ 'https://via.placeholder.com/350' ],
        set(value){
            if(!value || value==''){
                return 'https://via.placeholder.com/350';
            }
            return value;
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
    ]
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