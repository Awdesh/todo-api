var express = require("express");
/*
In short; body-parser extracts the entire body portion of an incoming request 
stream and exposes it on req.body as something easier to interface with. 
You don't need it per se, because you could do all of that yourself. 
However, it will most likely do what you want and save you the trouble.
*/
var bodyParser = require("body-parser");
var _ = require("underscore");
var app = express();
var PORT = process.env.PORT || 3000;
var IP = process.env.IP;
var db = require('./db.js');

var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/todos', function(req, res){
    var queryParams = req.query;
    var where = {};
    var filteredToDos = todos;
    
    if(queryParams.hasOwnProperty("completed") && queryParams.completed === 'true'){
        where.completed = true;
    } else if(queryParams.hasOwnProperty("completed") && queryParams.completed === 'false'){
        where.completed = false;
    }
    
    // if(queryParams.hasOwnProperty('q') && queryParams.q.length > 0){
    //     filteredToDos = _.filter(filteredToDos, function(td){
    //         var val = td.description.toLowerCase().indexOf(queryParams.q.toLowerCase()); 
    //         if(val > -1)
    //             return true;
    //         else
    //             return false;
    //     });
    // }
    
    // res.json(filteredToDos);
    
    if(queryParams.hasOwnProperty('q') && queryParams.q.length > 0){
        where.description = {
            $like: '%' + queryParams.q + '%'
        };
    }
    
    db.todo.findAll({where: where}).then(function(todos){
        res.json(todos);
    }), function(e) {
        res.status(500).send();
    };
});

app.get('/todos/:id', function(req, res){
    var todoId = parseInt(req.params.id, 10);
    db.todo.findById(todoId).then(function(todo){
        if(todo) {
            res.json(todo.toJSON());
        } else {
            res.status(404).send();
        }
    }, function(e){
        res.status(500).send();
    });
});

app.post('/todos', function(req, res){
    var body = _.pick(req.body, 'description', 'completed');
    
    // if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
    //     return res.status(404).send();        
    // }
    
    // body.description = body.description.trim();
    // body.id = todoNextId++;
    // todos.push(body);
    // console.log('description ' + body.description);
    // // res.json automatically sends status back like 200, 4xx.
    // res.json(body);
    
    db.todo.create(body).then(function(todo){
        if(todo)
            return res.json(todo.toJSON);
        else
            return res.status(404).send();
    }, function(e){
        return res.status(404).json(e);
    });
 });
 
 app.delete('/todos/:id', function(req, res){
     var todoId = parseInt(req.params.id, 10);
     var matchedTodo = _.findWhere(todos, {id: todoId});
     if(!matchedTodo)
        return res.status(404).send();
     todos = _.without(todos, matchedTodo);
     
      res.json(matchedTodo);
      // below is just for the logging purposes.
      todos.forEach(function(td){
        console.log(td);    
      });
 });
 
 // put is like an update.
 app.put('/todos/:id', function(req, res){
     var body = _.pick(req.body, 'description', 'completed');
     var todoId = parseInt(req.params.id, 10);
     var matchedTodo = _.findWhere(todos, {id: todoId});
    
    if(!matchedTodo){
        return res.status(404).send();
    }
    
     var validAttributes = {};
     
     if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
         validAttributes.completed = body.completed;
     } else if(body.hasOwnProperty('completed')){
         res.status(400).send();
     } else {
         //Keep going.
     }
     
     if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
         validAttributes.description = body.description;
     } else if(body.hasOwnProperty('description')){
         res.status(400).send();
     } else {
         // Keep going.
     }
     
     // objects in JS gets passed by reference, not by value.
     _.extend(matchedTodo, validAttributes);
     res.json(matchedTodo);
 });

db.sequelize.sync().then(function(){
        app.listen(PORT, function() {
            console.log('Express listening on port ' + PORT);
        });
    });

// app.listen(PORT, function(){
//     console.log('Express listening on port ' + PORT + '!');
// });