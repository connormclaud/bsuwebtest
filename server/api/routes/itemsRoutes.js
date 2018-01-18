'use strict';
module.exports = function(app) {
    var itemsList = require('../controllers/itemsController');

    // itemsList Routes
    app.route('/item')
        .get(itemsList.list_all_tasks)
        .post(itemsList.create_a_task);


    app.route('/item/:itemId')
        .get(itemsList.read_a_task)
        .put(itemsList.update_a_task)
        .delete(itemsList.delete_a_task);
};
