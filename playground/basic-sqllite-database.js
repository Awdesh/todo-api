// Sequelize is an ORM for sqlLite, postgres, mysql and other databases..
var Sequelize = require("sequelize");

var sequelize = new Sequelize(undefined, undefined, undefined, {
   'dialect': 'sqlite',
   'storage': __dirname + '/basic-sqlite-database.sqlite'
});

var ToDo = sequelize.define('tasks', {
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    
    completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

sequelize.sync().then(function(){
   ToDo.create({
      description: 'Clean the house',
      completed: false
   }).then(function(todo){
       return ToDo.create({
           description: 'Take out trash'
       });
   }).then(function(){
       return ToDo.findAll({
           where:{
               description:{
                   $like: '%trash'
               }
           }
       });
   }).then(function(todos){
       if(todos){
           todos.forEach(function(todo){
               console.log(todo.toJSON());
           });
       }
       else{
           console.log('No todo exists');
       }
   }).catch(function(e){
       console.log(e);
   });
});
