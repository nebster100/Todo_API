/*
This is the model for the import of sequelize and
it sets up what sequelize will look for when I send
it a 
*/

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('toDo', {
		description: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		completed: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	});
};