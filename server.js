var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore'); //Underscore package is commonly called this
var db = require('./db.js'); //The database

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextID = 1;

//Body Parser Setup
app.use(bodyParser.json());

var todos = [];

// GET requests
app.get('/', function(req, res) {
	res.send('Todo API Root');
});


app.get('/todos', function(req, res) {
	var queries = req.query;
	var filteredTodos = todos;

	if (queries.hasOwnProperty('completed') && queries.completed === 'true')
		filteredTodos = _.where(filteredTodos, {
			completed: true
		});
	else if (queries.hasOwnProperty('completed') && queries.completed === 'false')
		filteredTodos = _.where(filteredTodos, {
			completed: false
		});

	if (queries.hasOwnProperty('description')) {
		filteredTodos = _.filter(filteredTodos, function(todo) {
			var desc = todo.description;
			console.log(queries.description);
			return desc.includes(queries.description);
		});
	}

	res.json(filteredTodos);
});


app.get('/todos/:id', function(req, res) {
	var index = parseInt(req.params.id);
	var foundTodo = _.findWhere(todos, {
		id: index
	});
	if (foundTodo)
		res.json(foundTodo);
	else
		res.status(404).json({
			"error": "no toDO found with that id"
		});
});

// POST /todos
app.post('/todos', function(req, res) {
	//Whitelisting keys
	var body = _.pick(req.body, 'description', 'completed');

	db.toDo.create(body).then(function (todo){
		res.json(todo.toJSON());
	}, function (e){
		res.status(400).json(e)
	});

});

// DELETE
app.delete('/todos/:id', function(req, res) {
	var index = parseInt(req.params.id);
	var foundTodo = _.findWhere(todos, {
		id: index
	});

	if (foundTodo) {
		todos = _.without(todos, foundTodo);
		res.json(foundTodo);
	} else
		res.status(404).json({
			"error": "no toDO found with that id"
		});
});

//PUT
app.put('/todos/:id', function(req, res) {
	var index = parseInt(req.params.id);
	var foundTodo = _.findWhere(todos, {
		id: index
	});
	var body = _.pick(req.body, 'description', 'completed');
	var newTodo = {};

	if (!foundTodo)
		return res.status(404).json({
			"error": "no toDO found with that id"
		});

	if (body.hasOwnProperty('completed') &&
		_.isBoolean(body.completed)) {
		newTodo.completed = body.completed;
	} else if (body.hasOwnProperty('completed'))
		return res.status(400).send();


	if (body.hasOwnProperty('description') &&
		_.isString(body.description) &&
		body.description.trim().length > 0) {

		newTodo.description = body.description;

	} else if (body.hasOwnProperty('description'))
		return res.status(400).send();

	_.extend(foundTodo, newTodo);

	res.json(newTodo);
});

db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log('Express listening on port ' + PORT + '!');
	});
});