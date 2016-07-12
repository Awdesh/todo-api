var Sequelize = require("sequelize");
var sequelize = new Sequelize(undefined, undefined, undefined, {
   dialect: 'sqlite', 
   storage: __dirname + '/data/dev-todo-api.sqlite'
});

var db = {};
db.todo = sequelize.import(__dirname + '/models/todo.js');
db.user = sequelize.import(__dirname + '/models/user.js');
db.tasks = sequelize.import(__dirname + '/models/tasks.js');

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;