var express = require("express");
/*
In short; body-parser extracts the entire body portion of an incoming request 
stream and exposes it on req.body as something easier to interface with. 
You don't need it per se, because you could do all of that yourself. 
However, it will most likely do what you want and save you the trouble.
*/
var bodyParser = require("body-parser");
var _ = require("underscore");
var bcrypt = require("bcrypt");
var app = express();
var PORT = process.env.PORT || 3000;
var IP = process.env.IP;
var db = require('./db.js');

app.use(bodyParser.json());

app.get('/todos', function(req, res){
    var queryParams = req.query;
    var where = {};
    
    if(queryParams.hasOwnProperty("completed") && queryParams.completed === 'true'){
        where.completed = true;
    } else if(queryParams.hasOwnProperty("completed") && queryParams.completed === 'false'){
        where.completed = false;
    }
    
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


app.get('/vri', function(req, res) {
     db.tasks.findAll().then(function(tasks){
        res.json(tasks);
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
    db.todo.create(body).then(function(todo){
        if(todo)
            return res.json(todo.toJSON());
        else
            return res.status(404).send();
    }, function(e){
        return res.status(404).json(e);
    });
 });
 
app.post('/vri', function(req, res) {
    var body = _.pick(req.body, 'deviceModelType', 'deviceType', 'hubId', 'timeZone', 'hubReceiveTime', 'hubReceiveTimeOffset', 'qcl_json_data');
    db.tasks.create(body).then(function(task){
        if(task)
            return res.json(task.toJSON());
        else
            return res.status(404).send();
    }, function(e){
        return res.status(404).json(e);
    });
});
 
app.post('/user', function(req, res){
   var body = _.pick(req.body, 'email', 'password');
   db.user.create(body).then(function(user){
       if(user)
            return res.json(user.toPublicJSON());
        else
            return res.status(404).send();
   }, function(e){
        return res.status(404).json(e);
   });
});

app.post('/user/login', function(req, res) {
   var body = _.pick(req.body, 'email', 'password');
   
   if(typeof body.email !== 'string' || typeof body.password !== 'string') {
       return res.status(404).send();
   }
   
   db.user.findOne({where: {email : body.email}}).then(function(user){
       //var has = bcrypt.compareSync(user.get('password_hash'), body.password);
       if(user && bcrypt.compareSync(body.password, user.get('password_hash'))){
           return res.json(user.toJSON());
       } else {
           return res.status(401).send();
       }
   }, function(e){
       return res.status(500).send();
   });
});
 
app.delete('/todos/:id', function(req, res){
 var todoId = parseInt(req.params.id, 10);
 db.todo.destroy({
      where: {
          id: todoId
      }
  }).then(function(rowdDeleted){
      if(rowdDeleted == 0){
          res.status(404).json({
              'error':'No row exists'
          });
      } else {
          res.status(200).send();
      }
  }).then(function(){
      res.status(500).send();
  });
});
 
 // put is like an update.
 app.put('/todos/:id', function(req, res){
     var body = _.pick(req.body, 'description', 'completed');
     var todoId = parseInt(req.params.id, 10);
     var attributes = {};
     
     if(body.hasOwnProperty('description')){
        attributes.description = body.description;   
     }
     
     if(body.hasOwnProperty('completed')){
        attributes.completed = body.completed;   
     }
     
     db.todo.findById(todoId).then(function(todo){
         if(todo){
             todo.update(attributes).then(function(todo){
                 res.send(todo.toJSON());
             }, function(e){
                 res.status(404).send(e);
            });
         } else {
            res.status(404).send(); 
         }
     }, function(){
         res.status(500).send();
     });
 });

db.sequelize.sync({force: true}).then(function(){
        app.listen(PORT, function() {
            console.log('Express listening on port ' + PORT);
        });
    });