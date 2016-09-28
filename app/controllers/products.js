"use strict";

function isProductValid (product) {

    if (typeof product === 'undefined') {
        return false;
    }

    if (typeof product.title !== 'undefined' && typeof product.title !== 'string') {
        return false;
    }

    if (typeof product.number !== 'undefined' && typeof product.price !== 'number') {
        return false;
    }

    if (typeof product.description !== 'undefined' && typeof product.description !== 'string') {
        return false;
    }

    return true;
}

exports.index = (req, res) => {

    var sort = {};
    if (req.query.sort) {
        sort = {
            price: req.query.sort === 'price_asc' ? 1 : -1
        };
    }

    req.db.product.find().sort(sort).exec((err, products) => {
        if (err) {
            return res.status(500).send(err);
        }

        res.status(200).send(products);
    });
};

exports.create = (req, res) => {

    let image = null;
    if (req.files && req.files.image) {
        image = 'http://' + req.headers.host + '/uploads/' + req.files.image.name;
    }

    let fields = req.body;
    fields.image = image;
    let newProduct = new req.db.product(fields);

    newProduct.save((err, product) => {
        if (err) {
            return res.status(422).send(err);
        }

        res.status(200).send(product);
    });
};

exports.show = (req, res) => {
    req.db.product.findById(req.params.pid, (err, product) => {
        if (err) {
            return res.status(500).send(err);
        }

        if (!product) {
            return res.status(404).send({'message': 'Not found.'});
        }

        res.status(200).send(product);
    });
};

exports.update = (req, res) => {

    let fields = req.body;
    let image = null;
    if (!isProductValid(fields)) {
        return res.status(422).send({'message': 'Schema validation failed.'});
    }
    if (req.files && req.files.image) {
        image = 'http://' + req.headers.host + '/uploads/' + req.files.image.name;
    }

    if (image) {
        fields.image = image
    }

    let crudObj = {
        q: {
            _id: req.params.pid
        },
        u: fields,
        o: {
            new: true
        }
    };

    req.db.product.findOneAndUpdate(crudObj.q, crudObj.u, crudObj.o, (err, product) => {
        if (err) {
            return res.status(500).send(err);
        }

        if (!product) {
            return res.status(404).send({'message': 'Not found.'});
        }

        res.status(200).send(product);
    });
};

exports.remove = (req, res) => {
    req.db.product.findOneAndRemove({_id: req.params.pid}, (err, product) => {
        if (err) {
            return res.status(500).send(err);
        }

        if (!product) {
            return res.status(404).send({'message': 'Not found.'});
        }

        res.status(200).send();
    });
};
