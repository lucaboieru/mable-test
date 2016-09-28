var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

// Export the Mongoose model
module.exports = function (mongoConnection) {

    // Define Product schema
    var ProductSchema = new mongoose.Schema({
        title: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        }
    });

    var mongoModel;

    try {
        mongoModel = mongoConnection.model('Product', ProductSchema);
    }
    catch (err) {
        mongoModel = mongoose.model('Product');
    }

    return mongoModel;
};
