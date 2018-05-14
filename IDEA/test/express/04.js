/**
 * 路由模块化
 */
var express = require('express');
var app = express();
var birds = require("./Router");
app.use("/birds", birds);

var server = app.listen(3000, function () {
    console.log("OK");
});