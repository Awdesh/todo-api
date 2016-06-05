var express = require("express");
var app = express();
var PORT = process.env.PORT || 3000;

var todos = [{
    id: 1,
    description: 'Meet mum for lunch',
    completed: false
}, {
    id: 2,
    description: 'Clean dishes',
    completed: false
}, {
    id: 3,
    description: 'Work on side project',
    completed: false
}];

app.get('/', function(req, res){
    res.send('TODO API root');
});

app.get('/todos', function(req, res){
    res.json(todos);
});

app.get('/todos/:id', function(req, res){
    var todoId = parseInt(req.params.id, 10);
    todos.forEach(function(todo){
        if(todo.id === todoId){
            res.json(todo);
            //res.send('inside single todos-: ' + req.params.id);        
            return;
        }
    });
    res.status(404).send();
});

app.listen(PORT, function(){
    console.log('Express listening on port ' + PORT + '!');
});