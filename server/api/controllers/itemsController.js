'use strict';


var mongoose = require('mongoose'),
    Item = mongoose.model('Items');

exports.list_all_tasks = function (req, res) {
    Item.find({}, function (err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};

exports.create_a_task = function(req, res) {
    var new_task = new Item(req.body);
    new_task.save(function(err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};


exports.read_a_task = function(req, res) {
    Item.findById(req.params.itemId, function(err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};


exports.update_a_task = function(req, res) {
    Item.findOneAndUpdate({_id: req.params.itemId}, req.body, {new: true}, function(err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};


exports.delete_a_task = function(req, res) {


    Item.remove({
        _id: req.params.itemId
    }, function(err, task) {
        if (err)
            res.send(err);
        res.json({ message: 'Task successfully deleted' });
    });
};
