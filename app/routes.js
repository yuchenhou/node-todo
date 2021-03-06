var Todo = require('./models/todo');

function getTodos(res) {
    Todo.find(function (err, todos) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }

        res.json(todos); // return all todos in JSON format
    });
}
;

function getTotal(res) {
    Todo.find(function (err, todos) {
        if (err) {
            res.send(err);
        }
        var total = 0;
        for (var i = 0; i < todos.length; i += 1) {
            total += todos[i].price;
        }
        res.json(Number((total*1.075).toFixed(2)));
    });
};
module.exports = function (app) {

    // api ---------------------------------------------------------------------
    // get all todos
    app.get('/api/food', function (req, res) {
        // use mongoose to get all todos in the database
        getTodos(res);
    });

    app.get('/api/total', function (req, res) {
        getTotal(res);
    });

    // create todo and send back all todos after creation
    app.post('/api/food', function (req, res) {

        // create a todo, information comes from AJAX request from Angular
        Todo.create({
            text: req.body.text,
            price: req.body.price,
            done: false
        }, function (err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            getTodos(res);
        });

    });

    // delete a todo
    app.delete('/api/food/:food_id', function (req, res) {
        Todo.remove({
            _id: req.params.food_id
        }, function (err, todo) {
            if (err)
                res.send(err);

            getTodos(res);
        });
    });

    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};
