var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//mongoose.connect('mongodb+srv://test:test@todo-xsgfs.mongodb.net/todo?retryWrites=true&w=majority');
mongoose.connect('mongodb://localhost/todo');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var data = [{item: 'Bath'} , {item: 'Get Milk'} , {item: 'Codeforces round'}];

var todoSchema = new mongoose.Schema({
    item: String
});

var ToDo = mongoose.model('ToDo' , todoSchema);
var itemOne = ToDo({item : 'React Js'}).save(function(err){
    if (err) throw err;
    console.log('Item Saved');
});

module.exports = function (app){
    app.get('/todo' , function(req , res){
        res.render('todo' , {todos: data});
    });

    app.post('/todo' , urlencodedParser ,  function(req , res){
        data.push(req.body);
        res.json({todos: data});
    });

    app.delete('/todo/:item' , function(req , res){
        data = data.filter(function(todo){
            return todo.item.replace(/ /g , '-') !== req.params.item;
        });
        res.json({todos: data});
    });
}
