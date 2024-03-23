const Supplier = require("../models/supplier.model.js");


const {body, validationResult} = require("express-validator");


exports.create = [

    // Validate and sanitize the name field.
    body('name', 'The part name is required').trim().isLength({min: 1}).escape(),
    body('description', 'The part description is required').trim().isLength({min: 1}).escape(),
    body('price', 'The part price is required').trim().isLength({min: 1}).escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a genre object with escaped and trimmed data.
        const supplier = new Supplier(req.body);

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('supplier-add', {title: 'Create Genre', supplier: supplier, errors: errors.array()});
        } else {
            // Data from form is valid., save to db
            Supplier.create(supplier, (err, data) => {
                if (err)
                    res.render("500", {message: `Error occurred while creating the Part.`});
                else res.redirect("/orders");
            });
        }
    }
];

exports.findAll = (req, res) => {
    Supplier.getAll((err, data) => {
        if (err)
            res.render("500", {message: "The was a problem retrieving the list of parts"});
        else res.render("supplier-list-all", {orders: data});
    });
};

exports.findOne = (req, res) => {
    Supplier.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Part with id ${req.params.id}.`
                });
            } else {
                res.render("500", {message: `Error retrieving part with id ${req.params.id}`});
            }
        } else res.render("supplier-update", {supplier: data});
    });
};


exports.update = [

    // Validate and sanitize the name field.
    body('name', 'The part name is required').trim().isLength({min: 1}).escape(),
    body('description', 'The part description is required').trim().isLength({min: 1}).escape(),
    body('price', 'The part price is required').trim().isLength({min: 1}).escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a genre object with escaped and trimmed data.
        const supplier = new Supplier(req.body);
        supplier.i

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('supplier-update', {supplier: supplier, errors: errors.array()});
        } else {
            // Data from form is valid., save to db
            Supplier.updateById(
                req.body.id,
                supplier,
                (err, data) => {
                    if (err) {
                        if (err.kind === "not_found") {
                            res.status(404).send({
                                message: `Part with id ${req.body.id} Not found.`
                            });
                        } else {
                            res.render("500", {message: `Error updating Part with id ${req.body.id}`});
                        }
                    } else res.redirect("/orders");
                }
            );
        }
    }
];

exports.remove = (req, res) => {
    Supplier.delete(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Part with id ${req.params.id}.`
                });
            } else {
                res.render("500", {message: `Could not delete Part with id ${req.body.id}`});
            }
        } else res.redirect("/orders");
    });
};

exports.removeAll = (req, res) => {
    Supplier.removeAll((err, data) => {
        if (err)
            res.render("500", {message: `Some error occurred while removing all parts.`});
        else res.send({message: `All parts were deleted successfully!`});
    });
};