/**
 * 在一个挂载点装载一组中间件
 */
var express = require('express');
var app = express();
app.use('/user/:id', function (req, res, next) {
    console.log('Request URL:', req.originalUrl);
    next();
}, function (req, res, next) {
    console.log('Request Type:', req.method);
    next();
});
// 路由和句柄函数(中间件系统)，处理指向 /user/:id 的 GET 请求
app.get('/user/:id', function (req, res, next) {
    res.send(`USER:${req.params.id}`);
});
var server = app.listen(3000, function () {
    console.log("OK");
});