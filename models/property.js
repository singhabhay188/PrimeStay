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

let Property = mongoose.model('Property', propertySchema);

module.exports = Property;