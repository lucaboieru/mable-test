function isProductValid(product) {
    return true;
}

exports.index = (req, res) => {
    req.db.product.find({}, (err, products) => {
        if (err) {
            return res.status(500).send(err);
        }

        res.status(200).send(products);
    });
};

exports.create = (req, res) => {
    if (!isProductValid(req.body)) {
        return res.status(422).send('Provided data not valid');
    }

    var newProduct = new req.db.product(req.body);

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

        res.status(200).send(product);
    });
};

exports.update = (req, res) => {

    if (!isProductValid(req.body)) {
        return res.status(422).send();
    }

    var crudObj = {
        q: {
            _id: req.params.pid
        },
        u: req.body,
        o: {
            new: true
        }
    };

    req.db.product.findOneAndUpdate(crudObj.q, crudObj.u, crudObj.o, (err, product) => {
        if (err) {
            return res.status(500).send(err);
        }

        res.status(200).send(product);
    });
};

exports.remove = (req, res) => {
    req.db.product.findOneAndRemove({_id: req.params.pid}, (err) => {
        if (err) {
            return res.status(500).send(err);
        }

        res.status(200).send();
    });
};
