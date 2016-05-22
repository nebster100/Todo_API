var express = require('express');
var bodyParser = require('body-parser');
var db = require('./db.js'); //The database
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextID = 1;

//Body Parser Setup
app.use(bodyParser.json());

var todos = [];

//GET /
app.get('/', function(req, res) {
	res.send('Todo API Root');
});

//GET /todos
app.get('/todos', function(req, res) {
	var queries = req.query;
	var where = {};
	if (queries.hasOwnProperty('completed') && queries.completed === 'true')
		where.completed = true;
	else if (queries.hasOwnProperty('completed') && queries.completed === 'false')
		where.completed = false;
	if (queries.hasOwnProperty('description') && queries.description.length > 0){
		where.description = {
			$like: '%' + queries.description + '%'
		};
	}

	db.toDo.findAll({where: where}).then(function (todos) {
			res.json(todos);
		},function (e) {
			res.status(500).json(e);
		});
});

//GET /todos/:id
app.get('/todos/:id', function (req, res) {
	var index = parseInt(req.params.id);

	db.toDo.findById(index).then(function(todo) {
		if (todo) {
			res.json(todo.toJSON());
		} else
			res.status(404).send();
	}, function(e) {
		res.status(500).json(e);
	});

});

// POST /todos
app.post('/todos', function (req, res) {
	//Whitelisting keys
	var body = _.pick(req.body, 'description', 'completed');

	db.toDo.create(body).then(function(todo) {
		res.status(200).json(todo.toJSON());
	}, function(e) {
		res.status(400).json(e);
	});

});

// DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
	var index = parseInt(req.params.id);
	db.toDo.destroy({
		where: {
			id: index
		}
	}).then(function (deletedToDo){
		if(deletedToDo === 1)
			res.status(204).send();
		else
			res.status(404).json({
				error: 'No todo with id'
			});
	},function (e){
		res.status(500).send();
	});
});

//PUT /todos/:id
app.put('/todos/:id', function(req, res) {
	var index = parseInt(req.params.id);
	var body = _.pick(req.body, 'description', 'completed');
	var attributes = {};

	if (body.hasOwnProperty('completed'))
		attributes.completed = body.completed;
	
	if (body.hasOwnProperty('description'))
		attributes.description = body.description;

	db.toDo.findById(index).then(function (todo){
		if(todo)
			todo.update(attributes).then(function (todo){
				res.json(todo.toJSON());
			}, function (e){
				res.status(400).json(e);
			});
		else
			res.status(404).send();
	}, function(){
		res.status(500).send();
	})
});

//POST /users
app.post('/users', function (req, res) {
	var body = _.pick(req.body, 'email', 'password');

	db.user.create(body).then(function(todo) {
		res.status(200).json(todo.toPublicJSON());
	}, function(e) {
		res.status(400).json(e);
	});

});

db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log('Express listening on port ' + PORT + '!');
	});
});