var express = require('express');
var f = express();

f.set('view engine', 'ejs')
f.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

f.get('/contact', function(req, res) {
    res.sendFile(__dirname + '/contact.html');
});

f.get('/profile/:name', function(req, res) {
    var data = {
        Age: 20,
        job: 'Student',
        hob: ['c', 'java', 'python']
    };
    res.render('profile', { person: req.params.name, data: data });
});

f.listen(3000);
console.log("");