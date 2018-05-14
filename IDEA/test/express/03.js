/**
 * 链式路由句柄
 */
var express = require('express');
var app = express();
app.route("/book")
    .get((req, res) => {
        res.send('Get a random book');
    })
    .post((req, res) => {
        res.send('Put a random book');
    })

var server = app.listen(3000, function () {
    console.log("OK");
});