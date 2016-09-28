"use strict";

const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

// Export the Mongoose model
module.exports = function (mongoConnection) {

    // Define Product schema
    let OrderSchema = new mongoose.Schema({
        description: {
            type: String,
            required: true
        },
        products: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        }]
    });

    let mongoModel;

    try {
        mongoModel = mongoConnection.model('Order', OrderSchema);
    }
    catch (err) {
        mongoModel = mongoose.model('Order');
    }

    return mongoModel;
};
