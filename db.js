/*This file sets up the db object which contains
all of the stuff to sequelize the data. It gets
called in server.js which in turn calls the instance
of sequelize in this file.
*/

var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/data/dev_toDo_API.sqlite'
});
var db = {};

db.toDo = sequelize.import(__dirname + '/models/toDo.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;