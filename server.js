var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');//Underscore package is commonly called this

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextID = 4;

//Body Parser Setup
app.use(bodyParser.json());

var todos = [{
	id: 1,
	description: 'Learn how to do this',
	completed: false
}, {//This individual toDo is a toDo model
	id: 2,
	description: 'Master this',
	completed: false
}, {//This individual toDo is a toDo model
	id: 3,
	description: 'Do this once',
	completed: true
}];//This is called a toDo collection

// GET requests
app.get('/', function (req, res){
	res.send('Todo API Root');
});
app.get('/todos', function (req, res){
	res.json(todos);
});
app.get('/todos/:id', function (req, res){
	var index = parseInt(req.params.id);
	var foundTodo = _.findWhere(todos, {id: index});
	if(foundTodo)
		res.json(foundTodo);
	else
		res.status(404).send();
});

// POST /todos
app.post('/todos', function (req, res) {
	//Whitelisting keys
	var body = _.pick(req.body, 'description', 'completed');

	//Validation
	if(!_.isBoolean(body.completed) || 
	   !_.isString(body.description) ||
	   body.description.trim().length === 0)
		return res.status(400).send();

	//Cleanup and adding an ID
	body.description = body.description.trim();
	body.id = todoNextID;
	todoNextID++;

	todos.push(body);
	res.json(body);
});


app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT + '!');
});