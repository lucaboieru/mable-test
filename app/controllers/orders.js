"use strict";

exports.index = (req, res) => {
    req.db.order.find({}).populate('products').exec((err, orders) => {
        if (err) {
            return res.status(500).send(err);
        }

        res.status(200).send(orders);
    });
};

exports.create = (req, res) => {

    let fields = req.body;
    let newOrder = new req.db.order(fields);

    newOrder.save((err, order) => {
        if (err) {
            return res.status(422).send(err);
        }

        res.status(200).send(order);
    });
};
