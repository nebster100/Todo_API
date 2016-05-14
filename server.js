var express = require('express');
var bodyParser = require('body-parser');

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
	var index = req.params.id-1;
	if(index >= 0 && index < todos.length)
		res.json(todos[index]);
	else
		res.status(404).send();
});

// POST /todos
app.post('/todos', function (req, res) {
	var body = req.body;
	body.id = todoNextID;
	todoNextID++;
	todos.push(body);
	res.json(body);

});


app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT + '!');
});