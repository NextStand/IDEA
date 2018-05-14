/**
 * 应用级中间件
 */
var express = require('express');
var app = express();
app.use((req, res, next) => {
    console.log('Time:', Date.now());
    next();
})
// 挂载至 /user/:id 的中间件，任何指向 /user/:id 的请求都会执行它
app.use('/user/:id', function (req, res, next) {
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