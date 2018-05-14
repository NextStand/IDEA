/**
 * 路由句柄
 */
var express = require('express');
var app = express();
/*---------多个路由句柄--------------- */
app.get('/', function (req, res, next) {
    console.log('response will be sent by the next function ...');
    next();
}, function (req, res) {
    res.send("Hello World");
});
/*---------数组语法--------------- */
var cb0 = function (req, res, next) {
    console.log('CB0');
    next();
}

var cb1 = function (req, res, next) {
    console.log('CB1');
    next();
}

var cb2 = function (req, res) {
    res.send('Hello from C!');
}

app.get('/c', [cb0, cb1, cb2]);

/*---------混合语法--------------- */
app.get('/d', [cb0, cb1], (req, res, next) => {
    console.log('response will be sent by the next function ...');
    next();
}, (req, res) => {
    res.send('Hello from D!');
});

var server = app.listen(3000, function () {
    /*   var host = server.address().address;
      var port = server.address().port;
  
      console.log('Example app listening at http://%s:%s', host, port); */
});